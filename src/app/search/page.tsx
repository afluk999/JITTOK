"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FirebaseProduct, getProducts } from "@/lib/productService";
import { Search, Heart, ArrowRight } from "lucide-react";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function simpleMatch(query: string, text: string) {
  const q = normalizeText(query);
  const t = normalizeText(text);

  if (!q) return true;
  if (t.includes(q)) return true;

  const corrections: Record<string, string[]> = {
    tshrt: ["tshirt", "tee", "shirt"],
    tshrit: ["tshirt", "tee", "shirt"],
    tshirt: ["tshirt", "tee", "shirt"],
    tee: ["tshirt", "tee", "shirt"],
    hodi: ["hoodie", "hoodies"],
    hoodi: ["hoodie", "hoodies"],
    hoody: ["hoodie", "hoodies"],
    pant: ["pants", "sweatpants"],
    swetpant: ["sweatpants", "pants"],
    swetpants: ["sweatpants", "pants"],
    accesory: ["accessories"],
  };

  const words = corrections[q] || [];

  return words.some((word) => t.includes(normalizeText(word)));
}

export default function SearchPage() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [query, setQuery] = useState("");
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
        console.error("LOAD SEARCH PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return products;

    return products.filter((product) => {
      const searchText = [
        product.name,
        product.variant,
        product.category,
        product.description,
        ...(product.sizes || []),
      ].join(" ");

      return simpleMatch(query, searchText);
    });
  }, [products, query]);

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f6f2eb",
          color: "#111",
          fontFamily: '"Outfit", sans-serif',
          padding: isPhone ? "96px 16px 64px" : "140px 42px 90px",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <header
            style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
              gap: isPhone ? "20px" : "34px",
              alignItems: "end",
              marginBottom: isPhone ? "32px" : "44px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  color: "#77736c",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Search JITTOK
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: isPhone ? "76px" : "clamp(82px, 9vw, 146px)",
                  lineHeight: 0.82,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Find Product
              </h1>
            </div>

            <p
              style={{
                margin: isPhone ? 0 : "0 0 10px",
                maxWidth: isPhone ? "100%" : "360px",
                color: "#4d4943",
                fontSize: isPhone ? "13px" : "14px",
                lineHeight: 1.7,
              }}
            >
              Search by product name, category, size, or almost-correct
              spelling.
            </p>
          </header>

          <section
            style={{
              background: "#f2eee7",
              border: "1px solid #e5ded4",
              padding: isPhone ? "16px" : "22px",
              marginBottom: isPhone ? "30px" : "38px",
            }}
          >
            <div
              style={{
                height: isPhone ? "54px" : "62px",
                background: "#f6f2eb",
                border: "1px solid #d8d0c4",
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                alignItems: "center",
              }}
            >
              <Search
                size={20}
                strokeWidth={1.8}
                style={{
                  justifySelf: "center",
                  color: "#77736c",
                }}
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search: tshirt, hodi, pant..."
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#111",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: isPhone ? "14px" : "16px",
                  fontWeight: 700,
                }}
              />
            </div>

            <p
              style={{
                margin: "14px 0 0",
                color: "#77736c",
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              Try: <strong>tshrt</strong>, <strong>hoodi</strong>,{" "}
              <strong>swet pant</strong>, <strong>tee</strong>
            </p>
          </section>

          {loading ? (
            <EmptyBox text="Loading products..." isPhone={isPhone} />
          ) : results.length === 0 ? (
            <EmptyBox text="No matching products found." isPhone={isPhone} />
          ) : (
            <>
              <p
                style={{
                  margin: "0 0 22px",
                  color: "#77736c",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {results.length} result{results.length === 1 ? "" : "s"} found
              </p>

              <section
                style={{
                  display: "grid",
                  gridTemplateColumns: isPhone
                    ? "repeat(2, minmax(0, 1fr))"
                    : "repeat(4, minmax(0, 1fr))",
                  gap: isPhone ? "22px 12px" : "18px",
                }}
              >
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isPhone={isPhone}
                  />
                ))}
              </section>
            </>
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
            gap: "6px",
            color: "#111",
            fontSize: isPhone ? "9px" : "11px",
            fontWeight: 900,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(17,17,17,0.5)",
            paddingBottom: "3px",
          }}
        >
          View Product <ArrowRight size={isPhone ? 11 : 13} />
        </span>
      </article>
    </Link>
  );
}

function EmptyBox({ text, isPhone }: { text: string; isPhone: boolean }) {
  return (
    <section
      style={{
        minHeight: isPhone ? "260px" : "360px",
        background: "#f2eee7",
        border: "1px solid #e5ded4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#77736c",
        fontSize: "12px",
        fontWeight: 900,
        letterSpacing: "1px",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "24px",
      }}
    >
      {text}
    </section>
  );
}