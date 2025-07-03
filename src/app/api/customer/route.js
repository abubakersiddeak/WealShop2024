import { connectMongodb } from "@/app/lib/mongodb";
import Customer from "@/app/models/Customer";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongodb();
  const customers = await Customer.find().sort({ name: 1 });
  return NextResponse.json(customers);
}
