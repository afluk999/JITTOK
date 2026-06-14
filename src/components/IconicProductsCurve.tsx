"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getHomeContent } from "@/lib/contentService";
import { FirebaseProduct, getProducts } from "@/lib/productService";

type IconicProduct = {
  id: string;
  href: string;
  image: string;
};

const fallbackIconicProducts: IconicProduct[] = [
  {
    id: "01",
    href: "/collections",
    image: "/iconic-tee.png",
  },
  {
    id: "02",
    href: "/collections",
    image: "/iconic-hoodie.png",
  },
  {
    id: "03",
    href: "/collections",
    image: "/iconic-pants.png",
  },
];

export default function IconicProductsCurve() {
  const [isPhone, setIsPhone] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [iconicProducts, setIconicProducts] =
    useState<IconicProduct[]>(fallbackIconicProducts);

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
    async function loadIconicProducts() {
      try {
        const [content, products] = await Promise.all([
          getHomeContent(),
          getProducts(),
        ]);

        console.log("ALL PRODUCTS:", products);
        console.log(
          "FEATURED PRODUCTS:",
          products.filter((product: FirebaseProduct) => product.isFeatured)
        );
        console.log("ICONIC IMAGES:", content.iconicImages);

        const featuredProducts = products.filter(
          (product: FirebaseProduct) => product.isFeatured
        );

        const normalProducts = products.filter(
          (product: FirebaseProduct) => !product.isFeatured
        );

        const selectedProducts = [...featuredProducts, ...normalProducts]
          .filter((product) => product.slug)
          .slice(0, 3);

        if (selectedProducts.length === 0) {
          setIconicProducts(fallbackIconicProducts);
          return;
        }

        const finalProducts: IconicProduct[] = selectedProducts.map(
          (product, index) => {
            const adminIconicImage = content.iconicImages?.[index];
            const productImage = product.images?.[0];

            return {
              id: String(index + 1).padStart(2, "0"),
              href: `/product/${product.slug}`,
              image:
                adminIconicImage ||
                productImage ||
                fallbackIconicProducts[index]?.image ||
                "/iconic-tee.png",
            };
          }
        );

        setIconicProducts(finalProducts);
      } catch (error) {
        console.error("LOAD ICONIC PRODUCTS ERROR:", error);
        setIconicProducts(fallbackIconicProducts);
      }
    }

    loadIconicProducts();
  }, []);

  useEffect(() => {
    if (!isPhone) return;

    const timer = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % iconicProducts.length);
    }, 1600);

    return () => clearInterval(timer);
  }, [isPhone, iconicProducts.length]);

  const frontProduct = iconicProducts[activeProduct];
  const backProductOne =
    iconicProducts[(activeProduct + 1) % iconicProducts.length];
  const backProductTwo =
    iconicProducts[(activeProduct + 2) % iconicProducts.length];

  return (
    <section
      id="iconic-products"
      style={{
        position: "relative",
        zIndex: 40,
        marginTop: "0",
        background: "#f7f2ea",
        fontFamily: '"Outfit", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: isPhone ? "46px" : "52px",
          background:
            "linear-gradient(90deg, #111 0%, #2b2b2b 50%, #111 100%)",
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
          {Array.from({ length: 28 }).map((_, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: isPhone ? "14px" : "18px",
                paddingRight: isPhone ? "32px" : "42px",
                fontFamily:
                  '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                fontSize: isPhone ? "26px" : "30px",
                letterSpacing: isPhone ? "4px" : "5px",
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

      <div
        style={{
          padding: isPhone ? "58px 18px 72px" : "72px 54px 82px",
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.95), transparent 36%), linear-gradient(180deg, #fbf7ef 0%, #f1eadf 100%)",
        }}
      >
        {isPhone ? (
          <div
            style={{
              width: "100%",
              maxWidth: "330px",
              height: "390px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <StackCard
              product={backProductTwo}
              style={{
                position: "absolute",
                inset: "34px 0 0 54px",
                width: "78%",
                height: "330px",
                transform: "rotate(12deg)",
                opacity: 0.55,
                zIndex: 1,
              }}
            />

            <StackCard
              product={backProductOne}
              style={{
                position: "absolute",
                inset: "18px 0 0 34px",
                width: "84%",
                height: "350px",
                transform: "rotate(7deg)",
                opacity: 0.78,
                zIndex: 2,
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={frontProduct.id}
                initial={{ opacity: 0, x: 22, rotate: 2, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, rotate: -2, scale: 1 }}
                exit={{ opacity: 0, x: -22, rotate: -5, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "88%",
                  height: "365px",
                  zIndex: 5,
                }}
              >
                <IconicCard product={frontProduct} isPhone />
              </motion.div>
            </AnimatePresence>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "-8px",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                zIndex: 8,
              }}
            >
              {iconicProducts.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActiveProduct(index)}
                  aria-label={`View iconic product ${product.id}`}
                  style={{
                    width: activeProduct === index ? "22px" : "7px",
                    height: "7px",
                    borderRadius: "999px",
                    border: "none",
                    background:
                      activeProduct === index
                        ? "#111"
                        : "rgba(17,17,17,0.24)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
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
              <motion.div
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
                <IconicCard product={product} isPhone={false} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function IconicCard({
  product,
  isPhone,
}: {
  product: IconicProduct;
  isPhone: boolean;
}) {
  return (
    <Link
      href={product.href}
      style={{
        display: "block",
        height: isPhone ? "100%" : "460px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #eee7dc 0%, #d8cec0 100%)",
        border: "1px solid rgba(255,255,255,0.78)",
        boxShadow: isPhone
          ? "0 22px 55px rgba(52,42,30,0.18), inset 0 1px 0 rgba(255,255,255,0.75)"
          : "0 24px 70px rgba(52,42,30,0.15), inset 0 1px 0 rgba(255,255,255,0.75)",
        textDecoration: "none",
        clipPath: "polygon(7% 0%, 100% 0%, 93% 100%, 0% 100%)",
        borderRadius: "18px",
      }}
    >
      <img
        src={product.image}
        alt={`Iconic product ${product.id}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 38%, rgba(0,0,0,0.06) 100%)",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          position: "absolute",
          left: isPhone ? "20px" : "22px",
          bottom: isPhone ? "18px" : "20px",
          color: "rgba(17,17,17,0.55)",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: "1px",
        }}
      >
        {product.id}
      </span>
    </Link>
  );
}

function StackCard({
  product,
  style,
}: {
  product: IconicProduct;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        overflow: "hidden",
        background: "linear-gradient(180deg, #eee7dc 0%, #d8cec0 100%)",
        border: "1px solid rgba(255,255,255,0.78)",
        boxShadow: "0 18px 45px rgba(52,42,30,0.14)",
        clipPath: "polygon(7% 0%, 100% 0%, 93% 100%, 0% 100%)",
        borderRadius: "18px",
        ...style,
      }}
    >
      <img
        src={product.image}
        alt={`Iconic product ${product.id}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 42%, rgba(0,0,0,0.08) 100%)",
        }}
      />
    </div>
  );
}