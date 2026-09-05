"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrders, type Order, type OrderStatus } from "@/lib/orderService";
import {
  LogOut,
  Package,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const statusColors: Record<OrderStatus, CSSProperties> = {
  new: { background: "#eee5cc", color: "#6c5519" },
  confirmed: { background: "#d9e8f5", color: "#1c4f78" },
  processing: { background: "#e3d9f5", color: "#4a2c78" },
  shipped: { background: "#d3e6f0", color: "#1a5a78" },
  delivered: { background: "#dfe9dd", color: "#31512c" },
  cancelled: { background: "#ead9d7", color: "#7b2820" },
  returned: { background: "#f0d9d3", color: "#7b3520" },
};

// Orders in these statuses count toward revenue.
// Cancelled/returned orders are excluded.
const REVENUE_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getOrderDate(value: unknown): Date | null {
  if (!value || typeof value !== "object") return null;

  const maybeTimestamp = value as { toDate?: () => Date };

  if (typeof maybeTimestamp.toDate === "function") {
    return maybeTimestamp.toDate();
  }

  return null;
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isWithinDays(date: Date, days: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin");
        return;
      }

      setCheckingAuth(false);
      await loadOrders();
    });

    return () => unsubscribe();
  }, [router]);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (loadError) {
      console.error("LOAD DASHBOARD DATA ERROR:", loadError);
      setError("Dashboard data could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/admin");
    } catch (logoutError) {
      console.error("LOGOUT ERROR:", logoutError);
      alert("Logout failed. Please try again.");
    }
  }

  const stats = useMemo(() => {
    const revenueOrders = orders.filter((order) =>
      REVENUE_STATUSES.includes(order.status),
    );

    const totalRevenue = revenueOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );

    const today = new Date();

    const ordersToday = orders.filter((order) => {
      const orderDate = getOrderDate(order.createdAt);
      return orderDate ? isSameDay(orderDate, today) : false;
    }).length;

    const ordersThisWeek = orders.filter((order) => {
      const orderDate = getOrderDate(order.createdAt);
      return orderDate ? isWithinDays(orderDate, 7) : false;
    }).length;

    const averageOrderValue =
      revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0;

    const statusCounts: Record<OrderStatus, number> = {
      new: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };

    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const productTotals = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productTotals.get(item.slug) || {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };

        existing.quantity += item.quantity;
        existing.revenue += item.lineTotal;
        productTotals.set(item.slug, existing);
      });
    });

    const topProducts = Array.from(productTotals.values())
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      totalRevenue,
      ordersToday,
      ordersThisWeek,
      averageOrderValue,
      statusCounts,
      topProducts,
    };
  }, [orders]);

  if (checkingAuth) {
    return <main style={loadingStyle}>Checking admin access...</main>;
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "34px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>JITTOK Admin</p>
            <h1 style={titleStyle}>Dashboard</h1>
          </div>

          <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/admin/products" style={outlineButtonStyle}>
              Products
            </Link>

            <Link href="/admin/orders" style={outlineButtonStyle}>
              Orders
            </Link>

            <Link href="/admin/content" style={outlineButtonStyle}>
              Content
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={outlineButtonStyle}
            >
              <LogOut size={15} />
              Logout
            </button>
          </nav>
        </header>

        {error ? (
          <section style={emptyBoxStyle}>
            <p style={{ margin: "0 0 16px", color: "#8f1d1d" }}>{error}</p>
            <button
              type="button"
              onClick={loadOrders}
              style={outlineButtonStyle}
            >
              Try Again
            </button>
          </section>
        ) : loading ? (
          <section style={emptyBoxStyle}>Loading dashboard...</section>
        ) : orders.length === 0 ? (
          <section style={emptyBoxStyle}>
            <Package size={36} strokeWidth={1.4} />
            <p style={{ marginTop: "14px" }}>
              No orders yet. Stats will appear here once customers start
              checking out.
            </p>
          </section>
        ) : (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
                marginBottom: "26px",
              }}
            >
              <StatCard
                icon={<Receipt size={20} />}
                label="Total Orders"
                value={String(stats.totalOrders)}
                sub={`${stats.ordersToday} today · ${stats.ordersThisWeek} this week`}
              />

              <StatCard
                icon={<Wallet size={20} />}
                label="Total Revenue"
                value={formatPrice(stats.totalRevenue)}
                sub="Excludes cancelled & returned"
              />

              <StatCard
                icon={<TrendingUp size={20} />}
                label="Average Order Value"
                value={formatPrice(Math.round(stats.averageOrderValue))}
                sub="Per completed order"
              />

              <StatCard
                icon={<Package size={20} />}
                label="New Orders"
                value={String(stats.statusCounts.new)}
                sub="Need confirmation"
              />
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
              className="dashboardTwoCol"
            >
              <div style={panelStyle}>
                <h2 style={panelTitleStyle}>Orders by Status</h2>

                <div style={{ display: "grid", gap: "8px" }}>
                  {(Object.keys(statusLabels) as OrderStatus[]).map(
                    (status) => (
                      <div
                        key={status}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: "#ffffff",
                          border: "1px solid #e5ded4",
                        }}
                      >
                        <span
                          style={{
                            minHeight: "24px",
                            padding: "0 9px",
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: "10px",
                            fontWeight: 900,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            ...statusColors[status],
                          }}
                        >
                          {statusLabels[status]}
                        </span>

                        <strong style={{ fontSize: "14px" }}>
                          {stats.statusCounts[status]}
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div style={panelStyle}>
                <h2 style={panelTitleStyle}>Top Products</h2>

                {stats.topProducts.length === 0 ? (
                  <p style={{ color: "#77736c", fontSize: "13px" }}>
                    No product sales yet.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: "8px" }}>
                    {stats.topProducts.map((product, index) => (
                      <div
                        key={product.name + index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: "#ffffff",
                          border: "1px solid #e5ded4",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 700 }}>
                          {index + 1}. {product.name}
                        </span>

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#77736c",
                            fontWeight: 700,
                          }}
                        >
                          {product.quantity} sold ·{" "}
                          {formatPrice(product.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .dashboardTwoCol {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      style={{
        background: "#111",
        color: "#f6f2eb",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            color: "rgba(246,242,235,0.65)",
          }}
        >
          {label}
        </span>

        <span style={{ color: "rgba(246,242,235,0.5)" }}>{icon}</span>
      </div>

      <strong
        style={{
          display: "block",
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: "34px",
          lineHeight: 1,
          fontWeight: 400,
          marginBottom: "8px",
        }}
      >
        {value}
      </strong>

      <span style={{ fontSize: "11px", color: "rgba(246,242,235,0.55)" }}>
        {sub}
      </span>
    </div>
  );
}

const loadingStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#111",
  color: "#f6f2eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: '"Outfit", sans-serif',
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f6f2eb",
  color: "#111",
  padding: "42px",
  fontFamily: '"Outfit", sans-serif',
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 10px",
  color: "#77736c",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: '"Bebas Neue", Impact, sans-serif',
  fontSize: "60px",
  lineHeight: 0.9,
  fontWeight: 400,
  textTransform: "uppercase",
};

const outlineButtonStyle: CSSProperties = {
  height: "42px",
  padding: "0 16px",
  border: "1px solid #d4ccc1",
  background: "transparent",
  color: "#111",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  padding: "20px",
};

const panelTitleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "13px",
  fontWeight: 900,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
};

const emptyBoxStyle: CSSProperties = {
  minHeight: "260px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#77736c",
  border: "1px dashed #d4ccc1",
  fontSize: "13px",
  textAlign: "center",
  padding: "30px",
};