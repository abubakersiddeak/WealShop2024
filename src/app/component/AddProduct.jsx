"use client";

import { useState, useRef } from "react";
import { FiUpload, FiImage, FiCheck, FiX } from "react-icons/fi";
import generateSlug from "../utils/generateSlug";
import Select from "react-select";
import { EyeOff } from "lucide-react";

export default function AddProduct({ setOpenAddproduct }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: {
      gender: "",
      type: "",
      collection: "",
    },
    price: "",
    discountPrice: "",
    brand: "",
    sizes: [],
    colors: [],
    quantity: "",
    images: [],
    inStock: true,
    sku: "",
    tags: [],
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    shippingDetails: {
      freeShipping: false,
      shippingCost: "",
      estimatedDeliveryDays: "",
    },
    sizeGuide: "",
    visibility: "public",
    adminNote: "",
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProductAdded, setIsProductAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayInput = (e, field) => {
    const value = e.target.value;
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
      });

      const results = await Promise.all(uploadPromises);
      const newImages = results.filter((r) => r.url).map((r) => r.url);

      setUploadedImages((prev) => [...prev, ...newImages]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.price || formData.images.length === 0) {
      alert("Please fill in all required fields and upload at least one image");
      return;
    }

    try {
      // Prepare the data to send
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
        quantity: Number(formData.quantity) || 0,
        weight: formData.weight ? Number(formData.weight) : undefined,
        dimensions: {
          length: formData.dimensions.length
            ? Number(formData.dimensions.length)
            : undefined,
          width: formData.dimensions.width
            ? Number(formData.dimensions.width)
            : undefined,
          height: formData.dimensions.height
            ? Number(formData.dimensions.height)
            : undefined,
        },
        shippingDetails: {
          ...formData.shippingDetails,
          shippingCost: formData.shippingDetails.shippingCost
            ? Number(formData.shippingDetails.shippingCost)
            : undefined,
          estimatedDeliveryDays: formData.shippingDetails.estimatedDeliveryDays
            ? Number(formData.shippingDetails.estimatedDeliveryDays)
            : undefined,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Product`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
          category: {
            gender: "",
            type: "",
            collection: "",
          },
          price: "",
          discountPrice: "",
          brand: "",
          sizes: [],
          colors: [],
          quantity: "",
          images: [],
          inStock: true,
          sku: "",
          tags: [],
          weight: "",
          dimensions: {
            length: "",
            width: "",
            height: "",
          },
          shippingDetails: {
            freeShipping: false,
            shippingCost: "",
            estimatedDeliveryDays: "",
          },
          sizeGuide: "",
          visibility: "public",
          adminNote: "",
        });
        setUploadedImages([]);
        setIsProductAdded(true);
        setTimeout(() => setIsProductAdded(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message || "Failed to add product. Please try again.");
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "details", label: "Details" },
    { id: "media", label: "Media" },
    { id: "shipping", label: "Shipping" },
  ];

  const collectionoptions = [
    { value: "Men-Full-Sleeve-Jersey", label: "Men-Full-Sleeve-Jersey" },
    { value: "Men-Half-Sleeve-Jersey", label: "Men-Half-Sleeve-Jersey" },
    { value: "Men-Shorts", label: "Men-Shorts" },
    { value: "Men-Trouser", label: "Men-Trouser" },
    { value: "Men-Others", label: "Men-Others" },
    // { value: "Men-Full-Sleeve-Jersey", label: "Men-Full-Sleeve-Jersey" },
    // { value: "Men-Half-Sleeve-Jersey", label: "Men-Half-Sleeve-Jersey" },
    // { value: "Men-Shorts", label: "Men-Shorts" },
    // { value: "Men-Trouser", label: "Men-Trouser" },
    // { value: "Men-Others", label: "Men-Others" },
    { value: "Kids-Full-Sleeve-Jersey", label: "Kids-Full-Sleeve-Jersey" },
    { value: "Kids-Half-Sleeve-Jersey", label: "Kids-Half-Sleeve-Jersey" },
    { value: "Kids-Shorts", label: "Kids-Shorts" },
    { value: "Kids-Trouser", label: "Kids-Trouser" },
    { value: "Kids-Others", label: "Kids-Others" },

    { value: "Accessories-Cricket", label: "Accessories-Cricket" },
    { value: "Accessories-Football", label: "Accessories-Football" },
    { value: "Accessories-Badmintion", label: "Accessories-Badmintion" },
    { value: "Accessories-Volleyball", label: "Accessories-Volleyball" },

    { value: "Accessories-Others", label: "Accessories-Others" },
  ]; // search collection option

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between">
        {" "}
        <span className="text-3xl font-bold text-gray-800 mb-6 ">
          Add New Product
        </span>
        <span className="text-3xl font-bold text-gray-800 mb-6 hover:text-gray-600">
          <button
            onClick={() => {
              setOpenAddproduct(false);
            }}
          >
            <EyeOff />
          </button>
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Product Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug*
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Pricing</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity*
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  In Stock
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Category</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender*
                </label>
                <select
                  name="category.gender"
                  value={formData.category.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>

                  <option value="kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type*
                </label>
                <input
                  type="text"
                  name="category.type"
                  value={formData.category.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <Select
                options={collectionoptions}
                value={collectionoptions.find(
                  (option) => option.value === formData.category.collection
                )}
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: {
                      ...prev.category,
                      collection: selectedOption ? selectedOption.value : "",
                    },
                  }));
                }}
                placeholder="Select Collection"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand*
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Attributes
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes.join(", ")}
                  onChange={(e) => handleArrayInput(e, "sizes")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colors (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.colors.join(", ")}
                  onChange={(e) => handleArrayInput(e, "colors")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) => handleArrayInput(e, "tags")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Product Images
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FiImage className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop images here, or click to browse
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  multiple
                  accept="image/*"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center"
                >
                  <FiUpload className="mr-2" />
                  {isUploading ? "Uploading..." : "Select Images"}
                </label>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG up to 10MB
                </p>
              </div>
            </div>

            {isUploading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Uploading images...
                </p>
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Uploaded Images ({uploadedImages.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Shipping Details
              </h2>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="shippingDetails.freeShipping"
                  checked={formData.shippingDetails.freeShipping}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Free Shipping
                </label>
              </div>

              {!formData.shippingDetails.freeShipping && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <input
                      type="number"
                      name="shippingDetails.shippingCost"
                      value={formData.shippingDetails.shippingCost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Delivery Days
                </label>
                <input
                  type="number"
                  name="shippingDetails.estimatedDeliveryDays"
                  value={formData.shippingDetails.estimatedDeliveryDays}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Physical Attributes
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Guide
                </label>
                <textarea
                  name="sizeGuide"
                  value={formData.sizeGuide}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {activeTab !== "basic" && (
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    tabs[tabs.findIndex((t) => t.id === activeTab) - 1].id
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
          </div>

          <div>
            {activeTab !== tabs[tabs.length - 1].id ? (
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    tabs[tabs.findIndex((t) => t.id === activeTab) + 1].id
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                disabled={isProductAdded}
              >
                {isProductAdded ? (
                  <>
                    <FiCheck className="mr-2" />
                    Product Added!
                  </>
                ) : (
                  "Save Product"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
