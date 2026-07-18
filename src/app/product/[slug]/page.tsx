"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  type FirebaseProduct,
  getProductBySlugFromFirebase,
} from "@/lib/productService";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  Truck,
  WalletCards,
  Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "910000000000";

type ProductWithOffers = FirebaseProduct & {
  originalPrice?: number;
  originalDisplayPrice?: string;
  prepaidDiscount?: number;
  productDetails?: string;
};

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}.00`;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductWithOffers | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [openInfo, setOpenInfo] = useState<string | null>("details");

  useEffect(() => {
    function checkPhone() {
      setIsPhone(window.innerWidth <= 900);
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = (await getProductBySlugFromFirebase(
          slug
        )) as ProductWithOffers | null;

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

  if (loading) {
    return (
      <>
        <Navbar />
        <main
          style={{
            minHeight: "100vh",
            background: "#f8f4ec",
            padding: isPhone ? "120px 18px" : "160px 42px",
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
            padding: isPhone ? "120px 18px" : "160px 42px",
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

  const sellingPrice = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const prepaidDiscount = Number(product.prepaidDiscount || 50);
  const hasOriginalPrice = originalPrice > sellingPrice;

  const originalDisplayPrice =
    product.originalDisplayPrice ||
    (hasOriginalPrice ? formatPrice(originalPrice) : "");

  const savingAmount = hasOriginalPrice
    ? Math.max(originalPrice - sellingPrice, 0)
    : 0;

  function handleAddToCart() {
    addToCart(product as any, size, quantity);
    setAdded(true);
    window.dispatchEvent(new Event("cart-updated"));
    setTimeout(() => setAdded(false), 1400);
  }

  function handleBuyNow() {
    addToCart(product as any, size, quantity);
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/cart");
  }

  const directWhatsAppMessage = `Hi JITTOK, I want to order this product.

Product: ${product.name}
Variant: ${product.variant}
Size: ${size}
Quantity: ${quantity}
Price: ${product.displayPrice}

