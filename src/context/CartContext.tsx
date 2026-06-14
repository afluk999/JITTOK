"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  increaseQuantity: (slug: string, size: string) => void;
  decreaseQuantity: (slug: string, size: string) => void;
  removeFromCart: (slug: string, size: string) => void;
  clearCart: () => void;
  getWhatsAppMessage: () => string;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "jittok-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, mounted]);

  function addToCart(product: Product, size: string, quantity = 1) {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product.slug === product.slug && item.size === size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.product.slug === product.slug && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, size, quantity }];
    });
  }

  function increaseQuantity(slug: string, size: string) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.slug === slug && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(slug: string, size: string) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.slug === slug && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  function removeFromCart(slug: string, size: string) {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.slug === slug && item.size === size)
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  function getWhatsAppMessage() {
    if (cartItems.length === 0) {
      return "Hi JITTOK, I want to know more about your products.";
    }

    const productLines = cartItems
      .map((item, index) => {
        const itemTotal = item.product.price * item.quantity;

        return `${index + 1}. ${item.product.name}
Variant: ${item.product.variant}
Size: ${item.size}
Quantity: ${item.quantity}
Price: ₹${itemTotal.toLocaleString("en-IN")}.00`;
      })
      .join("\n\n");

    return `Hi JITTOK, I want to place an order.

${productLines}

Subtotal: ₹${subtotal.toLocaleString("en-IN")}.00
Shipping: ${shipping === 0 ? "Free" : `₹${shipping}.00`}
Total: ₹${total.toLocaleString("en-IN")}.00

Please confirm availability and delivery details.`;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shipping,
        total,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}