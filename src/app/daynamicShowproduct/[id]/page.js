import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";
import ShowProductCard from "@/app/component/ShowProductCard";
import React from "react";

export default async function page({ params }) {
  const { id } = await params; // this id could be product catagory or product name

  console.log(id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/findproductbyCatagory/${id}`,
    {
      cache: "no-store",
    }
  );
  const products = await res.json();
  return (
    <div>
      <Navbar />
      <ShowProductCard products={products} id={id} r />
      <Footer />
    </div>
  );
}
