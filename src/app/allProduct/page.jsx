"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function Allproduct() {
  const [products, setProducts] = useState([]);
  const itemsPerPage = 16;
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
    <>
      {" "}
      <Navbar />
      <div className="relative p-4">
        <h2 className="text-left text-4xl md:text-6xl lg:text-7xl font-serif mb-8">
          All Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {selectedProducts.map((product) => (
            <button
              onClick={(e) => productClick(e, product)}
              key={product._id}
              className=" p-1 cursor-pointer border-b-2 border-gray-200"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-54 border border-gray-300 md:h-90 xl:h-100 object-cover "
              />
              <h3 className="md:text-xl font-semibold text-start mt-3">
                {product.name}
              </h3>
              <p className="text-gray-600 text-start mt-1">
                {product.salePrice} TK
              </p>
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
      <Footer />
    </>
  );
}
