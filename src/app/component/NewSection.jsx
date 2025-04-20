"use client";
import { productData } from "../db/db";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
export default function NewSection() {
  const scrollRef = useRef(null);
  const router = useRouter();
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const productClick = (e, index) => {
    e.preventDefault();
    console.log(index);
    router.push(`/${index}`);
  };
  console.log(productData);
  return (
    <div className="relative p-4  ">
      <h1 className="xl:p-4 xl:text-6xl font-extrabold">New Arrival</h1>

      {/* Left arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10  text-white p-2 rounded-full  md:text-4xl "
      >
        ❮
      </button>

      {/* Right arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10  text-white p-2 rounded-full  md:text-4xl"
      >
        ❯
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex xl:gap-6 gap-2 overflow-x-hidden scroll-smooth md:p-2"
      >
        {/* 🔁 Cardগুলো এখানেই থাকবে – নিচে দেখানো হয়েছে */}
        {productData.map((p, index) => (
          <button
            onClick={(e) => productClick(e, index)}
            key={index}
            className="relative w-52 md:w-80 bg-white rounded-2xl overflow-hidden   hover:scale-[1.02] transition-all duration-500"
          >
            {/* Soft Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6a5bff] to-[#bb82f4] opacity-15 blur-xl z-0"></div>

            {/* Product Image */}
            <div className="relative z-10 flex items-center justify-center bg-gray-100 h-60 md:h-80">
              <img
                src="/-473Wx593H-700089869-black-MODEL.avif"
                alt={p.name}
                className="h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="relative z-10 p-4 text-black text-left">
              <h2 className="text-lg md:text-2xl font-semibold">{p.name}</h2>
              <p className="text-sm md:text-base opacity-80 mt-1">
                {p.price} TK
              </p>
            </div>

            {/* "New" Tag */}
            <span className="absolute top-3 left-3 z-10 text-[10px] md:text-xs bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-2 py-[2px] md:px-3 md:py-1 rounded-full shadow-md tracking-wider">
              NEW
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
