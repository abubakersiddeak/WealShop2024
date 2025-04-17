"use client";
import React, { useRef } from "react";

export default function NewSection() {
  const scrollRef = useRef(null);

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

  return (
    <div className="relative ">
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
        className="flex xl:gap-6 gap-2 overflow-x-hidden scroll-smooth "
      >
        {/* 🔁 Cardগুলো এখানেই থাকবে – নিচে দেখানো হয়েছে */}
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="card bg-base-100 w-40 md:w-96 shadow-sm shrink-0 "
          >
            <figure className="md:px-3 md:pt-3 px-1 pt-1 ">
              <img
                src="/-473Wx593H-700089869-black-MODEL.avif"
                alt="Shoes"
                className="rounded-xl h-[150px] md:h-[400px]"
              />
            </figure>
            <p className="md:mt-6 mt-2 ml-2 absolute md:ml-6 font-extrabold text-[10px] md:text-xl border px-[3px] py-[2px] md:py-1 md:px-2 rounded-xl bg-black text-white">
              New
            </p>
            <div className="card-body p-3">
              <h2 className="card-title text-xs md:text-2xl">
                Nike Sports Shoe
              </h2>
              <p className="text-[10px] md:text-xl">BDT 3999 TK</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
