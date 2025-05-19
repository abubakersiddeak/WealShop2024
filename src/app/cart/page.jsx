"use client";
import React from "react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  console.log(cartItems);
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
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-2">Your cart is empty.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go Shopping
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
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.product.name}</h2>
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
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-xl pt-6 border-t">
            Total:{" "}
            <span className="text-green-600">TK. {getTotal().toFixed(2)}</span>
          </div>
          <div className="text-right">
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
