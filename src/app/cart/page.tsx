"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getHomeContent } from "@/lib/contentService";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    shipping,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getWhatsAppMessage,
  } = useCart();

  const [whatsappNumber, setWhatsappNumber] = useState("919605300701");
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const smallScreen = window.innerWidth <= 768;
      const touchLikeDevice =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsPhone(smallScreen && (phoneUserAgent || touchLikeDevice));
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const content = await getHomeContent();
        setWhatsappNumber(content.whatsappNumber || "919605300701");
      } catch (error) {
        console.error("LOAD CART SETTINGS ERROR:", error);
      }
    }

    loadSettings();
  }, []);

  const cleanWhatsappNumber = whatsappNumber.replace(/^\+/, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    getWhatsAppMessage()
  )}`;

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f6f2eb",
          color: "#111",
          fontFamily: '"Outfit", sans-serif',
          padding: isPhone ? "96px 16px 64px" : "140px 42px 90px",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <Link
            href="/collections"
            style={{
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
            }}
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>

          <header
            style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
              gap: isPhone ? "18px" : "34px",
              alignItems: "end",
              marginBottom: isPhone ? "32px" : "44px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  color: "#77736c",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                JITTOK Cart
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: isPhone ? "72px" : "clamp(82px, 9vw, 146px)",
                  lineHeight: 0.82,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Your Cart
              </h1>
            </div>

            {cartItems.length > 0 ? (
              <button
                onClick={clearCart}
                style={{
                  height: "44px",
                  padding: "0 18px",
                  border: "1px solid #d4ccc1",
                  background: "transparent",
                  color: "#111",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  width: isPhone ? "fit-content" : "auto",
                }}
              >
                Clear Cart
              </button>
            ) : null}
          </header>

          {cartItems.length === 0 ? (
            <section
              style={{
                minHeight: "420px",
                background: "#f2eee7",
                border: "1px solid #e5ded4",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px",
              }}
            >
              <ShoppingBag size={42} strokeWidth={1.4} />

              <h2
                style={{
                  margin: "20px 0 12px",
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: isPhone ? "48px" : "58px",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Cart is Empty
              </h2>

              <p
                style={{
                  margin: "0 0 28px",
                  color: "#4d4943",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Add your favorite JITTOK products and order through WhatsApp.
              </p>

              <Link
                href="/collections"
                style={{
                  height: "52px",
                  padding: "0 24px",
                  background: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Shop Products
              </Link>
            </section>
          ) : (
            <section
              style={{
                display: "grid",
                gridTemplateColumns: isPhone ? "1fr" : "1fr 380px",
                gap: isPhone ? "22px" : "28px",
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: "14px" }}>
                {cartItems.map((item) => {
                  const image = item.product.images?.[0];

                  return (
                    <article
                      key={`${item.product.slug}-${item.size}`}
                      style={{
                        background: "#f2eee7",
                        border: "1px solid #e5ded4",
                        display: "grid",
                        gridTemplateColumns: isPhone ? "96px 1fr" : "118px 1fr auto",
                        gap: isPhone ? "14px" : "22px",
                        alignItems: "center",
                        padding: isPhone ? "12px" : "14px",
                      }}
                    >
                      <Link
                        href={`/product/${item.product.slug}`}
                        style={{
                          width: isPhone ? "96px" : "118px",
                          height: isPhone ? "124px" : "148px",
                          background: "#e6dfd3",
                          overflow: "hidden",
                          display: "block",
                        }}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={item.product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : null}
                      </Link>

                      <div>
                        <h2
                          style={{
                            margin: "0 0 8px",
                            fontFamily: '"Bebas Neue", Impact, sans-serif',
                            fontSize: isPhone ? "32px" : "42px",
                            lineHeight: 0.9,
                            fontWeight: 400,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.product.name}
                        </h2>

                        <p
                          style={{
                            margin: "0 0 10px",
                            color: "#77736c",
                            fontSize: "11px",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.product.variant} / Size {item.size}
                        </p>

                        <p
                          style={{
                            margin: "0 0 14px",
                            fontSize: "14px",
                            fontWeight: 900,
                          }}
                        >
                          ₹
                          {(item.product.price * item.quantity).toLocaleString(
                            "en-IN"
                          )}
                          .00
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <button
                            onClick={() =>
                              decreaseQuantity(item.product.slug, item.size)
                            }
                            style={qtyButtonStyle}
                          >
                            <Minus size={14} />
                          </button>

                          <span
                            style={{
                              minWidth: "24px",
                              textAlign: "center",
                              fontWeight: 900,
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.product.slug, item.size)
                            }
                            style={qtyButtonStyle}
                          >
                            <Plus size={14} />
                          </button>

                          <button
                            onClick={() =>
                              removeFromCart(item.product.slug, item.size)
                            }
                            style={{
                              ...qtyButtonStyle,
                              marginLeft: "8px",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside
                style={{
                  background: "#111",
                  color: "#f6f2eb",
                  padding: isPhone ? "28px 22px" : "34px",
                  position: isPhone ? "relative" : "sticky",
                  top: isPhone ? "auto" : "110px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 28px",
                    fontFamily: '"Bebas Neue", Impact, sans-serif',
                    fontSize: "54px",
                    lineHeight: 0.9,
                    fontWeight: 400,
                    textTransform: "uppercase",
                  }}
                >
                  Order Summary
                </h2>

                <SummaryRow
                  label="Subtotal"
                  value={`₹${subtotal.toLocaleString("en-IN")}.00`}
                />

                <SummaryRow
                  label="Shipping"
                  value={shipping === 0 ? "Free" : `₹${shipping}.00`}
                />

                <div
                  style={{
                    height: "1px",
                    background: "rgba(246,242,235,0.16)",
                    margin: "22px 0",
                  }}
                />

                <SummaryRow
                  label="Total"
                  value={`₹${total.toLocaleString("en-IN")}.00`}
                  big
                />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    height: "56px",
                    marginTop: "28px",
                    background: "#25D366",
                    color: "#111",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  <FaWhatsapp size={18} />
                  Order on WhatsApp
                </a>
              </aside>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function SummaryRow({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "24px",
        marginBottom: "16px",
        fontSize: big ? "18px" : "14px",
        fontWeight: big ? 900 : 700,
      }}
    >
      <span style={{ color: big ? "#f6f2eb" : "rgba(246,242,235,0.68)" }}>
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

const qtyButtonStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #d4ccc1",
  background: "transparent",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};