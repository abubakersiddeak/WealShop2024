"use client";

import {
  ClipboardPlus,
  ShoppingBag,
  PackageOpen,
  LineChart,
  Activity,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Users,
  BellRing,
} from "lucide-react";
import AddProduct from "../component/AddProduct";
import ShowOrder from "../component/ShowOrder";

import { useEffect, useState } from "react";
import ShowAllProduct from "../component/ShowAllProduct";

export default function EcomarsDashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openAddproduct, setOpenAddproduct] = useState(false);
  const [openShowOrder, setOpenShowOrder] = useState(false);
  const [openAvailableProducts, setOpenAvailableProducts] = useState(false);
  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getTotalOrder`
      );
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
        setFilteredOrders(json.data); // Initialize filteredOrders with all orders
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally, show an error message to the user
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  console.log(orders);
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

  // Common styling for navigated components to match futuristic theme
  const navigatedComponentStyle =
    "min-h-screen bg-gray-900 text-gray-100 p-6 relative";

  if (openAddproduct) {
    return (
      <div className={navigatedComponentStyle}>
        <button
          onClick={handleBack}
          className="mb-6 absolute top-6 left-6 text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowUpRight size={20} className="transform rotate-180" /> Back to
          Dashboard
        </button>
        <div className="pt-12">
          {" "}
          {/* Add padding to prevent content from hiding behind back button */}
          <AddProduct setOpenAddproduct={setOpenAddproduct} />
        </div>
      </div>
    );
  }

  if (openShowOrder) {
    return (
      <div className={navigatedComponentStyle}>
        <button
          onClick={handleBack}
          className="mb-6 absolute top-6 left-6 text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowUpRight size={20} className="transform rotate-180" /> Back to
          Dashboard
        </button>
        <div className="pt-12">
          <ShowOrder setOpenShowOrder={setOpenShowOrder} />
        </div>
      </div>
    );
  }

  if (openAvailableProducts) {
    return (
      <div className={navigatedComponentStyle}>
        <button
          onClick={handleBack}
          className="mb-6 absolute top-6 left-6 text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowUpRight size={20} className="transform rotate-180" /> Back to
          Dashboard
        </button>
        <div className="pt-12">
          <ShowAllProduct />
        </div>
      </div>
    );
  }
  const totalsale = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalBuyPrice = orders.reduce((productAcc, product) => {
    const itemTotal = product.items.reduce((itemAcc, item) => {
      return itemAcc + item.buyPrice;
    }, 0);
    return productAcc + itemTotal;
  }, 0);
  const totalProfit =
    orders.reduce((sum, order) => sum + (order.store_amount || 0), 0) -
    totalBuyPrice;
  // Main Dashboard view with modern/futuristic enhancements
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 p-8 font-sans">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-10 tracking-tight">
          WEAL
        </h1>

        {/* Quick Actions / Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <button
            onClick={handleAddProduct}
            className="group bg-gray-800 hover:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-6 border border-gray-700 hover:border-purple-500 transform hover:-translate-y-1"
          >
            <div className="bg-purple-600 group-hover:bg-purple-500 p-4 rounded-full text-white shadow-xl transition-all duration-300">
              <ClipboardPlus size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-400 group-hover:text-purple-300">
                Add New Product
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Deploy new items to your digital storefront.
              </p>
            </div>
          </button>

          <button
            onClick={handleShowOrder}
            className="group bg-gray-800 hover:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-6 border border-gray-700 hover:border-cyan-500 transform hover:-translate-y-1"
          >
            <div className="bg-cyan-600 group-hover:bg-cyan-500 p-4 rounded-full text-white shadow-xl transition-all duration-300">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300">
                Process Orders
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Review and manage all incoming customer requests.
              </p>
            </div>
          </button>

          <button
            onClick={handleShowAvailableProducts}
            className="group bg-gray-800 hover:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-6 border border-gray-700 hover:border-green-500 transform hover:-translate-y-1"
          >
            <div className="bg-green-600 group-hover:bg-green-500 p-4 rounded-full text-white shadow-xl transition-all duration-300">
              <PackageOpen size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-400 group-hover:text-green-300">
                Total Products
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Explore your inventory and product listings.
              </p>
            </div>
          </button>
        </div>

        {/* Analytics & Insights Section */}
        <h2 className="text-3xl font-bold text-gray-200 mb-6 flex items-center gap-3">
          <LineChart size={28} className="text-purple-400" />
          Real-time Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Metric Card: Total Sales */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-purple-500/20 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Total Sales
              </h3>
              <CreditCard size={24} className="text-purple-500" />
            </div>
            <p className="text-4xl font-bold text-purple-400">TK {totalsale}</p>
            <p className="text-sm text-gray-400 mt-2 flex items-center">
              <TrendingUp size={16} className="text-green-400 mr-1" />
              +12.5% since last month
            </p>
          </div>
          {/* Metric Card: Average Order Value */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-orange-500/20 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Revinue Form sale Product
              </h3>
              <CreditCard size={24} className="text-orange-500" />
            </div>
            <p className="text-4xl font-bold text-orange-400">
              TK {totalProfit}
            </p>
            <p className="text-sm text-gray-400 mt-2 flex items-center">
              <TrendingUp size={16} className="text-green-400 mr-1" />
              +2.1% since last month
            </p>
          </div>
          {/* Metric Card: New Orders */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-cyan-500/20 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Total Orders
              </h3>
              <ShoppingBag size={24} className="text-cyan-500" />
            </div>
            <p className="text-4xl font-bold text-cyan-400">{orders.length}</p>
            <p className="text-sm text-gray-400 mt-2 flex items-center">
              <TrendingUp size={16} className="text-green-400 mr-1" />
              +8.1% since last week
            </p>
          </div>

          {/* Metric Card: Customers Acquired */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-green-500/20 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">
                New Customers
              </h3>
              <Users size={24} className="text-green-500" />
            </div>
            <p className="text-4xl font-bold text-green-400">325</p>
            <p className="text-sm text-gray-400 mt-2 flex items-center">
              <TrendingUp size={16} className="text-green-400 mr-1" />
              +15.0% since last month
            </p>
          </div>
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-gray-200 mb-5 flex items-center gap-3">
              <Activity size={24} className="text-sky-400" /> Recent Activity
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                <ShoppingBag
                  size={20}
                  className="text-emerald-400 flex-shrink-0 mt-1"
                />
                <div>
                  <p className="text-gray-100 font-medium">
                    New Order #ORD-20250528-001 by Alice Smith
                  </p>
                  <p className="text-gray-400 text-sm">
                    Product: Quantum Monitor X-Series, Qty: 1 -{" "}
                    <span className="text-purple-300">2 minutes ago</span>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                <ClipboardPlus
                  size={20}
                  className="text-yellow-400 flex-shrink-0 mt-1"
                />
                <div>
                  <p className="text-gray-100 font-medium">
                    Product "Hyper-drive Processor" updated
                  </p>
                  <p className="text-gray-400 text-sm">
                    Stock adjusted to 50 units -{" "}
                    <span className="text-purple-300">1 hour ago</span>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                <Users size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-100 font-medium">
                    New customer registration: John Doe
                  </p>
                  <p className="text-gray-400 text-sm">
                    Welcome to the platform! -{" "}
                    <span className="text-purple-300">4 hours ago</span>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                <PackageOpen
                  size={20}
                  className="text-red-400 flex-shrink-0 mt-1"
                />
                <div>
                  <p className="text-gray-100 font-medium">
                    Low Stock Alert: "Nano-Fiber Cables"
                  </p>
                  <p className="text-gray-400 text-sm">
                    Only 10 units remaining -{" "}
                    <span className="text-purple-300">Yesterday</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-gray-200 mb-5 flex items-center gap-3">
              <BellRing size={24} className="text-orange-400" /> Notifications
            </h3>
            <ul className="space-y-4">
              <li className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-3">
                <span className="text-yellow-400">●</span>
                <p className="text-gray-100 font-medium text-sm">
                  System maintenance scheduled for May 30th, 2 AM PST.
                </p>
              </li>
              <li className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-3">
                <span className="text-red-400">●</span>
                <p className="text-gray-100 font-medium text-sm">
                  Payment gateway processing delay on some transactions.
                </p>
              </li>
              <li className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-3">
                <span className="text-green-400">●</span>
                <p className="text-gray-100 font-medium text-sm">
                  New dashboard features are now live! Check settings.
                </p>
              </li>
            </ul>
            <button className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-md">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
