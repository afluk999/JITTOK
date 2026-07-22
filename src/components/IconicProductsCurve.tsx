"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getHomeContent } from "@/lib/contentService";
import {
  getIconicProducts,
  type FirebaseProduct,
  type ProductBadge,
  type ProductImageSetting,
} from "@/lib/productService";
import {
  signatureProducts,
  type SignatureProduct,
} from "@/data/signatureProducts";

type CardProduct = {
  id: string;
  slug: string;
  name: string;
  href: string;

  frontImage: string;
  backImage: string;

  frontFit: "cover" | "contain";
  backFit: "cover" | "contain";

  frontPositionX: number;
  frontPositionY: number;
  backPositionX: number;
  backPositionY: number;

  sellingPrice: number | string;
  originalPrice?: number | string;

  badge?: ProductBadge;
  stock?: number;
  status?: FirebaseProduct["status"];
};

const badgeLabels: Record<Exclude<ProductBadge, "none">, string> = {
  new: "New",
  bestseller: "Bestseller",
  limited: "Limited",
  "sold-out": "Sold Out",
};

function formatProductPrice(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const text = String(value).trim();

  if (text.includes("₹")) {
    return text;
  }

  const numericValue = Number(text.replace(/[^0-9.]/g, ""));

  if (Number.isFinite(numericValue) && numericValue > 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericValue);
  }

  return text;
}

function getNumericPrice(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : null;
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

function mapFirebaseProduct(product: FirebaseProduct): CardProduct {
  const frontSetting = getImageSetting(product, "front");
  const backSetting = getImageSetting(product, "back");

  const frontImage = frontSetting?.url || product.images?.[0] || "";
  const backImage =
    backSetting?.url ||
    product.images?.[1] ||
    product.images?.[0] ||
    "";

  return {
    id: product.id || product.slug,
    slug: product.slug,
    name: product.name,
    href: `/product/${product.slug}`,

    frontImage,
    backImage,

    frontFit: frontSetting?.fit ?? "contain",
    backFit: backSetting?.fit ?? frontSetting?.fit ?? "contain",

    frontPositionX: frontSetting?.positionX ?? 50,
    frontPositionY: frontSetting?.positionY ?? 50,
    backPositionX: backSetting?.positionX ?? 50,
    backPositionY: backSetting?.positionY ?? 50,

    sellingPrice:
      product.sellingPrice ??
      product.price ??
      product.displayPrice,

    originalPrice: product.originalPrice,

    badge: product.badge,
    stock: product.stock,
    status: product.status,
  };
}

function mapSignatureProduct(
  product: SignatureProduct,
  signatureImages: string[],
  fallbackImage: string,
): CardProduct {
  const frontImage =
    signatureImages[0] ||
    fallbackImage ||
    "";

  const backImage =
    signatureImages[1] ||
    signatureImages[0] ||
    fallbackImage ||
    "";

  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    href: `/signature/${product.slug}`,

    frontImage,
    backImage,

    frontFit: "contain",
    backFit: "contain",

    frontPositionX: 50,
    frontPositionY: 50,
    backPositionX: 50,
    backPositionY: 50,

    sellingPrice: product.displayPrice,
    originalPrice: product.originalDisplayPrice,
  };
}

function getCardBadge(product: CardProduct) {
  if (product.status === "sold-out" || product.stock === 0) {
    return {
      label: "Sold Out",
      className: "ipBadge ipSoldOutBadge",
    };
  }

  if (product.badge && product.badge !== "none") {
    return {
      label: badgeLabels[product.badge],
      className: `ipBadge ip${product.badge
        .split("-")
        .map(
          (part) =>
            part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("")}Badge`,
    };
  }

  if (
    typeof product.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 3
  ) {
    return {
      label: `Only ${product.stock} Left`,
      className: "ipBadge ipLowStockBadge",
    };
  }

  return null;
}

