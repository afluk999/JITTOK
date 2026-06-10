"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const iconicProducts = [
  {
    id: "01",
    href: "/product/oversized-tee-ivory",
    image: "/iconic-tee.png",
  },
  {
    id: "02",
    href: "/product/signature-hoodie-black",
    image: "/iconic-hoodie.png",
  },
  {
    id: "03",
    href: "/product/wide-sweatpants-grey",
    image: "/iconic-pants.png",
  },
];

function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {!loaded || error ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8d8579",
            fontSize: "12px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            background:
              "linear-gradient(180deg, #eee7dc 0%, #d8cec0 100%)",
          }}
        >
          Product Image
        </div>
      ) : null}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          opacity: loaded && !error ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />
    </>
  );
}

export default function IconicProductsCurve() {
  return (
    <section
      id="iconic-products"
      style={{
        position: "relative",
        zIndex: 40,
        background: "#f7f2ea",
        fontFamily: '"Outfit", sans-serif',
        overflow: "hidden",
      }}
    >
      {/* MOVING JITTOK TAG STRIP */}
      <div
        style={{
          height: "54px",
          background:
            "linear-gradient(90deg, #101010 0%, #2a2a2a 50%, #101010 100%)",
          color: "#f7f2ea",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            minWidth: "200%",
          }}
        >
          {Array.from({ length: 30 }).map((_, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "18px",
                paddingRight: "44px",
                fontFamily:
                  '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                fontSize: "31px",
                letterSpacing: "5px",
                textTransform: "uppercase",
              }}
            >
              JITTOK
              <small
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#f7f2ea",
                  display: "inline-block",
                  opacity: 0.75,
                }}
              />
            </span>
          ))}
        </motion.div>
      </div>

      {/* PRODUCT IMAGE CARDS */}
      <div
        style={{
          padding: "70px 54px 82px",
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.95), transparent 36%), linear-gradient(180deg, #fbf7ef 0%, #f1eadf 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "28px",
          }}
        >
          {iconicProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8 }}
            >
              <Link
                href={product.href}
                style={{
                  display: "block",
                  height: "460px",
                  position: "relative",
                  overflow: "hidden",
                  background:
                    "linear-gradient(180deg, #eee7dc 0%, #d8cec0 100%)",
                  border: "1px solid rgba(255,255,255,0.78)",
                  boxShadow:
                    "0 24px 70px rgba(52,42,30,0.15), inset 0 1px 0 rgba(255,255,255,0.75)",
                  textDecoration: "none",
                  clipPath:
                    "polygon(7% 0%, 100% 0%, 93% 100%, 0% 100%)",
                  borderRadius: "18px",
                }}
              >
                <ProductImage
                  src={product.image}
                  alt={`Iconic product ${product.id}`}
                />

                {/* LIGHT OVERLAY */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* SMALL NUMBER */}
                <span
                  style={{
                    position: "absolute",
                    left: "24px",
                    bottom: "22px",
                    color: "rgba(17,17,17,0.58)",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                  }}
                >
                  {product.id}
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}