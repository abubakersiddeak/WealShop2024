"use client";

import { useState, useRef } from "react";
import { BarChart3, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function EcomarsDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    size: "",
    colour: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedURL, setUploadedURL] = useState("");
  const [isProductAdded, setIsProductAdded] = useState(false);
  const fileInputRef = useRef(null); // 🔁 For resetting file input

  const inputValue = {
    name: formData.name,
    description: formData.description,
    category: formData.category,
    price: formData.price ? Number(formData.price) : 0,
    brand: formData.brand,
    sizes: formData.size ? [Number(formData.size)] : [],
    colors: formData.colour ? [formData.colour] : [],
    inStock: true,
    images: [uploadedURL], // The uploaded image URL
    rating: 5,
    reviewsCount: 0,
    isFeatured: false,
    sizeGuide: "",
  };

  const stats = [
    {
      icon: <Users className="text-blue-500" />,
      label: "Users",
      value: "2,430",
    },
    {
      icon: <ShoppingBag className="text-green-500" />,
      label: "Orders",
      value: "1,205",
    },
    {
      icon: <DollarSign className="text-yellow-500" />,
      label: "Revenue",
      value: "$18,250",
    },
    {
      icon: <BarChart3 className="text-purple-500" />,
      label: "Sales",
      value: "3,498",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

    // Automatically upload the image to Cloudinary
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3000/api/cloudinary", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setUploadedURL(data.url); // Store the uploaded image URL
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Wait until the image is uploaded and URL is set
    if (!uploadedURL) {
      alert("Please upload an image before adding the product.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/Product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputValue), // Send image URL along with product data
      });

      if (res.ok) {
        // Reset form
        setFormData({
          name: "",
          price: "",
          category: "",
          brand: "",
          size: "",
          colour: "",
          description: "",
        });

        // Reset image
        setImage(null);
        setPreview("");
        setUploadedURL("");

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }

        setIsProductAdded(true);
        setTimeout(() => setIsProductAdded(false), 1000);
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Product add failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Weal Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4"
          >
            <div className="bg-gray-100 p-2 rounded-full shadow">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="text-xl font-semibold">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 max-w-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🛒 Add New Product
        </h2>

        <form onSubmit={handleAddProduct} className="space-y-4">
          {[
            {
              name: "name",
              type: "text",
              placeholder: "Product Name",
              required: true,
            },
            {
              name: "price",
              type: "number",
              placeholder: "Product Price",
              required: true,
            },
            {
              name: "category",
              type: "text",
              placeholder: "Product Category",
              required: true,
            },
            { name: "brand", type: "text", placeholder: "Product Brand" },
            { name: "size", type: "number", placeholder: "Available Size" },
            { name: "colour", type: "text", placeholder: "Product Colour" },
          ].map(({ name, type, placeholder, required }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              className="input-style"
              value={formData[name]}
              onChange={handleChange}
              required={required}
            />
          ))}

          <textarea
            name="description"
            placeholder="Product Description"
            className="input-style resize-none h-24"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Image upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Upload Product Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file-input"
              required={true}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-48 mt-4 rounded-md shadow-md"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 text-lg font-semibold hover:bg-blue-700 transition"
          >
            {isProductAdded ? "✅ Added!" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
