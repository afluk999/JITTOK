"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getOrders,
  updateOrder,
  type Order,
  type OrderStatus,
} from "@/lib/orderService";
import {
  ArrowLeft,
  LogOut,
  Package,
  Save,
  Search,
} from "lucide-react";

type StatusFilter = "all" | OrderStatus;

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

const statusFilterOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Orders" },
  ...statusOptions,
];

const statusColors: Record<OrderStatus, CSSProperties> = {
  new: { background: "#eee5cc", color: "#6c5519" },
  confirmed: { background: "#d9e8f5", color: "#1c4f78" },
  processing: { background: "#e3d9f5", color: "#4a2c78" },
  shipped: { background: "#d3e6f0", color: "#1a5a78" },
  delivered: { background: "#dfe9dd", color: "#31512c" },
  cancelled: { background: "#ead9d7", color: "#7b2820" },
  returned: { background: "#f0d9d3", color: "#7b3520" },
};

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}.00`;
}

function formatDate(value: unknown) {
  if (!value || typeof value !== "object") return "—";

  const maybeTimestamp = value as { toDate?: () => Date };

  if (typeof maybeTimestamp.toDate === "function") {
    return maybeTimestamp.toDate().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "—";
}

function OrderRow({
  order,
  onSaved,
}: {
  order: Order;
  onSaved: (updated: Order) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [customerName, setCustomerName] = useState(order.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(
    order.customerPhone || "",
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    order.deliveryAddress || "",
  );
  const [pincode, setPincode] = useState(order.pincode || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!order.id) return;

    try {
      setSaving(true);

      await updateOrder(order.id, {
        status,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        pincode: pincode.trim(),
      });

      onSaved({
        ...order,
        status,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        pincode: pincode.trim(),
      });

      alert("Order updated successfully.");
    } catch (error) {
      console.error("UPDATE ORDER ERROR:", error);
      alert("Failed to update this order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article
      style={{
        background: "#f2eee7",
        border: "1px solid #e5ded4",
        padding: "16px",
      }}
    >
      <div
        onClick={() => setExpanded((value) => !value)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.5px",
            }}
          >
            {order.orderReference}
          </p>

          <p style={{ margin: 0, fontSize: "12px", color: "#77736c" }}>
            {formatDate(order.createdAt)} · {order.items.length} item
            {order.items.length === 1 ? "" : "s"} · {order.source}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              minHeight: "26px",
              padding: "0 10px",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              ...statusColors[order.status],
            }}
          >
            {order.status}
          </span>

          <strong style={{ fontSize: "14px" }}>
            {formatPrice(order.total)}
          </strong>
        </div>
      </div>

      {expanded ? (
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #ddd5ca",
            display: "grid",
            gap: "14px",
          }}
        >
          <div style={{ display: "grid", gap: "6px" }}>
            {order.items.map((item, index) => (
              <p key={index} style={{ margin: 0, fontSize: "13px" }}>
                {item.productName} — {item.variant || "Standard"} / Size{" "}
                {item.size} × {item.quantity} —{" "}
                {formatPrice(item.lineTotal)}
              </p>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>Customer Name</label>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                style={inputStyle}
                placeholder="From WhatsApp chat"
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                style={inputStyle}
                placeholder="From WhatsApp chat"
              />
            </div>

            <div>
              <label style={labelStyle}>Pincode</label>
              <input
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                style={inputStyle}
                placeholder="From WhatsApp chat"
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as OrderStatus)
                }
                style={inputStyle}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              style={{ ...inputStyle, height: "70px", paddingTop: "10px" }}
              placeholder="From WhatsApp chat"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={saveButtonStyle}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin");
        return;
      }

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
      console.error("LOAD ORDERS ERROR:", loadError);
      setError("Orders could not be loaded. Please try again.");
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

  function handleOrderSaved(updated: Order) {
    setOrders((previous) =>
      previous.map((order) => (order.id === updated.id ? updated : order)),
    );
  }

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const searchableText = [
        order.orderReference,
        order.customerName,
        order.customerPhone,
        ...order.items.map((item) => item.productName),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Link href="/admin/products" style={backLinkStyle}>
          <ArrowLeft size={15} />
          Back to Products
        </Link>

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>JITTOK Admin</p>
            <h1 style={titleStyle}>Orders</h1>
          </div>

          <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/admin/dashboard" style={outlineButtonStyle}>
              Dashboard
            </Link>

            <button type="button" onClick={handleLogout} style={outlineButtonStyle}>
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 200px",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={17}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#77736c",
              }}
            />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search order ID, customer name, phone, product..."
              style={{ ...inputStyle, paddingLeft: "44px" }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            style={inputStyle}
          >
            {statusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        {error ? (
          <section style={emptyBoxStyle}>
            <p style={{ margin: "0 0 16px", color: "#8f1d1d" }}>{error}</p>
            <button type="button" onClick={loadOrders} style={outlineButtonStyle}>
              Try Again
            </button>
          </section>
        ) : loading ? (
          <section style={emptyBoxStyle}>Loading orders...</section>
        ) : filteredOrders.length === 0 ? (
          <section style={emptyBoxStyle}>
            <Package size={36} strokeWidth={1.4} />
            <p style={{ marginTop: "14px" }}>
              {orders.length === 0
                ? "No orders yet. Orders will appear here once customers check out."
                : "No orders match your search or filter."}
            </p>
          </section>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onSaved={handleOrderSaved}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f6f2eb",
  color: "#111",
  padding: "42px",
  fontFamily: '"Outfit", sans-serif',
};

const backLinkStyle: CSSProperties = {
  color: "#77736c",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginBottom: "32px",
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
  height: "46px",
  padding: "0 18px",
  border: "1px solid #d4ccc1",
  background: "transparent",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: "48px",
  border: "1px solid #d8d0c4",
  background: "#f2eee7",
  outline: "none",
  padding: "0 15px",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "13px",
  color: "#111",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "#77736c",
};

const saveButtonStyle: CSSProperties = {
  height: "44px",
  padding: "0 20px",
  border: "none",
  background: "#111",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  cursor: "pointer",
  width: "fit-content",
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