export default function IconicProductsCurve() {
  const [isPhone, setIsPhone] = useState(false);
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function checkPhone() {
      const smallScreen = window.innerWidth <= 768;
      const touchLikeDevice =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsPhone(smallScreen && touchLikeDevice);
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadIconicProducts() {
      try {
        const [firebaseProducts, content] = await Promise.all([
          getIconicProducts().catch((error) => {
            console.error(
              "LOAD FIREBASE ICONIC PRODUCTS ERROR:",
              error,
            );
            return [] as FirebaseProduct[];
          }),
          getHomeContent().catch((error) => {
            console.error("LOAD HOME CONTENT ERROR:", error);
            return null;
          }),
        ]);

        /**
         * Products marked as Iconic in the product admin take priority.
         * When none are selected, the original signature products remain
         * as a safe fallback, so the current section never disappears.
         */
        if (firebaseProducts.length > 0) {
          setProducts(firebaseProducts.map(mapFirebaseProduct));
          return;
        }

        const fallbackProducts = signatureProducts.map((product) => {
          const signatureImages =
            content?.signatureProductImages?.[product.slug] || [];

          const fallbackImage =
            content?.iconicImages?.[product.imageIndex] || "";

          return mapSignatureProduct(
            product,
            signatureImages,
            fallbackImage,
          );
        });

        setProducts(fallbackProducts);
      } catch (error) {
        console.error("LOAD ICONIC PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadIconicProducts();
  }, []);

  return (
    <section
      id="iconic-products"
      className="ipSection"
      style={{
        position: "relative",
        zIndex: 40,
        width: "100%",
        overflow: "hidden",
        background: "#ffffff",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div
        style={{
          padding: isPhone ? "28px 14px 42px" : "58px 42px 68px",
          background: "#ffffff",
        }}
      >
        {loading ? (
          <div className="ipStatusBox">Loading iconic products...</div>
        ) : products.length === 0 ? (
          <div className="ipStatusBox">No iconic products yet.</div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: isPhone ? "430px" : "1060px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: isPhone
                ? "repeat(2, minmax(0, 1fr))"
                : "repeat(3, minmax(0, 1fr))",
              gap: isPhone ? "16px 12px" : "22px",
              alignItems: "start",
            }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{
                  opacity: 0,
                  y: isPhone ? 22 : 32,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.18,
                }}
                transition={{
                  duration: isPhone ? 0.5 : 0.62,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={isPhone ? undefined : { y: -6 }}
                style={
                  isPhone &&
                  products.length % 2 === 1 &&
                  index === products.length - 1
                    ? {
                        gridColumn: "1 / -1",
                        width: "calc((100% - 12px) / 2)",
                        justifySelf: "center",
                      }
                    : undefined
                }
              >
                <SignatureCard
                  product={product}
                  number={String(index + 1).padStart(2, "0")}
                  isPhone={isPhone}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .ipStatusBox {
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #77736c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-align: center;
          text-transform: uppercase;
        }

        .ipBadge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 8;
          display: inline-flex;
          min-height: 27px;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          color: #ffffff;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.14);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.9px;
          line-height: 1;
          text-transform: uppercase;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.12);
        }

        .ipNewBadge {
          color: #111111;
          background: #ffffff;
          border-color: rgba(17, 17, 17, 0.13);
        }

        .ipBestsellerBadge {
          background: #111111;
        }

        .ipLimitedBadge {
          color: #111111;
          background: #f3e6ba;
          border-color: rgba(17, 17, 17, 0.12);
        }

        .ipSoldOutBadge {
          background: #821f19;
        }

        .ipLowStockBadge {
          color: #111111;
          background: #f6d86b;
          border-color: rgba(17, 17, 17, 0.12);
        }

        @media (max-width: 768px) {
          .ipBadge {
            top: 11px;
            left: 11px;
            min-height: 25px;
            padding: 0 9px;
            font-size: 7px;
          }
        }
      `}</style>
    </section>
  );
}

function SignatureCard({
  product,
  number,
  isPhone,
}: {
  product: CardProduct;
  number: string;
  isPhone: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const hasDifferentBackImage =
    Boolean(product.backImage) &&
    product.backImage !== product.frontImage;

  const currentPrice = formatProductPrice(product.sellingPrice);
  const originalPrice = formatProductPrice(product.originalPrice);

  const currentNumericPrice = getNumericPrice(product.sellingPrice);
  const originalNumericPrice = getNumericPrice(product.originalPrice);

  const showOriginalPrice =
    Boolean(originalPrice) &&
    originalPrice !== currentPrice &&
    (originalNumericPrice === null ||
      currentNumericPrice === null ||
      originalNumericPrice > currentNumericPrice);

  const cardBadge = getCardBadge(product);

  return (
    <Link
      href={product.href}
      onMouseEnter={() => {
        if (!isPhone) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      style={{
        display: "block",
        width: "100%",
        overflow: "hidden",
        color: "#111111",
        background: "#ffffff",
        border: "1px solid rgba(17,17,17,0.12)",
        boxShadow: isPhone
          ? "0 9px 26px rgba(17,17,17,0.065)"
          : "0 10px 30px rgba(17,17,17,0.075)",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {product.frontImage ? (
          <>
            <img
              src={product.frontImage}
              alt={`${product.name} front`}
              style={{
                position: "absolute",
                inset: 0,
                display: "block",
                width: "100%",
                height: "100%",
                padding:
                  product.frontFit === "contain"
                    ? isPhone
                      ? "5px"
                      : "8px"
                    : 0,
                objectFit: product.frontFit,
                objectPosition: `${product.frontPositionX}% ${product.frontPositionY}%`,
                boxSizing: "border-box",
                background: "#ffffff",
                opacity:
                  hovered && hasDifferentBackImage
                    ? 0
                    : 1,
                transform:
                  hovered && hasDifferentBackImage
                    ? "scale(1.04)"
                    : product.frontFit === "contain"
                      ? isPhone
                        ? "scale(1.08)"
                        : "scale(1.1)"
                      : "scale(1)",
                transformOrigin: "center",
                transition:
                  "opacity 350ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            {product.backImage ? (
              <img
                src={product.backImage}
                alt={`${product.name} back`}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "block",
                  width: "100%",
                  height: "100%",
                  padding:
                    product.backFit === "contain"
                      ? isPhone
                        ? "5px"
                        : "8px"
                      : 0,
                  objectFit: product.backFit,
                  objectPosition: `${product.backPositionX}% ${product.backPositionY}%`,
                  boxSizing: "border-box",
                  background: "#ffffff",
                  opacity:
                    hovered && hasDifferentBackImage
                      ? 1
                      : 0,
                  transform:
                    hovered && hasDifferentBackImage
                      ? product.backFit === "contain"
                        ? "scale(1.1)"
                        : "scale(1)"
                      : "scale(1.04)",
                  transformOrigin: "center",
                  transition:
                    "opacity 350ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
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
              padding: "20px",
              color: "#8a857d",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2px",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Add an Iconic product from the admin panel
          </div>
        )}

        {cardBadge ? (
          <span className={cardBadge.className}>
            {cardBadge.label}
          </span>
        ) : null}

        <span
          style={{
            position: "absolute",
            left: isPhone ? "13px" : "17px",
            bottom: isPhone ? "11px" : "14px",
            zIndex: 4,
            color: "rgba(17,17,17,0.58)",
            fontSize: isPhone ? "10px" : "11px",
            fontWeight: 900,
            letterSpacing: "1.2px",
          }}
        >
          {number}
        </span>
      </div>

      <div
        style={{
          minHeight: isPhone ? "68px" : "70px",
          padding: isPhone ? "13px 15px" : "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxSizing: "border-box",
          background: "#ffffff",
          borderTop: "1px solid rgba(17,17,17,0.1)",
        }}
      >
        <h3
          style={{
            margin: 0,
            maxWidth: "58%",
            color: "#111111",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "0.7px",
            lineHeight: 1.25,
            textTransform: "uppercase",
          }}
        >
          {product.name}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "flex-end",
            gap: "6px",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {showOriginalPrice ? (
            <span
              style={{
                color: "#8b867f",
                fontSize: "10px",
                fontWeight: 700,
                textDecoration: "line-through",
              }}
            >
              {originalPrice}
            </span>
          ) : null}

          <span
            style={{
              color: "#111111",
              fontSize: "14px",
              fontWeight: 900,
            }}
          >
            {currentPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}