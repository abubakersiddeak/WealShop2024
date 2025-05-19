"use client";
import React, { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";

export default function Product({ product }) {
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
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
  } = product;

  const containerRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [activeImage, setActiveImage] = useState(
    images[0] || "/placeholder.jpg"
  );
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setIsTouchDevice(hasTouch);
  }, []);
  const handleAddToCart = async () => {
    try {
      console.log(product, quantity, selectedSize);
      addToCart(product, quantity, selectedSize);

      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       userId: user._id,
      //       items: cartItems,
      //       totalAmount: total,
      //       shippingAddress: {
      //         name: "Abubakar",
      //         address: "Chattogram",
      //         city: "Chattogram",
      //         phone: "017XXXXXXXX",
      //       },
      //     }),
      //   }
      // );

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   console.error("Order failed:", errorData.message || "Unknown error");
      //   return;
      // }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
    setZoomed(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setBackgroundPosition("center");
    setZoomed(false);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="relative w-full max-w-[90vw] mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      {/* Left: Image */}
      <div className="flex flex-col items-center space-y-4">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-[90vw] h-[60vh] sm:w-[300px] sm:h-[400px] md:w-[400px] md:h-[500px] overflow-hidden bg-no-repeat bg-cover transition duration-300 ease-in-out"
          style={{
            backgroundImage: `url(${activeImage})`,
            backgroundSize: zoomed ? "200%" : "contain",
            backgroundPosition: backgroundPosition,
          }}
        />

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto max-w-full px-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-cover cursor-pointer border ${
                activeImage === img ? "border-black" : "border-gray-300"
              }`}
              onClick={() => {
                setActiveImage(img);
                setZoomed(false);
                setBackgroundPosition("center");
              }}
            />
          ))}
        </div>
      </div>

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

        {brand && <p className="text-sm text-gray-600">Brand: {brand}</p>}
        {category && (
          <p className="text-sm text-gray-600">
            Category: {category.gender} {category.type}
          </p>
        )}
        {colors.length > 0 && (
          <p className="text-sm text-gray-600">
            Colour:{" "}
            {colors.map((c, index) => (
              <span key={index} className="text-sm text-gray-600">
                {`${c}${index < colors.length - 1 ? ", " : ""}`}
              </span>
            ))}
          </p>
        )}
        <p className="text-sm text-gray-600">Rating: {rating} ⭐</p>
        <p className="text-sm text-gray-600">Reviews: {reviewsCount}</p>

        <p
          className={`font-semibold ${
            inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          Availability: {inStock ? "In Stock " : "Out of Stock "}
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

          <button
            onClick={handleAddToCart} // <-- এখানে ফাংশন ব্যবহার করা হলো
            className="bg-black text-white px-6 py-2 rounded mt-4 hover:bg-gray-800 transition"
          >
            ADD TO CART
          </button>
          {showNotification && (
            <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
              Product added to cart!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
