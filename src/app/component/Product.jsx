"use client";
import React, { useRef, useState } from "react";

export default function Product({ product }) {
  const {
    name,
    description,
    category,
    price,
    brand,
    sizes = [],
    colors = [],
    inStock,
    images = [],
    rating,
    reviewsCount,
    isFeatured,
    sizeGuide,
  } = product;

  const containerRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

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

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="relative w-full max-w-[90vw] mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      {/* Left: Image */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-[300px] sm:h-[400px] md:h-[80vh] rounded-2xl overflow-hidden bg-no-repeat bg-cover transition duration-300 ease-in-out"
        style={{
          backgroundImage: `url(${images[0] || "/placeholder.jpg"})`,
          backgroundSize: zoomed ? "200%" : "contain",
          backgroundPosition: backgroundPosition,
        }}
      />

      {/* Right: Info */}
      <div className="mt-4 md:mt-6 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold">{name}</h1>
        <p className="text-lg sm:text-xl font-semibold text-gray-700">
          TK. {price}
        </p>

        {description && (
          <div className="space-y-1 text-sm text-gray-700">
            <p className="font-semibold">DESCRIPTION</p>
            <p>{description}</p>
          </div>
        )}

        {/* Extra Details (Optional) */}
        {brand && <p className="text-sm text-gray-600">Brand: {brand}</p>}
        {category && (
          <p className="text-sm text-gray-600">Category: {category}</p>
        )}
        {rating && <p className="text-sm text-gray-600">Rating: {rating} ⭐</p>}
        {reviewsCount && (
          <p className="text-sm text-gray-600">Reviews: {reviewsCount}</p>
        )}

        {/* Availability */}
        <p
          className={`font-semibold ${
            inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          Availability: {inStock ? "In Stock ✅" : "Out of Stock ❌"}
        </p>

        {/* Size Selector & Quantity */}
        <div className="mt-6 space-y-4">
          {sizes.length > 0 && (
            <div>
              <label htmlFor="size" className="block text-sm font-medium mb-1">
                SIZE
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full max-w-[160px]"
              >
                {sizes.map((size, i) => (
                  <option key={i}>{size}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded mt-4">
            <button onClick={decreaseQuantity} className="px-3 py-1 text-lg">
              -
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-10 text-center border-x border-gray-300"
            />
            <button onClick={increaseQuantity} className="px-3 py-1 text-lg">
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="bg-black text-white px-6 py-2 rounded mt-4 hover:bg-gray-800 transition">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
