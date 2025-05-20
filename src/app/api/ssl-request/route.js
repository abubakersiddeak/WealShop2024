import sslcz from "sslcommerz-lts";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      const transactionId = Math.floor(Math.random() * 1000000000).toString();

      const paymentData = {
        total_amount: data.amount,
        currency: "BDT",
        tran_id: transactionId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/fail`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ipn`,
        shipping_method: "Courier",
        product_name: "Weal Store Order",
        product_category: "Ecommerce",
        product_profile: "general",
        cus_name: data.name,
        cus_email: data.email,
        cus_add1: data.address,
        cus_city: data.city,
        cus_postcode: "0000",
        cus_country: "Bangladesh",
        cus_phone: data.phone,
      };

      const store_id = process.env.SSLCOMMERZ_STORE_ID;
      const store_passwd = process.env.SSLCOMMERZ_STORE_PASS;
      const is_live = false;

      const sslcommerz = new sslcz(store_id, store_passwd, is_live);
      const apiResponse = await sslcommerz.init(paymentData);

      if (apiResponse?.GatewayPageURL) {
        res.status(200).json(apiResponse);
      } else {
        res
          .status(500)
          .json({ message: "GatewayPageURL not found", error: true });
      }
    } catch (err) {
      console.error("SSLCommerz error:", err);
      res.status(500).json({
        message: "Payment API Error",
        error: true,
        details: err.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
