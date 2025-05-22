"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart after payment success
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("checkoutAmount");

    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home or orders page
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-6 font-sans">
      <div className="max-w-lg w-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 rounded-3xl shadow-lg p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="text-7xl animate-pulse">🚀</div>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide drop-shadow-md">
          Payment Successful!
        </h1>
        <p className="text-lg mb-6 leading-relaxed tracking-wide">
          Thank you for your purchase. Your order is now being processed and
          will be shipped soon.
        </p>
        <p className="italic text-cyan-200 text-sm">
          You will be redirected to the homepage shortly...
        </p>
      </div>
      <div className="mt-10 text-gray-400 text-xs select-none">
        &copy; {new Date().getFullYear()} Weal. All rights reserved.
      </div>
    </div>
  );
}
