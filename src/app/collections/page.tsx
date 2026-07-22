"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FirebaseProduct,
  getProductOriginalPrice,
  getProductSellingPrice,
  getProducts,
  ProductBadge,
  ProductImageSetting,
} from "@/lib/productService";
import { Heart } from "lucide-react";

const categories = ["All", "T-Shirts", "Hoodies", "Pants", "Accessories"];

const badgeLabels: Record<Exclude<ProductBadge, "none">, string> = {
  new: "New",
  bestseller: "Bestseller",
  limited: "Limited",
  "sold-out": "Sold Out",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getSortedImageSettings(product: FirebaseProduct) {
  return [...(product.imageSettings ?? [])].sort(
    (firstImage, secondImage) =>
      (firstImage.order ?? 0) - (secondImage.order ?? 0),
  );
}

function getImageSetting(
  product: FirebaseProduct,
  role: "front" | "back",
): ProductImageSetting | undefined {
  const settings = getSortedImageSettings(product);

  if (role === "front") {
    return (
      settings.find((image) => image.role === "front") ??
      settings[0]
    );
  }

  return (
    settings.find((image) => image.role === "back") ??
    settings[1] ??
    settings.find((image) => image.role === "front") ??
    settings[0]
  );
}

function getProductBadge(product: FirebaseProduct) {
  const resolvedStatus = product.status ?? "published";
  const stock = Number(product.stock || 0);

  if (resolvedStatus === "sold-out" || stock <= 0) {
    return {
      label: "Sold Out",
      style: {
        background: "#821f19",
        color: "#fff",
      } as React.CSSProperties,
    };
  }

  if (product.badge && product.badge !== "none") {
    const badgeStyles: Record<
      Exclude<ProductBadge, "none">,
      React.CSSProperties
    > = {
      new: {
        background: "#fff",
        color: "#111",
        border: "1px solid rgba(17,17,17,0.15)",
      },
      bestseller: {
        background: "#111",
        color: "#fff",
      },
      limited: {
        background: "#f3e6ba",
        color: "#111",
      },
      "sold-out": {
        background: "#821f19",
        color: "#fff",
      },
    };

    return {
      label: badgeLabels[product.badge],
      style: badgeStyles[product.badge],
    };
  }

  if (stock > 0 && stock <= 3) {
    return {
      label: `Only ${stock} Left`,
      style: {
        background: "#f6d86b",
        color: "#111",
      } as React.CSSProperties,
    };
  }

  return null;
}

function isPublicProduct(product: FirebaseProduct) {
  const status = product.status ?? "published";
  return status !== "draft" && status !== "archived";
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
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
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(
          data
            .filter(isPublicProduct)
            .sort(
              (firstProduct, secondProduct) =>
                (firstProduct.homepageOrder ?? 999) -
                (secondProduct.homepageOrder ?? 999),
            ),
        );
      } catch (error) {
        console.error("LOAD COLLECTION PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category === activeCategory,
    );
  }, [products, activeCategory]);

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f6f2eb",
          padding: isPhone ? "94px 14px 64px" : "140px 42px 90px",
          fontFamily: '"Outfit", sans-serif',
          color: "#111",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <header
            style={{
              marginBottom: isPhone ? "28px" : "46px",
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
              gap: isPhone ? "16px" : "34px",
              alignItems: "end",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  color: "#77736c",
                  fontSize: isPhone ? "10px" : "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                JITTOK Collection
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: isPhone ? "68px" : "clamp(82px, 9vw, 146px)",
                  lineHeight: 0.82,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                All Products
              </h1>
            </div>

            <p
              style={{
                margin: isPhone ? "0" : "0 0 10px",
                maxWidth: isPhone ? "100%" : "360px",
                color: "#4d4943",
                fontSize: isPhone ? "12px" : "14px",
                lineHeight: 1.7,
              }}
            >
              Explore everyday essentials added directly from the JITTOK admin
              dashboard.
            </p>
          </header>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: isPhone ? "nowrap" : "wrap",
              overflowX: isPhone ? "auto" : "visible",
              marginBottom: isPhone ? "26px" : "34px",
              paddingBottom: isPhone ? "8px" : "0",
              scrollbarWidth: isPhone ? "none" : undefined,
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                style={{
                  height: isPhone ? "36px" : "40px",
                  padding: isPhone ? "0 14px" : "0 18px",
                  border:
                    activeCategory === category
                      ? "1px solid #111"
                      : "1px solid #d8d0c4",
                  background:
                    activeCategory === category ? "#111" : "transparent",
                  color: activeCategory === category ? "#fff" : "#111",
                  fontSize: isPhone ? "10px" : "11px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flex: isPhone ? "0 0 auto" : undefined,
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <section style={isPhone ? phoneEmptyStyle : emptyStyle}>
              Loading products...
            </section>
          ) : filteredProducts.length === 0 ? (
            <section style={isPhone ? phoneEmptyStyle : emptyStyle}>
              No products found.
            </section>
          ) : (
            <section
              style={{
                display: "grid",
                gridTemplateColumns: isPhone
                  ? "repeat(2, minmax(0, 1fr))"
                  : "repeat(4, minmax(0, 1fr))",
                gap: isPhone ? "22px 12px" : "18px",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  isPhone={isPhone}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function ProductCard({
  product,
  isPhone,
}: {
  product: FirebaseProduct;
  isPhone: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const frontSetting = getImageSetting(product, "front");
  const backSetting = getImageSetting(product, "back");

  const frontImage =
    frontSetting?.url || product.images?.[0] || "";

  const backImage =
    backSetting?.url ||
    product.images?.[1] ||
    product.images?.[0] ||
    "";

  const hasDifferentBackImage =
    Boolean(backImage) && backImage !== frontImage;

  const sellingPrice = getProductSellingPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const badge = getProductBadge(product);
  const isSoldOut =
    product.status === "sold-out" || Number(product.stock || 0) <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      onMouseEnter={() => {
        if (!isPhone) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: "#111",
        textDecoration: "none",
        display: "block",
        minWidth: 0,
      }}
    >
      <article>
        <div
          style={{
            position: "relative",
            aspectRatio: "3 / 4",
            background: "linear-gradient(180deg, #eee9e0 0%, #ddd6ca 100%)",
            marginBottom: isPhone ? "10px" : "14px",
            overflow: "hidden",
          }}
        >
          {frontImage ? (
            <>
              <img
                src={frontImage}
                alt={product.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: frontSetting?.fit ?? "cover",
                  objectPosition: `${frontSetting?.positionX ?? 50}% ${
                    frontSetting?.positionY ?? 50
                  }%`,
                  display: "block",
                  opacity:
                    hovered && hasDifferentBackImage ? 0 : 1,
                  transform:
                    hovered && hasDifferentBackImage
                      ? "scale(1.03)"
                      : "scale(1)",
                  transition:
                    "opacity 340ms ease, transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />

              {backImage ? (
                <img
                  src={backImage}
                  alt={`${product.name} back`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: backSetting?.fit ?? "cover",
                    objectPosition: `${backSetting?.positionX ?? 50}% ${
                      backSetting?.positionY ?? 50
                    }%`,
                    display: "block",
                    opacity:
                      hovered && hasDifferentBackImage ? 1 : 0,
                    transform:
                      hovered && hasDifferentBackImage
                        ? "scale(1)"
                        : "scale(1.03)",
                    transition:
                      "opacity 340ms ease, transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              ) : null}
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8d867b",
                fontSize: isPhone ? "8px" : "11px",
                letterSpacing: isPhone ? "2px" : "4px",
                textTransform: "uppercase",
                textAlign: "center",
                padding: "8px",
              }}
            >
              Product Image
            </div>
          )}

          {badge ? (
            <span
              style={{
                position: "absolute",
                top: isPhone ? "8px" : "14px",
                left: isPhone ? "8px" : "14px",
                zIndex: 4,
                minHeight: isPhone ? "24px" : "28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isPhone ? "0 8px" : "0 10px",
                fontSize: isPhone ? "7px" : "8px",
                fontWeight: 900,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                boxShadow: "0 5px 16px rgba(0,0,0,0.12)",
                ...badge.style,
              }}
            >
              {badge.label}
            </span>
          ) : null}

          <button
            type="button"
            aria-label={
              liked ? "Remove from favourites" : "Add to favourites"
            }
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLiked((previous) => !previous);
            }}
            style={{
              position: "absolute",
              top: isPhone ? "8px" : "14px",
              right: isPhone ? "8px" : "14px",
              zIndex: 4,
              width: isPhone ? "28px" : "34px",
              height: isPhone ? "28px" : "34px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.78)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            <Heart
              size={isPhone ? 12 : 15}
              strokeWidth={1.8}
              fill={liked ? "#111" : "none"}
            />
          </button>

          {isSoldOut ? (
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 4,
                minHeight: isPhone ? "28px" : "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(17,17,17,0.9)",
                color: "#fff",
                fontSize: isPhone ? "7px" : "9px",
                fontWeight: 900,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Currently Sold Out
            </div>
          ) : null}
        </div>

        <div>
          <h2
            style={{
              margin: "0 0 5px",
              fontSize: isPhone ? "10px" : "12px",
              fontWeight: 900,
              letterSpacing: "0.7px",
              textTransform: "uppercase",
              lineHeight: 1.2,
              minHeight: isPhone ? "24px" : "auto",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: isPhone ? 2 : 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              margin: "0 0 6px",
              color: "#77736c",
              fontSize: isPhone ? "9px" : "11px",
              fontWeight: 700,
              letterSpacing: "0.9px",
              textTransform: "uppercase",
              lineHeight: 1.2,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {product.variant}
          </p>

          <div
            style={{
              margin: "0 0 8px",
              display: "flex",
              alignItems: "baseline",
              gap: isPhone ? "5px" : "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: isPhone ? "11px" : "13px",
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
            >
              {formatPrice(sellingPrice)}
            </span>

            {originalPrice !== null ? (
              <span
                style={{
                  color: "#918b83",
                  fontSize: isPhone ? "8px" : "10px",
                  fontWeight: 700,
                  textDecoration: "line-through",
                  whiteSpace: "nowrap",
                }}
              >
                {formatPrice(originalPrice)}
              </span>
            ) : null}
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#111",
              fontSize: isPhone ? "9px" : "11px",
              fontWeight: 900,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(17,17,17,0.5)",
              paddingBottom: "3px",
            }}
          >
            View Product
          </span>
        </div>
      </article>
    </Link>
  );
}

const emptyStyle: React.CSSProperties = {
  minHeight: "360px",
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#77736c",
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const phoneEmptyStyle: React.CSSProperties = {
  minHeight: "260px",
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#77736c",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
  textAlign: "center",
  padding: "24px",
};