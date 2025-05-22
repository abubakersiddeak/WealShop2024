import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const tran_id = Math.floor(100000 + Math.random() * 900000).toString();
    const init_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    const formData = new FormData();
    formData.append("store_id", process.env.SSLCOMMERZ_STORE_ID);
    formData.append("store_passwd", process.env.SSLCOMMERZ_STORE_PASS);
    formData.append("total_amount", body.amount.toString());
    formData.append("currency", "BDT");
    formData.append("tran_id", tran_id);

    formData.append("success_url", `${baseURL}/api/success?id=${tran_id}`);
    formData.append("fail_url", `${baseURL}/api/fail?id=${tran_id}`);
    formData.append("cancel_url", `${baseURL}/api/cancel?id=${tran_id}`);
    formData.append("ipn_url", `${baseURL}/api/ipn?id=${tran_id}`);

    formData.append("cus_name", body.name);
    formData.append("cus_email", body.email);
    formData.append("cus_add1", body.address);
    formData.append("cus_add2", body.address);
    formData.append("cus_city", body.city);
    formData.append("cus_state", body.city);
    formData.append("cus_postcode", body.postcode);
    formData.append("cus_country", "Bangladesh");
    formData.append("cus_phone", body.phone);
    formData.append("cus_fax", body.phone);

    formData.append("shipping_method", "YES");
    formData.append("ship_name", body.name);
    formData.append("ship_add1", body.address);
    formData.append("ship_add2", body.address);
    formData.append("ship_city", body.city);
    formData.append("ship_state", body.city);
    formData.append("ship_country", "Bangladesh");
    formData.append("ship_postcode", "0000");

    formData.append("product_name", "Checkout Products");
    formData.append("product_category", "Mixed");
    formData.append("product_profile", "general");
    formData.append("product_amount", body.amount.toString());

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const SSLRes = await fetch(init_url, requestOptions);
    const SSLResJSON = await SSLRes.json();

    return NextResponse.json(SSLResJSON);
  } catch (error) {
    console.error("SSLCommerz error:", error);
    return NextResponse.json({ message: "Something went wrong", error });
  }
}
