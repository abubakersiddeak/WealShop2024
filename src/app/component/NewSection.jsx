"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Still use Next.js Link for navigation

export default function NewSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/Product");
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scrollByAmount = 300;

  const scrollLeftFunc = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
    }
  }, []);

  const scrollRightFunc = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
    }
  }, []);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    if (scrollRef.current) {
      scrollRef.current.classList.add("cursor-grabbing");
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove("cursor-grabbing");
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove("cursor-grabbing");
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  }, []);

  // Touch drag handlers
  const handleTouchStart = useCallback((e) => {
    isDragging.current = true;
    if (scrollRef.current && e.touches[0]) {
      startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  }, []);

  // --- Render Logic ---
  if (loading) {
    return (
      <section className="container mx-auto p-4 py-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 text-center">
          New Arrivals
        </h2>
        <div className="flex justify-center items-center h-48">
          <p className="text-xl text-gray-600">Loading new products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto p-4 py-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 text-center">
          New Arrivals
        </h2>
        <div className="flex justify-center items-center h-48">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container mx-auto p-4 py-8">
        <h2 className="text-4xl text-left   md:text-6xl lg:text-7xl font-serif mb-8">
          New Arrivals
        </h2>
        <div className="flex justify-center items-center h-48">
          <p className="text-xl text-gray-600">
            No new products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-4 py-8 relative">
      <h2 className="text-left text-4xl md:text-6xl lg:text-7xl font-serif mb-8 ">
        New Arrivals
      </h2>

      {/* Navigation Buttons */}
      <button
        onClick={scrollLeftFunc}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-40 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 hidden md:block"
        aria-label="Scroll left"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>

      <button
        onClick={scrollRightFunc}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-40 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 hidden md:block"
        aria-label="Scroll right"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="scroll-container flex gap-4 md:gap-6 lg:gap-8 overflow-x-scroll no-scrollbar p-2 -m-2 cursor-grab"
      >
        {products.map((p) => (
          <Link
            href={`/product/${p._id}`}
            key={p._id}
            className="flex-none w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
              <img
                src={p.images[0] || "/placeholder-image.jpg"} // Fallback image
                alt={p.name || "Product image"}
                // For img tag, you typically need to set width/height or ensure container handles it
                // You might need to add specific width/height props if your images aren't optimized
                // or if you experience layout shifts.
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 z-10 text-[10px] md:text-xs bg-black text-white px-2 py-[2px] md:px-3 md:py-1 rounded-full shadow-md tracking-wider font-semibold">
                NEW
              </span>
            </div>
            <div className="p-3 md:p-4 text-black text-left">
              <h3 className="text-sm md:text-lg font-semibold truncate">
                {p.name}
              </h3>
              <p className="text-sm md:text-base text-gray-700 mt-1">
                <span className="font-bold">{p.salePrice}</span> TK
              </p>
              {p.regularPrice && p.regularPrice > p.salePrice && (
                <p className="text-xs text-gray-500 line-through">
                  {p.regularPrice} TK
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
