import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";
import Product from "@/app/component/Product";
import React from "react";
export default async function ProductPage({ params }) {
  const { productId } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/${productId}`,
    {
      cache: "no-store",
    }
  );

  const product = await res.json();

  return (
    <>
      <Navbar />
      <Product product={product} />
      <Footer />
    </>
  );
}
