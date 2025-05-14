"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ShowProductCard({ products, id }) {
  const catagory = id;
  const router = useRouter();
  const productClick = (e, p) => {
    e.preventDefault();
    router.push(`/dynamic/${p._id}`);
  };
  return (
    <div className="relative p-2">
      <h2 className="text-2xl  xl:p-4 xl:text-6xl font-serif">{catagory}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <button
            onClick={(e) => productClick(e, p)}
            key={p._id}
            className=" p-1  border-b-2 border-gray-200"
          >
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-48 md:h-90 xl:h-100 object-cover "
            />
            <h3 className="md:text-xl font-semibold text-start mt-3">
              {p.name}
            </h3>
            <p className="text-gray-600 text-start mt-1">{p.price} TK</p>
          </button>
        ))}
      </div>
    </div>
  );
}
