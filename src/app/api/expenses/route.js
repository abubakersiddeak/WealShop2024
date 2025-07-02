// app/api/expenses/route.js (Next.js 13+/App Router)

import { connectMongodb } from "@/app/lib/mongodb";
import Expense from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongodb();
  const expenses = await Expense.find();
  return NextResponse.json(expenses);
}

export async function POST(req) {
  await connectMongodb();
  const data = await req.json();
  const expense = await Expense.create(data);
  return NextResponse.json(expense);
}
