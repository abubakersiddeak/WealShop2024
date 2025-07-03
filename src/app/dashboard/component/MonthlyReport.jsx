"use client";

import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa"; // Import icons for a richer UI

function getMonthString(date) {
  return date.toISOString().slice(0, 7); // YYYY-mm
}

function prevMonth(date, n = 1) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - n);
  return d;
}

export default function MonthlyReport() {
  const [month, setMonth] = useState(getMonthString(new Date()));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/businessReport?month=${month}`);
      if (!res.ok) throw new Error("ডেটা আনতে ব্যর্থ হয়েছে"); // Failed to fetch data
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err.message || "ত্রুটি হয়েছে"); // An error occurred
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [month]);

  const handlePrevMonth = () => {
    const d = new Date(`${month}-01`);
    setMonth(getMonthString(prevMonth(d)));
  };

  const handleNextMonth = () => {
    const d = new Date(`${month}-01`);
    const next = new Date(d);
    next.setMonth(d.getMonth() + 1);
    if (getMonthString(next) > getMonthString(new Date())) return; // disable future months
    setMonth(getMonthString(next));
  };

  const isCurrentMonth = month === getMonthString(new Date());

  const getMonthName = (monthString) => {
    const [year, monthNum] = monthString.split("-");
    const date = new Date(year, parseInt(monthNum) - 1, 1);
    return date.toLocaleString("bn-BD", { month: "long", year: "numeric" }); // Format month name for Bangladesh locale
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900 leading-tight">
          ব্যবসার মাসিক সারাংশ ও রিপোর্ট
        </h1>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 bg-gray-100 p-3 rounded-lg shadow-sm">
          <button
            onClick={handlePrevMonth}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaChevronLeft className="text-sm" />
            <span className="hidden sm:inline">আগের মাস</span>
          </button>

          <div className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wide">
            {getMonthName(month)}
          </div>

          <button
            onClick={handleNextMonth}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isCurrentMonth
                ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            }`}
            disabled={isCurrentMonth}
          >
            <span className="hidden sm:inline">পরবর্তী মাস</span>
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-blue-600">
            <FaSpinner className="animate-spin text-4xl mb-4" />
            <p className="text-lg font-medium">লোড হচ্ছে...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-red-600 bg-red-50 rounded-lg border border-red-200">
            <FaExclamationTriangle className="text-4xl mb-4" />
            <p className="text-lg font-semibold">ত্রুটি: {error}</p>
            <p className="text-sm text-gray-600 mt-2">
              ডেটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
            </p>
          </div>
        )}

        {/* Summary Display */}
        {!loading && !error && summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sales Summary Card */}
            <ReportCard title="বিক্রয় সংক্রান্ত তথ্য" icon={FaChartLine}>
              <p>
                <span className="font-semibold">মোট বিক্রয়:</span> ৳{" "}
                {(
                  summary.totalSales +
                  summary.totalOrderAmount +
                  summary.extraProfit
                )?.toLocaleString("bn-BD") || 0}
              </p>
              <p>
                <span className="font-semibold">মোট লাভ:</span> ৳{" "}
                {summary.totalProfit?.toLocaleString("bn-BD") || 0}
              </p>
              <p>
                <span className="font-semibold">মোট বকেয়া:</span> ৳{" "}
                {summary.totalDue?.toLocaleString("bn-BD") || 0}
              </p>
              <p>
                <span className="font-semibold">এক্সট্রা লাভ:</span> ৳{" "}
                {summary.extraProfit?.toLocaleString("bn-BD") || 0}
              </p>
            </ReportCard>

            {/* Orders Summary Card */}
            <ReportCard title="অর্ডার সম্পর্কিত তথ্য" icon={FaShoppingCart}>
              <p>
                <span className="font-semibold">মোট অর্ডার:</span>{" "}
                {summary.totalOrders || 0}
              </p>
              <p>
                <span className="font-semibold">মোট অর্ডার মূল্য:</span> ৳{" "}
                {summary.totalOrderAmount?.toLocaleString("bn-BD") || 0}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">
                  অর্ডার স্ট্যাটাস:
                </h3>
                {summary.ordersByStatus &&
                  Object.entries(summary.ordersByStatus).map(
                    ([status, count]) => (
                      <p key={status} className="flex justify-between">
                        <span>{status}:</span>
                        <span className="font-medium">{count}</span>
                      </p>
                    )
                  )}
              </div>
            </ReportCard>

            {/* Expenses Summary Card */}
            <ReportCard title="ব্যয় সম্পর্কিত তথ্য" icon={FaMoneyBillWave}>
              <p>
                <span className="font-semibold">মোট ব্যয়:</span> ৳{" "}
                {summary.totalExpenses?.toLocaleString("bn-BD") || 0}
              </p>
            </ReportCard>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !summary && (
          <div className="text-center py-12 text-gray-600 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg font-medium">
              এই মাসের জন্য কোন ডেটা পাওয়া যায়নি।
            </p>
            <p className="text-sm mt-2">অন্য মাস নির্বাচন করে দেখুন।</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Card Component for better structure and styling
function ReportCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
        {Icon && <Icon className="text-3xl text-blue-600 mr-3" />}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-3 text-gray-700 text-base">{children}</div>
    </div>
  );
}
