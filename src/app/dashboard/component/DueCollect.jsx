"use client";

import { useEffect, useState } from "react";

export default function DueCollect() {
  const [salesWithDue, setSalesWithDue] = useState([]);
  const [search, setSearch] = useState("");
  const [paying, setPaying] = useState({});

  useEffect(() => {
    fetch("/api/sales")
      .then((res) => res.json())
      .then((data) => {
        const dueSales = data.filter((sale) => sale.dueAmount > 0);
        setSalesWithDue(dueSales);
      });
  }, []);

  const handleDuePay = async (saleId) => {
    const payAmount = Number(paying[saleId]);
    if (!payAmount || payAmount <= 0) {
      alert("বৈধ পরিমাণ দিন");
      return;
    }

    const sale = salesWithDue.find((s) => s._id === saleId);
    if (payAmount > sale.dueAmount) {
      alert("বকেয়ার চেয়ে বেশি পরিশোধ করা যাবে না");
      return;
    }

    const res = await fetch(`/api/sales/${saleId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidAmount: payAmount }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "সার্ভার সমস্যা হয়েছে");
      return;
    }

    alert("বকেয়া সফলভাবে পরিশোধ হয়েছে");

    const updated = salesWithDue
      .map((s) =>
        s._id === saleId
          ? {
              ...s,
              dueAmount: s.dueAmount - payAmount,
              paidAmount: s.paidAmount + payAmount,
            }
          : s
      )
      .filter((s) => s.dueAmount > 0);

    setSalesWithDue(updated);
    setPaying({ ...paying, [saleId]: "" });
  };

  const filtered = salesWithDue.filter((sale) => {
    const keyword = search.toLowerCase();
    const customer = sale.customerId?.name || sale.customerName || "";
    const product = sale.productName || "";
    const amount = sale.dueAmount?.toString() || "";
    return (
      customer.toLowerCase().includes(keyword) ||
      product.toLowerCase().includes(keyword) ||
      amount.includes(keyword)
    );
  });

  const totalDue = salesWithDue.reduce(
    (sum, sale) => sum + (sale.dueAmount || 0),
    0 // এখানে 0 শুরুতে দিলে sum এর initial মান ঠিকভাবে কাজ করবে
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between">
        <span className="text-2xl font-bold mb-4"> বকেয়া সংগ্রহ</span>
        <span className="text-2xl font-bold mb-4 text-red-600">
          {" "}
          টোটাল বকেয়া {totalDue}
        </span>
      </div>

      <input
        type="text"
        placeholder="গ্রাহক / পণ্য / বকেয়া অনুসন্ধান করুন..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded text-black"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500">কোনো বকেয়া পাওয়া যায়নি।</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((sale) => (
            <div
              key={sale._id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-black">{sale.productName}</p>
                <p className="text-gray-700">
                  গ্রাহক: {sale.customerId?.name || sale.customerName}
                </p>
                <p className="text-red-600">বকেয়া: ৳{sale.dueAmount}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="৳"
                  min={1}
                  max={sale.dueAmount}
                  value={paying[sale._id] || ""}
                  onChange={(e) =>
                    setPaying({ ...paying, [sale._id]: e.target.value })
                  }
                  className="p-2 border rounded text-black w-28"
                />
                <button
                  onClick={() => handleDuePay(sale._id)}
                  className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                >
                  পরিশোধ করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
