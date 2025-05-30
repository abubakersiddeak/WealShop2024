// pages/CartPage.js (or src/app/cart/page.js if using app router)
"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import { FaShoppingBag, FaTrashAlt, FaSmileBeam } from "react-icons/fa";

import { HiMinusSm, HiPlusSm } from "react-icons/hi"; // Icons for quantity control

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    toggleSelectAll,
  } = useCart();

  // State to manage the "Select All" checkbox
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  // Effect to update "Select All" checkbox based on individual item selections
  useEffect(() => {
    // If there are cart items and ALL of them are selected, set "Select All" to true
    if (cartItems.length > 0 && cartItems.every((item) => item.isSelected)) {
      setIsSelectAllChecked(true);
    } else {
      // Otherwise, "Select All" should be false (either some are unselected, or cart is empty)
      setIsSelectAllChecked(false);
    }
  }, [cartItems]);

  const getSelectedTotal = () =>
    Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) =>
            item.isSelected
              ? total + item.product.salePrice * item.quantity
              : total,
          0
        )
      : 0;

  const handleRemove = (product, size) => {
    removeFromCart(product, size);
    toast.success("Item removed from cart!", {
      icon: "👋",
    });
  };

  const handleQuantityChange = (product, size, newQuantity) => {
    updateQuantity(product, size, newQuantity);
  };

  const handleItemToggle = (product, size) => {
    toggleItemSelection(product, size);
  };

  const handleSelectAllToggle = (e) => {
    const isChecked = e.target.checked;
    setIsSelectAllChecked(isChecked);
    toggleSelectAll(isChecked);
  };

  // Improved loading state (though context should ideally manage this)
  if (!cartItems) {
    // This check relies on cartItems being undefined initially.
    // If cartItems is initialized as [], this block won't run.
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto p-4 py-12 min-h-[70vh] flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-800">
            Your Cart
          </h1>
          <div className="flex flex-col items-center justify-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-xl text-gray-600 font-medium">
              Loading your cart items...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Filter selected items for checkout
  const selectedCartItems = cartItems.filter((item) => item.isSelected);
  const isCheckoutDisabled = selectedCartItems.length === 0;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 py-8 md:py-12 min-h-[70vh]">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-gray-800">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <FaSmileBeam className="text-black text-6xl mx-auto mb-4" />
            <p className="text-gray-700 mb-6 text-lg font-medium">
              Your cart is feeling a little lonely.
            </p>
            <Link
              href="/allProduct"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm hover:bg-gray-700 transition-all duration-300 text-lg shadow-md hover:shadow-lg"
              title="Start Browse our amazing products"
            >
              <FaShoppingBag className="text-xl" />
              Start Shopping Now!
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Select All Checkbox */}
            <div className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-md">
              <input
                type="checkbox"
                id="selectAll"
                className="form-checkbox h-5 w-5 cursor-pointer text-black rounded"
                checked={isSelectAllChecked}
                onChange={handleSelectAllToggle}
              />
              <label
                htmlFor="selectAll"
                className="ml-3 text-lg font-semibold text-gray-700"
              >
                Select All ({selectedCartItems.length} of {cartItems.length}{" "}
                selected)
              </label>
            </div>

            {cartItems.map((item, index) => (
              <div
                key={`${item.product._id}-${item.size}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 gap-4"
              >
                {/* Checkbox for individual item */}
                <input
                  type="checkbox"
                  className="form-checkbox cursor-pointer h-5 w-5 text-black rounded self-start mt-1 sm:mt-0"
                  checked={item.isSelected}
                  onChange={() => handleItemToggle(item.product, item.size)}
                />

                <div className="flex items-center gap-4 flex-grow">
                  <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                    <img
                      src={item.product.images[0] || "/placeholder-product.jpg"}
                      alt={item.product.name || "Product image"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">
                      {item.product.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded mt-2 max-w-[120px]">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 cursor-pointer text-lg text-gray-700 hover:bg-gray-100 rounded-l"
                        aria-label="Decrease quantity"
                      >
                        <HiMinusSm />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-10 text-center border-x border-gray-300 text-gray-800 font-medium"
                        aria-label="Item quantity"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 cursor-pointer text-lg text-gray-700 hover:bg-gray-100 rounded-r"
                        aria-label="Increase quantity"
                      >
                        <HiPlusSm />
                      </button>
                    </div>

                    <p className="text-md sm:text-lg font-semibold text-gray-800 mt-2">
                      Price:{" "}
                      <span className="text-gray-700">
                        TK. {item.product.salePrice}
                      </span>{" "}
                      × {item.quantity} ={" "}
                      <span className="text-black font-extrabold">
                        TK.{" "}
                        {(item.product.salePrice * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.product, item.size)}
                  className="cursor-pointer mt-3 sm:mt-0 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200 flex items-center justify-center gap-2 self-end sm:self-center text-sm font-medium"
                  title="Remove item from cart"
                >
                  <FaTrashAlt />
                  Remove
                </button>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-xl border-t-4 border-black mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                Selected Items Total:
              </h2>
              <span className="text-2xl md:text-3xl font-extrabold text-black">
                TK. {getSelectedTotal().toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-4 pt-6">
              <Link
                href="/allProduct"
                className="w-full sm:w-auto text-center bg-gray-800 text-white px-8 py-3 rounded-sm hover:bg-gray-700 transition-all duration-300 text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                🛍️ Continue Shopping
              </Link>

              <Link
                href="/checkout"
                onClick={() => {
                  // Only store selected items for checkout
                  localStorage.setItem(
                    "checkoutCart",
                    JSON.stringify(selectedCartItems) // <--- THIS IS THE FIX
                  );
                  localStorage.setItem(
                    "checkoutAmount",
                    JSON.stringify(getSelectedTotal())
                  );
                }}
                className={`w-full sm:w-auto text-center px-8 py-3 rounded-sm text-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                  isCheckoutDisabled
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-700 hover:shadow-lg"
                }`}
                aria-disabled={isCheckoutDisabled}
                tabIndex={isCheckoutDisabled ? -1 : 0} // Make it not focusable when disabled
              >
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
