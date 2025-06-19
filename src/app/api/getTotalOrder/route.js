import { NextResponse } from "next/server";

import Order from "@/app/models/Order";
import { connectMongodb } from "@/app/lib/mongodb";

export async function GET() {
  try {
    // MongoDB কানেকশন চেক ও কানেক্ট
    connectMongodb();

    // সব অর্ডার খুঁজে আনা
    const orders = await Order.find().sort({ createdAt: -1 });

    // JSON হিসেবে রেসপন্স
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
