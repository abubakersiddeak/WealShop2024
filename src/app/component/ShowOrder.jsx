"use client";
import { useEffect, useState } from "react";
import { EyeOff } from "lucide-react";

export default function ShowOrder({ setOpenShowOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading orders...</p>;

  return (
    <div className="p-4 md:p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl md:text-2xl font-bold text-gray-800">
          Total Orders ({orders.length})
        </span>
        <button
          className="hover:text-gray-400"
          onClick={() => setOpenShowOrder(false)}
        >
          <EyeOff />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="hidden md:table min-w-full bg-white border border-gray-200 shadow rounded-xl">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-center">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{order.customer.name}</td>
                <td className="py-3 px-4">{order.customer.phone}</td>
                <td className="py-3 px-4">
                  {order.items.map((item) => (
                    <div key={item._id}>{item.name}</div>
                  ))}
                </td>
                <td className="py-3 px-4 text-center">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </td>
                <td className="py-3 px-4">{order.payment_status}</td>
                <td className="py-3 px-4 text-center">৳{order.amount}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      order.status === "VALID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Mobile Layout */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {order.customer.name}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {order.customer.phone}
              </p>
              <p>
                <span className="font-semibold">Products:</span>{" "}
                {order.items.map((item) => item.name).join(", ")}
              </p>
              <p>
                <span className="font-semibold">Qty:</span>{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p>
                <span className="font-semibold">Payment:</span>{" "}
                {order.payment_status}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ৳{order.amount}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 text-sm rounded-full font-medium ${
                    order.status === "VALID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <div className="mt-2 text-right">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <h3 className="text-lg md:text-xl font-bold mb-2">Order Details</h3>
            <p>
              <strong>Customer:</strong> {selectedOrder.customer.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.customer.phone}
            </p>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {selectedOrder.shipping.address}, {selectedOrder.shipping.city},{" "}
              {selectedOrder.shipping.country} -{" "}
              {selectedOrder.shipping.postal_code}
            </p>
            <p>
              <strong>Transaction ID:</strong> {selectedOrder.tran_id}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.card_type}
            </p>
            <p>
              <strong>Issuer:</strong> {selectedOrder.card_issuer}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Amount:</strong> ৳{selectedOrder.amount}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.tran_date).toLocaleString()}
            </p>
            <div className="mt-4">
              <h4 className="font-semibold">Items:</h4>
              {selectedOrder.items.map((item) => (
                <div key={item._id} className="ml-2 mt-1">
                  • {item.name} (Size: {item.size}, Qty: {item.quantity}, Price:
                  ৳{item.price})
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
