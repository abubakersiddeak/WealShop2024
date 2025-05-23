// /app/api/payment/success/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();

  const tran_id = formData.get("tran_id");
  const amount = formData.get("amount");
  const status = formData.get("status");
  const card_type = formData.get("card_type");

  const queryParams = new URLSearchParams({
    tran_id,
    amount,
    status,
    card_type,
  });

  return NextResponse.redirect(
    new URL(`/success?${queryParams.toString()}`, req.url),
    303
  );
}
