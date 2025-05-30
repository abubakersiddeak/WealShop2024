import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

export async function PUT(request, { params }) {
  const { tran_id } = await params;

  if (!tran_id) {
    return NextResponse.json(
      { success: false, message: "tran_id is required" },
      { status: 400 }
    );
  }

  try {
    await connectMongodb();

    // ক্লায়েন্ট থেকে আপডেট ডাটা নিন
    const updateData = await request.json();

    // ভ্যালিডেশন (প্রয়োজনীয় ফিল্ড চেক)
    if (!updateData.customer || !updateData.shipping || !updateData.items) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: customer, shipping, or items",
        },
        { status: 400 }
      );
    }

    // optional: আরও ডিটেইল চেক করতে পারেন, যেমন customer.name ইত্যাদি

    // ডাটাবেজে আপডেট
    const updatedOrder = await Order.findOneAndUpdate(
      { tran_id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
