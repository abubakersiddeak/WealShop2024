"use client";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ShowProductCard from "@/app/component/ShowProductCard";

export default function Page() {
  const [results, setResults] = useState([]);
  const params = useParams();
  const query = params.query;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/findproduct/search?query=${query}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setResults(data.products);
    };

    if (query) {
      fetchData();
    }
  }, [query]);
  console.log(results);

  return (
    <div>
      <Navbar />
      <ShowProductCard products={results} />

      <Footer />
    </div>
  );
}
