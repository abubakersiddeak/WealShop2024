// components/Product.js
"use client";
import React, { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import CartDrawer from "./CartDrawer";
import Link from "next/link"; // Import Link for navigation

export default function Product({ product }) {
  const { addToCart } = useCart();
  const [buttonText, setButtonText] = useState("ADD TO CART");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [instock, setInstock] = useState(true); // Corrected typo: setInstoke -> setInstock

  // Destructure product details for cleaner access
  const {
    name,
    description,
    category,
    salePrice,
    brand,
    sizes = [], // Ensure sizes is an array
    colors = [],
    images = [],
  } = product;

  // State to hold the full selected size object, not just the string
  // Initialize with the first size object if available, otherwise null
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? sizes[0] : null
  );

  useEffect(() => {
    // Update instock status based on overall product quantity
    if (product.quantity === 0) {
      setInstock(false);
    } else {
      setInstock(true);
    }

    // Also, if sizes array is available, ensure a default selected size
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [product.quantity, sizes, selectedSize]);

  // Assuming product.category.scollection holds the type needed for related products
  // Make sure product.category and product.category.scollection are always defined
  const productType = category?.scollection;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/relatedProduct?category=${productType}`
        );
        const data = await res.json();
        // Filter out the current product from related products
        // Ensure _id comparison handles potential object types if they ever occur
        const currentProductId = product._id?.$oid || product._id; // Robustly get current product ID
        const filteredData = data.filter((item) => {
          const relatedProductId = item._id?.$oid || item._id; // Robustly get related product ID
          return relatedProductId !== currentProductId;
        });
        setRelatedProducts(filteredData);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    if (productType) {
      // Only fetch if productType is available
      fetchRelatedProducts();
    }
  }, [productType, product._id]); // Add product._id to dependency array to refetch if product changes

  const containerRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [quantity, setQuantity] = useState(1);
  // selectedSize state is now managed above
  const [activeImage, setActiveImage] = useState(
    images[0] || "/placeholder.jpg"
  );
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setIsTouchDevice(hasTouch);
  }, []);

  const handleAddToCart = async () => {
    try {
      // Ensure a size is selected before adding to cart
      if (!selectedSize) {
        console.error("Please select a size before adding to cart.");
        // Optionally, show a user-friendly message or alert here
        return;
      }

      // Pass the complete selectedSize object to addToCart
      addToCart(product, quantity, selectedSize);
      setButtonText("SUCCESS");
      setIsDrawerOpen(true); // Open the drawer after adding to cart

      setTimeout(() => {
        setButtonText("ADD TO CART");
      }, 1000);
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  const handleMouseMove = (e) => {
    if (isTouchDevice || !containerRef.current) return; // Add null check for containerRef.current
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
    setZoomed(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setBackgroundPosition("center");
    setZoomed(false);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      <div className="relative w-full max-w-[90vw] mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Left: Image */}
        <div className="flex flex-col items-center space-y-4">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-[90vw] h-[60vh] sm:w-[300px] sm:h-[400px] md:w-[400px] md:h-[500px] overflow-hidden bg-no-repeat bg-cover transition duration-300 ease-in-out"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundSize: zoomed ? "200%" : "contain",
              backgroundPosition: backgroundPosition,
            }}
          />

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto max-w-full px-2">
            {images.map((img, index) => (
              <img
                key={index} // Using index here is acceptable as thumbnails are static and not reordered
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-16 h-16 object-cover cursor-pointer border ${
                  activeImage === img ? "border-black" : "border-gray-300"
                }`}
                onClick={() => {
                  setActiveImage(img);
                  setZoomed(false);
                  setBackgroundPosition("center");
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="mt-4 md:mt-6 space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold">{name}</h1>
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            TK. {salePrice}
          </p>

          {description && (
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">DESCRIPTION</p>
              <p>{description}</p>
            </div>
          )}

          {brand && <p className="text-sm text-gray-600">Brand: {brand}</p>}
          {category && (
            <p className="text-sm text-gray-600">
              Category: {category.gender} {category.type}
            </p>
          )}
          {colors.length > 0 && (
            <p className="text-sm text-gray-600">
              Colour:{" "}
              {colors.map((c, index) => (
                <span key={index} className="text-sm text-gray-600">
                  {`${c}${index < colors.length - 1 ? ", " : ""}`}
                </span>
              ))}
            </p>
          )}

          <p
            className={`font-semibold ${
              instock ? "text-green-600" : "text-red-600"
            }`}
          >
            Availability: {instock ? "In Stock " : "Out of Stock "}
          </p>

          {/* Size Selector & Quantity */}
          <div className="mt-6 space-y-4">
            {sizes.length > 0 && (
              <div>
                <label
                  htmlFor="size"
                  className="block text-sm font-medium mb-1"
                >
                  SIZE
                </label>
                <select
                  id="size"
                  // Bind value to the string representation of the selected size
                  value={selectedSize ? selectedSize.size : ""}
                  onChange={(e) => {
                    // Find the full size object from the `sizes` array
                    const foundSize = sizes.find(
                      (s) => s.size === e.target.value
                    );
                    setSelectedSize(foundSize); // Set the full object to state
                  }}
                  className="border border-gray-300 p-2 rounded w-full max-w-[160px]"
                >
                  {sizes.map((size, i) => (
                    <option
                      key={size.size || i} // Use size.size as key if available, fallback to index
                      value={size.size}
                      disabled={size.quantity === 0}
                    >
                      {size.size} {size.quantity === 0 ? "(Out of Stock)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center border border-gray-300 rounded mt-4">
              <button
                onClick={decreaseQuantity}
                className="px-3 py-1 text-lg cursor-pointer"
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center border-x border-gray-300"
              />
              <button
                onClick={increaseQuantity}
                className="px-3 py-1 text-lg cursor-pointer"
              >
                +
              </button>
            </div>

            {instock ? (
              <button
                onClick={handleAddToCart}
                className="bg-black cursor-pointer text-white px-6 py-2 rounded mt-4 hover:bg-gray-800 transition"
              >
                {buttonText}
              </button>
            ) : (
              <button className="bg-gray-500 cursor-not-allowed text-white px-6 py-2 rounded mt-4">
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Related Products Section --- */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="w-full max-w-[90vw] mx-auto p-4 mt-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            You Might Also Like:
          </h3>
          <div
            className="
            grid
            grid-cols-2           /* Mobile: 2 columns */
            sm:grid-cols-3        /* Small screens: 3 columns (optional, can be same as md) */
            md:grid-cols-4        /* Medium screens: 4 columns */
            lg:grid-cols-5        /* Large screens: 5 columns */
            gap-6
            max-h-[600px]         /* Limit height to enable vertical scroll */
            overflow-y-auto       /* Enable vertical scroll */
            pr-2                  /* Add padding right for scrollbar not to overlap content */
          "
          >
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct._id?.$oid || relProduct._id} // Robust key for related products
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <Link
                  href={`/dynamic/${relProduct._id?.$oid || relProduct._id}`}
                  className="block"
                >
                  <img
                    src={relProduct.images[0] || "/placeholder-product.jpg"}
                    alt={relProduct.name}
                    className="w-full h-48 object-cover object-center transform transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2 leading-tight">
                    <Link
                      href={`/dynamic/${
                        relProduct._id?.$oid || relProduct._id
                      }`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {relProduct.name}
                    </Link>
                  </h4>
                  <p className="text-md font-bold text-gray-800 mb-4">
                    TK. {relProduct.salePrice}
                  </p>
                  {relProduct.quantity > 0 ? (
                    <button
                      onClick={() => {
                        addToCart(
                          relProduct,
                          1, // Default quantity 1
                          // Ensure we pass the full size object if available, otherwise a default string
                          relProduct.sizes && relProduct.sizes.length > 0
                            ? relProduct.sizes[0] // Pass the full size object here
                            : { size: "One Size", quantity: 0 } // Fallback to an object for consistency
                        );
                        setIsDrawerOpen(true);
                      }}
                      className="mt-auto bg-black cursor-pointer text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button className="mt-auto bg-gray-600 cursor-not-allowed text-white px-4 py-2 rounded-md">
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- End Related Products Section --- */}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
