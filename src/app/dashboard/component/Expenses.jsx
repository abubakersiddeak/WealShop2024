"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// সময়ের হিসাব বাংলায় দেখানোর ফাংশন
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "এইমাত্র";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  return `${days} দিন আগে`;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showAllThisMonth, setShowAllThisMonth] = useState(false);
  const [form, setForm] = useState({ note: "", amount: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses");
    let data = await res.json();

    // createdAt ঠিকমতো সেট করা
    data = data.map((exp) => {
      const createdAt = exp.createdAt
        ? new Date(exp.createdAt)
        : new Date(parseInt(exp._id.substring(0, 8), 16) * 1000);
      return { ...exp, createdAt };
    });

    // সর্বশেষ খরচ প্রথমে দেখানোর জন্য sort
    data.sort((a, b) => b.createdAt - a.createdAt);
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount) {
      alert("টাকার পরিমাণ দিন");
      return;
    }

    if (editingId) {
      await fetch(`/api/expenses/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ note: "", amount: "", category: "" });
    fetchExpenses();
  };

  const handleEdit = (exp) => {
    setForm({ note: exp.note, amount: exp.amount, category: exp.category });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে মুছতে চান?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  // এই মাসের খরচ ফিল্টার
  const now = new Date();
  const thisMonthExpenses = expenses.filter(
    (exp) =>
      exp.createdAt.getMonth() === now.getMonth() &&
      exp.createdAt.getFullYear() === now.getFullYear()
  );

  const thisMonthTotal = thisMonthExpenses.reduce(
    (acc, exp) => acc + exp.amount,
    0
  );

  const displayedExpenses = showAllThisMonth
    ? thisMonthExpenses
    : thisMonthExpenses.slice(0, 5); // ✅ এখন শুধু এই মাসের ৫টি খরচ দেখাবে

  return (
    <div className="min-h-screen bg-gradient-to-br bg-pink-50 ">
      <Link href="/dashboard" className="text-xl  relative block p-4">
        ← ড্যাশবোর্ডে ফিরে যান
      </Link>

      <div className="max-w-3xl mx-auto p-4">
        {thisMonthExpenses.length > 0 && (
          <div className="mt-6 text-lg font-bold">
            এই মাসের মোট খরচ:{" "}
            <span className="text-red-600">৳{thisMonthTotal}</span>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4 ">
          {editingId ? "খরচ এডিট করুন" : "খরচ যোগ করুন"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="খরচের নোট"
            className="border p-2 w-full rounded "
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <input
            type="number"
            placeholder="টাকার পরিমাণ"
            className="border p-2 w-full rounded "
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
            required
          />
          <input
            type="text"
            placeholder="ধরন (যেমন: বিদ্যুৎ, বেতন)"
            className="border p-2 w-full rounded "
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600  px-4 py-2 rounded">
              {editingId ? "আপডেট করুন" : "যোগ করুন"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ note: "", amount: "", category: "" });
                  setEditingId(null);
                }}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center mb-3 gap-3">
          <h2 className="text-xl font-semibold flex-grow">
            সাম্প্রতিক খরচসমূহ
          </h2>
          <button
            onClick={() => setShowAllThisMonth(!showAllThisMonth)}
            className="bg-purple-600  px-3 py-1 rounded text-sm"
          >
            {showAllThisMonth ? "শুধু ৫টি খরচ দেখান" : "এই মাসের সব খরচ দেখুন"}
          </button>
        </div>

        <ul className="space-y-2">
          {displayedExpenses.length === 0 && (
            <li className="p-3 border rounded text-center text-gray-500">
              কোন খরচ পাওয়া যায়নি
            </li>
          )}

          {displayedExpenses.map((exp) => (
            <li key={exp._id} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{exp.note || "নোট নেই"}</p>
                  <p className="text-sm text-gray-500">
                    {exp.category || "অনির্দিষ্ট"} |{" "}
                    {timeSince(new Date(exp.createdAt))}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-blue-400">৳{exp.amount}</span>
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-yellow-500 text-lg"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 text-lg"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
