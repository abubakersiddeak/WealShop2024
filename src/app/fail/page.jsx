"use client";
import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function FailPage() {
  const handleRetry = () => {
    // Reload page or redirect user to checkout or home page
    window.location.href = "/checkout";
  };

  return (
    <>
      <Navbar />
      <div className="h-screen  flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gradient-to-tr from-red-600 via-red-400 to-pink-600 rounded-3xl p-12 shadow-lg max-w-md w-full">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-24 w-24 text-white animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4">
            Oops! Payment Failed
          </h1>
          <p className="text-white/90 mb-8 text-lg">
            Something went wrong during the payment process.
            <br />
            Please try again or contact our support team for assistance.
          </p>

          <button
            onClick={handleRetry}
            className="bg-white text-red-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-red-500/50 transition duration-300 transform hover:-translate-y-1"
          >
            Retry Payment
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
