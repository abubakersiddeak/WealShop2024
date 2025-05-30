"use client";

import { useState, useRef } from "react";
// Importing icons from react-icons/fi
import { FiUpload, FiImage, FiCheck, FiX } from "react-icons/fi";
// Assuming generateSlug is a utility function you have
import generateSlug from "../utils/generateSlug";
// Importing Select component from react-select for dropdowns
import Select from "react-select";
// Importing EyeOff icon from lucide-react
import { EyeOff } from "lucide-react";

// Custom Alert/Modal Component
const CustomAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Error</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function AddProduct({ setOpenAddproduct }) {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: {
      gender: "",
      type: "",
      scollection: "",
    },
    salePrice: "",
    discountsalePrice: "",
    brand: "",
    sizes: [],
    colors: [],
    quantity: "",
    images: [],
    inStock: true,
    sku: "",
    tags: [],
    visibility: "public",
    adminNote: "",
  });

  // State for uploaded images preview
  const [uploadedImages, setUploadedImages] = useState([]);
  // State for upload loading indicator
  const [isUploading, setIsUploading] = useState(false);
  // State to show product added success message
  const [isProductAdded, setIsProductAdded] = useState(false);
  // State to manage active tab in the form
  const [activeTab, setActiveTab] = useState("basic");
  // Ref for file input element
  const fileInputRef = useRef(null);
  // State for custom alert message
  const [alertMessage, setAlertMessage] = useState("");

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for product name to generate slug
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value), // Generate slug from product name
      }));
    } else if (name.includes(".")) {
      // Handle nested state updates (e.g., category.gender)
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      // Handle direct state updates
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handler for array type inputs (e.g., sizes, colors, tags)
  const handleArrayInput = (e, field) => {
    const value = e.target.value;
    // Split by comma and trim whitespace for each item
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  // Handler for file input change (image uploads)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return; // No files selected

    setIsUploading(true); // Set uploading state to true

    try {
      // Map over selected files to create upload promises
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file); // Append file to FormData
        // Make fetch request to cloudinary API endpoint
        return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`, {
          method: "POST",
          body: formData,
        }).then((res) => res.json()); // Parse response as JSON
      });

      // Wait for all upload promises to resolve
      const results = await Promise.all(uploadPromises);
      // Filter out successful uploads and extract URLs
      const newImages = results.filter((r) => r.url).map((r) => r.url);

      // Update uploadedImages state for preview
      setUploadedImages((prev) => [...prev, ...newImages]);
      // Update formData.images with new image URLs
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      setAlertMessage("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // Function to remove an uploaded image
  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1); // Remove image at specified index
    setUploadedImages(newImages); // Update preview state
    setFormData((prev) => ({
      ...prev,
      images: newImages, // Update formData state
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic client-side validation for required fields
    if (!formData.name || !formData.salePrice || formData.images.length === 0) {
      setAlertMessage(
        "Please fill in all required fields and upload at least one image."
      );
      return;
    }

    try {
      // Prepare the data to send to the API, converting numbers where necessary
      const productData = {
        ...formData,
        salePrice: Number(formData.salePrice),
        discountsalePrice: formData.discountsalePrice
          ? Number(formData.discountsalePrice)
          : undefined, // Only include if present
        quantity: Number(formData.quantity) || 0, // Default to 0 if empty
      };

      // Make API call to add product
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Product`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData), // Send form data as JSON
        }
      );

      if (response.ok) {
        // If response is successful, reset form and show success message
        setFormData({
          name: "",
          slug: "",
          description: "",
          category: {
            gender: "",
            type: "",
            scollection: "",
          },
          salePrice: "",
          discountsalePrice: "",
          brand: "",
          sizes: [],
          colors: [],
          quantity: "",
          images: [],
          inStock: true,
          sku: "",
          tags: [],
          visibility: "public",
          adminNote: "",
        });
        setUploadedImages([]); // Clear uploaded images preview
        setIsProductAdded(true); // Show product added success
        setTimeout(() => setIsProductAdded(false), 3000); // Hide after 3 seconds
      } else {
        // If response is not OK, parse error and throw
        const errorData = await response.json();
        let errorMessage = "Failed to add product. Please try again.";

        // Enhanced error message for duplicate field value
        if (
          errorData.message &&
          (errorData.message.includes("duplicate key error") ||
            errorData.message.includes("Duplicate field value"))
        ) {
          errorMessage =
            "A product with this name or slug already exists. Please choose a different name or modify the slug.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        throw new Error(errorMessage); // Throw error to be caught by catch block
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setAlertMessage(
        error.message || "Failed to add product. Please try again."
      );
    }
  };

  // Define tabs for navigation
  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "details", label: "Details" },
    { id: "media", label: "Media" },
  ];

  // Options for the collection select dropdown
  const collectionoptions = [
    { value: "Men-Full-Sleeve-Jersey", label: "Men-Full-Sleeve-Jersey" },
    { value: "Men-Half-Sleeve-Jersey", label: "Men-Half-Sleeve-Jersey" },
    { value: "Men-Shorts", label: "Men-Shorts" },
    { value: "Men-Trouser", label: "Men-Trouser" },
    { value: "Men-Others", label: "Men-Others" },
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
  ];

  // Custom styles for react-select component
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#125577 ", // Custom background color
      borderColor: state.isFocused ? "#60a5fa" : "#d1d5db", // Border color on focus
      boxShadow: state.isFocused ? "0 0 0 1px #60a5fa" : "none", // Shadow on focus
      "&:hover": {
        borderColor: "#60a5fa",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#f0f9ff", // Dropdown menu background
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#60a5fa"
        : state.isFocused
        ? "#e0f2fe"
        : "#f0f9ff",
      color: "#1e3a8a",
      "&:active": {
        backgroundColor: "#bae6fd",
      },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-md">
      {/* Custom Alert Component */}
      <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />

      <div className="flex justify-between">
        <span className="text-3xl font-bold text-white mb-6">
          Add New Product
        </span>
        <span className="text-3xl font-bold text-white mb-6 hover:text-gray-600">
          <button
            onClick={() => {
              setOpenAddproduct(false); // Close the add product form
            }}
          >
            <EyeOff /> {/* EyeOff icon */}
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
                ? "border-b-2 border-blue-500 text-blue-600" // Active tab styles
                : "text-white hover:text-white" // Inactive tab styles
            }`}
            onClick={() => setActiveTab(tab.id)} // Set active tab on click
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab Content */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Product Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="block text-sm font-medium text-white mb-1">
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
              <h2 className="text-xl font-semibold text-white">Pricing</h2>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Sale Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Buy Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <input
                    type="number"
                    name="discountsalePrice"
                    value={formData.discountsalePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="ml-2 block text-sm text-white">
                  In Stock
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Category</h2>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="block text-sm font-medium text-white mb-1">
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
                  (option) => option.value === formData.category.scollection
                )}
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: {
                      ...prev.category,
                      scollection: selectedOption ? selectedOption.value : "",
                    },
                  }));
                }}
                styles={customStyles}
                placeholder="Select Collection"
              />

              <div>
                <label className="block text-sm font-medium text-white mb-1">
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
              <h2 className="text-xl font-semibold text-white">Attributes</h2>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="block text-sm font-medium text-white mb-1">
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
                <label className="block text-sm font-medium text-white mb-1">
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

        {/* Media Tab Content */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Product Images</h2>

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
                <p className="text-xs text-white">
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
                <h3 className="text-lg font-medium text-white mb-3">
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
                className="px-4 py-2 border border-gray-300 rounded-md text-white hover:bg-gray-50"
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
