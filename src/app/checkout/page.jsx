"use client";

import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaCity,
} from "react-icons/fa";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    amount: 0,
    postcode: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    const storedAmount =
      JSON.parse(localStorage.getItem("checkoutAmount")) || 0;

    setCartItems(storedCart);
    if (storedAmount > 0) {
      setForm((prevForm) => ({ ...prevForm, amount: storedAmount }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log(form, "form");
  console.log(cartItems, "cartitem");
  const validateForm = () => {
    const { name, email, address, phone, city, postcode } = form;
    if (!name || !email || !address || !phone || !city || !postcode) {
      setError("সব ফিল্ড পূরণ করা বাধ্যতামূলক!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("সঠিক ইমেইল ঠিকানা দিন।");
      return false;
    }
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("সঠিক ফোন নাম্বার দিন (বাংলাদেশ স্ট্যান্ডার্ড)।");
      return false;
    }
    setError("");
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      localStorage.setItem("checkoutData", JSON.stringify(form));

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment request failed");
      }

      if (data?.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        alert("পেমেন্ট লিঙ্ক তৈরি হয়নি। আবার চেষ্টা করুন।");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center py-10 px-4">
        <form
          onSubmit={handleCheckout}
          className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8 space-y-6 text-gray-800 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-black tracking-wide">
            Checkout
          </h2>

          {error && (
            <div className="text-red-500 text-center font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={<FaUser />}
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={<FaEnvelope />}
              placeholder="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={<FaPhone />}
              placeholder="Phone Number"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={<FaCity />}
              placeholder="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={<FaMapMarkerAlt />}
              placeholder="Postcode"
              name="postcode"
              value={form.postcode}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
            <FaMapMarkerAlt className="mt-1 text-cyan-600" />
            <textarea
              placeholder="Full Shipping Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
              className="bg-transparent w-full ml-3 focus:outline-none placeholder:text-gray-500 resize-none text-gray-800"
            />
          </div>

          {cartItems.length > 0 && (
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-2">
              <h3 className="text-xl font-semibold text-cyan-700">
                🛍️ Order Summary
              </h3>
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.product.name} (x{item.quantity})
                  </span>
                  <span>৳{item.product.price * item.quantity}</span>
                </div>
              ))}
              <hr className="border-gray-200" />
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>৳{form.amount}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold py-3 rounded-xl shadow-md transition duration-300"
          >
            Pay ৳{form.amount} Now
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

function InputWithIcon({ icon, ...props }) {
  return (
    <div className="flex items-center border border-white/20 rounded-xl px-4 py-2 bg-white/5">
      <span className="text-cyan-300">{icon}</span>
      <input
        {...props}
        className="bg-transparent w-full ml-3 focus:outline-none placeholder:text-gray-300"
        required
      />
    </div>
  );
}
