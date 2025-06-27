// components/CartDrawer.js
"use client"; // Make sure this is a client component

import React from "react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
// Removed: import Image from "next/image"; // No longer needed
import { FaTrashAlt } from "react-icons/fa"; // For remove icon
import { HiMinusSm, HiPlusSm } from "react-icons/hi"; // For quantity control icons
import { useRouter } from "next/navigation"; // To programmatically close the drawer after checkout

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleItemSelection, // New: for individual item selection
    toggleSelectAll, // New: for select all functionality
    getSelectedTotal, // New: to get total of selected items
  } = useCart();
  console.log(cartItems);
  const router = useRouter();

  // Calculate total for all items in the drawer (not just selected) for display purposes if needed
  // Note: This function is not currently used in the provided JSX for display.
  const getTotalAllItems = () =>
    Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) => total + item.product.salePrice * item.quantity,
          0
        )
      : 0;

  // Handler for removing an item
  const handleRemove = (product, size) => {
    removeFromCart(product, size);
    // Optionally, add a small toast notification here if you have one
  };

  // Handler for quantity change
  const handleQuantityChange = (product, size, newQuantity) => {
    // Ensure quantity doesn't go below 1
    if (newQuantity < 1) return;
    updateQuantity(product, size, newQuantity);
  };

  // Handler for item selection toggle
  const handleItemToggle = (product, size) => {
    toggleItemSelection(product, size);
  };

  // Handler for "Select All" toggle
  const handleSelectAllToggle = (e) => {
    toggleSelectAll(e.target.checked);
  };

  // Determine if "Select All" checkbox should be checked
  const isSelectAllChecked =
    cartItems.length > 0 && cartItems.every((item) => item.isSelected);

  // Filter selected items for checkout
  const selectedCartItems = cartItems.filter((item) => item.isSelected);
  const isCheckoutDisabled = selectedCartItems.length === 0;

  // Handle checkout and close drawer
  const handleProceedToCheckout = () => {
    if (isCheckoutDisabled) return; // Prevent action if nothing selected

    localStorage.setItem("checkoutCart", JSON.stringify(selectedCartItems));
    localStorage.setItem("checkoutAmount", JSON.stringify(getSelectedTotal()));

    onClose(); // Close the drawer
    router.push("/checkout"); // Navigate to checkout page
  };
  console.log(cartItems);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[9999] overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ overflowScrolling: "touch" }} // Improve scroll behavior on touch devices
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none transition-colors"
            aria-label="Close cart drawer"
          >
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-600 text-center">
            <p className="text-lg font-medium">Your cart is empty!</p>
            <Link
              href="/allProduct"
              onClick={onClose} // Close drawer when navigating
              className="mt-4 text-blue-600 hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            {/* Select All Checkbox */}
            <div className="flex items-center mb-4 p-2 bg-gray-50 rounded-md border border-gray-200">
              <input
                type="checkbox"
                id="drawerSelectAll"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={isSelectAllChecked}
                onChange={handleSelectAllToggle}
              />
              <label
                htmlFor="drawerSelectAll"
                className="ml-2 text-md font-semibold text-gray-700"
              >
                Select All ({selectedCartItems.length} of {cartItems.length})
              </label>
            </div>

            {cartItems.map((item, index) => {
              const productDetails = item.product;

              const imageUrl =
                productDetails.images && productDetails.images.length > 0
                  ? productDetails.images[0]
                  : "/placeholder.jpg"; // Fallback to placeholder if no images

              return (
                <div
                  key={`${productDetails._id}-${item.size}-${index}`}
                  className="flex items-start mb-4 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Item Selection Checkbox */}
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 rounded mr-3 mt-1"
                    checked={item.isSelected}
                    onChange={() => handleItemToggle(productDetails, item.size)}
                  />

                  {/* Replaced Next/image with <img> tag for product images */}
                  <img
                    src={imageUrl}
                    alt={productDetails.name || "Product image"}
                    className="object-cover rounded-md mr-3 flex-shrink-0 w-[80px] h-[80px]" // Apply width and height directly or via CSS
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 text-base leading-tight">
                      {productDetails.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Size:{" "}
                      <span className="font-medium">{item.size.size}</span>
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded-md mt-2 max-w-[100px]">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            productDetails,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="px-2 py-1 text-md text-gray-700 hover:bg-gray-100 rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        <HiMinusSm />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-8 text-center border-x border-gray-300 text-gray-800 font-medium"
                        aria-label="Item quantity"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            productDetails,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 text-md text-gray-700 hover:bg-gray-100 rounded-r-md"
                        aria-label="Increase quantity"
                      >
                        <HiPlusSm />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-gray-800 mt-2">
                      ৳{(productDetails.salePrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(productDetails, item.size)}
                    className="text-red-500 hover:text-red-700 ml-3 flex-shrink-0 p-1"
                    aria-label="Remove item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Fixed Footer for Checkout */}
        {cartItems.length > 0 && (
          <div className="mt-auto pt-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">
                Selected Total:
              </span>
              <span className="text-xl font-extrabold text-black">
                ৳{getSelectedTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className={`w-full text-white px-6 py-3 cursor-pointer rounded-lg text-lg font-semibold transition-all duration-300 ${
                isCheckoutDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-700 cursor-pointer"
              }`}
              disabled={isCheckoutDisabled}
            >
              Proceed to Checkout →
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center mt-2 text-blue-600 hover:underline text-sm"
            >
              View Full Cart Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
