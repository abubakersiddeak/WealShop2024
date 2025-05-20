"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <div className="p-9 bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center ">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-2">
            WEAL
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600">
              Forgot Password?
            </a>
          </div>

          <div className="mt-2 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/createUser" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
