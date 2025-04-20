import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";
import Product from "@/app/component/Product";
import React from "react";

export default async function page({ params }) {
  const { product } = await params;
  return (
    <>
      <Navbar />
      <Product product={product} />
      <Footer />
    </>
  );
}
