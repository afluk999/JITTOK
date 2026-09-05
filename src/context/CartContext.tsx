"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type FirebaseProduct,
  getProductSellingPrice,
} from "@/lib/productService";

export type CartItem = {
  product: FirebaseProduct;
  size: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addToCart: (product: FirebaseProduct, size: string, quantity?: number) => void;
  increaseQuantity: (productId: string, size: string) => void;
  decreaseQuantity: (productId: string, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  getWhatsAppMessage: () => string;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "jittok-cart";

export function getProductId(product: FirebaseProduct): string {
  // Firebase products use `id`, but fall back to slug just in case
  // an item was saved before `id` was consistently present.
  return product.id ?? product.slug;
}

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

    // Keeps the Navbar cart badge in sync across the app.
    window.dispatchEvent(new Event("cart-updated"));
  }, [cartItems, mounted]);

  function addToCart(product: FirebaseProduct, size: string, quantity = 1) {
    const productId = getProductId(product);

    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => getProductId(item.product) === productId && item.size === size
      );

      if (existingItem) {
        return prev.map((item) =>
          getProductId(item.product) === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, size, quantity }];
    });
  }

  function increaseQuantity(productId: string, size: string) {
    setCartItems((prev) =>
      prev.map((item) =>
        getProductId(item.product) === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId: string, size: string) {
    setCartItems((prev) =>
      prev.map((item) =>
        getProductId(item.product) === productId && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  function removeFromCart(productId: string, size: string) {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(getProductId(item.product) === productId && item.size === size)
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
      (total, item) =>
        total + getProductSellingPrice(item.product) * item.quantity,
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
        const unitPrice = getProductSellingPrice(item.product);
        const itemTotal = unitPrice * item.quantity;

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