"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isPhone, setIsPhone] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const smallScreen = window.innerWidth <= 768;
      setIsPhone(phoneUserAgent && smallScreen);
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    function loadCartCount() {
      try {
        const cartData =
          localStorage.getItem("jittok-cart") ||
          localStorage.getItem("cart") ||
          "[]";

        const cartItems = JSON.parse(cartData);

        if (Array.isArray(cartItems)) {
          const total = cartItems.reduce((sum, item) => {
            return sum + Number(item.quantity || 1);
          }, 0);

          setCartCount(total);
        }
      } catch {
        setCartCount(0);
      }
    }

    loadCartCount();

    window.addEventListener("storage", loadCartCount);
    window.addEventListener("cart-updated", loadCartCount);

    return () => {
      window.removeEventListener("storage", loadCartCount);
      window.removeEventListener("cart-updated", loadCartCount);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          width: "100%",
          height: isPhone ? "64px" : "76px",
          background: "#ffffff",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(17,17,17,0.08)",
          display: "grid",
          gridTemplateColumns: isPhone ? "38px 1fr 76px" : "1fr auto 1fr",
          alignItems: "center",
          padding: isPhone ? "0 12px" : "0 42px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        {isPhone ? (
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={mobileIconButtonStyle}
          >
            <Menu size={21} strokeWidth={1.8} />
          </button>
        ) : (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "#111",
                  textDecoration: "none",
                  fontSize: "11.5px",
                  fontWeight: 900,
                  letterSpacing: "1.1px",
                  textTransform: "uppercase",
                  borderBottom:
                    pathname === link.href
                      ? "1px solid #111"
                      : "1px solid transparent",
                  paddingBottom: "7px",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <Link
          href="/"
          aria-label="JITTOK Home"
          style={{
            color: "#111",
            textDecoration: "none",
            textAlign: "center",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            justifySelf: "center",
          }}
        >
        <img
  src="/jittok-logo.png"
  alt="JITTOK"
  style={{
    width: isPhone ? "170px" : "240px",
    height: isPhone ? "56px" : "68px",
    objectFit: "contain",
    display: "block",
    transform: "scale(2.12)",
    transformOrigin: "center",
  }}
/>

        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: isPhone ? "2px" : "14px",
          }}
        >
          <Link href="/search" aria-label="Search" style={iconLinkStyle}>
            <Search size={isPhone ? 19 : 20} strokeWidth={1.8} />
          </Link>

          <Link href="/cart" aria-label="Cart" style={iconLinkStyle}>
            <ShoppingBag size={isPhone ? 19 : 20} strokeWidth={1.8} />

            {cartCount > 0 ? (
              <span
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  minWidth: "16px",
                  height: "16px",
                  padding: "0 5px",
                  borderRadius: "999px",
                  background: "#111",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8.5px",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </header>

      {isPhone && menuOpen ? (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17,17,17,0.48)",
            zIndex: 3000,
          }}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(86vw, 360px)",
              height: "100%",
              background: "#f6f2eb",
              color: "#111",
              padding: "22px 22px 30px",
              display: "flex",
              flexDirection: "column",
              fontFamily: '"Outfit", sans-serif',
              boxShadow: "24px 0 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "22px",
                borderBottom: "1px solid rgba(17,17,17,0.1)",
              }}
            >
              <img
                src="/jittok-logo.png"
                alt="JITTOK"
                style={{
                  width: "130px",
                  height: "44px",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid rgba(17,17,17,0.12)",
                  background: "transparent",
                  color: "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={21} strokeWidth={1.8} />
              </button>
            </div>

            <nav
              style={{
                display: "grid",
                padding: "24px 0",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: pathname === link.href ? "#77736c" : "#111",
                    textDecoration: "none",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(17,17,17,0.08)",
                    fontFamily: '"Bebas Neue", Impact, sans-serif',
                    fontSize: "46px",
                    lineHeight: 0.9,
                    fontWeight: 400,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div
              style={{
                marginTop: "auto",
                display: "grid",
                gap: "14px",
              }}
            >
              <Link
                href="/cart"
                style={{
                  height: "52px",
                  background: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                <ShoppingBag size={17} />
                View Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>

              <p
                style={{
                  margin: 0,
                  color: "#77736c",
                  fontSize: "12px",
                  lineHeight: 1.7,
                }}
              >
                Premium everyday essentials for comfort, movement, and timeless
                streetwear style.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

const iconLinkStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  border: "none",
  background: "transparent",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  position: "relative",
  textDecoration: "none",
};

const mobileIconButtonStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  border: "none",
  background: "transparent",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};