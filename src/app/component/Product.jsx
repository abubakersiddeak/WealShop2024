"use client";
import React, { useRef, useState } from "react";

export default function Product({ product }) {
  const containerRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
    setZoomed(true);
  };

  const handleMouseLeave = () => {
    setBackgroundPosition("center");
    setZoomed(false);
  };

  return (
    <div className="relative w-full max-w-[90vw] mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      {/* Left Image */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-[300px] sm:h-[400px] md:h-[80vh] rounded-2xl overflow-hidden bg-no-repeat bg-cover transition duration-300 ease-in-out"
        style={{
          backgroundImage: "url(/61mVhojYteL._AC_UY1100_.jpg)",
          backgroundSize: zoomed ? "200%" : "contain",
          backgroundPosition: backgroundPosition,
        }}
      />

      {/* Right Info */}
      <div className="mt-4 md:mt-6 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold">{product}</h1>
        <p className="text-lg sm:text-xl font-semibold text-gray-700">
          TK. 3157
        </p>

        <div className="space-y-1 text-sm text-gray-700">
          <p className="font-semibold">INFO GUIDE</p>
          <p>semi long shirt</p>
          <p>collar neck with full sleeves</p>
          <p>embroidered applique attached</p>
          <p>Fabric: cotton</p>
          <p>Color: deep grey</p>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p>The model usually wears size M Top and 28 Waist Bottoms.</p>
          <p>The model is wearing size M.</p>
          <p>Fits true to size.</p>
          <p>Height: 5'4" (162.56 cm)</p>
          <p>Bust: 33" (83 cm)</p>
          <p>Shoulder: 14.5" (37 cm)</p>
          <p>Waist: 26"</p>
        </div>

        <div>
          <p className="text-green-600 font-semibold">
            Availability: In Stock ✅
          </p>
          <p className="text-sm text-gray-600">SKU: 11003874</p>
          <p className="text-sm text-gray-600">PID: PI6102</p>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium mb-1">
            SIZE
          </label>
          <select
            id="size"
            className="border border-gray-300 p-2 rounded w-full max-w-[160px]"
          >
            <option>S</option>
            <option>M</option>
            <option>L</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center border border-gray-300 rounded">
            <button className="px-3 py-1 text-lg">-</button>
            <input
              type="text"
              value="1"
              readOnly
              className="w-10 text-center border-x border-gray-300"
            />
            <button className="px-3 py-1 text-lg">+</button>
          </div>
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
