"use client";
import React from "react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import { FaShoppingBag } from "react-icons/fa";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  const getTotal = () =>
    Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      : 0;

  const handleRemove = (product, size) => {
    removeFromCart(product, size);
    toast.success("Item removed from cart");
  };

  if (!Array.isArray(cartItems)) {
    return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 min-h-[70vh]">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2 text-lg">
              Your cart is currently empty.
            </p>
            <Link
              href="/allProduct"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              title="Browse items"
            >
              <FaShoppingBag />
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded shadow-md"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">
                      {item.product.name}
                    </h2>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      TK. {item.product.price} × {item.quantity} ={" "}
                      <span className="text-blue-600 font-bold">
                        TK. {item.product.price * item.quantity}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.product, item.size)}
                  className="text-red-600 hover:text-red-800 hover:underline"
                  title="Remove item from cart"
                >
                  ❌ Remove
                </button>
              </div>
            ))}

            <div className="text-right font-bold text-xl pt-6 border-t">
              Total:{" "}
              <span className="text-green-600">
                TK. {getTotal().toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 pt-4">
              <Link
                href="/allProduct"
                className="bg-gray-900 text-white px-5 py-2 rounded hover:bg-gray-700 transition"
              >
                🛍️ Shop More
              </Link>

              <button className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
