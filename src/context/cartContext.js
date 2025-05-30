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
        { product, quantity, size: selectedSize, isSelected: true },
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

  // --- RE-ADDED getSelectedTotal FUNCTION ---
  const getSelectedTotal = () => {
    return Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) =>
            item.isSelected
              ? total + item.product.salePrice * item.quantity
              : total,
          0
        )
      : 0;
  };
  // --- END RE-ADDED FUNCTION ---

  const clearCheckedOutItems = (checkedOutItems) => {
    setCartItems((currentCartItems) => {
      const checkedOutItemIds = new Set(
        checkedOutItems.map((item) => `${item.product._id}-${item.size}`)
      );

      const updatedCart = currentCartItems.filter((item) => {
        return !checkedOutItemIds.has(`${item.product._id}-${item.size}`);
      });

      return updatedCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        toggleSelectAll,
        getSelectedTotal, // <--- IMPORTANT: This MUST be included here!
        clearCheckedOutItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
