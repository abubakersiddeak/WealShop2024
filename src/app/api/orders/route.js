import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

// POST method handler
export async function POST(request) {
  try {
    await connectMongodb();
    const body = await request.json(); // parsing JSON body

    const order = new Order(body);
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order saved",
        order,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order Save Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
