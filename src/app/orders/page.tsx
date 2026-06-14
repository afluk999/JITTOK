import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, ArrowRight, Truck, CheckCircle } from "lucide-react";

const sampleOrders = [
  {
    id: "JTK-1024",
    date: "10 June 2026",
    status: "Processing",
    total: "₹3,798.00",
    items: "Oversized Tee, Signature Hoodie",
  },
  {
    id: "JTK-1018",
    date: "04 June 2026",
    status: "Delivered",
    total: "₹1,299.00",
    items: "Premium Tee",
  },
];

export default function OrdersPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f6f2eb",
          padding: "150px 54px 90px",
          fontFamily: '"Outfit", sans-serif',
          color: "#111",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <section
            style={{
              marginBottom: "54px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "40px",
              alignItems: "end",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 14px",
                  color: "#77736c",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "1.3px",
                  textTransform: "uppercase",
                }}
              >
                01 / Orders
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: "clamp(78px, 8vw, 128px)",
                  lineHeight: 0.84,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Track Orders
              </h1>
            </div>

            <p
              style={{
                margin: "0 0 10px",
                maxWidth: "360px",
                color: "#4d4943",
                fontSize: "14px",
                lineHeight: 1.65,
              }}
            >
              Check your order status using your order number or login to view
              recent purchases.
            </p>
          </section>

          {/* TRACK ORDER BOX */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              gap: "34px",
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "#111",
                color: "#f6f2eb",
                padding: "42px",
                minHeight: "500px",
              }}
            >
              <Package size={38} strokeWidth={1.4} />

              <h2
                style={{
                  margin: "28px 0 18px",
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: "60px",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Find Your Order
              </h2>

              <p
                style={{
                  margin: "0 0 34px",
                  color: "rgba(246,242,235,0.68)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  maxWidth: "360px",
                }}
              >
                Enter your order ID to check current status. Backend tracking
                will be connected later.
              </p>

              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid rgba(246,242,235,0.32)",
                  paddingBottom: "12px",
                  marginBottom: "28px",
                }}
              >
                <input
                  placeholder="Order ID, e.g. JTK-1024"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#f6f2eb",
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "15px",
                  }}
                />

                <Search size={19} strokeWidth={1.7} />
              </div>

              <button
                type="button"
                style={{
                  height: "54px",
                  padding: "0 26px",
                  border: "none",
                  background: "#f6f2eb",
                  color: "#111",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Track Order <ArrowRight size={16} />
              </button>
            </div>

            {/* RECENT ORDERS */}
            <div
              style={{
                background: "#f2eee7",
                border: "1px solid #e5ded4",
                padding: "42px",
                minHeight: "500px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 28px",
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: "58px",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Recent Orders
              </h2>

              <div style={{ display: "grid", gap: "16px" }}>
                {sampleOrders.map((order) => (
                  <article
                    key={order.id}
                    style={{
                      background: "#f6f2eb",
                      border: "1px solid #ddd5ca",
                      padding: "22px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                        marginBottom: "18px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 8px",
                            fontSize: "13px",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          Order {order.id}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color: "#77736c",
                            fontSize: "13px",
                          }}
                        >
                          {order.date}
                        </p>
                      </div>

                      <StatusBadge status={order.status} />
                    </div>

                    <p
                      style={{
                        margin: "0 0 10px",
                        color: "#4d4943",
                        fontSize: "14px",
                      }}
                    >
                      {order.items}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <strong style={{ fontSize: "15px" }}>{order.total}</strong>

                      <Link
                        href="/contact"
                        style={{
                          color: "#111",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "12px",
                          fontWeight: 900,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        Need Help <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isDelivered = status === "Delivered";

  return (
    <span
      style={{
        height: "34px",
        padding: "0 14px",
        borderRadius: "999px",
        background: isDelivered ? "#e3eee3" : "#efe5d2",
        color: isDelivered ? "#2f6b36" : "#8a5d18",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontWeight: 900,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
      }}
    >
      {isDelivered ? <CheckCircle size={14} /> : <Truck size={14} />}
      {status}
    </span>
  );
}