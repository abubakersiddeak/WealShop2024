"use client";
import { useEffect, useState } from "react";
import { EyeOff, Info, Search, X, Loader2 } from "lucide-react"; // Added Loader2 icon for loading state

export default function ShowOrder({ setOpenShowOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // New state to manage the active order filter tab, defaulting to 'VALID' (New Orders)
  const [activeTab, setActiveTab] = useState("VALID"); // 'all', 'VALID', 'PROCESSING', 'DELIVERED'
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [processingOrderId, setProcessingOrderId] = useState(null); // State to track which order is being processed

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getTotalOrder`
      );
      const json = await res.json();
      if (json.success) {
        // Sort orders by tran_date in descending order (latest first)
        const sortedOrders = json.data.sort(
          (a, b) => new Date(b.tran_date) - new Date(a.tran_date)
        );
        setOrders(sortedOrders);
        // Initial filtering will be handled by the useEffect that depends on orders and activeTab
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally, show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Effect to filter orders whenever searchTerm, original orders, or activeTab change
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let results = orders.filter((order) => {
      // Add defensive checks here
      const customerName = order.customer?.name || ""; // Use empty string if name is null/undefined
      const tranId = order.tran_id || ""; // Use empty string if tran_id is null/undefined
      const orderId = order._id || ""; // Use empty string if _id is null/undefined

      return (
        customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
        tranId.toLowerCase().includes(lowerCaseSearchTerm) ||
        orderId.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

    // Further filter based on the active tab
    if (activeTab !== "all") {
      results = results.filter((order) => order.status === activeTab);
    }

    setFilteredOrders(results);
  }, [searchTerm, orders, activeTab]); // Added activeTab to dependencies

  // Function to update order status
  const updateOrderStatus = async (orderId, currentStatus) => {
    setProcessingOrderId(orderId); // Set processing state for this specific order
    let newStatus;
    if (currentStatus === "VALID") {
      newStatus = "PROCESSING";
    } else if (currentStatus === "PROCESSING") {
      newStatus = "DELIVERED";
    } else {
      setProcessingOrderId(null);
      return; // No further action if already DELIVERED or other status
    }

    try {
      // Assuming an API endpoint for updating order status
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/updateOrderStatus`,
        {
          method: "PUT", // Or PATCH, depending on your API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, status: newStatus }),
        }
      );
      const json = await res.json();
      if (json.success) {
        // Update the orders state to reflect the new status
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          );
          // Re-sort the orders after status update to maintain latest first order
          return updatedOrders.sort(
            (a, b) => new Date(b.tran_date) - new Date(a.tran_date)
          );
        });
        // filteredOrders will be updated automatically by the useEffect
      } else {
        console.error("Failed to update order status:", json.message);
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally, show an error message to the user
    } finally {
      setProcessingOrderId(null); // Clear processing state
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );

  const tabs = [
    { name: "New Orders", status: "VALID" }, // Prioritize New Orders
    { name: "Processing Orders", status: "PROCESSING" },
    { name: "Delivered Orders", status: "DELIVERED" },
    { name: "All Orders", status: "all" },
  ];

  return (
    <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 overflow-hidden font-inter">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl md:text-2xl font-semibold tracking-wide uppercase">
          Order Manifest{" "}
          <span className="text-blue-400">({filteredOrders.length})</span>
        </span>
        <button
          className="hover:text-gray-400 transition-colors duration-200"
          onClick={() => setOpenShowOrder(false)}
          aria-label="Close Order Manifest"
        >
          <EyeOff className="h-6 w-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by customer name, transaction ID, or order ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-blue-500 focus:outline-none text-gray-200 placeholder-gray-400 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search orders"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === tab.status
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-100"
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="overflow-auto rounded-md border border-gray-700">
        <table className="min-w-full text-sm md:text-md divide-y divide-gray-700 bg-gray-800 hidden md:table">
          <thead className="bg-gray-700 text-gray-300 uppercase tracking-wider">
            <tr>
              {/* No whitespace between th tags on the same line */}
              <th className="px-3 py-3 text-left font-semibold text-gray-300">
                Client Name
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-300">
                Order ID
              </th>
              <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell text-gray-300">
                Contact
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-300">
                Merchandise
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-300">
                Units
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-300">
                Value
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-300">
                State
              </th>
              <th className="px-3 py-3 text-right font-semibold text-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-3 py-6 text-center text-gray-400">
                  No orders found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-3 py-3 font-medium">
                    {order.customer.name}
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-blue-400 text-xs">
                      {order._id.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="block">{order.customer.phone}</span>
                    {order.customer.email && (
                      <span className="block text-gray-400 text-xs">
                        {order.customer.email.substring(0, 10)}...
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item._id} className="truncate">
                        {item.name}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <span className="text-gray-400 text-sm">
                        + {order.items.length - 2} more
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-3 py-3 text-center">৳{order.amount}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "VALID"
                          ? "bg-green-600 text-green-100"
                          : order.status === "PROCESSING"
                          ? "bg-blue-600 text-blue-100"
                          : "bg-purple-600 text-purple-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-400 hover:underline font-semibold transition-colors duration-200 flex items-center"
                        aria-label={`View details for order ${order._id}`}
                      >
                        <Info className="h-5 w-5 inline-block mr-1" />
                        <span>Details</span>
                      </button>
                      {order.status !== "DELIVERED" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, order.status)
                          }
                          disabled={processingOrderId === order._id}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center justify-center
                            ${
                              order.status === "VALID"
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                : "bg-teal-600 hover:bg-teal-700 text-white"
                            }
                            ${
                              processingOrderId === order._id
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }`}
                          aria-label={
                            order.status === "VALID"
                              ? "Initiate Processing"
                              : "Mark as Delivered"
                          }
                        >
                          {processingOrderId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : order.status === "VALID" ? (
                            "Initiate Processing"
                          ) : (
                            "Mark as Delivered"
                          )}
                        </button>
                      )}
                      {order.status === "DELIVERED" && (
                        <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-600 text-gray-300 cursor-not-allowed">
                          Delivered
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4 p-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-md border border-gray-700 bg-gray-800 p-4 shadow-md"
              >
                <p>
                  <span className="font-semibold text-gray-300">Client:</span>{" "}
                  <span className="text-blue-400">{order.customer.name}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order._id.substring(0, 10)}...
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold">Contact:</span>{" "}
                  {order.customer.phone}
                </p>
                <div className="my-2">
                  <span className="font-semibold text-gray-300">Items:</span>{" "}
                  {order.items.slice(0, 2).map((item, index) => (
                    <span key={item._id}>
                      {item.name}
                      {index < Math.min(1, order.items.length - 1) ? ", " : ""}
                    </span>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-gray-400 text-sm">
                      + {order.items.length - 2} more
                    </span>
                  )}
                </div>
                <p>
                  <span className="font-semibold text-gray-300">Payment:</span>{" "}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status === "paid"
                        ? "bg-green-700 text-green-200"
                        : "bg-yellow-700 text-yellow-200"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Value:</span> ৳
                  {order.amount}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "VALID"
                        ? "bg-green-600 text-green-100"
                        : order.status === "PROCESSING"
                        ? "bg-blue-600 text-blue-100"
                        : "bg-purple-600 text-purple-100"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <div className="mt-3 flex justify-end items-center space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-400 hover:underline font-semibold transition-colors duration-200 flex items-center"
                    aria-label={`View details for order ${order._id}`}
                  >
                    <Info className="h-5 w-5 inline-block mr-1" />{" "}
                    <span>More</span>
                  </button>
                  {order.status !== "DELIVERED" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, order.status)}
                      disabled={processingOrderId === order._id}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center justify-center
                        ${
                          order.status === "VALID"
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-teal-600 hover:bg-teal-700 text-white"
                        }
                        ${
                          processingOrderId === order._id
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      aria-label={
                        order.status === "VALID"
                          ? "Process order"
                          : "Deliver order"
                      }
                    >
                      {processingOrderId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : order.status === "VALID" ? (
                        "Process"
                      ) : (
                        "Deliver"
                      )}
                    </button>
                  )}
                  {order.status === "DELIVERED" && (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-600 text-gray-300 cursor-not-allowed">
                      Delivered
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-lg w-full relative border border-gray-700 animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-4 text-blue-400 uppercase tracking-wide">
              Order Dossier
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-gray-400">Client Name:</span>{" "}
                <span className="font-medium">
                  {selectedOrder.customer.name}
                </span>
              </p>
              <p>
                <span className="text-gray-100">Order ID:</span>{" "}
                <span className="text-blue-500">{selectedOrder._id}</span>
              </p>
              <p>
                <span className="text-gray-400">Contact Email:</span>{" "}
                {selectedOrder.customer.email || (
                  <span className="text-gray-500">Not Provided</span>
                )}
              </p>
              <p>
                <span className="text-gray-400">Contact Phone:</span>{" "}
                {selectedOrder.customer.phone}
              </p>
              <p>
                <span className="text-gray-400">Delivery Node:</span>{" "}
                {`${selectedOrder.shipping.address}, ${selectedOrder.shipping.city}, ${selectedOrder.shipping.country} - ${selectedOrder.shipping.postal_code}`}
              </p>
              <p>
                <span className="text-gray-400">Transaction Hash:</span>{" "}
                <span className="text-blue-500">{selectedOrder.tran_id}</span>
              </p>
              <p>
                <span className="text-gray-400">Payment Protocol:</span>{" "}
                {selectedOrder.card_type}
              </p>
              <p>
                <span className="text-gray-400">Issuing Authority:</span>{" "}
                {selectedOrder.card_issuer}
              </p>
              <p>
                <span className="text-gray-400">Current Status:</span>{" "}
                <span
                  className={`font-medium ${
                    selectedOrder.status === "VALID"
                      ? "text-green-400"
                      : selectedOrder.status === "PROCESSING"
                      ? "text-blue-400"
                      : "text-purple-400"
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Total Value:</span>{" "}
                <span className="font-semibold text-blue-400">
                  ৳{selectedOrder.amount}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Initiated On:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-300 mb-2">
                  Manifested Items:
                </h4>
                <ul className="list-disc ml-5 text-gray-400">
                  {selectedOrder.items.map((item) => (
                    <li key={item._id}>
                      {item.name} (Size: {item.size}, Units: {item.quantity},
                      Unit salePrice: ৳{item.salePrice})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors duration-200"
              aria-label="Close order details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
