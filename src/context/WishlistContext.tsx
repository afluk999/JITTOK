"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WishlistContextType = {
  wishlistIds: string[];
  wishlistCount: number;
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "jittok-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEY);
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }
    } catch {
      setWishlistIds([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds, mounted]);

  function toggle(productId: string) {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  function isWishlisted(productId: string) {
    return wishlistIds.includes(productId);
  }

  const wishlistCount = useMemo(() => wishlistIds.length, [wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, wishlistCount, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}