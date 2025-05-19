import { NextResponse } from "next/server";
import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";

export async function POST(request) {
  await connectMongodb();

  const data = await request.json();

  try {
    const newOrder = new Order(data);
    await newOrder.save();
    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
