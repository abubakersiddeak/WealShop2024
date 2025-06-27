import { NextResponse } from "next/server";
import Visitor from "@/app/models/Visitor";
import { connectMongodb } from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    await connectMongodb();

    const body = await request.json();
    const { ip, url, userAgent } = body;

    if (!ip || !url || !userAgent) {
      return NextResponse.json(
        { success: false, message: "Missing visitor data" },
        { status: 400 }
      );
    }

    const visitor = new Visitor({ ip, url, userAgent });
    await visitor.save();

    return NextResponse.json(
      { success: true, message: "Visitor logged" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging visitor:", error);
    return NextResponse.json(
      { success: false, message: "Logging failed", error: error.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectMongodb();

    const visitors = await Visitor.find().sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ success: true, visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}
