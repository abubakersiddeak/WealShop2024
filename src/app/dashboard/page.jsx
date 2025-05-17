"use client";

import { BarChart3, Users, ShoppingBag, DollarSign } from "lucide-react";
import AddProduct from "../component/AddProduct";

export default function EcomarsDashboard() {
  const stats = [
    {
      icon: <Users className="text-blue-500" />,
      label: "Users",
      value: "2,430",
    },
    {
      icon: <ShoppingBag className="text-green-500" />,
      label: "Orders",
      value: "1,205",
    },
    {
      icon: <DollarSign className="text-yellow-500" />,
      label: "Revenue",
      value: "$18,250",
    },
    {
      icon: <BarChart3 className="text-purple-500" />,
      label: "Sales",
      value: "3,498",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Weal Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4"
          >
            <div className="bg-gray-100 p-2 rounded-full shadow">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="text-xl font-semibold">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Form */}
      <AddProduct />
    </div>
  );
}
