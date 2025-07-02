// app/api/expenses/[id]/route.js

import { connectMongodb } from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectMongodb();
  const { id } = await params;
  await Expense.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

export async function PUT(req, { params }) {
  await connectMongodb();
  const { id } = await params;
  const data = await req.json();
  const updated = await Expense.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}
