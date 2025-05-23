import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

export async function GET(req, context) {
  try {
    await connectMongodb();

    const { invoiceId } = context.params; // ✅ context থেকে ঠিকভাবে নিচ্ছি

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, message: "Missing invoice ID in URL" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ invoiceId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order by invoiceId:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
