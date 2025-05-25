"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/context/cartContext";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Confetti from "react-confetti";
import {
  FiPrinter,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const tran_id = searchParams.get("tran_id");

  const { cartItems, clearCart } = useCart();

  const [customerData, setCustomerData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showorder, setShoworder] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [pageState, setPageState] = useState({
    loading: true,
    error: null,
    success: false,
  });

  const isSaving = useRef(false);

  // Track window size for Confetti
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Load customer data from localStorage once
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedCustomer = localStorage.getItem("checkoutData");
      if (storedCustomer) {
        const parsed = JSON.parse(storedCustomer);
        setCustomerData(parsed);
      }
    } catch (err) {
      console.error("Failed to parse checkoutData from localStorage", err);
    }
  }, []);

  // Save order if tran_id, customerData and cartItems exist & only once (isSaving flag)
  useEffect(() => {
    if (!tran_id || !customerData || !cartItems?.length || isSaving.current)
      return;

    isSaving.current = true;

    const saveOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${tran_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer: {
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
              },
              shipping: {
                address: customerData.address,
                city: customerData.city,
                postal_code: customerData.postcode,
                country: "Bangladesh",
              },
              items: cartItems.map((item) => ({
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                size: item.size,
              })),
              payment_status: "PAID",
            }),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setOrderData(data.order);
          setPageState({ loading: false, error: null, success: true });
          clearCart();
        } else {
          setPageState({
            loading: false,
            error: data.message || "Update failed",
            success: false,
          });
        }
      } catch (error) {
        console.error("Save order error:", error);
        setPageState({
          loading: false,
          error: "অর্ডার সংরক্ষণে সমস্যা হয়েছে।",
          success: false,
        });
      }
    };

    saveOrder();
  }, [tran_id, customerData, cartItems, clearCart]);

  // Fetch order details when tran_id changes
  useEffect(() => {
    if (!tran_id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchorders/invoice/${tran_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch order details");
        const orderDetails = await res.json();
        setShoworder(orderDetails);
      } catch (err) {
        console.error("Order fetch error:", err);
      }
    };

    fetchOrder();
  }, [tran_id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4 md:p-6 font-sans">
        <section className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center border border-gray-200">
          {pageState.success && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
            />
          )}

          <div className="mb-6">
            {pageState.success ? (
              <>
                <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  Payment Successful!
                </h1>
                <p className="text-lg text-gray-600">
                  Thank you for your purchase. Your order is confirmed.
                </p>
              </>
            ) : pageState.error ? (
              <>
                <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  Order Processing Issue
                </h1>
                <p className="text-lg text-red-600">{pageState.error}</p>
              </>
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2">
                Processing Your Order
              </h1>
            )}
          </div>

          {pageState.loading && <p>Loading...</p>}

          {pageState.success && showorder?.order && (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300"
                >
                  <FiPrinter className="h-5 w-5" />
                  Print Invoice
                </button>
                <a
                  href="/allProduct"
                  className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300"
                >
                  <FiShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </a>
              </div>

              <div
                id="invoice"
                className="text-left mt-6 bg-white p-6 md:p-8 rounded-lg shadow-inner border border-gray-200"
              >
                <header className="border-b border-gray-300 pb-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Weal</h2>
                  <p className="text-sm text-gray-600">www.wealshop.com</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Invoice ID:</span>{" "}
                      {showorder.order._id || tran_id}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {formatDate(showorder.order.createdAt)}
                    </p>
                  </div>
                </header>

                <section className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Customer Information
                  </h3>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {showorder.order.customer?.name || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {showorder.order.customer?.email || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {showorder.order.customer?.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {showorder.order.shipping?.address},{" "}
                    {showorder.order.shipping?.city} -{" "}
                    {showorder.order.shipping?.postal_code}
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                  <table className="w-full text-left border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-4 py-2">Product</th>
                        <th className="border px-4 py-2">Size</th>
                        <th className="border px-4 py-2">Qty</th>
                        <th className="border px-4 py-2">Unit Price</th>
                        <th className="border px-4 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showorder.order.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2">
                            {item.size || "-"}
                          </td>
                          <td className="border px-4 py-2">{item.quantity}</td>
                          <td className="border px-4 py-2">
                            ৳{item.price.toFixed(2)}
                          </td>
                          <td className="border px-4 py-2">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right font-semibold text-lg">
                    Grand Total: ৳
                    {showorder.order.items
                      ?.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    Payment Details
                  </h3>
                  <p>
                    <span className="font-semibold">Transaction ID:</span>{" "}
                    {tran_id}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> VALID
                  </p>
                  <p>
                    <span className="font-semibold">Amount Paid:</span> ৳
                    {showorder.order.items
                      ?.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Card Type:</span>{" "}
                    BKASH-BKash
                  </p>
                </section>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
