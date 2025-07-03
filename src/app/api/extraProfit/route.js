import { connectMongodb } from "@/app/lib/mongodb";
import ExtraProfit from "@/app/models/ExtraProfit";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongodb();
    const body = await req.json();
    const extraProfit = await ExtraProfit.create(body);
    return NextResponse.json(extraProfit);
  } catch (error) {
    console.error("Error adding extra profit:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongodb();
    const profits = await ExtraProfit.find().sort({ createdAt: -1 });
    return NextResponse.json(profits);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
