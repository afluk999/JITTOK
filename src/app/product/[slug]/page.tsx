"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type TouchEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JittokLoadingLogo from "@/components/JittokLoadingLogo";
import {
  getProductBySlugFromFirebase,
  getProductOriginalPrice,
  getProductSellingPrice,
  type FirebaseProduct,
} from "@/lib/productService";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919605300701";

const COLLECTION_LABELS: Record<string, string> = {
  ringer: "Ringer Collection",
  "raglan-half": "Raglan Half Collection",
  "raglan-full": "Raglan Full Collection",
  lovely: "Lovely Collection",
  terry: "Terry Collection",
  signature: "Signature Collection",
};

const DEFAULT_SHIPPING_RETURNS =
  "Free shipping on prepaid orders. Cash on delivery is available on eligible pincodes. Orders are dispatched within 24 hours. Size exchanges are accepted within 7 days of delivery, as long as the item is unworn and unwashed.";

const DEFAULT_MATERIAL_CARE =
  "Machine wash cold with similar colours. Do not bleach. Tumble dry low or hang dry. Iron on low heat if needed, avoiding any printed graphics.";

const DEFAULT_SIZE_GUIDE =
  "Sizes run true to standard streetwear fit. If you're between sizes, we recommend sizing up for a more relaxed, oversized look.";

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}.00`;
}

function getCollectionLabel(product: FirebaseProduct) {
  if (product.collection && COLLECTION_LABELS[product.collection]) {
    return COLLECTION_LABELS[product.collection];
  }

  if (product.collection) {
    return `${product.collection.replace(/-/g, " ")} Collection`;
  }

  return product.category || "JITTOK";
}

function getProductDetailLines(product: FirebaseProduct) {
  if (!product.productDetails) return [];

  return product.productDetails
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<FirebaseProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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
        setLoading(true);
        const data = await getProductBySlugFromFirebase(slug);

        setProduct(data);
        setQuantity(1);
        setSelectedSize(data?.sizes?.[0] ?? "");
      } catch (error) {
        console.error("LOAD PRODUCT ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  const images = useMemo(() => product?.images ?? [], [product]);

  const openLightbox = useCallback((index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevImage = useCallback(() => {
    setActiveImageIndex((previous) =>
      images.length === 0 ? 0 : (previous - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const goToNextImage = useCallback(() => {
    setActiveImageIndex((previous) =>
      images.length === 0 ? 0 : (previous + 1) % images.length,
    );
  }, [images.length]);

  // Lock body scroll while lightbox is open, and support keyboard nav.
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goToPrevImage();
      if (event.key === "ArrowRight") goToNextImage();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, goToPrevImage, goToNextImage]);

  function handleTouchStart(event: TouchEvent) {
    setTouchStartX(event.touches[0].clientX);
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX;

    if (deltaX > 50) goToPrevImage();
    if (deltaX < -50) goToNextImage();

    setTouchStartX(null);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "100vh", background: "#f8f4ec" }}>
          <JittokLoadingLogo
            minHeight="100vh"
            background="#f8f4ec"
            logoWidth={isPhone ? 118 : 142}
            label="Loading product"
          />
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
  const sellingPrice = getProductSellingPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const hasOriginalPrice = originalPrice !== null && originalPrice > sellingPrice;
  const savingAmount = hasOriginalPrice ? originalPrice! - sellingPrice : 0;

  const isSoldOut =
    product.status === "sold-out" || Number(product.stock || 0) <= 0;

  const maximumQuantity = Math.max(Number(product.stock || 1), 1);
  const detailLines = getProductDetailLines(product);
  const collectionLabel = getCollectionLabel(product);
  const collectionSlug = product.collection || "";

  function handleAddToCart() {
    if (!product || isSoldOut) return;

    addToCart(product, size, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleBuyNow() {
    if (!product || isSoldOut) return;

    addToCart(product, size, quantity);
    router.push("/cart");
  }

  function handleWhatsAppOrder() {
    if (!product) return;

    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const orderReference = `JT-${Date.now().toString(36).slice(-6).toUpperCase()}`;

    const message = `*NEW JITTOK ORDER REQUEST*