Please confirm availability and delivery details.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    directWhatsAppMessage
  )}`;

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f8f4ec",
          padding: isPhone ? "88px 12px 36px" : "118px 42px 52px",
          fontFamily: '"Outfit", sans-serif',
          color: "#111",
        }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          {!isPhone ? (
            <div
              style={{
                height: "54px",
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                borderBottom: "1px solid rgba(17,17,17,0.08)",
                marginBottom: "22px",
                color: "#8a857d",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              <span>01 / Interactive Showcase</span>
              <span />
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
          ) : null}

          <section
            style={{
              minHeight: isPhone ? "auto" : "650px",
              display: "grid",
              gridTemplateColumns: isPhone
                ? "1fr"
                : "200px minmax(0, 1fr) 420px",
              background: "#f1ede6",
              border: "1px solid rgba(17,17,17,0.06)",
              borderRadius: isPhone ? "10px" : "18px",
              overflow: "hidden",
            }}
          >
            <aside
              style={{
                padding: isPhone ? "12px" : "32px 22px",
                borderRight: isPhone
                  ? "none"
                  : "1px solid rgba(17,17,17,0.06)",
                borderBottom: isPhone
                  ? "1px solid rgba(17,17,17,0.06)"
                  : "none",
                display: isPhone ? "flex" : "grid",
                gap: isPhone ? "9px" : "13px",
                alignContent: "start",
                overflowX: isPhone ? "auto" : "visible",
                order: isPhone ? 2 : 1,
              }}
            >
              {images.length === 0 ? (
                <ThumbnailPlaceholder index={0} active isPhone={isPhone} />
              ) : (
                images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isPhone ? "1fr" : "28px 1fr",
                      alignItems: "center",
                      gap: "12px",
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      flex: isPhone ? "0 0 72px" : undefined,
                    }}
                  >
                    {!isPhone ? (
                      <span
                        style={{
                          color:
                            activeImage === index ? "#111" : "#9d978f",
                          fontSize: "12px",
                          fontWeight: 800,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    ) : null}

                    <div
                      style={{
                        width: isPhone ? "72px" : "auto",
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

            <div
              style={{
                position: "relative",
                minHeight: isPhone ? "460px" : undefined,
                background: "#ebe7df",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                order: isPhone ? 1 : 2,
              }}
            >
              {images.length > 0 ? (
                <img
                  src={images[activeImage] || images[0]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: isPhone ? "460px" : "650px",
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
                  left: isPhone ? "16px" : "24px",
                  bottom: isPhone ? "16px" : "24px",
                  color: "rgba(255,255,255,0.94)",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textShadow: "0 4px 18px rgba(0,0,0,0.35)",
                }}
              >
                {String(activeImage + 1).padStart(2, "0")}
                <br />
                {product.name}
                <br />
                <span style={{ opacity: 0.7 }}>{product.variant}</span>
              </div>
            </div>

            <aside
              style={{
                background: "#ffffff",
                padding: isPhone ? "30px 20px 24px" : "58px 44px 42px",
                display: "flex",
                flexDirection: "column",
                order: 3,
              }}
            >
              <p
                style={{
                  margin: "0 0 15px",
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
                  fontFamily:
                    '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: isPhone
                    ? "clamp(54px, 16vw, 74px)"
                    : "clamp(56px, 5vw, 78px)",
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
                  margin: "20px 0 21px",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#4d4943",
                }}
              >
                {product.variant}
              </p>

              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "11px",
                  flexWrap: "wrap",
                }}
              >
                {hasOriginalPrice ? (
                  <span
                    style={{
                      color: "#8a857d",
                      fontSize: "17px",
                      fontWeight: 700,
                      textDecoration: "line-through",
                      textDecorationThickness: "1.5px",
                    }}
                  >
                    {originalDisplayPrice}
                  </span>
                ) : null}

                <span
                  style={{
                    fontSize: "27px",
                    fontWeight: 900,
                  }}
                >
                  {product.displayPrice}
                </span>

                {savingAmount > 0 ? (
                  <span
                    style={{
                      padding: "5px 8px",
                      background: "#e8f5e9",
                      color: "#237a35",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.7px",
                      textTransform: "uppercase",
                    }}
                  >
                    Save {formatPrice(savingAmount)}
                  </span>
                ) : null}
              </div>

              <p
                style={{
                  margin: "0 0 25px",
                  maxWidth: "330px",
                  color: "#4d4943",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {product.description}
              </p>

              <InfoRow
                title="Details"
                open={openInfo === "details"}
                onClick={() =>
                  setOpenInfo(openInfo === "details" ? null : "details")
                }
              >
                {product.productDetails || product.description}
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
                    paddingTop: "8px",
                  }}
                >
                  {product.sizes?.map((productSize) => (
                    <button
                      key={productSize}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedSize(productSize);
                      }}
                      style={{
                        minWidth: "44px",
                        height: "38px",
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
                Free shipping on prepaid orders. COD is available. Orders are
                normally dispatched within 24 hours.
              </InfoRow>

              <div
                style={{
                  marginTop: "24px",
                  display: "grid",
                  gridTemplateColumns: isPhone ? "116px 1fr" : "136px 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    height: "54px",
                    border: "1px solid #d9d2c8",
                    display: "grid",
                    gridTemplateColumns: "38px 1fr 38px",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity((previous) => Math.max(1, previous - 1))
                    }
                    style={quantityButtonStyle}
                  >
                    <Minus size={15} />
                  </button>

                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "15px",
                      fontWeight: 800,
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((previous) => previous + 1)}
                    style={quantityButtonStyle}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  style={{
                    height: "54px",
                    border: "none",
                    background: added ? "#347a48" : "#111",
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
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                style={{
                  width: "100%",
                  height: "56px",
                  marginTop: "10px",
                  border: "none",
                  background: "#0a0a0a",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: 900,
                  letterSpacing: "0.4px",
                  cursor: "pointer",
                }}
              >
                <Zap size={17} fill="currentColor" />
                Buy it now
              </button>

              <div
                style={{
                  padding: "18px 0",
                  borderBottom: "1px solid #e5dfd6",
                  color: "#3e4753",
                  fontSize: "15px",
                  fontWeight: 800,
                }}
              >
                Save ₹{prepaidDiscount.toLocaleString("en-IN")} with Prepaid
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  padding: "20px 0",
                  borderBottom: "1px solid #e5dfd6",
                }}
              >
                <BenefitRow
                  icon={<Truck size={22} />}
                  title="Free Shipping"
                  subtitle="On prepaid orders"
                />
                <BenefitRow
                  icon={<WalletCards size={22} />}
                  title="COD Available"
                />
                <BenefitRow
                  icon={<RefreshCw size={22} />}
                  title="Easy Size Exchange"
                />
                <BenefitRow
                  icon={<PackageCheck size={22} />}
                  title="Dispatch within 24 Hours"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 56px",
                  gap: "10px",
                  marginTop: "18px",
                }}
              >
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

                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  aria-label="Add to favourites"
                  style={{
                    height: "54px",
                    border: "1px solid #d4ccc1",
                    background: "transparent",
                    display: "flex",
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
            </aside>
          </section>

          {!isPhone ? (
            <div
              style={{
                height: "76px",
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                color: "#8a857d",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
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

              <span>
                {String(activeImage + 1).padStart(2, "0")}{" "}
                <span style={{ opacity: 0.4 }}>——</span>{" "}
                {String(Math.max(images.length, 1)).padStart(2, "0")}
              </span>

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
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}

function BenefitRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "30px 1fr",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <span style={{ color: "#0b0b0b", display: "flex" }}>{icon}</span>

      <div>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>{title}</p>
        {subtitle ? (
          <p
            style={{
              margin: "2px 0 0",
              color: "#77808d",
              fontSize: "13px",
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
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
        display: "grid",
        gridTemplateColumns: isPhone ? "1fr" : "28px 1fr",
        alignItems: "center",
        gap: "12px",
        width: isPhone ? "72px" : "auto",
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
          width: isPhone ? "72px" : "auto",
          height: isPhone ? "88px" : "94px",
          borderRadius: "7px",
          border: active
            ? "1px solid #111"
            : "1px solid rgba(17,17,17,0.06)",
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
        padding: "17px 0",
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
            color: "#020202",
            fontSize: "13px",
            lineHeight: 1.65,
            whiteSpace: "pre-line",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

const quantityButtonStyle: React.CSSProperties = {
  width: "38px",
  height: "52px",
  border: "none",
  background: "transparent",
  color: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
