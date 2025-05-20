export async function POST(req) {
  const body = await req.json();

  const transactionId = "TXN_" + Date.now();

  const paymentData = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASS,
    total_amount: body.amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: "http://localhost:3000/success",
    fail_url: "http://localhost:3000/fail",
    cancel_url: "http://localhost:3000/cancel",
    cus_name: body.name,
    cus_email: body.email,
    cus_add1: body.address,
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    shipping_method: "NO",
    product_name: "Ecomars Order",
    product_category: "Ecommerce",
    product_profile: "general",
  };

  const sslRes = await fetch(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    }
  );

  const data = await sslRes.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