*Order Reference:* ${orderReference}
*Product:* ${product.name}
*Variant:* ${product.variant || "Standard"}
*Size:* ${size}
*Quantity:* ${quantity}
*Unit Price:* ${formatPrice(sellingPrice)}
*Order Total:* ${formatPrice(sellingPrice * quantity)}

*Product Link:*
${productUrl}

*Customer Details*
Name:
Delivery Place:
Pincode:
Phone Number:

Please confirm availability, delivery charges, payment method, and the final order total.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const pageStyle: CSSProperties = {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: '"Outfit", sans-serif',
    color: "#171717",
    padding: isPhone ? "88px 14px 60px" : "118px 4vw 60px",
  };

  const layoutStyle: CSSProperties = {
    display: isPhone ? "flex" : "grid",
    flexDirection: isPhone ? "column" : undefined,
    gridTemplateColumns: isPhone ? undefined : "minmax(0, 66%) minmax(0, 34%)",
    gap: isPhone ? "26px" : "48px",
    maxWidth: "1500px",
    margin: "0 auto",
  };

  return (
    <>
      <Navbar />

      <main style={pageStyle}>
        <div style={{ maxWidth: "1500px", margin: "0 auto 20px" }}>
          <Link
            href={collectionSlug ? `/collections/${collectionSlug}` : "/collections"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#77736c",
              textDecoration: "none",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <ChevronLeft size={14} />
            Back to {collectionLabel.replace(" Collection", "")} Products
          </Link>
        </div>

        <div style={layoutStyle}>
          {/* MAIN IMAGE + THUMBNAIL RAIL */}
          <div
            style={{
              display: "flex",
              flexDirection: isPhone ? "column" : "row",
              gap: isPhone ? "10px" : "14px",
            }}
          >
            {images.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  aspectRatio: "4 / 5",
                  background: "#ffff",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <>
                {/* MAIN IMAGE */}
                <button
                  type="button"
                  onClick={() => openLightbox(activeImageIndex)}
                  aria-label={`View ${product.name} image ${activeImageIndex + 1} fullscreen`}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: 1,
                    minWidth: 0,
                    aspectRatio: "4 / 5",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    overflow: "hidden",
                    borderRadius: "4px",
                    background: "#fff",
                  }}
                  className="jt-gallery-cell"
                >
                  <img
                    src={images[activeImageIndex]}
                    alt={`${product.name} view ${activeImageIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      bottom: "14px",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
                    {String(images.length).padStart(2, "0")}
                  </span>

                  <span className="jt-expand-icon">
                    <Expand size={16} color="#fff" />
                  </span>
                </button>

                {/* THUMBNAIL RAIL */}
                {images.length > 1 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isPhone ? "row" : "column",
                      gap: isPhone ? "8px" : "10px",
                      width: isPhone ? "100%" : "90px",
                      flexShrink: 0,
                      overflowX: isPhone ? "auto" : "visible",
                    }}
                  >
                    {images.map((imageUrl, imageIndex) => (
                      <button
                        key={imageIndex}
                        type="button"
                        onClick={() => setActiveImageIndex(imageIndex)}
                        aria-label={`Show image ${imageIndex + 1}`}
                        style={{
                          position: "relative",
                          display: "block",
                          width: isPhone ? "64px" : "100%",
                          flexShrink: 0,
                          aspectRatio: "4 / 5",
                          border:
                            imageIndex === activeImageIndex
                              ? "2px solid #111"
                              : "1px solid rgba(17,17,17,0.12)",
                          padding: 0,
                          cursor: "pointer",
                          overflow: "hidden",
                          borderRadius: "4px",
                          background: "#ffff",
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`${product.name} thumbnail ${imageIndex + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            opacity: imageIndex === activeImageIndex ? 1 : 0.75,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* STICKY INFO PANEL */}
          <aside
            style={{
              position: isPhone ? "static" : "sticky",
              top: isPhone ? undefined : "110px",
              alignSelf: "start",
              background: "#ffff",
              padding: isPhone ? "26px 20px" : "42px 38px",
              border: "1px solid rgba(17,17,17,0.06)",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#77736c",
              }}
            >
              {collectionLabel}
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: isPhone ? "34px" : "42px",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {product.name}
            </h1>

            {product.variant ? (
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  color: "#4d4943",
                }}
              >
                {product.variant}
              </p>
            ) : null}

            <div
              style={{
                marginTop: "18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {hasOriginalPrice ? (
                <span
                  style={{
                    color: "#8a857d",
                    fontSize: "15px",
                    fontWeight: 700,
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(originalPrice!)}
                </span>
              ) : null}

              <span style={{ fontSize: "24px", fontWeight: 900 }}>
                {formatPrice(sellingPrice)}
              </span>

              {savingAmount > 0 ? (
                <span
                  style={{
                    padding: "4px 8px",
                    background: "#e8f5e9",
                    color: "#237a35",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Save {formatPrice(savingAmount)}
                </span>
              ) : null}
            </div>

            {product.description ? (
              <p
                style={{
                  margin: "18px 0 0",
                  fontSize: "13.5px",
                  lineHeight: 1.7,
                  color: "#4d4943",
                }}
              >
                {product.description}
              </p>
            ) : null}

            {detailLines.length > 0 ? (
              <div style={{ marginTop: "22px" }}>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderTop: "1px solid #e5dfd6",
                    paddingTop: "18px",
                  }}
                >
                  Product Details
                </p>

                <ul style={{ margin: 0, paddingLeft: "18px" }}>
                  {detailLines.map((line, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: "12px",
                        lineHeight: 1.8,
                        color: "#4d4943",
                        textTransform: "uppercase",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* SIZE SELECTOR */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid #e5dfd6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Select Size
                </span>

                <button
                  type="button"
                  onClick={() => setOpenAccordion("size-guide")}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    color: "#111",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  Size Guide →
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(product.sizes ?? []).map((productSize) => (
                  <button
                    key={productSize}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => setSelectedSize(productSize)}
                    style={{
                      minWidth: "46px",
                      height: "42px",
                      border:
                        size === productSize
                          ? "1px solid #111"
                          : "1px solid #d4ccc1",
                      background: size === productSize ? "#111" : "transparent",
                      color: size === productSize ? "#fff" : "#111",
                      fontSize: "12px",
                      fontWeight: 800,
                      cursor: isSoldOut ? "not-allowed" : "pointer",
                      opacity: isSoldOut ? 0.45 : 1,
                    }}
                  >
                    {productSize}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY + ADD TO CART */}
            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "10px",
              }}
            >
              <div
                style={{
                  height: "50px",
                  border: "1px solid #d9d2c8",
                  display: "grid",
                  gridTemplateColumns: "34px 1fr 34px",
                  alignItems: "center",
                  opacity: isSoldOut ? 0.5 : 1,
                }}
              >
                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={quantityButtonStyle}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>

                <span style={{ textAlign: "center", fontWeight: 800 }}>
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={isSoldOut || quantity >= maximumQuantity}
                  onClick={() =>
                    setQuantity((q) => Math.min(maximumQuantity, q + 1))
                  }
                  style={quantityButtonStyle}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                style={{
                  height: "50px",
                  border: "none",
                  background: isSoldOut ? "#918b83" : added ? "#347a48" : "#111",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: isSoldOut ? "not-allowed" : "pointer",
                }}
              >
                {isSoldOut ? "Sold Out" : added ? "Added ✓" : "Add to Cart"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isSoldOut}
              style={{
                width: "100%",
                height: "52px",
                marginTop: "10px",
                border: "none",
                background: isSoldOut ? "#918b83" : "#8a1f1a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 900,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                cursor: isSoldOut ? "not-allowed" : "pointer",
              }}
            >
              {isSoldOut ? "Currently Sold Out" : "Buy It Now"}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              style={{
                width: "100%",
                height: "48px",
                marginTop: "10px",
                border: "none",
                background: "#25D366",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <FaWhatsapp size={16} />
              Order on WhatsApp
            </button>

            {/* BENEFITS */}
            <div
              style={{
                marginTop: "22px",
                paddingTop: "18px",
                borderTop: "1px solid #e5dfd6",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                fontSize: "11.5px",
                color: "#4d4943",
              }}
            >
              <span>Free Shipping<br /><span style={{ color: "#8a857d" }}>On prepaid orders</span></span>
              <span>COD Available</span>
              <span>Easy Size Exchange</span>
              <span>Dispatch within 24 Hours</span>
            </div>

            {/* ACCORDIONS */}
            <div style={{ marginTop: "20px" }}>
              <Accordion
                title="Shipping & Returns"
                open={openAccordion === "shipping"}
                onToggle={() =>
                  setOpenAccordion(openAccordion === "shipping" ? null : "shipping")
                }
              >
                {product.shippingReturns?.trim() || DEFAULT_SHIPPING_RETURNS}
              </Accordion>

              <Accordion
                title="Material & Care"
                open={openAccordion === "material"}
                onToggle={() =>
                  setOpenAccordion(openAccordion === "material" ? null : "material")
                }
              >
                {product.materialCare?.trim() || DEFAULT_MATERIAL_CARE}
              </Accordion>

              <Accordion
                title="Size Guide"
                open={openAccordion === "size-guide"}
                onToggle={() =>
                  setOpenAccordion(
                    openAccordion === "size-guide" ? null : "size-guide",
                  )
                }
              >
                {product.sizeGuideText?.trim() || DEFAULT_SIZE_GUIDE}
              </Accordion>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* FULLSCREEN LIGHTBOX */}
      {lightboxOpen && images.length > 0 ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(8,8,8,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: isPhone ? "20px 0" : "40px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: isPhone ? "16px" : "24px",
              left: isPhone ? "16px" : "24px",
              right: isPhone ? "16px" : "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            <span>
              {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close fullscreen view"
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <X size={26} />
            </button>
          </div>

          <img
            src={images[activeImageIndex]}
            alt={`${product.name} fullscreen view ${activeImageIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
            style={{
              maxWidth: isPhone ? "94vw" : "78vw",
              maxHeight: isPhone ? "70vh" : "76vh",
              objectFit: "contain",
            }}
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevImage();
                }}
                aria-label="Previous image"
                style={{
                  position: "absolute",
                  left: isPhone ? "10px" : "30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNextImage();
                }}
                aria-label="Next image"
                style={{
                  position: "absolute",
                  right: isPhone ? "10px" : "30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={22} />
              </button>

              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxWidth: "90vw",
                }}
              >
                {images.map((thumbUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                    style={{
                      width: "48px",
                      height: "60px",
                      padding: 0,
                      border:
                        index === activeImageIndex
                          ? "2px solid #fff"
                          : "1px solid rgba(255,255,255,0.3)",
                      opacity: index === activeImageIndex ? 1 : 0.55,
                      cursor: "pointer",
                      overflow: "hidden",
                      background: "transparent",
                    }}
                  >
                    <img
                      src={thumbUrl}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      <style>{`
        .jt-gallery-cell .jt-expand-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .jt-gallery-cell:hover .jt-expand-icon {
          opacity: 1;
        }

        .jt-gallery-cell {
          transition: opacity 200ms ease;
        }

        .jt-gallery-cell:hover {
          cursor: zoom-in;
        }
      `}</style>
    </>
  );
}

function Accordion({
  title,
  children,
  open,
  onToggle,
}: {
  title: string;
  children: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderTop: "1px solid #e5dfd6" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          height: "52px",
          border: "none",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 900,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        {title}
        {open ? <Minus size={15} /> : <Plus size={15} />}
      </button>

      {open ? (
        <p
          style={{
            margin: "0 0 18px",
            fontSize: "12.5px",
            lineHeight: 1.75,
            color: "#4d4943",
          }}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

const quantityButtonStyle: CSSProperties = {
  width: "34px",
  height: "48px",
  border: "none",
  background: "transparent",
  color: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};