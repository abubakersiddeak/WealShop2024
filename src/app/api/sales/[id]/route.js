// pages/api/sales/[id]/collectDue.js  (Next.js API Route)

import { connectMongodb } from "@/app/lib/mongodb";
import Sale from "@/app/models/Sale";

import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectMongodb();
    const { id } = await params; // sale _id
    const { paidAmount } = await req.json();

    if (!paidAmount || paidAmount <= 0) {
      return NextResponse.json(
        { error: "সঠিক পরিমাণ প্রদান করুন" },
        { status: 400 }
      );
    }

    const sale = await Sale.findById(id);
    if (!sale) {
      return NextResponse.json(
        { error: "বিক্রয় পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    if (sale.dueAmount < paidAmount) {
      return NextResponse.json(
        { error: "পরিশোধের পরিমাণ বকেয়া থেকে বেশি হতে পারে না" },
        { status: 400 }
      );
    }

    // Update paid amount and due amount
    sale.paidAmount += paidAmount;
    sale.dueAmount -= paidAmount;

    // Save updated sale
    await sale.save();

    return NextResponse.json({ message: "বকেয়া সফলভাবে পরিশোধ হয়েছে", sale });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "সার্ভার এ সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
