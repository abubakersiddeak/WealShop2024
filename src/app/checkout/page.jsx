// src/app/checkout/page.js
"use client";
import { useCart } from "@/context/cartContext";
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
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCheckedOutItems } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    amount: 0,
    postcode: "", // Keep it in state to capture if provided
  });

  // This cartItems state correctly holds the *selected* items from the CartPage
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [successSubmite, setSuccessSubmite] = useState(false);

  useEffect(() => {
    // Correctly load the selected items and amount from localStorage
    const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    const storedAmount =
      JSON.parse(localStorage.getItem("checkoutAmount")) || 0;

    setCartItems(storedCart); // Set the cartItems state with the selected items
    if (storedAmount > 0) {
      setForm((prevForm) => ({ ...prevForm, amount: storedAmount }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // postcode is intentionally excluded from mandatory fields
    const { name, email, address, phone, city } = form;
    if (!name || !email || !address || !phone || !city) {
      setError("নাম, ইমেইল, ঠিকানা, ফোন এবং শহর পূরণ করা বাধ্যতামূলক!"); // Name, email, address, phone, and city fields are mandatory!
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("সঠিক ইমেইল ঠিকানা দিন।"); // Please provide a valid email address.
      return false;
    }
    // Updated regex for Bangladesh phone numbers starting with 01 and having 11 digits
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("সঠিক ফোন নাম্বার দিন (বাংলাদেশ স্ট্যান্ডার্ড)।"); // Please provide a valid phone number (Bangladesh Standard).
      return false;
    }
    setError("");
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const orderData = {
      amount: form.amount,
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
      shipping: {
        address: form.address,
        city: form.city,
        postal_code: form.postcode,
        country: "Bangladesh",
      },
      items: cartItems.map((item) => ({
        product_id: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        salePrice: item.product.salePrice,
        buyPrice: item.product.buyPrice,
        size: item.size,
      })),
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderData }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessSubmite(true);
        clearCheckedOutItems(cartItems);
      } else {
        console.error("Error creating order:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error.message);
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
              required // Keep required for mandatory fields
            />
            <InputWithIcon
              icon={<FaEnvelope />}
              placeholder="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              icon={<FaPhone />}
              placeholder="Phone Number"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              icon={<FaCity />}
              placeholder="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              icon={<FaMapMarkerAlt />}
              placeholder="Postcode (Optional)"
              name="postcode"
              value={form.postcode}
              onChange={handleChange}
              // Removed 'required' here to make it optional
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

                  <span>
                    ৳{(item.product.salePrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr className="border-gray-200" />
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>৳{form.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer bg-black hover:bg-gray-700 text-white text-lg font-semibold py-3 rounded-xl shadow-md transition duration-300"
          >
            Submite Order
          </button>
        </form>
      </div>
      {successSubmite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">🎉 Thank You!</h2>
            <p className="text-gray-700">
              Your order has been placed successfully.
            </p>
            <p className="text-gray-600">
              Our team will call you to confirm the order.
            </p>
            <button
              onClick={() => {
                setSuccessSubmite(false);
                router.push("/");
              }}
              className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function InputWithIcon({ icon, ...props }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white">
      <span className="text-cyan-600">{icon}</span>
      <input
        {...props}
        className="bg-transparent w-full ml-3 focus:outline-none placeholder:text-gray-500 text-gray-800"
        // props.required will handle the required attribute, so no need to explicitly set it here if 'props' already contains it.
        // If props does not contain 'required', then the field will implicitly be optional
      />
    </div>
  );
}
