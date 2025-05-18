"use client";
import React, { useEffect, useState } from "react";

export default function HeroSection() {
  const slides = ["slide1", "slide2", "slide3", "slide4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 15000); // ১৫ সেকেন্ড পর পরিবর্তন

    return () => clearInterval(interval); // cleanup
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div>
      <div className="carousel w-full h-[70vh] lg:h-[90vh] relative">
        {slides.map((slideId, index) => (
          <div
            key={slideId}
            id={slideId}
            className={`carousel-item relative w-full ${
              currentIndex === index ? "block" : "hidden"
            }`}
          >
            <img
              src={
                index === 0
                  ? "/24ss-pr-ts-football-njr-copa-future-action-2278-16x9-1920x1080px.jpg"
                  : index === 1
                  ? "/Sports_EE-Times-Europe.webp"
                  : index === 2
                  ? "/action-activity-adult-athlete-262506-scaled.jpg"
                  : "/12721210_2023-wabc-NewApp-SPORTS.jpg"
              }
              className="w-full h-[70vh] lg:h-[90vh] object-cover"
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute inset-0 flex flex-col lg:gap-7 items-center justify-center">
              <h1 className="text-xl lg:text-7xl font-serif  text-center  text-white  text-shadow-lg font-light">
                We are committed to giving <br /> our customers the best
                quality.
              </h1>
              <button className="bg-white text-black lg:px-6 lg:py-3 py-1 px-1 rounded shadow-lg hover:bg-black hover:text-white transition-all duration-300 font-bold text-2xl lg:text-3xl mt-7">
                <a href="/allProduct">Shop Now</a>
              </button>
            </div>
          </div>
        ))}

        {/* Previous Button */}
        <button
          onClick={goToPrev}
          className="absolute text-shadow-lg left-1 top-1/2 transform -translate-y-1/2 text-2xl bg-opacity-50 text-white px-1 py-2 rounded"
        >
          {" "}
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute text-shadow-lg right-1 top-1/2 transform -translate-y-1/2 text-2xl bg-opacity-50 text-white px-1 py-2 rounded"
        >
          ❯
        </button>
      </div>
    </div>
  );
}
