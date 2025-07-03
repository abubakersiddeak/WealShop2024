import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

// PUT method এর জন্য named export
export async function PUT(request) {
  try {
    const body = await request.json(); // body থেকে data আনছি
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "orderId এবং status দেওয়া হয়নি।",
        },
        { status: 400 }
      );
    }

    await connectMongodb(); // MongoDB এর সাথে কানেক্ট করলাম

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "অর্ডার খুঁজে পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "অর্ডারের স্ট্যাটাস সফলভাবে আপডেট হয়েছে।",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("অর্ডার আপডেট করতে সমস্যা:", error);
    return NextResponse.json(
      {
        success: false,
        message: "সার্ভারে কোনো ত্রুটি ঘটেছে।",
      },
      { status: 500 }
    );
  }
}
