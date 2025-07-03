"use client";

import { useEffect, useState } from "react";

export default function ExtraProfit() {
  const [form, setForm] = useState({ amount: "", note: "" });
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfits = async () => {
    try {
      const res = await fetch("/api/extraProfit");
      const data = await res.json();
      setProfits(data);
    } catch (error) {
      console.error("Error fetching profits:", error);
    }
  };

  useEffect(() => {
    fetchProfits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount) return alert("পরিমাণ লিখুন");

    setLoading(true);
    try {
      const res = await fetch("/api/extraProfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(form.amount),
          note: form.note,
        }),
      });

      if (res.ok) {
        alert("এক্সট্রা লাভ যুক্ত হয়েছে");
        setForm({ amount: "", note: "" });
        fetchProfits();
      } else {
        alert("এক্সট্রা লাভ যুক্ত করা যায়নি");
      }
    } catch (error) {
      alert("সার্ভার ত্রুটি হয়েছে");
    }
    setLoading(false);
  };

  const total = profits.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        এক্সট্রা লাভ ব্যবস্থাপনা
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-4 mb-8 space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">পরিমাণ (টাকা)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full p-2 border rounded text-black"
            placeholder="৳"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">নোট (ঐচ্ছিক)</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full p-2 border rounded text-black"
            placeholder="যেমনঃ সার্ভিস চার্জ, পরিবহন ইত্যাদি"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "যোগ করা হচ্ছে..." : "এক্সট্রা লাভ যোগ করুন"}
        </button>
      </form>
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">
          সর্বমোট এক্সট্রা লাভ:{" "}
          <span className="text-green-600">{total.toLocaleString()} টাকা</span>
        </h3>

        <ul className="space-y-3 max-h-64 overflow-y-auto text-sm">
          {profits.length > 0 ? (
            profits.map((p) => (
              <li key={p._id} className="border-b pb-2">
                <div className="font-semibold">৳ {p.amount}</div>
                {p.note && <div className="text-gray-600">নোট: {p.note}</div>}
                <div className="text-gray-400 text-xs">
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">এক্সট্রা লাভের কোনো এন্ট্রি নেই।</p>
          )}
        </ul>
      </div>
    </div>
  );
}
