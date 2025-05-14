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
        <h2 className="text-2xl mb-4 xl:p-4 xl:text-6xl font-serif">
          All Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {selectedProducts.map((product) => (
            <button
              onClick={(e) => productClick(e, product)}
              key={product._id}
              className=" p-1  border-b-2 border-gray-200"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 md:h-90 xl:h-100 object-cover "
              />
              <h3 className="md:text-xl font-semibold text-start mt-3">
                {product.name}
              </h3>
              <p className="text-gray-600 text-start mt-1">
                {product.price} TK
              </p>
            </button>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
