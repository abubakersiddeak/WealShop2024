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
  const [showorder, setShoworder] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [pageState, setPageState] = useState({
    loading: true,
    error: null,
    success: false,
  });

  const isSaving = useRef(false);

  // Track window size for Confetti
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Load customer data from localStorage
  useEffect(() => {
    const storedCustomer = localStorage.getItem("checkoutData");
    if (storedCustomer) {
      try {
        const parsed = JSON.parse(storedCustomer);
        setCustomerData(parsed);
      } catch {
        console.error("Failed to parse checkoutData from localStorage");
      }
    }
  }, []);

  // Save order if customerData and tran_id is available
  useEffect(() => {
    const saveOrder = async () => {
      if (!tran_id || !customerData || cartItems.length === 0) return;

      isSaving.current = true;

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
                address: customerData.shipping,
                city: customerData.city,
                postal_code: customerData.postcode,
                country: "Bangladesh",
              },
              items: cartItems.map((i) => ({
                name: i.product.name,
                price: i.product.price,
                quantity: i.quantity,
                size: i.size,
              })),
              payment_status: "PAID",
            }),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setOrderData(data.order);
          setPageState({ loading: false, error: null, success: true });
          clearCart(); // Optional: অর্ডার সফল হলে কার্ট ক্লিয়ার করো
        } else {
          setPageState({
            loading: false,
            error: data.message || "Update failed",
            success: false,
          });
        }
      } catch (error) {
        console.error("Save order error:", error.message);
        setPageState({
          loading: false,
          error: "অর্ডার সংরক্ষণে সমস্যা হয়েছে।",
          success: false,
        });
      }
    };

    if (tran_id && customerData) {
      saveOrder();
    }
  }, [tran_id, customerData]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!tran_id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchorders/invoice/${tran_id}`
        );
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

  const getOrderItems = () => {
    if (!orderData?.items) return [];
    return orderData.items.map((item) => ({
      name: item.name || "-",
      size: item.size || "-",
      quantity: item.qty || item.quantity || 1,
      price: item.price || 0,
    }));
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const invoiceId = orderData?._id || tran_id || "-";
  console.log(showorder);
  console.log(cartItems);

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

          {pageState.success && orderData && customerData && (
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

              {showorder?.order && (
                <>
                  <div
                    id="invoice"
                    className="text-left mt-6 bg-gray-50 p-6 md:p-8 rounded-lg shadow-inner border border-gray-200"
                  >
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-gray-300 pb-4 mb-6">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
                          Weal
                        </h2>
                        <p className="text-sm text-gray-600">
                          Chattogram, Bangladesh
                        </p>
                        <p className="text-sm text-gray-600">
                          Phone: 01937370777
                        </p>
                      </div>
                      <div className="text-sm text-gray-700">
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

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Customer Info
                        </h3>
                        <p>{showorder.order.customer?.name}</p>
                        <p>{showorder.order.customer?.email}</p>
                        <p>{showorder.order.customer?.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Shipping Address
                        </h3>
                        <p>{showorder.order.shipping?.address}</p>
                        <p>{showorder.order.shipping?.city}</p>
                        <p>{showorder.order.shipping?.postal_code}</p>
                        <p>Bangladesh</p>
                      </div>
                    </section>

                    <table className="w-full text-left border-collapse border border-gray-300">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2">
                            Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Size
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Qty
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {showorder.order.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.size || "-"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.quantity}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              ৳{item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
