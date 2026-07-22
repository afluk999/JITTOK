"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getNewArrivalProducts,
  type FirebaseProduct,
  type ProductBadge,
  type ProductImageSetting,
} from "@/lib/productService";

type NewArrivalRow = "both" | "1" | "2";

type ArrivalProduct = FirebaseProduct & {
  newArrivalRow?: NewArrivalRow;

  /**
   * Legacy fields kept for products created before the new pricing system.
   */
  compareAtPrice?: number | string;
  salePrice?: number | string;
};

const badgeLabels: Record<Exclude<ProductBadge, "none">, string> = {
  new: "New",
  bestseller: "Bestseller",
  limited: "Limited",
  "sold-out": "Sold Out",
};

function formatProductPrice(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") return "";

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const text = String(value).trim();

  if (text.includes("₹")) return text;

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
  if (value === undefined || value === null || value === "") return null;

  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : null;
}

function getSortedImageSettings(product: ArrivalProduct) {
  return [...(product.imageSettings ?? [])].sort(
    (firstImage, secondImage) =>
      (firstImage.order ?? 0) - (secondImage.order ?? 0),
  );
}

function getImageSetting(
  product: ArrivalProduct,
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

function getCardBadge(product: ArrivalProduct) {
  const resolvedStatus = product.status ?? "published";

  if (resolvedStatus === "sold-out" || product.stock <= 0) {
    return {
      label: "Sold Out",
      className: "naProductBadge naSoldOutBadge",
    };
  }

  if (product.badge && product.badge !== "none") {
    return {
      label: badgeLabels[product.badge],
      className: `naProductBadge na${product.badge
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")}Badge`,
    };
  }

  if (product.stock > 0 && product.stock <= 3) {
    return {
      label: `Only ${product.stock} Left`,
      className: "naProductBadge naLowStockBadge",
    };
  }

  return null;
}

function ProductCard({
  product,
  index,
}: {
  product: ArrivalProduct;
  index: number;
}) {
  const [liked, setLiked] = useState(false);

  const frontSetting = getImageSetting(product, "front");
  const backSetting = getImageSetting(product, "back");

  const frontImage = frontSetting?.url || product.images?.[0];
  const backImage =
    backSetting?.url || product.images?.[1] || frontImage;

  const currentPriceValue =
    product.sellingPrice ??
    product.salePrice ??
    product.price ??
    product.displayPrice;

  const originalPriceValue =
    product.originalPrice ?? product.compareAtPrice;

  const currentPrice = formatProductPrice(currentPriceValue);
  const originalPrice = formatProductPrice(originalPriceValue);

  const currentNumericPrice = getNumericPrice(currentPriceValue);
  const originalNumericPrice = getNumericPrice(originalPriceValue);

  const showOriginalPrice =
    Boolean(originalPrice) &&
    originalPrice !== currentPrice &&
    (originalNumericPrice === null ||
      currentNumericPrice === null ||
      originalNumericPrice > currentNumericPrice);

  const cardBadge = getCardBadge(product);

  const frontImageStyle: React.CSSProperties = {
    objectFit: frontSetting?.fit ?? "cover",
    objectPosition: `${frontSetting?.positionX ?? 50}% ${
      frontSetting?.positionY ?? 50
    }%`,
  };

  const backImageStyle: React.CSSProperties = {
    objectFit: backSetting?.fit ?? "cover",
    objectPosition: `${backSetting?.positionX ?? 50}% ${
      backSetting?.positionY ?? 50
    }%`,
  };

  return (
    <motion.article
      className="naProductCard"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        delay: Math.min(index, 6) * 0.025,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="naProductLink"
        aria-label={`View ${product.name}`}
      >
        <div className="naImageBox">
          {frontImage ? (
            <img
              src={frontImage}
              alt={product.name}
              className="naProductImage naFrontImage"
              style={frontImageStyle}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="naImagePlaceholder">Product Image</div>
          )}

          {backImage ? (
            <img
              src={backImage}
              alt={`${product.name} back`}
              className="naProductImage naBackImage"
              style={backImageStyle}
              loading="lazy"
              decoding="async"
            />
          ) : null}

          {cardBadge ? (
            <span className={cardBadge.className}>
              {cardBadge.label}
            </span>
          ) : null}

          <button
            type="button"
            className={`naHeartButton${liked ? " naLiked" : ""}`}
            aria-label={liked ? "Remove from favourites" : "Add to favourites"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLiked((previous) => !previous);
            }}
          >
            <Heart
              size={13}
              fill={liked ? "#111" : "none"}
              stroke="#111"
              strokeWidth={1.8}
            />
          </button>

          <div className="naViewProduct">View Product</div>
        </div>

        <div className="naPriceBox">
          <span className="naCurrentPrice">{currentPrice}</span>

          {showOriginalPrice ? (
            <span className="naOriginalPrice">{originalPrice}</span>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}

function getUniqueProducts(products: ArrivalProduct[]) {
  const usedKeys = new Set<string>();

  return products.filter((product, index) => {
    const key =
      product.id ||
      product.slug ||
      `${product.name}-${product.variant}-${index}`;

    if (usedKeys.has(key)) {
      return false;
    }

    usedKeys.add(key);
    return true;
  });
}

function rotateProducts(products: ArrivalProduct[]) {
  if (products.length <= 1) return products;

  const middle = Math.ceil(products.length / 2);

  return [
    ...products.slice(middle),
    ...products.slice(0, middle),
  ];
}

function buildRows(products: ArrivalProduct[]) {
  const topRow: ArrivalProduct[] = [];
  const bottomRow: ArrivalProduct[] = [];

  products.forEach((product, index) => {
    const selectedRow = product.newArrivalRow;

    if (selectedRow === "1") {
      topRow.push(product);
      return;
    }

    if (selectedRow === "2") {
      bottomRow.push(product);
      return;
    }

    if (selectedRow === "both") {
      topRow.push(product);
      bottomRow.push(product);
      return;
    }

    /**
     * Older Firebase products may not have newArrivalRow yet.
     * Split those automatically so both rows appear immediately.
     */
    if (index % 2 === 0) {
      topRow.push(product);
    } else {
      bottomRow.push(product);
    }
  });

  return {
    top: topRow.length > 0 ? topRow : products,
    bottom:
      bottomRow.length > 0
        ? bottomRow
        : rotateProducts(products),
  };
}

function repeatForContinuousLoop(
  products: ArrivalProduct[],
  minimumCards = 12,
) {
  if (products.length === 0) return [];

  return Array.from(
    {
      length: Math.max(minimumCards, products.length),
    },
    (_, index) => products[index % products.length],
  );
}

function MarqueeRow({
  products,
  reverse = false,
  rowName,
}: {
  products: ArrivalProduct[];
  reverse?: boolean;
  rowName: string;
}) {
  const repeatedProducts = useMemo(
    () => repeatForContinuousLoop(products),
    [products],
  );

  if (repeatedProducts.length === 0) return null;

  return (
    <div className="naMarqueeViewport">
      <div
        className={`naMarqueeTrack${
          reverse ? " naMarqueeReverse" : ""
        }`}
      >
        <div className="naMarqueeGroup">
          {repeatedProducts.map((product, index) => {
            const productKey =
              product.id ||
              product.slug ||
              `${product.name}-${product.variant}`;

            return (
              <div
                className="naTrackItem"
                key={`${rowName}-first-${productKey}-${index}`}
              >
                <ProductCard product={product} index={index} />
              </div>
            );
          })}
        </div>

        <div className="naMarqueeGroup" aria-hidden="true">
          {repeatedProducts.map((product, index) => {
            const productKey =
              product.id ||
              product.slug ||
              `${product.name}-${product.variant}`;

            return (
              <div
                className="naTrackItem"
                key={`${rowName}-duplicate-${productKey}-${index}`}
              >
                <ProductCard product={product} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function NewArrivals() {
  const [products, setProducts] = useState<ArrivalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const data =
          (await getNewArrivalProducts()) as ArrivalProduct[];

        setProducts(getUniqueProducts(data));
      } catch (error) {
        console.error("LOAD NEW ARRIVALS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  const rows = useMemo(() => buildRows(products), [products]);

  return (
    <section id="new-arrivals" className="naArrivalsSection">
      {loading ? (
        <StatusBox text="Loading new arrivals..." />
      ) : products.length === 0 ? (
        <StatusBox text="No new arrivals yet." />
      ) : (
        <>
          <div className="naDesktopRows">
            <div className="naRows">
              <MarqueeRow
                products={rows.top}
                rowName="top"
              />

              <MarqueeRow
                products={rows.bottom}
                reverse
                rowName="bottom"
              />
            </div>
          </div>

          <div className="naMobileGrid">
            {products.map((product, index) => {
              const productKey =
                product.id ||
                product.slug ||
                `${product.name}-${product.variant}-${index}`;

              return (
                <ProductCard
                  key={`mobile-${productKey}`}
                  product={product}
                  index={index}
                />
              );
            })}
          </div>
        </>
      )}

      <style jsx global>{`
        .naArrivalsSection {
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          padding: 30px 0 48px;
          font-family: "Outfit", sans-serif;
        }

        .naDesktopRows {
          display: block;
          width: 100%;
        }

        .naMobileGrid {
          display: none;
        }

        .naRows {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .naMarqueeViewport {
          width: 100%;
          overflow: hidden;
          touch-action: pan-y;
        }

        .naMarqueeTrack {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: naMoveLeft 52s linear infinite;
        }

        .naMarqueeTrack.naMarqueeReverse {
          animation-name: naMoveRight;
          animation-duration: 58s;
        }

        .naMarqueeGroup {
          display: flex;
          flex-shrink: 0;
          gap: 18px;
          padding-right: 18px;
        }

        .naTrackItem {
          width: 210px;
          flex: 0 0 210px;
        }

        .naProductCard {
          display: block;
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.1);
          border-radius: 3px;
          box-shadow: 0 7px 22px rgba(17, 17, 17, 0.055);
          transition:
            transform 240ms ease,
            box-shadow 240ms ease;
        }

        .naProductCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(17, 17, 17, 0.09);
        }

        .naProductLink {
          display: block;
          width: 100%;
          color: inherit;
          text-decoration: none;
        }

        .naImageBox {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f0f0f0;
          border-radius: 2px;
          isolation: isolate;
        }

        .naProductBadge {
          position: absolute;
          top: 9px;
          left: 9px;
          z-index: 6;
          display: inline-flex;
          min-height: 25px;
          align-items: center;
          justify-content: center;
          padding: 0 9px;
          color: #ffffff;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.14);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.9px;
          line-height: 1;
          text-transform: uppercase;
          box-shadow: 0 4px 13px rgba(0, 0, 0, 0.12);
        }

        .naNewBadge {
          color: #111111;
          background: #ffffff;
          border-color: rgba(17, 17, 17, 0.13);
        }

        .naBestsellerBadge {
          background: #111111;
        }

        .naLimitedBadge {
          color: #111111;
          background: #f3e6ba;
          border-color: rgba(17, 17, 17, 0.12);
        }

        .naSoldOutBadge {
          background: #821f19;
        }

        .naLowStockBadge {
          color: #111111;
          background: #f6d86b;
          border-color: rgba(17, 17, 17, 0.12);
        }

        .naPriceBox {
          display: flex;
          min-height: 46px;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          background: #ffffff;
          border-top: 1px solid rgba(17, 17, 17, 0.08);
          white-space: nowrap;
        }

        .naCurrentPrice {
          color: #111111;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.15px;
          line-height: 1;
        }

        .naOriginalPrice {
          color: #989898;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          text-decoration: line-through;
          text-decoration-thickness: 1px;
        }

        .naProductImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition:
            opacity 360ms ease,
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .naFrontImage {
          z-index: 1;
          opacity: 1;
          transform: scale(1);
        }

        .naBackImage {
          z-index: 2;
          opacity: 0;
          transform: scale(1.045);
        }

        .naProductCard:hover .naFrontImage {
          opacity: 0;
          transform: scale(1.035);
        }

        .naProductCard:hover .naBackImage {
          opacity: 1;
          transform: scale(1);
        }

        .naImagePlaceholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          color: #858585;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-align: center;
          text-transform: uppercase;
        }

        .naHeartButton {
          position: absolute;
          top: 9px;
          right: 9px;
          z-index: 7;
          display: flex;
          width: 29px;
          height: 29px;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        .naHeartButton:hover {
          transform: scale(1.06);
          background: #ffffff;
        }

        .naHeartButton.naLiked {
          background: #ffffff;
        }

        .naViewProduct {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 4;
          display: flex;
          height: 36px;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: rgba(10, 10, 10, 0.92);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          transform: translateY(100%);
          transition: transform 260ms ease;
        }

        .naProductCard:hover .naViewProduct {
          transform: translateY(0);
        }

        .naStatusBox {
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          color: #77736c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-align: center;
          text-transform: uppercase;
        }

        @keyframes naMoveLeft {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes naMoveRight {
          from {
            transform: translate3d(-50%, 0, 0);
          }

          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (max-width: 1100px) and (min-width: 769px) {
          .naTrackItem {
            width: 188px;
            flex-basis: 188px;
          }

          .naMarqueeGroup {
            gap: 15px;
            padding-right: 15px;
          }

          .naRows {
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .naArrivalsSection {
            padding: 22px 10px 38px;
            overflow: visible;
          }

          .naDesktopRows {
            display: none;
          }

          .naMobileGrid {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px 10px;
          }

          .naProductCard {
            min-width: 0;
            border-radius: 2px;
            box-shadow: 0 5px 16px rgba(17, 17, 17, 0.055);
          }

          .naProductCard:hover {
            transform: none;
            box-shadow: 0 5px 16px rgba(17, 17, 17, 0.055);
          }

          .naProductBadge {
            top: 7px;
            left: 7px;
            min-height: 23px;
            padding: 0 7px;
            font-size: 7px;
            letter-spacing: 0.7px;
          }

          .naHeartButton {
            top: 7px;
            right: 7px;
            width: 28px;
            height: 28px;
          }

          .naViewProduct {
            height: 29px;
            font-size: 7px;
            letter-spacing: 0.9px;
            transform: translateY(0);
          }

          .naPriceBox {
            min-height: 41px;
            gap: 6px;
            padding: 0 9px;
          }

          .naCurrentPrice {
            font-size: 11px;
          }

          .naOriginalPrice {
            font-size: 8px;
          }
        }

        @media (max-width: 380px) {
          .naArrivalsSection {
            padding-right: 8px;
            padding-left: 8px;
          }

          .naMobileGrid {
            gap: 9px 8px;
          }

          .naProductBadge {
            max-width: calc(100% - 48px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .naPriceBox {
            padding: 0 7px;
          }

          .naCurrentPrice {
            font-size: 10px;
          }

          .naOriginalPrice {
            font-size: 7px;
          }
        }

        @media (hover: none) {
          .naViewProduct {
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .naMarqueeTrack,
          .naMarqueeTrack.naMarqueeReverse {
            animation-duration: 110s;
          }
        }
      `}</style>
    </section>
  );
}

function StatusBox({ text }: { text: string }) {
  return <div className="naStatusBox">{text}</div>;
}