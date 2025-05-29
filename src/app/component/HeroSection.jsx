"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link"; // Import Next.js Link component

// Define your slide data here for better organization
const slideData = [
  {
    id: "slide1",
    image:
      "/24ss-pr-ts-football-njr-copa-future-action-2278-16x9-1920x1080px.jpg",
    alt: "Football player in action on a field",
    heading: "We are committed to giving our customers the best quality.",
    shopLink: "/allProduct",
  },
  {
    id: "slide2",
    image: "/Sports_EE-Times-Europe.webp",
    alt: "Various sports equipment, including a ball, racket, and running shoes",
    heading: "Discover Your Passion, Gear Up for Greatness.",
    shopLink: "/allProduct",
  },
  {
    id: "slide3",
    image: "/action-activity-adult-athlete-262506-scaled.jpg",
    alt: "Athlete running on a track during sunset",
    heading: "Elevate Your Game with Our Premium Collection.",
    shopLink: "/allProduct",
  },
  {
    id: "slide4",
    image: "/12721210_2023-wabc-NewApp-SPORTS.jpg",
    alt: "Dynamic image of a basketball player mid-game",
    heading: "Experience the Difference in Every Performance.",
    shopLink: "/allProduct",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use useCallback for memoizing functions used in useEffect or as props
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideData.length);
  }, []); // Dependencies array is empty as it doesn't depend on outside state/props

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  }, []); // Dependencies array is empty

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext(); // Call the memoized function
    }, 15000); // 15 seconds per slide

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [goToNext]); // Re-run effect if goToNext changes (though it's memoized)

  return (
    <section
      aria-label="Hero Carousel"
      className="w-full relative overflow-hidden"
    >
      <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh]">
        {" "}
        {/* Adjusted height for better responsiveness */}
        {slideData.map((slide, index) => (
          <div
            key={slide.id}
            id={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              // Smooth transition
              currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0" // Control visibility and stacking
            }`}
            aria-hidden={currentIndex !== index} // Hide from screen readers if not active
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw" // Essential for Next.js Image optimization
              priority={index === 0} // Prioritize loading the first image
              style={{ objectFit: "cover" }}
              className="brightness-[.70]" // Darken image slightly for text readability
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              {" "}
              {/* Centered content, added padding */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-serif text-white drop-shadow-md leading-tight max-w-4xl">
                {" "}
                {/* Responsive font sizes, drop shadow, line height, max width */}
                {slide.heading}
              </h1>
              <Link href={slide.shopLink}>
                {" "}
                {/* Use Next.js Link component */}
                <button className="mt-8 bg-white text-black px-4 py-2 rounded-sm shadow-lg hover:bg-black hover:text-white transition-all duration-300 font-bold text-lg md:text-xl lg:text-2xl">
                  {" "}
                  {/* Professional button styling */}
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        ))}
        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {" "}
          {/* Dot indicators */}
          {slideData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                currentIndex === idx
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-75"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
        <button
          onClick={goToPrev}
          className="absolute hidden md:block left-4 top-1/2 -translate-y-1/2  bg-opacity-40 text-white p-3 rounded-full text-xl md:text-2xl hover:bg-opacity-60 transition-colors duration-300 z-20" // Refined button style
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          onClick={goToNext}
          className="absolute hidden md:block right-4 top-1/2 -translate-y-1/2  bg-opacity-40 text-white p-3 rounded-full text-xl md:text-2xl hover:bg-opacity-60 transition-colors duration-300 z-20" // Refined button style
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>
    </section>
  );
}
