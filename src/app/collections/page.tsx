"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FirebaseProduct, getProducts } from "@/lib/productService";
import { Heart } from "lucide-react";

const categories = ["All", "T-Shirts", "Hoodies", "Pants", "Accessories"];

export default function CollectionsPage() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
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
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("LOAD COLLECTION PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

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
                  key={product.id}
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
  const image = product.images?.[0];

  return (
    <Link
      href={`/product/${product.slug}`}
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
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
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

          <button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            style={{
              position: "absolute",
              top: isPhone ? "8px" : "14px",
              right: isPhone ? "8px" : "14px",
              width: isPhone ? "28px" : "34px",
              height: isPhone ? "28px" : "34px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.72)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Heart size={isPhone ? 12 : 15} strokeWidth={1.8} />
          </button>
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

          <p
            style={{
              margin: "0 0 8px",
              fontSize: isPhone ? "11px" : "13px",
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            {product.displayPrice}
          </p>

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