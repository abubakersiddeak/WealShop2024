"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cartContext";
import { useSearchParams } from "next/navigation";

import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const tran_id = searchParams.get("tran_id");

  const { cartItems, clearCart } = useCart();
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const processOrder = async () => {
      try {
        const saved = localStorage.getItem("checkoutData");
        let parsedData = null;

        if (saved) {
          parsedData = JSON.parse(saved);
          setCustomerData(parsedData);
          localStorage.removeItem("checkoutData");
        }

        if (tran_id && cartItems.length > 0 && parsedData) {
          const newOrderData = {
            customer: {
              name: parsedData.name || null,
              email: parsedData.email || null,
              phone: parsedData.phone || null,
            },
            shipping: {
              address: parsedData.address || null,
              city: parsedData.city || null,
              postal_code: parsedData.postalCode || null,
              country: "Bangladesh",
            },
            items: cartItems.map((item) => ({
              productId: item._id,
              name: item.name,
              qty: item.qty,
              price: item.price,
            })),
            payment_status: "PAID",
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${tran_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newOrderData),
            }
          );

          const result = await response.json();

          if (!response.ok) throw new Error(result.message);

          clearCart();

          console.log("🚀 tran_id:", tran_id);
          console.log("🛒 cartItems:", cartItems);
          console.log("📦 checkoutData:", parsedData);
          console.log("📤 পাঠানো হচ্ছে:", newOrderData);
          console.log("✅ অর্ডার সফলভাবে আপডেট হয়েছে:", result.order);
        }
      } catch (error) {
        console.error("❌ অর্ডার আপডেট করতে সমস্যা হয়েছে:", error.message);
      }
    };

    processOrder();
  }, [tran_id, cartItems]);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-green-700">
          অর্ডার সফল হয়েছে! ট্রানজেকশন আইডিঃ
        </h2>
        <p className="text-gray-800">{tran_id}</p>
      </div>
      <Footer />
    </>
  );
}
