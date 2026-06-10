"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const leftLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/#iconic-products" },
    { label: "Contact", href: "/contact" },
    { label: "Orders", href: "/orders" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "82px",
        zIndex: 999,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "0 42px",
        background: "rgba(246, 242, 235, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(30, 25, 20, 0.08)",
        boxShadow: "0 14px 45px rgba(40, 30, 20, 0.06)",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* LEFT LINKS */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
          justifySelf: "start",
        }}
      >
        {leftLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              color: "#111",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* CENTER LOGO */}
      <Link
        href="/"
        style={{
          color: "#111",
          textDecoration: "none",
          justifySelf: "center",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        <div
          style={{
            fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
            fontSize: "25px",
            letterSpacing: "4px",
            lineHeight: 0.85,
          }}
        >
          JITTOK
          <sup
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "7px",
              marginLeft: "3px",
              position: "relative",
              top: "-10px",
            }}
          >
            ®
          </sup>
        </div>

        <div
          style={{
            marginTop: "4px",
            fontSize: "8px",
            fontWeight: 800,
            letterSpacing: "1.7px",
            textTransform: "uppercase",
          }}
        >
          Essentials
        </div>
      </Link>

      {/* RIGHT ICONS */}
      <div
        style={{
          justifySelf: "end",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          color: "#111",
        }}
      >
        <button
          aria-label="Search"
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            color: "#111",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search size={21} strokeWidth={1.7} />
        </button>

        <Link
          href="/account"
          aria-label="Account"
          style={{
            color: "#111",
            display: "flex",
            alignItems: "center",
          }}
        >
          <User size={20} strokeWidth={1.7} />
        </Link>

        <Link
          href="/cart"
          aria-label="Cart"
          style={{
            color: "#111",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <ShoppingBag size={21} strokeWidth={1.7} />

          <span
            style={{
              position: "absolute",
              top: "-10px",
              right: "-11px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#111",
              color: "#fff",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            0
          </span>
        </Link>
      </div>
    </header>
  );
}