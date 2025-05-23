"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
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
  const { cartItems, clearCart } = useCart();
  const searchParams = useSearchParams();

  const [orderData, setOrderData] = useState(null);
  const [sslData, setSslData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [pageState, setPageState] = useState({
    loading: true,
    error: null,
    success: false,
  });
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const isSaving = useRef(false);

  // Track window size for confetti
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Save order to backend
  const saveOrder = useCallback(async () => {
    if (!customerData || !cartItems.length || isSaving.current) return;

    isSaving.current = true;
    setPageState((prev) => ({ ...prev, loading: true, error: null }));

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
        setOrderData(data.order);
        clearCart();
        setPageState({
          loading: false,
          error: null,
          success: true,
        });
      } else {
        throw new Error(data.message || "Failed to save order");
      }
    } catch (error) {
      setPageState({
        loading: false,
        error: error.message || "Order processing failed",
        success: false,
      });
    } finally {
      isSaving.current = false;
    }
  }, [customerData, cartItems, clearCart, invoiceId]);
  // Load customer data and process order
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const processOrder = async () => {
      try {
        // Load customer data from localStorage
        const saved = localStorage.getItem("checkoutData");
        if (saved && isMounted) {
          const parsedData = JSON.parse(saved);
          setCustomerData(parsedData);
          localStorage.removeItem("checkoutData");
        }

        // Extract SSL data from query params
        const tran_id = searchParams.get("tran_id");
        const amount = searchParams.get("amount");
        const status = searchParams.get("status");
        const card_type = searchParams.get("card_type");

        if (tran_id && isMounted) {
          setInvoiceId(tran_id);
          setSslData({ tran_id, amount, status, card_type });

          // Check if order already exists
          const orderResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchorders/invoice/${tran_id}`,
            { signal: controller.signal }
          );

          const existingOrder = await orderResponse.json();

          if (isMounted && orderResponse.ok && existingOrder) {
            setOrderData(existingOrder);
            setPageState((prev) => ({
              ...prev,
              loading: false,
              success: true,
            }));
          } else if (customerData && cartItems.length) {
            await saveOrder();
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Order processing error:", error);
          setPageState({
            loading: false,
            error: "Failed to process your order. Please contact support.",
            success: false,
          });
        }
      }
    };

    processOrder();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchParams, customerData, cartItems]);
  // Format date for display
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, []);

  // Print invoice handler
  const handlePrint = useCallback(() => {
    if (!orderData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${invoiceId}</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 600; }
            .text-right { text-align: right; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            .text-center { text-align: center; }
            .text-green { color: #10b981; }
            .text-red { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${document.getElementById("invoice")?.innerHTML || ""}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [orderData, invoiceId]);

  // Loading component
  const LoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mb-4"></div>
      <p className="text-gray-600">Processing your order...</p>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div className="flex items-center">
        <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Order Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );

  // Safely get order items
  const getOrderItems = () => {
    if (
      !orderData ||
      !orderData.orderItems ||
      !Array.isArray(orderData.orderItems)
    ) {
      return [];
    }
    return orderData.orderItems;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4 md:p-6 font-sans">
        <section className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center border border-gray-200">
          {/* Confetti effect on success */}
          {pageState.success && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
            />
          )}

          {/* Page header */}
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
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2">
                  Processing Your Order
                </h1>
              </>
            )}
          </div>

          {/* Error display */}
          {pageState.error && <ErrorMessage message={pageState.error} />}

          {/* Loading state */}
          {pageState.loading && <LoadingIndicator />}

          {/* Success content */}
          {pageState.success && orderData && customerData && sslData && (
            <>
              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300"
                  aria-label="Print Invoice"
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

              {/* Invoice */}
              <div
                id="invoice"
                className="text-left mt-6 bg-gray-50 p-6 md:p-8 rounded-lg shadow-inner border border-gray-200"
              >
                {/* Invoice header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-gray-300 pb-4 mb-6">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
                      Weal
                    </h2>
                    <p className="text-sm text-gray-600">www.wealshop.com</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold mb-1 text-gray-700">
                      Invoice ID:{" "}
                      <span className="text-cyan-600">{invoiceId}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(orderData.createdAt)}
                    </p>
                  </div>
                </header>

                {/* Customer information */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2 text-gray-800">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {customerData.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {customerData.email || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {customerData.phone}
                    </p>
                    <p className="md:col-span-2">
                      <span className="font-medium">Address:</span>{" "}
                      {customerData.address}, {customerData.city} -{" "}
                      {customerData.postcode}
                    </p>
                  </div>
                </section>

                {/* Order summary */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2 text-gray-800">
                    Order Summary
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-200 text-left">
                          <th className="py-3 px-4 border border-gray-300">
                            Product
                          </th>
                          <th className="py-3 px-4 border border-gray-300">
                            Size
                          </th>
                          <th className="py-3 px-4 border border-gray-300">
                            Qty
                          </th>
                          <th className="py-3 px-4 border border-gray-300">
                            Unit Price
                          </th>
                          <th className="py-3 px-4 border border-gray-300">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getOrderItems().length > 0 ? (
                          getOrderItems().map((item, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-100"
                              }
                            >
                              <td className="py-3 px-4 border border-gray-300">
                                {item.name}
                              </td>
                              <td className="py-3 px-4 border border-gray-300 text-center">
                                {item.size || "-"}
                              </td>
                              <td className="py-3 px-4 border border-gray-300 text-center">
                                {item.quantity}
                              </td>
                              <td className="py-3 px-4 border border-gray-300">
                                ৳{item.price?.toFixed(2) || "0.00"}
                              </td>
                              <td className="py-3 px-4 border border-gray-300">
                                ৳
                                {(
                                  (item.price || 0) * (item.quantity || 0)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4 text-gray-500"
                            >
                              No order items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-right mt-4 text-lg font-semibold text-gray-800">
                    Grand Total: ৳
                    {orderData.totalAmount?.toFixed(2) ||
                      sslData.amount ||
                      "0.00"}
                  </div>
                </section>

                {/* Payment details */}
                <section className="bg-white p-4 rounded border border-gray-300">
                  <h3 className="font-semibold mb-3 border-b border-gray-300 pb-2 text-gray-800">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p>
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {sslData.tran_id}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={
                          sslData.status === "VALID"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {sslData.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Amount Paid:</span> ৳
                      {sslData.amount}
                    </p>
                    {sslData.card_type && (
                      <p>
                        <span className="font-medium">Card Type:</span>{" "}
                        {sslData.card_type}
                      </p>
                    )}
                  </div>
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
