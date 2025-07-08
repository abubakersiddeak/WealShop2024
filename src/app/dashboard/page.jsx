"use client";
import { useRouter } from "next/navigation";
import {
  ClipboardPlus,
  ShoppingBag,
  PackageOpen,
  LineChart,
  Activity,
  ArrowLeft,
  CreditCard,
  Users,
  BellRing, // Added for notifications
} from "lucide-react";
import AddProduct from "../component/AddProduct";
import ShowOrder from "../component/ShowOrder";

import { useEffect, useState } from "react";
import ShowAllProduct from "../component/ShowAllProduct";
import VisitorList from "../component/VisitorList";
import Link from "next/link";
import Sales from "./component/Sales";
import DueCollect from "./component/DueCollect";
import ExtraProfit from "./component/ExtraProfit";
import MonthlyReport from "./component/MonthlyReport";

export default function EcomarsDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [openAddproduct, setOpenAddproduct] = useState(false);
  const [openShowOrder, setOpenShowOrder] = useState(false);
  const [openAvailableProducts, setOpenAvailableProducts] = useState(false);
  const [openVisitor, serOpenVisitor] = useState(false);
  const [saleproduct, setsaleproduct] = useState(false);
  const [showdue, setshowdue] = useState(false);
  const [showextraprofict, setshowextraprofict] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getTotalOrder`
        );
        const json = await res.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Product`
        );
        const data = await res.json();
        // Access products from the 'products' key and sort them
        const sorted = data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sorted);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handlelogout = async () => {
    await fetch("/api/logout", { method: "GET" });
    router.push("/login");
  };

  const handleNavigate = (page) => {
    setOpenAddproduct(page === "add");
    setOpenShowOrder(page === "orders");
    setOpenAvailableProducts(page === "products");
    serOpenVisitor(page === "visitor");
  };

  const handleBack = () => {
    setOpenAddproduct(false);
    setOpenShowOrder(false);
    setOpenAvailableProducts(false);
    serOpenVisitor(false);
  };

  // --- Derived State for Analytics ---
  const totalSale = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

  const totalBuyPrice = orders.reduce((orderSum, order) => {
    const orderItemsBuyPrice = order.items.reduce((itemSum, item) => {
      return itemSum + (item.buyPrice || 0) * (item.quantity || 0);
    }, 0);
    return orderSum + orderItemsBuyPrice;
  }, 0);

  const totalProfit = totalSale - totalBuyPrice;

  const lowStockProducts = products.filter((product) => product.quantity < 10);
  const totalNewOrders = orders.filter(
    (order) => order.status === "VALID"
  ).length;

  // --- Common back button component for reusability and consistency ---
  const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 sm:top-6 sm:left-6 text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center gap-2 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label="Back to Dashboard"
    >
      <ArrowLeft size={24} />
      <span className="hidden sm:inline font-semibold">Back to Dashboard</span>
    </button>
  );

  // --- Render different views based on state ---
  const navigatedComponentStyle =
    "min-h-screen bg-pink-50 text-gray-800 p-4 sm:p-6 relative"; // Changed text color

  if (openAddproduct) {
    return (
      <div className={navigatedComponentStyle}>
        <BackButton onClick={handleBack} />
        <div className="pt-16 sm:pt-20">
          <AddProduct setOpenAddproduct={setOpenAddproduct} />
        </div>
      </div>
    );
  }

  if (openShowOrder) {
    return (
      <div className={navigatedComponentStyle}>
        <BackButton onClick={handleBack} />
        <div className="pt-16 sm:pt-20">
          <ShowOrder setOpenShowOrder={setOpenShowOrder} />
        </div>
      </div>
    );
  }

  if (openAvailableProducts) {
    return (
      <div className={navigatedComponentStyle}>
        <BackButton onClick={handleBack} />
        <div className="pt-16 sm:pt-20">
          <ShowAllProduct />
        </div>
      </div>
    );
  }
  if (openVisitor) {
    return (
      <div className={navigatedComponentStyle}>
        <BackButton onClick={handleBack} />
        <div className="pt-16 sm:pt-20">
          <VisitorList />
        </div>
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    <div className="min-h-screen bg-pink-50 p-4 sm:p-8 font-sans text-gray-800">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-500 tracking-tight">
            WEAL Dashboard
          </h1>
          <button
            onClick={handlelogout}
            className="cursor-pointer text-sm sm:text-lg text-red-600 border border-red-600 p-2 sm:p-3 rounded-xl hover:bg-red-100 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Log Out
          </button>
        </header>

        {/* Quick Actions / Main Navigation */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {/* Action Card: Add Product */}
          <button
            onClick={() => handleNavigate("add")}
            className="cursor-pointer  group bg-white hover:bg-purple-50 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-gray-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className="bg-purple-600 group-hover:bg-purple-700 p-4 rounded-full text-white shadow-md transition-all duration-300">
              <ClipboardPlus size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-purple-700">
                Add New Product
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Deploy new items to your digital storefront.
              </p>
            </div>
          </button>

          {/* Action Card: Show Orders */}
          <button
            onClick={() => handleNavigate("orders")}
            className=" cursor-pointer group bg-white hover:bg-cyan-50 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-gray-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <div className="bg-cyan-600 group-hover:bg-cyan-700 p-4 rounded-full text-white shadow-md transition-all duration-300">
              <ShoppingBag size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-cyan-700">
                Order Manifest
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Review and manage all incoming customer requests.
              </p>
            </div>
          </button>

          {/* Action Card: Show All Products */}
          <button
            onClick={() => handleNavigate("products")}
            className="cursor-pointer group bg-white hover:bg-green-50 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-gray-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <div className="bg-green-600 group-hover:bg-green-700 p-4 rounded-full text-white shadow-md transition-all duration-300">
              <PackageOpen size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-green-700">
                Total Products{" "}
                <span className="text-yellow-600 block sm:inline">
                  ({products.length})
                </span>
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Explore your inventory and product listings.
              </p>
            </div>
          </button>
          <button
            onClick={() => handleNavigate("visitor")}
            className="cursor-pointer group bg-white hover:bg-blue-50 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-gray-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="bg-blue-600 group-hover:bg-blue-700 p-4 rounded-full text-white shadow-md transition-all duration-300">
              <Users size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-700">
                Web Visitors
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Explore every visitor.
              </p>
            </div>
          </button>
        </section>

        {/* Analytics & Insights Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <LineChart size={28} className="text-purple-600" />
            Real-time Analytics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {/* Metric Card: Total Sales */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Sales
                </h3>
                <CreditCard size={24} className="text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-purple-800">
                TK {totalSale.toLocaleString()}
              </p>
            </div>
            {/* Metric Card: Total Profit */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Revenue from Sales
                </h3>
                <CreditCard size={24} className="text-orange-600" />
              </div>
              <p className="text-4xl font-bold text-orange-800">
                TK {totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  New Orders
                </h3>
                <ShoppingBag size={24} className="text-cyan-600" />
              </div>
              <p className="text-4xl font-bold text-cyan-800">
                {totalNewOrders}
              </p>
            </div>
            {/* Metric Card: New Sale Button */}
            <button
              onClick={() => {
                setsaleproduct(true);
              }}
              className="cursor-pointer bg-gradient-to-r from-teal-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl font-bold transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <ShoppingBag size={32} className="mr-3" /> New Sale
            </button>
            <button
              onClick={() => {
                setshowdue(true);
              }}
              className="cursor-pointer bg-gradient-to-r bg-white text-red-600 md:text-3xl  p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl font-bold transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Total Due
            </button>
            <button
              onClick={() => {
                setshowextraprofict(true);
              }}
              className="cursor-pointer bg-gradient-to-r bg-white text-green-600 md:text-3xl  p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl font-bold transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Extra Profit
            </button>

            {/* Metric Card: Expenses Link */}
            <Link
              href="/dashboard/expence"
              className="bg-white p-6 rounded-2xl text-center text-red-500 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-2xl font-bold"
            >
              Expenses
            </Link>
          </div>
        </section>

        {/* Recent Activity & Low Stock Notifications */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activity */}

          {/* Low Stock Products */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-center text-2xl font-bold text-red-600 mb-6 flex items-center justify-center gap-2">
              <BellRing size={28} className="text-red-600" />
              Low Stock Products
            </h3>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">
                        Product Name
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((p, index) => (
                      <tr
                        key={p._id || index}
                        className="border-t border-gray-200 hover:bg-red-50 transition-colors"
                      >
                        <td className="px-4 py-3 sm:px-6 sm:py-4">{p.name}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-red-500 font-bold">
                          {p.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No low stock products found.
              </p>
            )}

            <button className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-rose-600 transition-all duration-300 shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500">
              View All Notifications
            </button>
          </div>
        </section>
      </div>
      {saleproduct && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 ">
          <div className="bg-pink-50 p-6 rounded-lg w-full h-full relative overflow-y-auto">
            <button
              onClick={() => setsaleproduct(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl font-bold cursor-pointer transition-colors duration-200"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="mt-8">
              <Sales />
            </div>
          </div>
        </div>
      )}
      {showdue && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 ">
          <div className="bg-pink-50 p-6 rounded-lg w-full h-full relative overflow-y-auto">
            <button
              onClick={() => setshowdue(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl font-bold cursor-pointer transition-colors duration-200"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="mt-8">
              <DueCollect />
            </div>
          </div>
        </div>
      )}
      {showextraprofict && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 ">
          <div className="bg-pink-50 p-6 rounded-lg w-full h-full relative overflow-y-auto">
            <button
              onClick={() => setshowextraprofict(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl font-bold cursor-pointer transition-colors duration-200"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="mt-8">
              <ExtraProfit />
            </div>
          </div>
        </div>
      )}
      <MonthlyReport />
    </div>
  );
}
