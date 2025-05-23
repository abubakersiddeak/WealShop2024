"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cartItems:", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity, size) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product._id === product._id && item.size === size
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, size }];
    });
  };

  const removeFromCart = (product, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product._id === product._id && item.size === size)
      )
    );
  };

  // ✅ MEMOIZED clearCart to avoid re-renders or loops
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
