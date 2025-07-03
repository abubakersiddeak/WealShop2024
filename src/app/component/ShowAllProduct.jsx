import React, { useEffect, useState } from "react";
import DashboardAllProduct from "./DashboardAllProduct";

const ShowAllProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    brand: "",
    category: "",
    salePrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/Product`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const products = data.products || [];
        setAllProducts(products);
        setFilteredProducts(products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Search & Filter Handler
  useEffect(() => {
    let temp = [...allProducts];

    // Search by multiple fields
    if (search) {
      const lower = search.toLowerCase();
      temp = temp.filter((product) =>
        [
          product.name,
          product.brand,
          product.category,
          String(product.salePrice),
          new Date(product.updatedAt).toLocaleDateString(),
        ]
          .join(" ")
          .toLowerCase()
          .includes(lower)
      );
    }

    // Category filter
    if (filter.category) {
      temp = temp.filter((product) => product.category === filter.category);
    }

    // Brand filter
    if (filter.brand) {
      temp = temp.filter((product) => product.brand === filter.brand);
    }

    // salePrice sorting
    if (filter.salePrice === "lowToHigh") {
      temp.sort((a, b) => a.salePrice - b.salePrice);
    } else if (filter.salePrice === "highToLow") {
      temp.sort((a, b) => b.salePrice - a.salePrice);
    }

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [search, filter, allProducts]);

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (data.success) {
          setAllProducts((prev) => prev.filter((p) => p._id !== id));
          alert("Product deleted successfully");
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };
  const handleUpdate = async (id, updatedProduct) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product updated successfully");
        // Optionally update state
      }
      console.log(data);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center ">
        Available Products ({filteredProducts.length})
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, updated date, category, brand, salePrice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/3"
        />

        <div className="flex flex-wrap gap-2">
          <select
            name="category"
            onChange={handleFilterChange}
            className="p-2 border rounded "
          >
            <option value="">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Shoes">Shoes</option>
          </select>

          <select
            name="brand"
            onChange={handleFilterChange}
            className="p-2 border rounded "
          >
            <option value="">All Brands</option>
            <option value="Nike">Nike</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
          </select>

          <select
            name="salePrice"
            onChange={handleFilterChange}
            className="p-2 border rounded "
          >
            <option value="">Default</option>
            <option value="lowToHigh">salePrice: Low to High</option>
            <option value="highToLow">salePrice: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product list */}
      {loading ? (
        <p className="text-center text-blue-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <DashboardAllProduct
              key={product._id}
              product={product}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllProduct;
