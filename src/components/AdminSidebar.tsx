"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { type CSSProperties } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Content", href: "/admin/content", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/admin");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#111111",
        color: "#f6f2eb",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div style={{ padding: "26px 22px 20px" }}>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "1.4px",
            color: "rgba(246,242,235,0.5)",
            textTransform: "uppercase",
          }}
        >
          JITTOK
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: "30px",
            lineHeight: 1,
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </h1>
      </div>

      <nav style={{ padding: "10px 14px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={getNavLinkStyle(isActive)}
            >
              <Icon size={17} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "14px",
          borderTop: "1px solid rgba(246,242,235,0.1)",
          display: "grid",
          gap: "8px",
        }}
      >
        <Link
          href="/"
          target="_blank"
          style={{
            ...getNavLinkStyle(false),
            color: "rgba(246,242,235,0.7)",
          }}
        >
          <ExternalLink size={16} strokeWidth={1.8} />
          View Site
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...getNavLinkStyle(false),
            width: "100%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "rgba(246,242,235,0.7)",
          }}
        >
          <LogOut size={16} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function getNavLinkStyle(isActive: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    height: "44px",
    padding: "0 12px",
    marginBottom: "4px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: isActive ? 800 : 600,
    letterSpacing: "0.2px",
    color: isActive ? "#111111" : "#f6f2eb",
    background: isActive ? "#f6f2eb" : "transparent",
    textDecoration: "none",
  };
}