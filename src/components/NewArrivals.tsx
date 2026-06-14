"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FirebaseProduct,
  getNewArrivalProducts,
} from "@/lib/productService";

function ProductCard({
  product,
  index,
  isPhone,
}: {
  product: FirebaseProduct;
  index: number;
  isPhone: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const frontImage = product.images?.[0];
  const backImage = product.images?.[1] || product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        style={{
          color: "#111",
          textDecoration: "none",
          display: "block",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "3 / 4",
            background: "linear-gradient(180deg, #eee9e0 0%, #ddd6ca 100%)",
            marginBottom: isPhone ? "10px" : "12px",
          }}
        >
          {frontImage ? (
            <img
              src={frontImage}
              alt={product.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered && backImage && !isPhone ? 0 : 1,
                transform: hovered && !isPhone ? "scale(1.04)" : "scale(1)",
                transition: "opacity 0.35s ease, transform 0.55s ease",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8d867b",
                fontSize: isPhone ? "9px" : "11px",
                letterSpacing: isPhone ? "3px" : "4px",
                textTransform: "uppercase",
                textAlign: "center",
                padding: "10px",
              }}
            >
              Product Image
            </div>
          )}

          {backImage && !isPhone ? (
            <img
              src={backImage}
              alt={`${product.name} back`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered ? 1 : 0,
                transform: hovered ? "scale(1)" : "scale(1.04)",
                transition: "opacity 0.35s ease, transform 0.55s ease",
              }}
            />
          ) : null}

          <button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLiked(!liked);
            }}
            style={{
              position: "absolute",
              top: isPhone ? "10px" : "14px",
              right: isPhone ? "10px" : "14px",
              width: isPhone ? "30px" : "32px",
              height: isPhone ? "30px" : "32px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 3,
            }}
          >
            <Heart
              size={isPhone ? 13 : 15}
              fill={liked ? "#111" : "none"}
              stroke="#111"
              strokeWidth={1.8}
            />
          </button>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: isPhone ? "38px" : "44px",
              background: "rgba(17,17,17,0.9)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isPhone ? "10px" : "11px",
              fontWeight: 900,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              transform: isPhone
                ? "translateY(0)"
                : hovered
                ? "translateY(0)"
                : "translateY(100%)",
              transition: "transform 0.28s ease",
            }}
          >
            View Product
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
            gap: isPhone ? "6px" : "10px",
            padding: "0 4px",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: isPhone ? "10px" : "11px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                color: "#111",
                textTransform: "uppercase",
                lineHeight: 1.25,
                display: "-webkit-box",
                WebkitLineClamp: isPhone ? 2 : 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.name}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: isPhone ? "9px" : "10px",
                color: "#77736c",
                letterSpacing: "1px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.variant}
            </p>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: isPhone ? "12px" : "12px",
              fontWeight: 800,
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            {product.displayPrice}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function NewArrivals() {
  const [newArrivalProducts, setNewArrivalProducts] = useState<
    FirebaseProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
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
    async function loadNewArrivals() {
      try {
        const data = await getNewArrivalProducts();
        setNewArrivalProducts(data);
      } catch (error) {
        console.error("LOAD NEW ARRIVALS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  const repeatedProducts =
    newArrivalProducts.length > 0
      ? [...newArrivalProducts, ...newArrivalProducts]
      : [];

  return (
    <section
      id="new-arrivals"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#f6f2eb",
        padding: isPhone ? "76px 0 76px" : "96px 48px 90px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: isPhone ? "34px" : "34px",
            padding: isPhone ? "0 18px" : "0",
          }}
        >
          <p
            style={{
              fontSize: isPhone ? "10px" : "10px",
              letterSpacing: "2.5px",
              color: "#77736c",
              margin: "0 0 12px",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            New Arrivals
          </p>

          <div
            style={{
              display: isPhone ? "grid" : "flex",
              alignItems: isPhone ? "start" : "flex-end",
              justifyContent: "space-between",
              gap: isPhone ? "22px" : "50px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: isPhone ? "68px" : "clamp(58px, 7vw, 92px)",
                letterSpacing: "1px",
                color: "#111",
                lineHeight: 0.86,
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              New Arrivals
            </h2>

            <div
              style={{
                maxWidth: isPhone ? "100%" : "330px",
                borderLeft: isPhone ? "1px solid rgba(17,17,17,0.18)" : "none",
                paddingLeft: isPhone ? "16px" : "0",
              }}
            >
              <p
                style={{
                  margin: isPhone ? "0" : "0 0 8px",
                  fontSize: isPhone ? "13px" : "13px",
                  color: "#6b665f",
                  lineHeight: 1.75,
                }}
              >
                The latest additions to the JITTOK collection.
                <br />
                <span
                  style={{
                    color: "#111",
                    fontWeight: 800,
                  }}
                >
                  Timeless pieces, made to move with you.
                </span>
              </p>
            </div>

            <Link
              href="/collections"
              style={{
                marginBottom: isPhone ? "0" : "10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "11px",
                letterSpacing: "1.4px",
                color: "#111",
                textDecoration: "none",
                fontWeight: 900,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                width: "fit-content",
                borderBottom: isPhone ? "1px solid rgba(17,17,17,0.62)" : "none",
                paddingBottom: isPhone ? "9px" : "0",
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {loading ? (
          <StatusBox text="Loading new arrivals..." isPhone={isPhone} />
        ) : newArrivalProducts.length === 0 ? (
          <StatusBox text="No new arrivals yet." isPhone={isPhone} />
        ) : (
          <div
            style={{
              overflow: "hidden",
              width: "100%",
            }}
          >
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                duration: isPhone ? 22 : 28,
                ease: "linear",
              }}
              style={{
                display: "flex",
                gap: isPhone ? "14px" : "16px",
                width: "max-content",
                paddingLeft: isPhone ? "18px" : "0",
                paddingRight: isPhone ? "18px" : "0",
              }}
            >
              {repeatedProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  style={{
                    width: isPhone ? "210px" : "250px",
                    flex: "0 0 auto",
                  }}
                >
                  <ProductCard
                    product={product}
                    index={index}
                    isPhone={isPhone}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBox({ text, isPhone }: { text: string; isPhone: boolean }) {
  return (
    <div
      style={{
        minHeight: isPhone ? "240px" : "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#77736c",
        fontSize: "12px",
        fontWeight: 900,
        letterSpacing: "1px",
        textTransform: "uppercase",
        textAlign: "center",
        padding: isPhone ? "0 18px" : "0",
      }}
    >
      {text}
    </div>
  );
}