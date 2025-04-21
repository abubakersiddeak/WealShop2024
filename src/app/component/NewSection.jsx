"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSection() {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/Product");
        if (!res.ok) {
          throw new Error("Product fetching failed from API in GET method");
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const productClick = (e, p) => {
    e.preventDefault();
    router.push(`/dynamic/${p._id}`);
  };
  // console.log(products);
  return (
    <div className="relative p-4">
      <h1 className="xl:p-4 xl:text-6xl font-extrabold">New Arrival</h1>

      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 text-gray-400 p-2 rounded-full md:text-4xl"
      >
        ❮
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2  text-gray-400 p-2 rounded-full md:text-4xl z-50"
      >
        ❯
      </button>

      <div
        ref={scrollRef}
        className="flex xl:gap-6 gap-2 overflow-x-hidden scroll-smooth md:p-2"
      >
        {products.map((p) => (
          <button
            onClick={(e) => productClick(e, p)}
            key={p._id}
            className="relative w-52 md:w-80 bg-white rounded-2xl overflow-hidden hover:scale-[1.02] shrink-0 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6a5bff] to-[#bb82f4] opacity-15 blur-xl z-0"></div>

            <div className="relative z-10 flex items-center justify-center bg-gray-100 h-60 md:h-80">
              <img
                src={p.images[0]}
                alt={p.name}
                className="h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>

            <div className="relative z-10 p-4 text-black text-left">
              <h2 className="text-lg md:text-2xl font-semibold">{p.name}</h2>
              <p className="text-sm md:text-base opacity-80 mt-1">
                {p.price} TK
              </p>
            </div>

            <span className="absolute top-3 left-3 z-10 text-[10px] md:text-xs bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-2 py-[2px] md:px-3 md:py-1 rounded-full shadow-md tracking-wider">
              NEW
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
