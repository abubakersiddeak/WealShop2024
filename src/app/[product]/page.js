import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

import Product from "../component/Product";

export default function page({ params }) {
  const { product } = params;
  return (
    <>
      <Navbar />
      <Product product={product} />
      <Footer />
    </>
  );
}
