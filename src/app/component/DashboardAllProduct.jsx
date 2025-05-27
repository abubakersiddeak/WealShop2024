"use client";
import React, { useState } from "react";

const DashboardAllProduct = ({ product, handleUpdate, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discountPrice: "",
    categoryType: "",
    categoryGender: "",
    sizes: "",
    colors: "",
    rating: "",
    reviewsCount: "",
    inStock: false,
    quantity: "",
  });

  if (!product) return <p>No product data available.</p>;

  // Open modal and populate form
  const openModal = () => {
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      categoryType: product.category?.type || "",
      categoryGender: product.category?.gender || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      rating: product.rating || "",
      reviewsCount: product.reviewsCount || "",
      inStock: product.inStock || false,
      quantity: product.quantity || "",
    });
    setIsModalOpen(true);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare updated product object
    const updatedProduct = {
      ...product,
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : null,
      category: {
        type: formData.categoryType,
        gender: formData.categoryGender,
      },
      sizes: formData.sizes.split(",").map((s) => s.trim()),
      colors: formData.colors.split(",").map((c) => c.trim()),
      rating: parseFloat(formData.rating),
      reviewsCount: parseInt(formData.reviewsCount),
      inStock: formData.inStock,
      quantity: parseInt(formData.quantity),
    };

    handleUpdate(updatedProduct);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600">
          <strong>Brand:</strong> {product.brand}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Price:</strong> ৳{product.price}
        </p>
        {product.discountPrice && (
          <p className="text-sm text-green-600">
            <strong>Discount:</strong> ৳{product.discountPrice}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <strong>Category:</strong> {product.category?.type} (
          {product.category?.gender})
        </p>
        <p className="text-sm text-gray-600">
          <strong>Sizes:</strong> {product.sizes?.join(", ")}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Colors:</strong> {product.colors?.join(", ")}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Rating:</strong> {product.rating} / 5 ({product.reviewsCount}{" "}
          reviews)
        </p>
        <p className="text-sm text-gray-600">
          <strong>Stock:</strong>{" "}
          {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Quantity:</strong> {product.quantity}
        </p>

        {/* Edit & Delete Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-h-[70vh] overflow-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (৳)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price (৳)
                </label>
                <input
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Type
                </label>
                <input
                  name="categoryType"
                  type="text"
                  value={formData.categoryType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Gender
                </label>
                <input
                  name="categoryGender"
                  type="text"
                  value={formData.categoryGender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sizes (comma separated)
                </label>
                <input
                  name="sizes"
                  type="text"
                  value={formData.sizes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colors (comma separated)
                </label>
                <input
                  name="colors"
                  type="text"
                  value={formData.colors}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reviews Count
                </label>
                <input
                  name="reviewsCount"
                  type="number"
                  value={formData.reviewsCount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  name="inStock"
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4"
                  id="inStock"
                />
                <label
                  htmlFor="inStock"
                  className="text-sm font-medium text-gray-700"
                >
                  In Stock
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardAllProduct;
