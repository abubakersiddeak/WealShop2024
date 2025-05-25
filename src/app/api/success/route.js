import { connectMongodb } from "@/app/lib/mongodb";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongodb();

    const formData = await req.formData();

    const orderData = {
      tran_id: formData.get("tran_id"),
      val_id: formData.get("val_id"),
      amount: parseFloat(formData.get("amount")),
      store_amount: parseFloat(formData.get("store_amount")),
      status: formData.get("status"),
      card_type: formData.get("card_type"),
      card_no: formData.get("card_no"),
      card_issuer: formData.get("card_issuer"),
      tran_date: formData.get("tran_date"),
      currency: formData.get("currency"),
    };

    // MongoDB তে ডাটা সেভ করো
    const newOrder = new Order(orderData);
    await newOrder.save();

    // সফল হলে রিডাইরেক্ট দাও
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/success?tran_id=${orderData.tran_id}`,
      303
    );
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
