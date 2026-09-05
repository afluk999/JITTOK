"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isPhone, setIsPhone] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/collections" },
    { label: "Store", href: "/store" },
   
  ];

  useEffect(() => {
    function checkPhone() {
      setIsPhone(window.innerWidth <= 768);
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
      <div
        style={{
          position: "fixed",
          top: "30px",
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isPhone ? "10px 10px 0" : "14px 20px 0",
          background: "transparent",
          boxSizing: "border-box",
          transform: navbarOpen ? "translateY(0)" : "translateY(-140%)",
          opacity: navbarOpen ? 1 : 0,
          pointerEvents: navbarOpen ? "auto" : "none",
          transition: "transform 320ms ease, opacity 280ms ease",
        }}
      >
        <header
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            height: isPhone ? "60px" : "55px",
            background: "rgba(255,255,255,0.32)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.65)",
            borderRadius: "999px",
            boxShadow:
              "0 10px 40px rgba(17,17,17,0.16), inset 0 1px 1px rgba(255,255,255,0.75), inset 0 -1px 1px rgba(17,17,17,0.04)",
            display: "grid",
            gridTemplateColumns: isPhone
              ? "1fr auto 1fr"
              : "auto 1fr auto",
            alignItems: "center",
            padding: isPhone ? "0 18px" : "0 34px",
            boxSizing: "border-box",
            fontFamily: '"Outfit", sans-serif',
          }}
        >
        {/* LEFT SIDE */}
        {isPhone ? (
          <div />
        ) : (
          <Link
            href="/"
            aria-label="JITTOK Home"
            style={{
              color: "#111",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifySelf: "start",
              marginLeft: "-80px",
              lineHeight: 1,
            }}
          >
            <img
              src="/jittok-logo.png"
              alt="JITTOK"
              style={{
                width: "150px",
                height: "50px",
                objectFit: "contain",
                display: "block",
                transform: "scale(2.2)",
                transformOrigin: "left center",
              }}
            />
          </Link>
        )}

        {/* CENTER: nav links on desktop, logo on mobile */}
        {isPhone ? (
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
                width: "170px",
                height: "56px",
                objectFit: "contain",
                display: "block",
                transform: "scale(2.12)",
                transformOrigin: "center",
              }}
            />
          </Link>
        ) : (
          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
              justifySelf: "center",
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
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
                    borderBottom: isActive
                      ? "1px solid #111"
                      : "1px solid transparent",
                    paddingBottom: "7px",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            justifySelf: "end",
            gap: isPhone ? "6px" : "14px",
          }}
        >
          {isPhone ? null : (
            <Link
              href="/search"
              aria-label="Search products"
              style={iconLinkStyle}
            >
              <Search size={20} strokeWidth={1.8} />
            </Link>
          )}

          {/* CART */}
          <Link
            href="/cart"
            aria-label={
              cartCount > 0
                ? `Cart with ${cartCount} items`
                : "Cart"
            }
            style={iconLinkStyle}
          >
            <ShoppingBag
              size={isPhone ? 19 : 20}
              strokeWidth={1.8}
            />

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

          {/* HAMBURGER (mobile only) */}
          {isPhone ? (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={mobileIconButtonStyle}
            >
              <Menu size={21} strokeWidth={1.8} />
            </button>
          ) : null}

          {/* CLOSE NAVBAR */}
          <button
            type="button"
            onClick={() => setNavbarOpen(false)}
            aria-label="Hide navigation bar"
            style={{
              width: isPhone ? "22px" : "24px",
              height: isPhone ? "22px" : "24px",
              borderRadius: "50%",
              border: "1px solid rgba(17,17,17,0.15)",
              background: "transparent",
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              opacity: 0.6,
            }}
          >
            <X size={isPhone ? 12 : 13} strokeWidth={2} />
          </button>
        </div>
        </header>
      </div>

      {/* REOPEN NAVBAR */}
      {!navbarOpen ? (
        <button
          type="button"
          onClick={() => setNavbarOpen(true)}
          aria-label="Show navigation bar"
          style={{
            position: "fixed",
            top: "44px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "1px solid rgba(17,17,17,0.15)",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(17,17,17,0.14)",
          }}
        >
          <Menu size={16} strokeWidth={2} />
        </button>
      ) : null}

      {/* MOBILE MENU */}
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
            {/* MOBILE MENU HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "22px",
                borderBottom:
                  "1px solid rgba(17,17,17,0.1)",
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
                  border:
                    "1px solid rgba(17,17,17,0.12)",
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

            {/* MOBILE NAVIGATION */}
            <nav
              aria-label="Mobile navigation"
              style={{
                display: "grid",
                padding: "24px 0",
              }}
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: isActive
                        ? "#77736c"
                        : "#111",
                      textDecoration: "none",
                      padding: "18px 0",
                      borderBottom:
                        "1px solid rgba(17,17,17,0.08)",
                      fontFamily:
                        '"Bebas Neue", Impact, sans-serif',
                      fontSize: "46px",
                      lineHeight: 0.9,
                      fontWeight: 400,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* MOBILE CART */}
            <div
              style={{
                marginTop: "auto",
                display: "grid",
                gap: "14px",
              }}
            >
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
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
                View Cart
                {cartCount > 0
                  ? ` (${cartCount})`
                  : ""}
              </Link>

              <p
                style={{
                  margin: 0,
                  color: "#77736c",
                  fontSize: "12px",
                  lineHeight: 1.7,
                }}
              >
                Premium everyday essentials for comfort,
                movement, and timeless streetwear style.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

const iconLinkStyle: CSSProperties = {
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

const mobileIconButtonStyle: CSSProperties = {
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