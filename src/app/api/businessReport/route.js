import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Sale from "@/app/models/Sale";
import ExtraProfit from "@/app/models/ExtraProfit";
import Order from "@/app/models/Order";
import Expense from "@/app/models/Expense";
import Product from "@/app/models/product";

export async function GET(req) {
  try {
    const monthParam = req.nextUrl.searchParams.get("month")?.trim();

    if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing month parameter. Please provide month as YYYY-MM (e.g., 2025-07).",
        },
        { status: 400 }
      );
    }

    await connectMongodb();

    const [year, monthNum] = monthParam.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    // Get all sales for the month
    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lt: endDate },
    }).lean();

    const totalSales = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const totalDue = sales.reduce((acc, s) => acc + (s.dueAmount || 0), 0);

    // Get all unique product IDs from sales
    const productIds = sales
      .map((s) => s.productId?.toString())
      .filter(Boolean);
    const products = await Product.find({
      _id: { $in: productIds },
    })
      .select("_id buyPrice")
      .lean();

    const productBuyPriceMap = new Map();
    products.forEach((p) => {
      productBuyPriceMap.set(p._id.toString(), p.buyPrice || 0);
    });

    // Calculate total profit correctly
    let profit = 0;
    sales.forEach((s) => {
      const buyPrice = productBuyPriceMap.get(s.productId?.toString()) || 0;
      const salePrice = s.salePrice || 0;
      const quantity = s.quantity || 0;
      profit += (salePrice - buyPrice) * quantity;
    });

    // Extra profit
    const extraProfits = await ExtraProfit.find({
      createdAt: { $gte: startDate, $lt: endDate },
    }).lean();
    const extraProfit = extraProfits.reduce(
      (acc, e) => acc + (e.amount || 0),
      0
    );

    // Orders
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lt: endDate },
    }).lean();
    const totalOrders = orders.length;
    const totalOrderAmount = orders.reduce(
      (acc, o) => acc + (o.amount || 0),
      0
    );
    const ordersByStatus = orders.reduce((acc, o) => {
      const status = o.status || "UNKNOWN";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Expenses
    const expenses = await Expense.find({
      createdAt: { $gte: startDate, $lt: endDate },
    }).lean();
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const expensesByCategory = expenses.reduce((acc, e) => {
      const cat = e.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + (e.amount || 0);
      return acc;
    }, {});

    const totalProfit = profit + extraProfit - totalExpenses;
    return NextResponse.json({
      totalSales,
      totalProfit,
      totalDue,
      extraProfit,
      totalOrders,
      totalOrderAmount,
      ordersByStatus,
      totalExpenses,
      expensesByCategory,
    });
  } catch (error) {
    console.error("[API Error] Business report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "POST not allowed, use GET with ?month=YYYY-MM" },
    { status: 405 }
  );
}
