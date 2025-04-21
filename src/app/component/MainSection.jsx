import Image from "next/image";
import React from "react";

export default function MainSection() {
  return (
    <div className="mt-6  h-[40vh] md:h-[90vh] w-full   flex  relative ">
      <div className="relative w-[60vw] h-[full]">
        <Image
          src={"/grand-sports-collage-soccer-basketball-600nw-1087921157.webp"}
          fill
          className="object-cover px-2"
          alt="full image"
        />
      </div>
      <div className="flex flex-col  w-[40%] justify-center items-center gap-2">
        <div className="relative  h-[60px] w-[60px] md:h-[200px] md:w-[200px]">
          <Image
            src="/weal.png"
            alt="weal logo"
            fill
            style={{ objectFit: "fill" }}
          />
        </div>
        <div>
          <span className="md:text-7xl font-extrabold text-blue-900">
            WEAL{" "}
          </span>
          <span className="md:text-7xl font-extrabold text-gray-400">BD</span>
        </div>
        <button className="bg-gray-500 text-black lg:px-12 lg:py-3 py-1 px-1 rounded-2xl shadow-lg hover:bg-black hover:text-white transition-all duration-300 font-bold text-sm lg:text-xl">
          Shop Now
        </button>
      </div>
    </div>
  );
}
