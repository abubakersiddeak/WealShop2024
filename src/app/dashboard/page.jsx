"use client";

import { ClipboardPlus, ShoppingBag, PackageOpen } from "lucide-react"; // PackageOpen icon for products
import AddProduct from "../component/AddProduct";
import ShowOrder from "../component/ShowOrder";

import { useState } from "react";
import ShowAllProduct from "../component/ShowAllProduct";

export default function EcomarsDashboard() {
  const [openAddproduct, setOpenAddproduct] = useState(false);
  const [openShowOrder, setOpenShowOrder] = useState(false);
  const [openAvailableProducts, setOpenAvailableProducts] = useState(false);

  const handleAddProduct = () => {
    setOpenAddproduct(true);
    setOpenShowOrder(false);
    setOpenAvailableProducts(false);
  };

  const handleShowOrder = () => {
    setOpenShowOrder(true);
    setOpenAddproduct(false);
    setOpenAvailableProducts(false);
  };

  const handleShowAvailableProducts = () => {
    setOpenAvailableProducts(true);
    setOpenAddproduct(false);
    setOpenShowOrder(false);
  };

  const handleBack = () => {
    setOpenAddproduct(false);
    setOpenShowOrder(false);
    setOpenAvailableProducts(false);
  };

  if (openAddproduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={handleBack}
          className="mb-4 text-blue-600 underline hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        <AddProduct setOpenAddproduct={setOpenAddproduct} />
      </div>
    );
  }

  if (openShowOrder) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={handleBack}
          className="mb-4 text-blue-600 underline hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        <ShowOrder setOpenShowOrder={setOpenShowOrder} />
      </div>
    );
  }

  if (openAvailableProducts) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={handleBack}
          className="mb-4 text-blue-600 underline hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        <ShowAllProduct />
      </div>
    );
  }

  // Main Dashboard view with 3 buttons now
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          📊 Welcome to <span className="text-green-600">Weal Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleAddProduct}
            className="bg-white hover:bg-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 border border-green-100"
          >
            <div className="bg-green-100 p-3 rounded-full text-green-600 shadow">
              <ClipboardPlus size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-700">
                Add New Product
              </h2>
              <p className="text-gray-500 text-sm">
                Click here to create and upload a new product.
              </p>
            </div>
          </button>

          <button
            onClick={handleShowOrder}
            className="bg-white hover:bg-yellow-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 border border-yellow-100"
          >
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-500 shadow">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-500">
                View Orders
              </h2>
              <p className="text-gray-500 text-sm">
                Check all customer orders and details.
              </p>
            </div>
          </button>

          <button
            onClick={handleShowAvailableProducts}
            className="bg-white hover:bg-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 border border-blue-100"
          >
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 shadow">
              <PackageOpen size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-700">
                Available Products
              </h2>
              <p className="text-gray-500 text-sm">
                Browse all products available in your store.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
