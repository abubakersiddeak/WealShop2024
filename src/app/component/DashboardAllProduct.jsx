"use client";
import React, { useState, useEffect } from "react";
import {
  PencilLine, // Icon for Edit
  Trash2, // Icon for Delete
  XCircle, // Icon for closing modal
  CheckCircle, // Icon for In Stock
  XOctagon, // Icon for Out of Stock
  Star, // Icon for Featured
  ExternalLink, // Icon for Size Guide
} from "lucide-react";

const DashboardAllProduct = ({ product, handleUpdate, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",

    description: "",
    brand: "",
    salePrice: "",

    categoryGender: "",
    categoryType: "",
    categoryScollection: "",
    sizes: "",
    buyPrice: "",
    quantity: "",
    inStock: false,
    isFeatured: false,

    visibility: "public",
    adminNote: "",
  });

  // Populate form data when modal opens or product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",

        description: product.description || "",
        brand: product.brand || "",
        salePrice: product.salePrice !== undefined ? product.salePrice : "",
        buyPrice: product.buyPrice || "",
        categoryGender: product.category?.gender || "",
        categoryType: product.category?.type || "",
        categoryScollection: product.category?.scollection || "",
        sizes: product.sizes?.join(", ") || "",

        quantity: product.quantity !== undefined ? product.quantity : "",
        inStock: product.inStock || false,
        isFeatured: product.isFeatured || false,

        visibility: product.visibility || "public",
        adminNote: product.adminNote || "",
      });
    }
  }, [product]); // Re-run when `product` prop changes

  if (!product)
    return <p className="text-gray-400">No product data available.</p>;

  // Open modal (formData is already populated by useEffect)
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handle input change in form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submit to update product
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare updated product object for sending
    const updatedProduct = {
      name: formData.name.trim(),

      description: formData.description.trim(),
      brand: formData.brand.trim(),
      salePrice: parseFloat(formData.salePrice),
      buyPrice: formData.buyPrice
        ? parseFloat(formData.discountsalePrice)
        : null,
      category: {
        gender: formData.categoryGender.trim(),
        type: formData.categoryType.trim(),
        scollection: formData.categoryScollection.trim(),
      },
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],

      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,

      visibility: formData.visibility,
      adminNote: formData.adminNote.trim() || undefined,
      // Do NOT send rating and reviewsCount from the frontend for direct editing,
      // as these should ideally be calculated/managed by your backend based on actual reviews.
    };

    handleUpdate(product._id, updatedProduct);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Product Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 p-6 border border-gray-700 transform hover:-translate-y-1">
        <img
          src={
            product.images?.[0] ||
            "https://placehold.co/400x300/333/999?text=No+Image"
          }
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700"
        />
        <h2 className="text-xl font-bold text-gray-100 mb-2 leading-tight">
          {product.name}
        </h2>
        <p className="text-sm text-gray-400 mb-1">
          <strong className="text-gray-300">Brand:</strong> {product.brand}
        </p>
        <div className="flex items-baseline mb-2">
          <p className="text-lg font-bold text-purple-400 drop-shadow-md">
            ৳{product.salePrice}
          </p>
        </div>

        <p className="text-sm text-gray-400 mb-1">
          <strong className="text-gray-300">Category:</strong>{" "}
          {product.category?.type} ({product.category?.gender},{" "}
          {product.category?.scollection})
        </p>
        <p className="text-sm text-gray-400 mb-1">
          <strong className="text-gray-300">Sizes:</strong>{" "}
          {product.sizes?.join(", ")}
        </p>

        <p className="text-sm text-gray-400 mb-1 flex items-center">
          <strong className="text-gray-300 mr-1">Stock:</strong>{" "}
          {product.quantity > 0 ? (
            <span className="text-green-500 flex items-center">
              <CheckCircle size={16} className="mr-1" /> In Stock
            </span>
          ) : (
            <span className="text-red-500 flex items-center">
              <XOctagon size={16} className="mr-1" /> Out of Stock
            </span>
          )}
        </p>
        <p className="text-sm text-gray-400 mb-1">
          <strong className="text-gray-300">Quantity:</strong>{" "}
          {product.quantity}
        </p>
        <p className="text-sm text-gray-400 mb-1 flex items-center">
          <strong className="text-gray-300 mr-1">Featured:</strong>{" "}
          {product.isFeatured ? (
            <span className="text-yellow-400 flex items-center">
              <Star size={16} className="mr-1 fill-yellow-400" /> Yes
            </span>
          ) : (
            "No"
          )}
        </p>

        <p className="text-sm text-gray-400 mb-1">
          <strong className="text-gray-300">Visibility:</strong>{" "}
          {product.visibility}
        </p>
        {product.adminNote && (
          <p className="text-sm text-gray-400 mb-1">
            <strong className="text-gray-300">Admin Note:</strong>{" "}
            {product.adminNote}
          </p>
        )}

        {/* Edit & Delete Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-cyan-500/30 transform hover:-translate-y-0.5"
          >
            <PencilLine size={16} /> Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
              Edit Product
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <XCircle size={28} />
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 h-28 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                ></textarea>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* salePrice & Buy Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    salePrice (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Buy Price (৳)
                  </label>
                  <input
                    name="discountsalePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.buyPrice}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Category Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category Gender
                  </label>
                  <input
                    name="categoryGender"
                    type="text"
                    value={formData.categoryGender}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category Type
                  </label>
                  <input
                    name="categoryType"
                    type="text"
                    value={formData.categoryType}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category Collection
                  </label>
                  <input
                    name="categoryScollection"
                    type="text"
                    value={formData.categoryScollection}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    name="sizes"
                    type="text"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="e.g., S, M, L, XL"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Quantity & Stock Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex items-center space-x-3 pt-6 md:pt-0">
                  <input
                    name="inStock"
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 transition-colors duration-200"
                    id="inStock"
                  />
                  <label
                    htmlFor="inStock"
                    className="text-sm font-medium text-gray-300"
                  >
                    In Stock
                  </label>
                  <input
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-5 w-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 transition-colors duration-200"
                    id="isFeatured"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm font-medium text-gray-300"
                  >
                    Is Featured
                  </label>
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Admin Note
                </label>
                <textarea
                  name="adminNote"
                  value={formData.adminNote}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 h-24 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-700 text-gray-300 font-semibold hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-gray-600/30 transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
                >
                  Save Changes
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
