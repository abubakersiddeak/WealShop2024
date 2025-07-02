"use client";
import React, { useEffect, useState } from "react";

export default function MonthlyReport() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch("/api/monthly-report")
      .then((res) => res.json())
      .then((data) => setReport(data));
  }, []);

  if (!report) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        📊 Monthly Report - {report.month}
      </h2>
      <ul className="space-y-2">
        <li>Total Sales: ৳{report.totalSales}</li>
        <li>Profit: ৳{report.profit}</li>
        <li>Expenses: ৳{report.expenses}</li>
        <li>New Customers: {report.newCustomers}</li>
      </ul>
    </div>
  );
}
