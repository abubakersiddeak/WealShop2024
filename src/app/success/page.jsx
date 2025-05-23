"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useCart } from "@/context/cartContext";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function SuccessPage() {
  const { cartItems, clearCart } = useCart();
  const searchParams = useSearchParams();

  const [orderData, setOrderData] = useState(null);
  const [sslData, setSslData] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [error, setError] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");

  const isSaving = useRef(false);

  // Load customer data from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("checkoutData");
    if (saved) {
      try {
        setCustomerData(JSON.parse(saved));
        localStorage.removeItem("checkoutData");
      } catch (e) {
        console.error("Failed to parse checkout data from localStorage", e);
        setError("Failed to load customer data.");
      }
    }
  }, []);

  // Extract SSL data and invoiceId from query params
  useEffect(() => {
    const tran_id = searchParams.get("tran_id");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");
    const card_type = searchParams.get("card_type");

    if (tran_id) setInvoiceId(tran_id);
    if (tran_id && amount && status) {
      setSslData({ tran_id, amount, status, card_type });
    }
  }, [searchParams]);

  // Save order to backend
  const saveOrder = useCallback(async () => {
    if (!customerData || !cartItems.length || orderSaved || isSaving.current) {
      return;
    }

    isSaving.current = true;
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...customerData,
            invoiceId,
            totalAmount: customerData.amount || 0,
            orderItems: cartItems.map((item) => ({
              productId: item.product?._id,
              name: item.product?.name,
              price: item.product?.price,
              quantity: item.quantity,
              size: item.size,
            })),
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderSaved(true);
        setOrderData(data.order);
        clearCart();
      } else {
        setError(`Order failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setError("Error saving order: " + err.message);
    } finally {
      isSaving.current = false;
    }
  }, [customerData, cartItems, orderSaved, clearCart, invoiceId]);

  // Call saveOrder once customerData and cartItems are ready
  useEffect(() => {
    saveOrder();
  }, [saveOrder]);

  // Fetch order by invoiceId from backend (in case of page reload)
  useEffect(() => {
    if (!invoiceId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchorders/invoice/${invoiceId}`
        );
        const data = await res.json();

        if (res.ok && data) {
          setOrderData(data);
          setOrderSaved(true);
        } else {
          setError("Order not found or failed to fetch.");
        }
      } catch (err) {
        setError("Error fetching order: " + err.message);
      }
    };

    // Only fetch if orderData is not already set (avoid override)
    if (!orderData) fetchOrder();
  }, [invoiceId, orderData]);

  // Helper: Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Print invoice handler
  const handlePrint = () => {
    if (!orderData) return;

    const printContents = document.getElementById("invoice").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  const handleDownload = () => {
    const element = document.getElementById("invoice");
    const opt = {
      margin: 0.3,
      filename: `invoice_${invoiceId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-6 font-sans">
        <section className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 text-center border">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg mb-6 text-gray-600">
            Thank you for your purchase. Your order is confirmed.
          </p>

          {orderSaved && customerData && sslData && orderData ? (
            <>
              <div className="mb-6">
                <button
                  onClick={handlePrint}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2 rounded shadow transition duration-300"
                  aria-label="Print Invoice"
                >
                  Print Invoice
                </button>
              </div>

              {/* INVOICE */}
              <div
                id="invoice"
                className="text-left mt-6 bg-gray-50 p-8 rounded-lg shadow-inner border"
              >
                {/* Header */}
                <header className="flex items-center justify-between border-b-2 border-gray-300 pb-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-wide">Weal</h2>
                    <p className="text-sm text-gray-600">www.wealshop.com</p>
                  </div>
                  <div className="text-right text-sm text-gray-700">
                    <p className="font-semibold mb-1">
                      Invoice ID:{" "}
                      <span className="text-cyan-600">{invoiceId}</span>
                    </p>
                    <p>{formatDate(orderData.createdAt || new Date())}</p>
                  </div>
                </header>

                {/* Customer Info */}
                <section className="mb-6 text-sm text-gray-700">
                  <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 pb-1">
                    Customer Information
                  </h3>
                  <p>
                    <strong>Name:</strong> {customerData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {customerData.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {customerData.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {customerData.address},{" "}
                    {customerData.city} - {customerData.postcode}
                  </p>
                </section>

                {/* Order Summary */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">
                    Order Summary
                  </h3>
                  <table className="w-full text-sm table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="py-2 px-3 border border-gray-300">
                          Product
                        </th>
                        <th className="py-2 px-3 border border-gray-300">
                          Size
                        </th>
                        <th className="py-2 px-3 border border-gray-300">
                          Qty
                        </th>
                        <th className="py-2 px-3 border border-gray-300">
                          Unit Price
                        </th>
                        <th className="py-2 px-3 border border-gray-300">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(orderData?.orderItems).map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          }
                        >
                          <td className="py-2 px-3 border border-gray-300">
                            {item.name}
                          </td>
                          <td className="py-2 px-3 border border-gray-300">
                            {item.size || "-"}
                          </td>
                          <td className="py-2 px-3 border border-gray-300">
                            {item.quantity}
                          </td>
                          <td className="py-2 px-3 border border-gray-300">
                            ৳{item.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 border border-gray-300">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right mt-4 text-lg font-semibold text-gray-800">
                    Grand Total: ৳
                    {orderData.totalAmount?.toFixed(2) || sslData.amount}
                  </div>
                </section>

                {/* Payment Info */}
                <section className="text-sm bg-white p-4 rounded border border-gray-300 mt-8 text-gray-700">
                  <h3 className="font-semibold mb-2 border-b border-gray-300 pb-1">
                    Payment Details
                  </h3>
                  <p>
                    <strong>Transaction ID:</strong> {sslData.tran_id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        sslData.status === "VALID"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {sslData.status}
                    </span>
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> ৳{sslData.amount}
                  </p>
                  {sslData.card_type && (
                    <p>
                      <strong>Card Type:</strong> {sslData.card_type}
                    </p>
                  )}
                </section>
              </div>
            </>
          ) : (
            <p className="text-gray-700 mt-8">Loading your order details...</p>
          )}
        </section>
        <a
          href="/allProduct"
          className="mt-4 bg-cyan-600 hover:bg-cyan-800 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
        >
          🛍️ Shop More
        </a>
      </main>
      <Footer />
    </>
  );
}
