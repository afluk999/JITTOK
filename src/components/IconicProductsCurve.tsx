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
  frontImage: string;
  backImage: string;
};

export default function IconicProductsCurve() {
  const [isPhone, setIsPhone] = useState(false);

  const [products, setProducts] = useState<CardProduct[]>(
    signatureProducts.map((product) => ({
      ...product,
      frontImage: "",
      backImage: "",
    }))
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
          signatureProducts.map((product) => {
            const signatureImages =
              content.signatureProductImages?.[product.slug] || [];

            const fallbackImage =
              content.iconicImages?.[product.imageIndex] || "";

            const frontImage =
              signatureImages[0] ||
              fallbackImage;

            const backImage =
              signatureImages[1] ||
              signatureImages[0] ||
              fallbackImage;

            return {
              ...product,
              frontImage,
              backImage,
            };
          })
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
        <div
          style={{
            width: "100%",
            maxWidth: isPhone ? "430px" : "1060px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isPhone
              ? "1fr"
              : "repeat(3, minmax(0, 1fr))",
            gap: isPhone ? "18px" : "22px",
            alignItems: "start",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.slug}
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
  const [hovered, setHovered] = useState(false);

  const hasDifferentBackImage =
    Boolean(product.backImage) &&
    product.backImage !== product.frontImage;

  return (
    <Link
      href={`/signature/${product.slug}`}
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
                padding: isPhone ? "5px" : "8px",
                objectFit: "contain",
                objectPosition: "center",
                boxSizing: "border-box",
                background: "#ffffff",
                opacity:
                  hovered && hasDifferentBackImage
                    ? 0
                    : 1,
                transform:
                  hovered && hasDifferentBackImage
                    ? "scale(1.04)"
                    : isPhone
                      ? "scale(1.08)"
                      : "scale(1.1)",
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
                  padding: isPhone ? "5px" : "8px",
                  objectFit: "contain",
                  objectPosition: "center",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  opacity:
                    hovered && hasDifferentBackImage
                      ? 1
                      : 0,
                  transform:
                    hovered && hasDifferentBackImage
                      ? "scale(1.1)"
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
            Add signature image in admin/content
          </div>
        )}

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
          <span
            style={{
              color: "#8b867f",
              fontSize: "10px",
              fontWeight: 700,
              textDecoration: "line-through",
            }}
          >
            {product.originalDisplayPrice}
          </span>

          <span
            style={{
              color: "#111111",
              fontSize: "14px",
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