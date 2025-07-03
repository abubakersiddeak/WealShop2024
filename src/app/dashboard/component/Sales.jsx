"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState(null);

  const [form, setForm] = useState({
    productId: "",
    productName: "",
    size: "",
    quantity: "",
    salePrice: 0,
    paidAmount: "",
    existingCustomerId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("/api/Product")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));

    fetch("/api/sales")
      .then((res) => res.json())
      .then((data) => setSales(data));

    fetch("/api/customer")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductSelect = (product) => {
    setForm({
      ...form,
      productId: product._id,
      productName: product.name,
      salePrice: product.salePrice || 0,
      size: product.sizes?.[0]?.size || "",
    });
    setDropdownOpen(false);
    setSearchTerm(""); // Clear search after selection
  };

  // ফিল্টার প্রোডাক্টস সার্চ টার্ম অনুযায়ী
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = products.find((p) => p._id === form.productId);

  // ... handleSubmit function এখানে থাকবে, আগের মতই
  // গ্রাহকের বিস্তারিত দেখার জন্য ফাংশন
  const fetchCustomerDetails = async (customerId) => {
    setCustomerLoading(true);
    setCustomerError(null);

    try {
      const res = await fetch(`/api/customer/${customerId}`);
      if (!res.ok) throw new Error("গ্রাহকের তথ্য পাওয়া যায়নি");

      const data = await res.json();
      setSelectedCustomer(data);
    } catch (error) {
      setCustomerError(error.message);
      setSelectedCustomer(null);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Modal বন্ধ করার ফাংশন
  const closeModal = () => {
    setSelectedCustomer(null);
    setCustomerError(null);
  };
  const totalSalesAmount = sales.reduce(
    (sum, product) => sum + product.totalAmount,
    0
  );
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">নতুন বিক্রয়</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // handleSubmit code আগের মতোই
          if (!form.productId) {
            alert("পণ্য নির্বাচন করুন");
            return;
          }

          const totalAmount = form.salePrice * form.quantity;
          const dueAmount = totalAmount - form.paidAmount;

          const body = {
            productId: form.productId,
            productName: form.productName,
            size: form.size,
            quantity: form.quantity,
            salePrice: form.salePrice,
            paidAmount: form.paidAmount,
            totalAmount,
            dueAmount,
          };

          if (form.existingCustomerId) {
            body.customerId = form.existingCustomerId;
          } else if (form.customerName && form.customerPhone) {
            body.customerName = form.customerName.trim();
            body.customerPhone = form.customerPhone.trim();
            body.customerAddress = form.customerAddress.trim();
          }

          const res = await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (!res.ok) return alert("বিক্রয় ব্যর্থ হয়েছে");
          alert("বিক্রয় সফলভাবে যুক্ত হয়েছে!");

          setForm({
            productId: "",
            productName: "",
            size: "",
            quantity: "",
            salePrice: 0,
            paidAmount: "",
            existingCustomerId: "",
            customerName: "",
            customerPhone: "",
            customerAddress: "",
          });

          const updatedSales = await fetch("/api/sales").then((res) =>
            res.json()
          );
          setSales(updatedSales);
        }}
        className="space-y-4"
      >
        <label className="block mb-1 font-medium">পণ্য নির্বাচন করুন</label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full flex items-center justify-between p-2 border rounded text-black "
          >
            {form.productId && selectedProduct ? (
              <div className="flex items-center space-x-2">
                {selectedProduct.images?.[0] && (
                  <Image
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    width={40}
                    height={40}
                    className="rounded object-cover border"
                  />
                )}
                <span>{selectedProduct.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">পণ্য নির্বাচন করুন</span>
            )}
            <svg
              className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded border bg-gray-900 shadow-lg text-white">
              {/* Search Input */}
              <input
                type="text"
                placeholder="পণ্য অনুসন্ধান করুন..."
                className="w-full p-2 border-b border-gray-300 outline-none text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />

              <ul>
                {filteredProducts.length === 0 && (
                  <li className="p-2 text-center text-gray-500">
                    কোন পণ্য পাওয়া যায়নি
                  </li>
                )}
                {filteredProducts.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => handleProductSelect(p)}
                    className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-800"
                  >
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="rounded object-cover border"
                      />
                    )}
                    <span>{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* বাকি ফর্ম এলিমেন্ট আগের মতোই থাকবে */}

        {form.productId && (
          <>
            <label htmlFor="sizeSelect" className="block mb-1 font-medium">
              উপলব্ধ সাইজ:
            </label>
            <select
              id="sizeSelect"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full p-2 border rounded text-black"
            >
              {selectedProduct?.sizes?.map((s, i) => (
                <option key={i} value={s.size}>
                  {s.size} (স্টক: {s.quantity})
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="quantity" className="block mb-1 font-medium">
          পরিমাণ
        </label>
        <input
          id="quantity"
          type="number"
          placeholder="পরিমাণ"
          className="w-full p-2 border rounded text-black"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: Number(e.target.value) })
          }
          min={1}
        />

        <label htmlFor="salePrice" className="block mb-1 font-medium">
          বিক্রয় মূল্য প্রতি ইউনিট
        </label>
        <input
          id="salePrice"
          type="number"
          placeholder="বিক্রয় মূল্য"
          className="w-full p-2 border rounded text-black"
          value={form.salePrice}
          onChange={(e) =>
            setForm({ ...form, salePrice: Number(e.target.value) })
          }
          min={0}
        />

        <label htmlFor="paidAmount" className="block mb-1 font-medium">
          পরিশোধিত টাকা
        </label>
        <input
          id="paidAmount"
          type="number"
          placeholder="পরিশোধিত টাকা"
          className="w-full p-2 border rounded text-black"
          value={form.paidAmount}
          onChange={(e) =>
            setForm({ ...form, paidAmount: Number(e.target.value) })
          }
          min={0}
        />

        <label htmlFor="existingCustomer" className="block mb-1 font-medium">
          গ্রাহক নির্বাচন করুন (ঐচ্ছিক)
        </label>
        <select
          id="existingCustomer"
          value={form.existingCustomerId}
          onChange={(e) =>
            setForm({
              ...form,
              existingCustomerId: e.target.value,
              customerName: "",
              customerPhone: "",
              customerAddress: "",
            })
          }
          className="w-full p-2 border rounded text-black"
        >
          <option value="">-- আগের গ্রাহক নেই --</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>

        <label htmlFor="customerName" className="block mb-1 font-medium">
          নতুন গ্রাহকের নাম
        </label>
        <input
          id="customerName"
          type="text"
          placeholder="নতুন গ্রাহকের নাম"
          className="w-full p-2 border rounded text-black"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />

        <label htmlFor="customerPhone" className="block mb-1 font-medium">
          গ্রাহকের ফোন
        </label>
        <input
          id="customerPhone"
          type="tel"
          placeholder="গ্রাহকের ফোন"
          className="w-full p-2 border rounded text-black"
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
        />

        <label htmlFor="customerAddress" className="block mb-1 font-medium">
          গ্রাহকের ঠিকানা
        </label>
        <textarea
          id="customerAddress"
          placeholder="গ্রাহকের ঠিকানা"
          className="w-full p-2 border rounded text-black"
          value={form.customerAddress}
          onChange={(e) =>
            setForm({ ...form, customerAddress: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          বিক্রয় সংরক্ষণ করুন
        </button>
      </form>
      {/* বিক্রয় তালিকা */}
      <h2 className="text-xl font-semibold mt-8 mb-4">বিক্রয় তালিকা</h2>
      <h3 className="text-green-700 text-xl">
        মোট বিক্রয়ঃ {totalSalesAmount.toLocaleString("bn-BD")} টাকা
      </h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="">
            <th className="border border-gray-300 p-2">পণ্য</th>
            <th className="border border-gray-300 p-2">গ্রাহক</th>
            <th className="border border-gray-300 p-2">সাইজ</th>
            <th className="border border-gray-300 p-2">পরিমাণ</th>
            <th className="border border-gray-300 p-2">বিক্রয় মূল্য</th>
            <th className="border border-gray-300 p-2">তারিখ</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id} className="border-t border-gray-300">
              <td className="p-2 text-center">{sale.productName}</td>
              <td className="p-2 text-center">
                {sale.customerId ? (
                  <button
                    onClick={() => fetchCustomerDetails(sale.customerId._id)}
                    className="text-blue-600 underline text-center"
                  >
                    {sale.customerId.name}
                  </button>
                ) : (
                  "গ্রাহক নেই"
                )}
              </td>
              <td className="p-2 text-center">{sale.size}</td>
              <td className="p-2 text-center">{sale.quantity}</td>
              <td className="p-2 text-center">{sale.totalAmount}</td>
              <td className="p-2 text-center">
                {new Date(sale.createdAt).toLocaleDateString("bn-BD")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50 text-white">
          <div className="bg-gray-900 p-6 rounded max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white cursor-pointer hover:text-gray-500"
              aria-label="Close modal"
            >
              ✕
            </button>

            {customerLoading ? (
              <p>লোড হচ্ছে...</p>
            ) : customerError ? (
              <p className="text-red-600">{customerError}</p>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">গ্রাহকের তথ্য</h2>
                <p>
                  <strong>নাম:</strong> {selectedCustomer.name}
                </p>
                <p>
                  <strong>ফোন:</strong> {selectedCustomer.phone}
                </p>
                <p>
                  <strong>ঠিকানা:</strong>{" "}
                  {selectedCustomer.address || "নির্ধারিত নেই"}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
