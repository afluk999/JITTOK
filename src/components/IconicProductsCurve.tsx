"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getHomeContent } from "@/lib/contentService";
import {
  signatureProducts,
  type SignatureProduct,
} from "@/data/signatureProducts";

type CardProduct = SignatureProduct & {
  image: string;
};

export default function IconicProductsCurve() {
  const [isPhone, setIsPhone] = useState(false);
  const [products, setProducts] = useState<CardProduct[]>(
    signatureProducts.map((product) => ({ ...product, image: "" }))
  );

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
    async function loadSignatureImages() {
      try {
        const content = await getHomeContent();

        setProducts(
          signatureProducts.map((product) => ({
            ...product,
            image:
              content.signatureProductImages?.[product.slug]?.[0] ||
              content.iconicImages?.[product.imageIndex] ||
              "",
          }))
        );
      } catch (error) {
        console.error("LOAD SIGNATURE PRODUCT IMAGES ERROR:", error);
      }
    }

    loadSignatureImages();
  }, []);

  return (
    <section
      id="iconic-products"
      style={{
        position: "relative",
        zIndex: 40,
        width: "100%",
        background: "#ffffff",
        fontFamily: '"Outfit", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: isPhone ? "28px 12px 42px" : "72px 54px 82px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: isPhone ? "420px" : "1240px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isPhone
              ? "1fr"
              : "repeat(3, minmax(0, 1fr))",
            gap: isPhone ? "18px" : "24px",
            alignItems: "start",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: isPhone ? 22 : 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: isPhone ? 0.5 : 0.65,
                delay: index * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={isPhone ? undefined : { y: -8 }}
            >
              <SignatureCard
                product={product}
                number={String(index + 1).padStart(2, "0")}
                isPhone={isPhone}
              />
            </motion.div>
          ))}
        </div>
      </div>
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
  return (
    <Link
      href={`/signature/${product.slug}`}
      style={{
        display: "block",
        width: "100%",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid rgba(17,17,17,0.12)",
        boxShadow: isPhone
          ? "0 10px 28px rgba(17,17,17,0.07)"
          : "0 12px 34px rgba(17,17,17,0.08)",
        textDecoration: "none",
        color: "#111111",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: isPhone ? "4 / 4.7" : "4 / 5",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
              transform: isPhone ? "scale(1.1)" : "scale(1.08)",
              transformOrigin: "center",
              padding: isPhone ? "4px" : "10px",
              boxSizing: "border-box",
              background: "#ffffff",
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
              color: "#8a857d",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Add signature image in admin/content
          </div>
        )}

        <span
          style={{
            position: "absolute",
            left: isPhone ? "12px" : "20px",
            bottom: isPhone ? "10px" : "18px",
            color: "rgba(17,17,17,0.58)",
            fontSize: isPhone ? "10px" : "12px",
            fontWeight: 900,
            letterSpacing: "1.2px",
          }}
        >
          {number}
        </span>
      </div>

      <div
        style={{
          minHeight: isPhone ? "72px" : "78px",
          padding: isPhone ? "14px 16px 15px" : "16px 18px 17px",
          borderTop: "1px solid rgba(17,17,17,0.1)",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: isPhone ? "12px" : "13px",
            lineHeight: 1.25,
            fontWeight: 900,
            letterSpacing: "0.8px",
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
            gap: "7px",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              color: "#8b867f",
              fontSize: isPhone ? "10px" : "11px",
              fontWeight: 700,
              textDecoration: "line-through",
            }}
          >
            {product.originalDisplayPrice}
          </span>

          <span
            style={{
              color: "#111111",
              fontSize: isPhone ? "14px" : "15px",
              fontWeight: 900,
            }}
          >
            {product.displayPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
