import { connectMongodb } from "@/app/lib/mongodb";
import Customer from "@/app/models/Customer";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectMongodb();

    const { customerId } = params;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
