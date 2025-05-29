import Image from "next/image";
import React from "react";
import Link from "next/link"; // Import Next.js Link component

export default function MainSection() {
  return (
    <section className="mt-6 flex flex-col md:flex-row h-[50vh] md:h-[80vh] lg:h-[90vh] w-full items-center justify-center bg-gray-50">
      {" "}
      {/* Use section for semantic HTML, adjust height, use flex-col for mobile, add background */}
      {/* Left Section - Image */}
      <div className="relative w-full md:w-[60%] h-2/3 md:h-full overflow-hidden">
        {" "}
        {/* Responsive width and height */}
        <Image
          src={"/grand-sports-collage-soccer-basketball-600nw-1087921157.webp"}
          alt="Collage of sports activities including soccer and basketball" // Improved alt text
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 60vw" // Essential for Next.js Image optimization
          style={{ objectFit: "cover" }}
          priority // Prioritize loading for LCP
          className="p-2 md:p-0" // Removed px-2 as object-cover makes it weird, added p-2 for general padding on mobile
        />
      </div>
      {/* Right Section - Logo, Text, and Button */}
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4 w-full md:w-[40%] h-1/3 md:h-full bg-white p-4">
        {" "}
        {/* Responsive width and height, add background and padding */}
        <div className="relative h-16 w-16 md:h-32 md:w-32 lg:h-48 lg:w-48 flex-shrink-0">
          {" "}
          {/* Responsive size, flex-shrink to prevent shrinking */}
          <Image
            src="/weal.png"
            alt="Weal logo" // Improved alt text
            fill
            sizes="(max-width: 768px) 64px, (max-width: 1200px) 128px, 192px" // Image optimization
            style={{ objectFit: "contain" }} // Changed from fill to contain for better logo aspect ratio
            priority // Prioritize loading
          />
        </div>
        <div>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-blue-900">
            WEAL{" "}
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-400">
            BD
          </span>
        </div>
        <Link href="/allProduct">
          {" "}
          {/* Use Next.js Link for client-side navigation */}
          <button className="mt-4 bg-gray-500 text-white px-8 py-2 md:px-12 md:py-3 rounded-full shadow-lg hover:bg-blue-900 hover:text-white transition-all duration-300 font-bold text-base md:text-xl lg:text-2xl">
            {" "}
            {/* Professional button styling, rounded-full, better colors */}
            Shop Now
          </button>
        </Link>
      </div>
    </section>
  );
}
