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
  FiDownload,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const tran_id = searchParams.get("tran_id");

  const { cartItems, clearCart } = useCart();

  const [customerData, setCustomerData] = useState(null);
  const [orderData, setOrderData] = useState(null); // This holds the order saved to DB
  const [displayOrder, setDisplayOrder] = useState(null); // This holds the order fetched for display
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [pageState, setPageState] = useState({
    loading: true,
    error: null,
    success: false,
  });

  const isSavingOrder = useRef(false); // Flag to prevent multiple order saves
  const invoiceRef = useRef(null); // Ref for the invoice section for PDF generation

  // --- Utility Functions ---
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const calculateGrandTotal = useCallback((items) => {
    return (
      items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
    );
  }, []);

  // --- Effects ---

  // 1. Track window size for Confetti
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize(); // Set initial size

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 2. Load customer data from localStorage once
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
      // Optionally, set an error state here if crucial for flow
    }
  }, []);

  // 3. Save order to the database if `tran_id`, `customerData`, and `cartItems` exist
  //    This effect runs only once per transaction ID to prevent duplicate order saving.
  useEffect(() => {
    // Ensure all prerequisites are met and order hasn't been saved yet
    if (
      !tran_id ||
      !customerData ||
      !cartItems?.length ||
      isSavingOrder.current
    ) {
      // console.log("Skipping saveOrder:", { tran_id, customerData, cartItemsLength: cartItems?.length, isSavingOrder: isSavingOrder.current });
      return;
    }

    isSavingOrder.current = true; // Set flag to true to prevent re-execution

    const saveOrder = async () => {
      setPageState((prev) => ({ ...prev, loading: true }));
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
                size: item.size || "N/A", // Ensure size is always defined
              })),
              payment_status: "PAID",
              // Add a total amount for easier database querying/validation
              total_amount: calculateGrandTotal(cartItems),
            }),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setOrderData(data.order); // Store the saved order details
          setPageState({ loading: false, error: null, success: true });
          clearCart(); // Clear cart only on successful order save
          localStorage.removeItem("checkoutData"); // Clear checkout data after successful order
        } else {
          // Log server-side error for debugging
          console.error("Server responded with an error:", data.message);
          setPageState({
            loading: false,
            error:
              data.message ||
              "Failed to finalize your order. Please contact support.",
            success: false,
          });
        }
      } catch (error) {
        console.error("Error saving order:", error);
        setPageState({
          loading: false,
          error:
            "An unexpected error occurred while saving your order. Please check your internet connection or contact support.",
          success: false,
        });
      } finally {
        isSavingOrder.current = false; // Reset flag after operation attempt
      }
    };

    saveOrder();
  }, [tran_id, customerData, cartItems, clearCart, calculateGrandTotal]);

  // 4. Fetch order details for display using `tran_id`
  //    This runs independently to populate the invoice, even if `saveOrder` had issues.
  useEffect(() => {
    if (!tran_id) {
      setPageState((prev) => ({ ...prev, loading: false })); // Stop loading if no tran_id
      return;
    }

    const fetchOrderForDisplay = async () => {
      setPageState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchorders/invoice/${tran_id}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to retrieve order details for display."
          );
        }
        const orderDetails = await res.json();
        setDisplayOrder(orderDetails.order); // Assuming the API returns { order: ... }
        setPageState((prev) => ({
          ...prev,
          loading: false,
          success: prev.success || true,
        })); // Mark as success if fetched, or keep existing success state
      } catch (err) {
        console.error("Order fetch error for display:", err);
        setPageState((prev) => ({
          ...prev,
          loading: false,
          error: prev.error || `Could not load order details: ${err.message}`, // Keep existing error if more specific
          success: false,
        }));
      }
    };

    fetchOrderForDisplay();
  }, [tran_id]);

  // --- Handlers ---
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 }); // Scale for better resolution
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        // If content exceeds one page, handle pagination
        const pageHeight = pdf.internal.pageSize.getHeight();
        let position = 0;

        while (position < pdfHeight) {
          pdf.addImage(imgData, "PNG", 0, position * -1, pdfWidth, pdfHeight);
          position += pageHeight;
          if (position < pdfHeight) {
            pdf.addPage();
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`invoice_${tran_id || "Weal"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again or print the page.");
    }
  };

  // Determine which order data to display (prefer `orderData` if available, otherwise `displayOrder`)
  const orderToDisplay = orderData || displayOrder;

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
              numberOfPieces={300} // Slightly reduced for performance
              initialVelocityX={{ min: -10, max: 10 }}
              initialVelocityY={{ min: 10, max: 20 }}
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
              // This state will primarily be visible during the initial fetch/save
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2">
                  Processing Your Order...
                </h1>
                <p className="text-lg text-gray-600">
                  Please wait while we finalize your transaction.
                </p>
              </>
            )}
          </div>

          {pageState.loading && (
            <p className="text-gray-500 text-lg">
              {pageState.success
                ? "Loading order details..."
                : "Finalizing order..."}
            </p>
          )}

          {pageState.success && orderToDisplay && (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300"
                >
                  <FiPrinter className="h-5 w-5" />
                  Print Invoice
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300"
                >
                  <FiDownload className="h-5 w-5" />
                  Download Invoice (PDF)
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
                ref={invoiceRef} // Assign ref here for PDF generation
                className="text-left mt-6 bg-white p-6 md:p-8 rounded-lg shadow-inner border border-gray-200 print:shadow-none print:border-none" // Add print styles
              >
                <header className="border-b border-gray-300 pb-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Weal</h2>
                  <p className="text-sm text-gray-600">www.wealshop.com</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Invoice ID:</span>{" "}
                      {orderToDisplay._id || tran_id}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {formatDate(orderToDisplay.createdAt)}
                    </p>
                  </div>
                </header>

                <section className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Customer Information
                  </h3>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {orderToDisplay.customer?.name || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {orderToDisplay.customer?.email || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {orderToDisplay.customer?.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {orderToDisplay.shipping?.address},{" "}
                    {orderToDisplay.shipping?.city} -{" "}
                    {orderToDisplay.shipping?.postal_code}
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                  <div className="overflow-x-auto">
                    {" "}
                    {/* Added for small screens */}
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
                        {orderToDisplay.items?.length > 0 ? (
                          orderToDisplay.items.map((item, index) => (
                            <tr key={index}>
                              <td className="border px-4 py-2">{item.name}</td>
                              <td className="border px-4 py-2">
                                {item.size || "N/A"}
                              </td>
                              <td className="border px-4 py-2">
                                {item.quantity}
                              </td>
                              <td className="border px-4 py-2">
                                ৳{item.price.toFixed(2)}
                              </td>
                              <td className="border px-4 py-2">
                                ৳{(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="border px-4 py-2 text-center text-gray-500"
                            >
                              No items found in this order.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right font-semibold text-lg">
                    Grand Total: ৳
                    {calculateGrandTotal(orderToDisplay.items).toFixed(2)}
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    Payment Details
                  </h3>
                  <p>
                    <span className="font-semibold">Transaction ID:</span>{" "}
                    {tran_id || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {orderToDisplay.payment_status || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Amount Paid:</span> ৳
                    {calculateGrandTotal(orderToDisplay.items).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {orderToDisplay.payment_method || "BKASH-BKash"}{" "}
                    {/* Default if not stored */}
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
