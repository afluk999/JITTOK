"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FirebaseProduct,
  getProductBySlugFromFirebase,
} from "@/lib/productService";
import { getHomeContent } from "@/lib/contentService";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, ArrowRight, Heart, Plus, Minus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<FirebaseProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [openInfo, setOpenInfo] = useState<string | null>(null);

  const [isPhone, setIsPhone] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("910000000000");

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
    async function loadProduct() {
      try {
        const data = await getProductBySlugFromFirebase(slug);
        setProduct(data);

        if (data?.sizes?.[0]) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("LOAD PRODUCT ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const content = await getHomeContent();
        setWhatsappNumber(content.whatsappNumber || "910000000000");
      } catch (error) {
        console.error("LOAD WHATSAPP NUMBER ERROR:", error);
      }
    }

    loadSiteSettings();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main
          style={{
            minHeight: "100vh",
            background: "#f8f4ec",
            padding: isPhone ? "110px 18px" : "160px 42px",
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          Loading product...
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <main
          style={{
            minHeight: "100vh",
            background: "#f8f4ec",
            padding: isPhone ? "110px 18px" : "160px 42px",
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          <h1>Product not found</h1>
          <Link href="/collections">Back to collections</Link>
        </main>

        <Footer />
      </>
    );
  }

  const size = selectedSize || product.sizes?.[0] || "Free Size";

  const images =
    product.images && product.images.length > 0
      ? product.images.slice(0, 5)
      : [];

  function handleAddToCart() {
    addToCart(product as any, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const cleanWhatsappNumber = whatsappNumber.replace(/^\+/, "");

  const directWhatsAppMessage = `Hi JITTOK, I want to order this product.

Product: ${product.name}
Variant: ${product.variant}
Size: ${size}
Price: ${product.displayPrice}

Please confirm availability and delivery details.`;

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    directWhatsAppMessage
  )}`;

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f8f4ec",
          padding: isPhone ? "92px 16px 44px" : "118px 42px 52px",
          fontFamily: '"Outfit", sans-serif',
          color: "#111",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div
            style={{
              height: isPhone ? "48px" : "54px",
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr auto" : "1fr auto 1fr",
              alignItems: "center",
              borderBottom: "1px solid rgba(17,17,17,0.08)",
              marginBottom: isPhone ? "18px" : "22px",
              color: "#8a857d",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <span>{isPhone ? "Product" : "01 / Interactive Showcase"}</span>

            {!isPhone ? <span /> : null}

            <Link
              href="/collections"
              style={{
                justifySelf: "end",
                color: "#111",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <section
            style={{
              minHeight: isPhone ? "auto" : "650px",
              display: "grid",
              gridTemplateColumns: isPhone
                ? "1fr"
                : "200px minmax(0, 1fr) 420px",
              background: "#f1ede6",
              border: "1px solid rgba(17,17,17,0.06)",
              borderRadius: isPhone ? "16px" : "18px",
              overflow: "hidden",
            }}
          >
            {/* PHONE MAIN IMAGE */}
            {isPhone ? (
              <div
                style={{
                  position: "relative",
                  background: "#ebe7df",
                  height: "480px",
                  overflow: "hidden",
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[activeImage] || images[0]}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                ) : (
                  <ImagePlaceholder text="Main Product Image" />
                )}

                <button
                  onClick={() => setLiked(!liked)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "16px",
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.72)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Heart
                    size={19}
                    fill={liked ? "#111" : "none"}
                    strokeWidth={1.6}
                  />
                </button>

                <div
                  style={{
                    position: "absolute",
                    left: "18px",
                    bottom: "18px",
                    color: "rgba(255,255,255,0.94)",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textShadow: "0 4px 18px rgba(0,0,0,0.28)",
                  }}
                >
                  {String(activeImage + 1).padStart(2, "0")}
                  <br />
                  {product.name}
                  <br />
                  <span style={{ opacity: 0.7 }}>{product.variant}</span>
                </div>
              </div>
            ) : null}

            {/* LEFT THUMBNAILS */}
            <aside
              style={{
                padding: isPhone ? "14px 14px 0" : "32px 22px",
                borderRight: isPhone ? "none" : "1px solid rgba(17,17,17,0.06)",
                borderBottom: isPhone ? "1px solid rgba(17,17,17,0.06)" : "none",
                display: isPhone ? "flex" : "grid",
                gap: isPhone ? "10px" : "13px",
                alignContent: "start",
                overflowX: isPhone ? "auto" : "visible",
                order: isPhone ? 2 : undefined,
              }}
            >
              {images.length === 0 ? (
                <ThumbnailPlaceholder index={0} active isPhone={isPhone} />
              ) : (
                images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setActiveImage(index)}
                    style={{
                      display: isPhone ? "block" : "grid",
                      gridTemplateColumns: isPhone ? undefined : "28px 1fr",
                      alignItems: "center",
                      gap: "12px",
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      flex: isPhone ? "0 0 74px" : undefined,
                    }}
                  >
                    {!isPhone ? (
                      <span
                        style={{
                          color: activeImage === index ? "#111" : "#9d978f",
                          fontSize: "12px",
                          fontWeight: 800,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    ) : null}

                    <div
                      style={{
                        height: isPhone ? "88px" : "94px",
                        background: "#e8e1d7",
                        overflow: "hidden",
                        borderRadius: "7px",
                        border:
                          activeImage === index
                            ? "1px solid #111"
                            : "1px solid rgba(17,17,17,0.06)",
                      }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </button>
                ))
              )}
            </aside>

            {/* CENTER IMAGE DESKTOP ONLY */}
            {!isPhone ? (
              <div
                style={{
                  position: "relative",
                  background: "#ebe7df",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[activeImage] || images[0]}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                ) : (
                  <ImagePlaceholder text="Main Product Image" />
                )}

                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    bottom: "24px",
                    color: "rgba(255,255,255,0.94)",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textShadow: "0 4px 18px rgba(0,0,0,0.28)",
                  }}
                >
                  {String(activeImage + 1).padStart(2, "0")}
                  <br />
                  {product.name}
                  <br />
                  <span style={{ opacity: 0.7 }}>{product.variant}</span>
                </div>
              </div>
            ) : null}

            {/* RIGHT INFO */}
            <aside
              style={{
                background: "#f4f0e9",
                padding: isPhone ? "28px 20px 24px" : "92px 62px 54px",
                display: "flex",
                flexDirection: "column",
                order: isPhone ? 3 : undefined,
              }}
            >
              <p
                style={{
                  margin: "0 0 18px",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                {product.isNewArrival ? "New Arrival" : product.category}
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: isPhone ? "54px" : "clamp(56px, 5vw, 78px)",
                  lineHeight: 0.86,
                  fontWeight: 400,
                  letterSpacing: "-0.5px",
                  textTransform: "uppercase",
                }}
              >
                {product.name}
              </h1>

              <p
                style={{
                  margin: "20px 0 24px",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#4d4943",
                }}
              >
                {product.variant}
              </p>

              <p
                style={{
                  margin: "0 0 28px",
                  fontSize: isPhone ? "22px" : "24px",
                  fontWeight: 800,
                }}
              >
                {product.displayPrice}
              </p>

              <p
                style={{
                  margin: "0 0 30px",
                  maxWidth: isPhone ? "100%" : "310px",
                  color: "#4d4943",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {product.description}
              </p>

              <div style={{ marginBottom: "30px" }}>
                <InfoRow
                  title="Details"
                  open={openInfo === "details"}
                  onClick={() =>
                    setOpenInfo(openInfo === "details" ? null : "details")
                  }
                >
                  Premium everyday fit with clean finish and soft feel.
                </InfoRow>

                <InfoRow
                  title="Size"
                  open={openInfo === "size"}
                  onClick={() =>
                    setOpenInfo(openInfo === "size" ? null : "size")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      flexWrap: "wrap",
                      paddingTop: "10px",
                    }}
                  >
                    {product.sizes?.map((productSize) => (
                      <button
                        key={productSize}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedSize(productSize);
                        }}
                        style={{
                          minWidth: "42px",
                          height: "36px",
                          border:
                            size === productSize
                              ? "1px solid #111"
                              : "1px solid #d4ccc1",
                          background:
                            size === productSize ? "#111" : "transparent",
                          color: size === productSize ? "#fff" : "#111",
                          fontSize: "12px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {productSize}
                      </button>
                    ))}
                  </div>
                </InfoRow>

                <InfoRow
                  title="Shipping"
                  open={openInfo === "shipping"}
                  onClick={() =>
                    setOpenInfo(openInfo === "shipping" ? null : "shipping")
                  }
                >
                  Order through WhatsApp. Delivery details will be confirmed by
                  the store.
                </InfoRow>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 56px",
                  gap: "14px",
                  marginBottom: "14px",
                }}
              >
                <button
                  onClick={handleAddToCart}
                  style={{
                    height: "56px",
                    border: "none",
                    background: added ? "#4a7c59" : "#111",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {added ? "Added ✓" : "Add to Cart"}
                </button>

                <button
                  onClick={() => setLiked(!liked)}
                  style={{
                    height: "56px",
                    border: "1px solid #d4ccc1",
                    background: "transparent",
                    display: isPhone ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Heart
                    size={20}
                    fill={liked ? "#111" : "none"}
                    strokeWidth={1.6}
                  />
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  height: "54px",
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

          <div
            style={{
              height: isPhone ? "58px" : "76px",
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "1fr auto 1fr",
              alignItems: "center",
              color: "#8a857d",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              textAlign: isPhone ? "center" : "left",
            }}
          >
            {!isPhone ? (
              <Link
                href="/collections"
                style={{
                  color: "#8a857d",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <ArrowLeft size={14} />
                Prev Product
              </Link>
            ) : null}

            <span>
              {String(activeImage + 1).padStart(2, "0")}{" "}
              <span style={{ opacity: 0.4 }}>——</span>{" "}
              {String(Math.max(images.length, 1)).padStart(2, "0")}
            </span>

            {!isPhone ? (
              <Link
                href="/collections"
                style={{
                  justifySelf: "end",
                  color: "#8a857d",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                Next Product
                <ArrowRight size={14} />
              </Link>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ThumbnailPlaceholder({
  index,
  active,
  isPhone,
}: {
  index: number;
  active?: boolean;
  isPhone?: boolean;
}) {
  return (
    <div
      style={{
        display: isPhone ? "block" : "grid",
        gridTemplateColumns: isPhone ? undefined : "28px 1fr",
        alignItems: "center",
        gap: "12px",
        flex: isPhone ? "0 0 74px" : undefined,
      }}
    >
      {!isPhone ? (
        <span
          style={{
            color: active ? "#111" : "#9d978f",
            fontSize: "12px",
            fontWeight: 800,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}

      <div
        style={{
          height: isPhone ? "88px" : "94px",
          borderRadius: "7px",
          border: active ? "1px solid #111" : "1px solid rgba(17,17,17,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ImagePlaceholder text="Image" />
      </div>
    </div>
  );
}

function ImagePlaceholder({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#918a80",
        fontSize: "11px",
        letterSpacing: "5px",
        textTransform: "uppercase",
        background: "linear-gradient(180deg, #eee9e0 0%, #dcd4c8 100%)",
      }}
    >
      {text}
    </div>
  );
}

function InfoRow({
  title,
  children,
  open,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        borderTop: "1px solid #ddd5ca",
        padding: "18px 0",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>

        {open ? <Minus size={16} /> : <Plus size={16} />}
      </div>

      {open ? (
        <div
          style={{
            marginTop: "14px",
            color: "#4d4943",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}