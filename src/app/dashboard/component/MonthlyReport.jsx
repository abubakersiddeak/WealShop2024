"use client";

import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa"; // Import icons for a richer UI

function getMonthString(date) {
  return date.toISOString().slice(0, 7); // YYYY-MM
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
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err.message || "An error occurred");
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
    return date.toLocaleString("en-US", { month: "long", year: "numeric" }); // Format month name for English locale
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900 leading-tight">
          Monthly Business Summary & Report
        </h1>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10 bg-blue-50 p-4 rounded-xl shadow-inner border border-blue-100">
          <button
            onClick={handlePrevMonth}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <FaChevronLeft className="text-sm" />
            <span className="hidden sm:inline">Previous Month</span>
          </button>

          <div className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wide">
            {getMonthName(month)}
          </div>

          <button
            onClick={handleNextMonth}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              isCurrentMonth
                ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-70 shadow-none"
                : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
            }`}
            disabled={isCurrentMonth}
          >
            <span className="hidden sm:inline">Next Month</span>
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <FaSpinner className="animate-spin text-5xl mb-6" />
            <p className="text-xl font-medium">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-red-700 bg-red-50 rounded-xl border border-red-200 shadow-md">
            <FaExclamationTriangle className="text-5xl mb-6" />
            <p className="text-xl font-semibold">Error: {error}</p>
            <p className="text-md text-gray-600 mt-3">
              There was an issue loading the data. Please try again.
            </p>
          </div>
        )}

        {/* Summary Display */}
        {!loading && !error && summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sales Summary Card */}
            <ReportCard title="Sales Information" icon={FaChartLine}>
              <p>
                <span className="font-semibold">Total Sales:</span> ৳{" "}
                {(
                  summary.totalSales +
                  summary.totalOrderAmount +
                  summary.extraProfit
                )?.toLocaleString("en-US") || 0}
              </p>
              <p>
                <span className="font-semibold">Offline Profit:</span> ৳{" "}
                {summary.totalProfit?.toLocaleString("en-US") || 0}
              </p>
              <p>
                <span className="font-semibold">Online Profit:</span> ৳{" "}
                {summary.totalProfit?.toLocaleString("en-US") || 0}
              </p>
              <p>
                <span className="font-semibold text-green-600">
                  Total Profit:
                </span>{" "}
                ৳ {summary.totalProfit + summary.totalorderProfit || 0}
              </p>
              <p>
                <span className="font-semibold">Total Due:</span> ৳{" "}
                {summary.totalDue?.toLocaleString("en-US") || 0}
              </p>
              <p>
                <span className="font-semibold">Extra Profit:</span> ৳{" "}
                {summary.extraProfit?.toLocaleString("en-US") || 0}
              </p>
            </ReportCard>

            {/* Orders Summary Card */}
            <ReportCard title="Online Information" icon={FaShoppingCart}>
              <p>
                <span className="font-semibold">Total Orders:</span>{" "}
                {summary.totalOrders || 0}
              </p>
              <p>
                <span className="font-semibold">Total Sale:</span> ৳{" "}
                {summary.totalOrderAmount?.toLocaleString("en-US") || 0}
              </p>
              <p>
                <span className="font-semibold">Total Profit:</span> ৳{" "}
                {summary.totalorderProfit?.toLocaleString("en-US") || 0}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3">Order Status:</h3>
                {summary.ordersByStatus &&
                  Object.entries(summary.ordersByStatus).map(
                    ([status, count]) => (
                      <p
                        key={status}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="capitalize">{status}:</span>
                        <span className="font-medium text-blue-600">
                          {count}
                        </span>
                      </p>
                    )
                  )}
              </div>
            </ReportCard>

            {/* Expenses Summary Card */}
            <ReportCard title="Expense Information" icon={FaMoneyBillWave}>
              <p>
                <span className="font-semibold">Total Expenses:</span> ৳{" "}
                {summary.totalExpenses?.toLocaleString("en-US") || 0}
              </p>
            </ReportCard>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !summary && (
          <div className="text-center py-20 text-gray-700 bg-blue-50 rounded-xl border border-blue-200 shadow-md">
            <p className="text-xl font-medium">
              No data available for this month.
            </p>
            <p className="text-md mt-3">Please select another month to view.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Card Component for better structure and styling
function ReportCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center mb-5 pb-4 border-b border-gray-200">
        {Icon && <Icon className="text-3xl text-blue-600 mr-4" />}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}
