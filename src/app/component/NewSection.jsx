"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSection() {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/Product");
        if (!res.ok) throw new Error("Product fetching failed");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const scrollByAmount = 400;

  const scrollLeftFunc = () => {
    scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRightFunc = () => {
    scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  const productClick = (e, p) => {
    e.preventDefault();
    router.push(`/dynamic/${p._id}`);
  };

  // Mouse drag
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.2;
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    });
  };

  // Touch drag
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    requestAnimationFrame(() => {
      const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.2;
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    });
  };

  return (
    <div className="relative p-4 ">
      <h1 className="xl:p-4 text-5xl mb-4 xl:text-8xl font-serif">
        New Arrival
      </h1>

      <button
        onClick={scrollLeftFunc}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-40 text-gray-400 p-2 rounded-full md:text-4xl"
      >
        ❮
      </button>

      <button
        onClick={scrollRightFunc}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-40 text-gray-400 p-2 rounded-full md:text-4xl"
      >
        ❯
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
        className="scroll-container flex xl:gap-6 gap-2 overflow-x-hidden md:p-2 font-serif cursor-grab"
      >
        {products.map((p) => (
          <button
            onClick={(e) => productClick(e, p)}
            key={p._id}
            className="relative w-70 md:w-80  bg-white overflow-hidden hover:scale-[1.02] shrink-0 transition-all duration-500"
          >
            <div className="relative z-10 flex items-center justify-center h-90 md:h-120 ">
              <img
                src={p.images[0]}
                alt={p.name}
                className="h-full w-full border border-gray-300 object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 p-4 text-black text-left">
              <h2 className="text-xs md:text-xl font-serif">{p.name}</h2>
              <p className="text-sm md:text-base opacity-80 mt-1">
                {p.salePrice} TK
              </p>
            </div>
            <span className="absolute top-1 left-0 z-10 text-[10px] md:text-xs bg-gradient-to-r bg-black text-white px-2 py-[2px] md:px-3 md:py-1 rounded-full shadow-md tracking-wider">
              NEW
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
