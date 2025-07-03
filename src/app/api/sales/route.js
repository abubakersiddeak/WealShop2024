import { connectMongodb } from "@/app/lib/mongodb";
import Sale from "@/app/models/Sale";
import Customer from "@/app/models/Customer";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongodb();
    const body = await req.json();

    let customerId = null;

    if (body.customerId) {
      customerId = body.customerId;
    } else if (body.customerName && body.customerPhone) {
      const newCustomer = await Customer.create({
        name: body.customerName,
        phone: body.customerPhone,
        address: body.customerAddress || "",
      });
      customerId = newCustomer._id;
    }

    // বিক্রি হওয়ার পর quantity কমাও
    const product = await Product.findById(body.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // সাইজ খুঁজে বের করো
    const sizeIndex = product.sizes.findIndex((s) => s.size === body.size);
    if (sizeIndex === -1) {
      return NextResponse.json({ error: "Size not found" }, { status: 400 });
    }

    // স্টকে যথেষ্ট আছে কিনা চেক করো
    if (product.sizes[sizeIndex].quantity < body.quantity) {
      return NextResponse.json(
        { error: "স্টকে পর্যাপ্ত পণ্য নেই" },
        { status: 400 }
      );
    }

    // quantity কমাও
    product.sizes[sizeIndex].quantity -= body.quantity;
    product.quantity = product.sizes.reduce((acc, s) => acc + s.quantity, 0);

    await product.save();

    // সেল রেকর্ড করো
    const sale = await Sale.create({
      ...body,
      customerId,
    });

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error in Sale POST:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectMongodb();
  const sales = await Sale.find()
    .populate("customerId")
    .sort({ createdAt: -1 });
  return NextResponse.json(sales);
}
