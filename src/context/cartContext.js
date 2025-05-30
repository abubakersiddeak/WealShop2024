// context/cartContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product, quantity, selectedSize) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product._id === product._id && item.size === selectedSize
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
      toast.success(`${quantity} more added to cart!`);
    } else {
      setCartItems([
        ...cartItems,
        { product, quantity, size: selectedSize, isSelected: true }, // Ensure new items are selected by default
      ]);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const removeFromCart = (product, size) => {
    setCartItems((currentCartItems) => {
      const updatedCart = currentCartItems.filter(
        (item) => !(item.product._id === product._id && item.size === size)
      );
      return updatedCart;
    });
  };

  const updateQuantity = (product, size, newQuantity) => {
    setCartItems((currentCartItems) => {
      return currentCartItems.map((item) => {
        if (item.product._id === product._id && item.size === size) {
          const quantityToSet = Math.max(1, newQuantity);
          return { ...item, quantity: quantityToSet };
        }
        return item;
      });
    });
  };

  const toggleItemSelection = (product, size) => {
    setCartItems((currentCartItems) => {
      return currentCartItems.map((item) => {
        if (item.product._id === product._id && item.size === size) {
          return { ...item, isSelected: !item.isSelected };
        }
        return item;
      });
    });
  };

  const toggleSelectAll = (select) => {
    setCartItems((currentCartItems) => {
      return currentCartItems.map((item) => ({
        ...item,
        isSelected: select,
      }));
    });
  };

  // --- MODIFIED clearCart FUNCTION ---
  // Now accepts an array of items that were successfully checked out.
  // It removes these specific items from the cart.
  const clearCheckedOutItems = (checkedOutItems) => {
    setCartItems((currentCartItems) => {
      // Create a Set of unique identifiers for the items that were checked out
      // Using a combination of product ID and size to uniquely identify items
      const checkedOutItemIds = new Set(
        checkedOutItems.map((item) => `${item.product._id}-${item.size}`)
      );

      // Filter out items from the current cart that are present in the checkedOutItemIds set
      const updatedCart = currentCartItems.filter((item) => {
        return !checkedOutItemIds.has(`${item.product._id}-${item.size}`);
      });

      return updatedCart;
    });
  };
  // --- END MODIFIED FUNCTION ---

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        toggleSelectAll,
        // Expose the new function
        clearCheckedOutItems, // <--- IMPORTANT: Use this new function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
