"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Allproduct() {
  const [products, setProducts] = useState([]);
  const itemsPerPage = 8; // 2 rows * 4 columns
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Product`
        );
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

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const productClick = (e, product) => {
    e.preventDefault();
    router.push(`/dynamic/${product._id}`);
  };

  return (
    <div className="relative p-4">
      <h2 className="text-5xl mb-4 xl:p-4 xl:text-8xl font-serif">
        All Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedProducts.map((product) => (
          <button
            onClick={(e) => productClick(e, product)}
            key={product._id}
            className=" p-1  border-b-2 border-gray-200"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-110 border border-gray-300 md:h-90 xl:h-110 object-cover "
            />
            <h3 className="md:text-xl font-semibold text-start mt-3">
              {product.name}
            </h3>
            <p className="text-gray-600 text-start mt-1">{product.price} TK</p>
          </button>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⬅ Prev
        </button>

        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold shadow">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
