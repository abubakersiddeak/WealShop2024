import React from "react";
import Navbar from "../component/Navbar";
import UserRegister from "../component/UserRegister";
import Footer from "../component/Footer";

export default function page() {
  return (
    <div>
      <Navbar />
      <UserRegister />
      <Footer />
    </div>
  );
}
