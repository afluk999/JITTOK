"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getHomeContent } from "@/lib/contentService";
import {
  getSignatureProductBySlug,
  type SignatureProduct,
} from "@/data/signatureProducts";
import {
  ArrowLeft,
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

type PageProduct = SignatureProduct & {
  images: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
};

export default function SignatureProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const slug = String(params.slug || "");
  const baseProduct = getSignatureProductBySlug(slug);

  const [product, setProduct] = useState<PageProduct | null>(
    baseProduct
      ? {
          ...baseProduct,
          images: [],
          isNewArrival: false,
          isFeatured: true,
        }
      : null
  );
  const [isPhone, setIsPhone] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    baseProduct?.sizes?.[0] || ""
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("919605300701");
  const [openSection, setOpenSection] = useState<"details" | "shipping" | null>(
    "details"
  );

  useEffect(() => {
    function updatePhone() {
      setIsPhone(window.innerWidth <= 900);
    }

    updatePhone();
    window.addEventListener("resize", updatePhone);

    return () => window.removeEventListener("resize", updatePhone);
  }, []);

  useEffect(() => {
    async function loadSignatureSettings() {
      if (!baseProduct) return;

      try {
        const content = await getHomeContent();

        const separateGallery =
          content.signatureProductImages?.[baseProduct.slug] || [];

        // One-time fallback keeps the old homepage image working until
        // a separate signature gallery is uploaded from admin/content.
        const oldIconicImage =
          content.iconicImages?.[baseProduct.imageIndex] || "";

        const images =
          separateGallery.length > 0
            ? separateGallery.slice(0, 5)
            : oldIconicImage
              ? [oldIconicImage]
              : [];

        setActiveImage(0);

        setProduct({
          ...baseProduct,
          images,
          isNewArrival: false,
          isFeatured: true,
        });

        setWhatsappNumber(content.whatsappNumber || "919605300701");
      } catch (error) {
        console.error("LOAD SIGNATURE PRODUCT ERROR:", error);
      }
    }

    loadSignatureSettings();
  }, [baseProduct]);

  if (!baseProduct || !product) {
    return (
      <>
        <Navbar />
        <main
          style={{
            minHeight: "70vh",
            padding: "150px 24px",
            background: "#f8f4ec",
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          <h1>Signature product not found</h1>
          <Link href="/">Return home</Link>
        </main>
        <Footer />
      </>
    );
  }

  const selectedProductSize =
    selectedSize || product.sizes[0] || "Free Size";
  const saving = product.originalPrice - product.price;
  const cartProduct = product as any;

  function handleAddToCart() {
    addToCart(cartProduct, selectedProductSize, quantity);
    setAdded(true);
    window.dispatchEvent(new Event("cart-updated"));
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleBuyNow() {
    addToCart(cartProduct, selectedProductSize, quantity);
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/cart");
  }

  const cleanWhatsappNumber = whatsappNumber.replace(/[^\d]/g, "");
  const whatsappMessage = `Hi JITTOK, I want to order this signature product.

Product: ${product.name}
Variant: ${product.variant}
Size: ${selectedProductSize}
Quantity: ${quantity}
Price: ${product.displayPrice}

Please confirm availability and delivery details.`;

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f8f4ec",
          color: "#111",
          padding: isPhone ? "92px 12px 42px" : "126px 42px 70px",
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link
            href="/#iconic-products"
            style={{
              marginBottom: "22px",
              color: "#5f5a53",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <ArrowLeft size={15} />
            Back to signature products
          </Link>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "minmax(0, 1.25fr) 440px",
              background: "#ffffff",
              border: "1px solid rgba(17,17,17,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                minWidth: 0,
                background: "#f1ede6",
                display: "grid",
                gridTemplateRows: "minmax(0, 1fr) auto",
              }}
            >
              <div
                style={{
                  position: "relative",
                  minHeight: isPhone ? "480px" : "650px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {product.images[activeImage] ? (
                  <img
                    src={product.images[activeImage]}
                    alt={`${product.name} image ${activeImage + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: isPhone ? "480px" : "650px",
                      objectFit: "contain",
                      objectPosition: "center",
                      display: "block",
                      padding: isPhone ? "10px" : "24px",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#8a857d",
                      fontSize: "12px",
                      fontWeight: 900,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Add 1 to 5 signature images in admin/content
                  </div>
                )}

                {product.images.length > 0 ? (
                  <span
                    style={{
                      position: "absolute",
                      left: "16px",
                      bottom: "14px",
                      padding: "7px 10px",
                      background: "rgba(17,17,17,0.72)",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "1px",
                    }}
                  >
                    {String(activeImage + 1).padStart(2, "0")} /{" "}
                    {String(product.images.length).padStart(2, "0")}
                  </span>
                ) : null}
              </div>

              {product.images.length > 1 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: isPhone ? "10px" : "12px",
                    background: "#ffffff",
                    borderTop: "1px solid rgba(17,17,17,0.08)",
                    overflowX: "auto",
                  }}
                >
                  {product.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show product image ${index + 1}`}
                      style={{
                        width: isPhone ? "72px" : "82px",
                        height: isPhone ? "86px" : "98px",
                        flex: "0 0 auto",
                        padding: 0,
                        border:
                          activeImage === index
                            ? "2px solid #111"
                            : "1px solid rgba(17,17,17,0.12)",
                        background: "#f1ede6",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block",
                        }}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <aside
              style={{
                padding: isPhone ? "30px 20px 26px" : "54px 40px 42px",
                background: "#ffffff",
              }}
            >
              <p
                style={{
                  margin: "0 0 14px",
                  color: "#6d6861",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "1.3px",
                  textTransform: "uppercase",
                }}
              >
                Signature Collection
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: isPhone ? "62px" : "78px",
                  lineHeight: 0.86,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                {product.name}
              </h1>

              <p
                style={{
                  margin: "20px 0 18px",
                  color: "#4d4943",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {product.variant}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    color: "#8a857d",
                    fontSize: "17px",
                    fontWeight: 700,
                    textDecoration: "line-through",
                  }}
                >
                  {product.originalDisplayPrice}
                </span>

                <span style={{ fontSize: "29px", fontWeight: 900 }}>
                  {product.displayPrice}
                </span>

                <span
                  style={{
                    padding: "5px 8px",
                    background: "#e8f5e9",
                    color: "#237a35",
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  Save ₹{saving}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 26px",
                  color: "#4d4943",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {product.description}
              </p>

              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Select Size
                </p>

                <div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: "46px",
                        height: "40px",
                        border:
                          selectedProductSize === size
                            ? "1px solid #111"
                            : "1px solid #d4ccc1",
                        background:
                          selectedProductSize === size ? "#111" : "#ffffff",
                        color:
                          selectedProductSize === size ? "#ffffff" : "#111",
                        fontSize: "12px",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isPhone ? "112px 1fr" : "136px 1fr",
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
                      fontWeight: 900,
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
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
                    color: "#ffffff",
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
                  background: "#b50f14",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                <Zap size={17} fill="currentColor" />
                Buy it now
              </button>

              <div
                style={{
                  marginTop: "20px",
                  padding: "18px 0",
                  borderTop: "1px solid #e5dfd6",
                  borderBottom: "1px solid #e5dfd6",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <Benefit
                  icon={<Truck size={21} />}
                  title="Free Shipping"
                  subtitle="On prepaid orders"
                />
                <Benefit
                  icon={<WalletCards size={21} />}
                  title="COD Available"
                />
                <Benefit
                  icon={<RefreshCw size={21} />}
                  title="Easy Size Exchange"
                />
                <Benefit
                  icon={<PackageCheck size={21} />}
                  title="Dispatch within 24 Hours"
                />
              </div>

              <Accordion
                title="Product Details"
                open={openSection === "details"}
                onClick={() =>
                  setOpenSection(
                    openSection === "details" ? null : "details"
                  )
                }
              >
                {product.productDetails}
              </Accordion>

              <Accordion
                title="Shipping"
                open={openSection === "shipping"}
                onClick={() =>
                  setOpenSection(
                    openSection === "shipping" ? null : "shipping"
                  )
                }
              >
                Free shipping on prepaid orders. COD is available. Orders are
                normally dispatched within 24 hours.
              </Accordion>

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
                    background: "#25d366",
                    color: "#111",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontSize: "12px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  <FaWhatsapp size={18} />
                  Order on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => setLiked((previous) => !previous)}
                  aria-label="Add to favourites"
                  style={{
                    height: "54px",
                    border: "1px solid #d4ccc1",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Heart
                    size={20}
                    fill={liked ? "#111" : "none"}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Benefit({
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
        gap: "11px",
        alignItems: "center",
      }}
    >
      <span style={{ color: "#b50f14", display: "flex" }}>{icon}</span>

      <div>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>{title}</p>
        {subtitle ? (
          <p style={{ margin: "2px 0 0", color: "#77808d", fontSize: "13px" }}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Accordion({
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
        padding: "17px 0",
        borderBottom: "1px solid #e5dfd6",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
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
            marginTop: "13px",
            color: "#4d4943",
            fontSize: "13px",
            lineHeight: 1.7,
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
