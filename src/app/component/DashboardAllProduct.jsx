"use client";
import React, { useState, useEffect } from "react";

const DashboardAllProduct = ({ product, handleUpdate, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "", // Added slug to formData
    description: "", // Added description to formData
    brand: "",
    price: "",
    discountPrice: "",
    categoryGender: "",
    categoryType: "",
    categoryScollection: "", // Added scollection to formData
    sizes: "",
    colors: "",
    quantity: "",
    inStock: false,
    // Note: rating and reviewsCount are typically calculated on the backend
    // and not directly editable via a simple product update form.
    // images: "", // If you plan to allow image updates, this would be more complex (e.g., file inputs)
    isFeatured: false, // Added isFeatured to formData
    sku: "", // Added sku to formData
    tags: "", // Added tags to formData
    weight: "", // Added weight to formData
    dimensionsLength: "", // Added dimensions to formData
    dimensionsWidth: "",
    dimensionsHeight: "",
    shippingFreeShipping: false, // Added shippingDetails to formData
    shippingCost: "",
    shippingEstimatedDeliveryDays: "",
    sizeGuide: "", // Added sizeGuide to formData
    visibility: "public", // Added visibility to formData
    adminNote: "", // Added adminNote to formData
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
        categoryScollection: product.category?.scollection || "", // Populate scollection
        sizes: product.sizes?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        quantity: product.quantity !== undefined ? product.quantity : "",
        inStock: product.inStock || false,
        isFeatured: product.isFeatured || false, // Populate isFeatured
        sku: product.sku || "", // Populate sku
        tags: product.tags?.join(", ") || "", // Populate tags
        weight: product.weight !== undefined ? product.weight : "", // Populate weight
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
        shippingFreeShipping: product.shippingDetails?.freeShipping || false, // Populate shipping details
        shippingCost:
          product.shippingDetails?.shippingCost !== undefined
            ? product.shippingDetails.shippingCost
            : "",
        shippingEstimatedDeliveryDays:
          product.shippingDetails?.estimatedDeliveryDays !== undefined
            ? product.shippingDetails.estimatedDeliveryDays
            : "",
        sizeGuide: product.sizeGuide || "", // Populate sizeGuide
        visibility: product.visibility || "public", // Populate visibility
        adminNote: product.adminNote || "", // Populate adminNote
      });
    }
  }, [product]); // Re-run when `product` prop changes

  if (!product) return <p>No product data available.</p>;

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
        scollection: formData.categoryScollection.trim(), // Include scollection
      },
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured, // Include isFeatured
      sku: formData.sku.trim() || undefined, // Set to undefined if empty for sparse index
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [], // Include tags
      weight: formData.weight ? parseFloat(formData.weight) : undefined, // Include weight
      dimensions: {
        // Include dimensions
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
        // Include shippingDetails
        freeShipping: formData.shippingFreeShipping,
        shippingCost: formData.shippingCost
          ? parseFloat(formData.shippingCost)
          : undefined,
        estimatedDeliveryDays: formData.shippingEstimatedDeliveryDays
          ? parseInt(formData.shippingEstimatedDeliveryDays)
          : undefined,
      },
      sizeGuide: formData.sizeGuide.trim() || undefined, // Include sizeGuide
      visibility: formData.visibility, // Include visibility
      adminNote: formData.adminNote.trim() || undefined, // Include adminNote
      // Do NOT send rating and reviewsCount from the frontend for direct editing,
      // as these should ideally be calculated/managed by your backend based on actual reviews.
    };

    handleUpdate(product._id, updatedProduct);
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
          {product.category?.gender}, {product.category?.scollection})
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
        <p className="text-sm text-gray-600">
          <strong>Featured:</strong> {product.isFeatured ? "Yes" : "No"}
        </p>
        {product.sku && (
          <p className="text-sm text-gray-600">
            <strong>SKU:</strong> {product.sku}
          </p>
        )}
        {product.tags && product.tags.length > 0 && (
          <p className="text-sm text-gray-600">
            <strong>Tags:</strong> {product.tags.join(", ")}
          </p>
        )}
        {product.weight && (
          <p className="text-sm text-gray-600">
            <strong>Weight:</strong> {product.weight} kg
          </p>
        )}
        {product.dimensions && (
          <p className="text-sm text-gray-600">
            <strong>Dimensions:</strong> {product.dimensions.length}L x{" "}
            {product.dimensions.width}W x {product.dimensions.height}H cm
          </p>
        )}
        {product.shippingDetails && (
          <p className="text-sm text-gray-600">
            <strong>Shipping:</strong>{" "}
            {product.shippingDetails.freeShipping
              ? "Free"
              : `৳${product.shippingDetails.shippingCost}`}{" "}
            (Est. {product.shippingDetails.estimatedDeliveryDays} days)
          </p>
        )}
        {product.sizeGuide && (
          <p className="text-sm text-gray-600">
            <strong>Size Guide:</strong> {product.sizeGuide}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <strong>Visibility:</strong> {product.visibility}
        </p>
        {product.adminNote && (
          <p className="text-sm text-gray-600">
            <strong>Admin Note:</strong> {product.adminNote}
          </p>
        )}

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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
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

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                  required
                ></textarea>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand <span className="text-red-500">*</span>
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

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price (৳)
                </label>
                <input
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Category Gender */}
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

              {/* Category Type */}
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

              {/* Category Collection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Collection
                </label>
                <input
                  name="categoryScollection"
                  type="text"
                  value={formData.categoryScollection}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sizes (comma separated)
                </label>
                <input
                  name="sizes"
                  type="text"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="e.g., S, M, L, XL"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colors (comma separated)
                </label>
                <input
                  name="colors"
                  type="text"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="e.g., red, blue, green"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* In Stock */}
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

              {/* Is Featured */}
              <div className="flex items-center space-x-2">
                <input
                  name="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4"
                  id="isFeatured"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-gray-700"
                >
                  Is Featured
                </label>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., casual, summer, new-arrival"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Length (cm)
                  </label>
                  <input
                    name="dimensionsLength"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dimensionsLength}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Width (cm)
                  </label>
                  <input
                    name="dimensionsWidth"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dimensionsWidth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    name="dimensionsHeight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dimensionsHeight}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Shipping Details
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    name="shippingFreeShipping"
                    type="checkbox"
                    checked={formData.shippingFreeShipping}
                    onChange={handleChange}
                    className="h-4 w-4"
                    id="shippingFreeShipping"
                  />
                  <label
                    htmlFor="shippingFreeShipping"
                    className="text-sm font-medium text-gray-700"
                  >
                    Free Shipping
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Cost (৳)
                  </label>
                  <input
                    name="shippingCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shippingCost}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estimated Delivery Days
                  </label>
                  <input
                    name="shippingEstimatedDeliveryDays"
                    type="number"
                    min="0"
                    value={formData.shippingEstimatedDeliveryDays}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Size Guide */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size Guide URL
                </label>
                <input
                  name="sizeGuide"
                  type="text"
                  value={formData.sizeGuide}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Admin Note
                </label>
                <textarea
                  name="adminNote"
                  value={formData.adminNote}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
