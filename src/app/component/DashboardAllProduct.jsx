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
    slug: "",
    description: "",
    brand: "",
    price: "",
    discountPrice: "",
    categoryGender: "",
    categoryType: "",
    categoryScollection: "",
    sizes: "",
    colors: "",
    quantity: "",
    inStock: false,
    isFeatured: false,
    sku: "",
    tags: "",
    weight: "",
    dimensionsLength: "",
    dimensionsWidth: "",
    dimensionsHeight: "",
    shippingFreeShipping: false,
    shippingCost: "",
    shippingEstimatedDeliveryDays: "",
    sizeGuide: "",
    visibility: "public",
    adminNote: "",
  });

  // Populate form data when modal opens or product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        brand: product.brand || "",
        price: product.price !== undefined ? product.price : "",
        discountPrice:
          product.discountPrice !== undefined ? product.discountPrice : "",
        categoryGender: product.category?.gender || "",
        categoryType: product.category?.type || "",
        categoryScollection: product.category?.scollection || "",
        sizes: product.sizes?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        quantity: product.quantity !== undefined ? product.quantity : "",
        inStock: product.inStock || false,
        isFeatured: product.isFeatured || false,
        sku: product.sku || "",
        tags: product.tags?.join(", ") || "",
        weight: product.weight !== undefined ? product.weight : "",
        dimensionsLength:
          product.dimensions?.length !== undefined
            ? product.dimensions.length
            : "",
        dimensionsWidth:
          product.dimensions?.width !== undefined
            ? product.dimensions.width
            : "",
        dimensionsHeight:
          product.dimensions?.height !== undefined
            ? product.dimensions.height
            : "",
        shippingFreeShipping: product.shippingDetails?.freeShipping || false,
        shippingCost:
          product.shippingDetails?.shippingCost !== undefined
            ? product.shippingDetails.shippingCost
            : "",
        shippingEstimatedDeliveryDays:
          product.shippingDetails?.estimatedDeliveryDays !== undefined
            ? product.shippingDetails.estimatedDeliveryDays
            : "",
        sizeGuide: product.sizeGuide || "",
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
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      brand: formData.brand.trim(),
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : null,
      category: {
        gender: formData.categoryGender.trim(),
        type: formData.categoryType.trim(),
        scollection: formData.categoryScollection.trim(),
      },
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,
      sku: formData.sku.trim() || undefined,
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [],
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      dimensions: {
        length: formData.dimensionsLength
          ? parseFloat(formData.dimensionsLength)
          : undefined,
        width: formData.dimensionsWidth
          ? parseFloat(formData.dimensionsWidth)
          : undefined,
        height: formData.dimensionsHeight
          ? parseFloat(formData.dimensionsHeight)
          : undefined,
      },
      shippingDetails: {
        freeShipping: formData.shippingFreeShipping,
        shippingCost: formData.shippingCost
          ? parseFloat(formData.shippingCost)
          : undefined,
        estimatedDeliveryDays: formData.shippingEstimatedDeliveryDays
          ? parseInt(formData.shippingEstimatedDeliveryDays)
          : undefined,
      },
      sizeGuide: formData.sizeGuide.trim() || undefined,
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
            ৳{product.price}
          </p>
          {product.discountPrice && (
            <>
              <p className="text-sm text-gray-500 line-through ml-2">
                ৳{product.discountPrice}
              </p>
              <p className="text-sm text-green-500 ml-2">
                (
                {((1 - product.price / product.discountPrice) * 100).toFixed(0)}
                % off)
              </p>
            </>
          )}
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
        <p className="text-sm text-gray-400 mb-1">
          <strong className="text-gray-300">Colors:</strong>{" "}
          {product.colors?.join(", ")}
        </p>
        <p className="text-sm text-gray-400 mb-1 flex items-center">
          <strong className="text-gray-300 mr-1">Stock:</strong>{" "}
          {product.inStock ? (
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

        {product.sku && (
          <p className="text-sm text-gray-400 mb-1">
            <strong className="text-gray-300">SKU:</strong> {product.sku}
          </p>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-1">
            <strong className="text-gray-300 text-sm">Tags:</strong>
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {product.weight && (
          <p className="text-sm text-gray-400 mb-1">
            <strong className="text-gray-300">Weight:</strong> {product.weight}{" "}
            kg
          </p>
        )}
        {product.dimensions && (
          <p className="text-sm text-gray-400 mb-1">
            <strong className="text-gray-300">Dimensions:</strong>{" "}
            {product.dimensions.length}L x {product.dimensions.width}W x{" "}
            {product.dimensions.height}H cm
          </p>
        )}
        {product.shippingDetails && (
          <p className="text-sm text-gray-400 mb-1">
            <strong className="text-gray-300">Shipping:</strong>{" "}
            {product.shippingDetails.freeShipping
              ? "Free"
              : `৳${product.shippingDetails.shippingCost}`}{" "}
            (Est. {product.shippingDetails.estimatedDeliveryDays} days)
          </p>
        )}
        {product.sizeGuide && (
          <p className="text-sm text-gray-400 mb-1 flex items-center">
            <strong className="text-gray-300 mr-1">Size Guide:</strong>
            <a
              href={product.sizeGuide}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center"
            >
              View <ExternalLink size={14} className="ml-1" />
            </a>
          </p>
        )}
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

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
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

              {/* Price & Discount Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Discount Price (৳)
                  </label>
                  <input
                    name="discountPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discountPrice}
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Colors (comma separated)
                  </label>
                  <input
                    name="colors"
                    type="text"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="e.g., red, blue, green"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
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

              {/* SKU & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    SKU
                  </label>
                  <input
                    name="sku"
                    type="text"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., casual, summer, new-arrival"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div className="space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <label className="block text-lg font-semibold text-gray-200 mb-2">
                  Physical Attributes
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Length (cm)
                    </label>
                    <input
                      name="dimensionsLength"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.dimensionsLength}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Width (cm)
                    </label>
                    <input
                      name="dimensionsWidth"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.dimensionsWidth}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Height (cm)
                    </label>
                    <input
                      name="dimensionsHeight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.dimensionsHeight}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <label className="block text-lg font-semibold text-gray-200 mb-2">
                  Shipping Details
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    name="shippingFreeShipping"
                    type="checkbox"
                    checked={formData.shippingFreeShipping}
                    onChange={handleChange}
                    className="h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 transition-colors duration-200"
                    id="shippingFreeShipping"
                  />
                  <label
                    htmlFor="shippingFreeShipping"
                    className="text-sm font-medium text-gray-300"
                  >
                    Free Shipping
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Shipping Cost (৳)
                  </label>
                  <input
                    name="shippingCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shippingCost}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Estimated Delivery Days
                  </label>
                  <input
                    name="shippingEstimatedDeliveryDays"
                    type="number"
                    min="0"
                    value={formData.shippingEstimatedDeliveryDays}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Size Guide & Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Size Guide URL
                  </label>
                  <input
                    name="sizeGuide"
                    type="text"
                    value={formData.sizeGuide}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Visibility
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="public" className="bg-gray-800">
                      Public
                    </option>
                    <option value="private" className="bg-gray-800">
                      Private
                    </option>
                    <option value="archived" className="bg-gray-800">
                      Archived
                    </option>
                  </select>
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
