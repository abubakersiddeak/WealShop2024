// components/CartDrawer.js
import React from "react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems } = useCart();

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item, index) => {
              // Access product details from item.product
              const productDetails = item.product;

              // Determine the image source safely from productDetails.images
              const imageUrl =
                productDetails.images && productDetails.images.length > 0
                  ? productDetails.images[0]
                  : "/placeholder.jpg"; // Fallback to placeholder if no images

              return (
                <div
                  key={index}
                  className="flex items-center mb-4 border-b pb-2"
                >
                  <img
                    src={imageUrl} // Use the safely determined URL
                    alt={productDetails.name} // Access name from productDetails
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{productDetails.name}</h3>{" "}
                    {/* Access name from productDetails */}
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}{" "}
                      {/* This is the cart quantity */}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} {/* Access size from item directly */}
                    </p>
                    <p className="text-sm font-bold">
                      TK. {productDetails.salePrice * item.quantity}{" "}
                      {/* Access salePrice from productDetails */}
                    </p>
                  </div>
                </div>
              );
            })}

            <Link
              href="/checkout"
              onClick={() => {
                localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
                localStorage.setItem(
                  "checkoutAmount",
                  JSON.stringify(getTotal())
                );
              }}
              className="mt-6 w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
            >
              Proceed to Checkout →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
