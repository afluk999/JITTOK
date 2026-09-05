"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  getProductsByCollection,
  getProductSellingPrice,
  type FirebaseProduct,
} from "@/lib/productService";
import {
  getHomeContent,
  type CollectionDefinition,
} from "@/lib/contentService";

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}.00`;
}

function ProductCard({ product }: { product: FirebaseProduct }) {
  const { addToCart } = useCart();

  const [hovering, setHovering] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);

  const frontImage = product.images?.[0];
  const backImage = product.images?.[1] || frontImage;
  const price = getProductSellingPrice(product);
  const availableSizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : ["Free Size"];

  const isSoldOut =
    product.status === "sold-out" || Number(product.stock || 0) <= 0;

  function togglePicker(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (isSoldOut) return;
    setPickerOpen((open) => !open);
  }

  function handleConfirmAdd(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const sizeToUse = selectedSize || availableSizes[0];
    addToCart(product, sizeToUse, 1);

    setAdded(true);
    setPickerOpen(false);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div style={{ position: "relative" }}>
      <Link
        href={`/product/${product.slug}`}
        style={{ display: "block", textDecoration: "none" }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 4",
            overflow: "hidden",
            borderRadius: "10px",
            background: "#ececec",
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
                opacity: hovering && backImage ? 0 : 1,
                transition: "opacity 300ms ease",
              }}
            />
          ) : null}

          {backImage ? (
            <img
              src={backImage}
              alt={`${product.name} back`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovering ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
            />
          ) : null}

          {isSoldOut ? (
            <span
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                padding: "5px 10px",
                background: "#821f19",
                color: "#fff",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                borderRadius: "3px",
              }}
            >
              Sold Out
            </span>
          ) : null}
        </div>
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "10px",
          marginTop: "12px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.35,
              color: "#111111",
            }}
          >
            {product.name}
          </p>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              fontWeight: 600,
              color: "#4a4a4a",
            }}
          >
            {formatPrice(price)}
          </p>
        </div>

        <button
          type="button"
          onClick={togglePicker}
          disabled={isSoldOut}
          aria-label={
            isSoldOut ? `${product.name} sold out` : `Quick add ${product.name}`
          }
          style={{
            flexShrink: 0,
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            border: "1px solid rgba(17,17,17,0.2)",
            background: added ? "#237a35" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1,
            color: added ? "#ffffff" : "#111111",
            cursor: isSoldOut ? "not-allowed" : "pointer",
            opacity: isSoldOut ? 0.4 : 1,
          }}
        >
          {added ? "✓" : isSoldOut ? "×" : "+"}
        </button>
      </div>

      {pickerOpen ? (
        <>
          <div
            onClick={() => setPickerOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "transparent" }}
          />

          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: "calc(100% + 8px)",
              zIndex: 50,
              width: "200px",
              padding: "14px",
              background: "#ffffff",
              border: "1px solid rgba(17,17,17,0.12)",
              borderRadius: "10px",
              boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "#77736c",
              }}
            >
              Select Size
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
              {availableSizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setSelectedSize(size);
                    }}
                    style={{
                      minWidth: "34px",
                      height: "30px",
                      padding: "0 8px",
                      border: isActive ? "1px solid #111111" : "1px solid #d4ccc1",
                      background: isActive ? "#111111" : "transparent",
                      color: isActive ? "#ffffff" : "#111111",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              style={{
                width: "100%",
                height: "36px",
                border: "none",
                background: "#111111",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Add to Cart
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function ComingSoonPage({ name }: { name: string }) {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f8f4ec",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "160px 24px 100px",
          fontFamily: '"Outfit", sans-serif',
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "2px",
            color: "#77736c",
            textTransform: "uppercase",
          }}
        >
          JITTOK
        </p>

        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 800,
            color: "#171717",
            textTransform: "uppercase",
          }}
        >
          {name} — Coming Soon
        </h1>

        <p
          style={{
            margin: "0 0 30px",
            maxWidth: "420px",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#55524c",
          }}
        >
          This collection is currently under development. Follow JITTOK for
          the latest updates on when it drops.
        </p>

        <a
          href="https://www.instagram.com/jittok.in/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48px",
            padding: "0 26px",
            borderRadius: "6px",
            background: "#171717",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.6px",
            textDecoration: "none",
          }}
        >
          Follow @jittok.in
        </a>
      </main>

      <Footer />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f8f4ec",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Outfit", sans-serif',
          padding: "160px 24px 100px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: "0 0 16px" }}>Collection Not Found</h1>
          <Link href="/collections" style={{ color: "#111" }}>
            Back to Collections
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug.toLowerCase() : "";
  const [meta, setMeta] = useState<CollectionDefinition | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    function checkSize() {
      setIsPhone(window.innerWidth <= 768);
    }

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    async function loadMeta() {
      try {
        setMetaLoading(true);
        const content = await getHomeContent();
        const match =
          content.collectionsList?.find(
            (collection) => collection.slug === slug,
          ) ?? null;

        setMeta(match);
      } catch (error) {
        console.error("LOAD COLLECTION META ERROR:", error);
        setMeta(null);
      } finally {
        setMetaLoading(false);
      }
    }

    loadMeta();
  }, [slug]);

  useEffect(() => {
    if (!meta || meta.status !== "live") {
      setLoading(false);
      return;
    }

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProductsByCollection(slug);
        setProducts(data);
      } catch (error) {
        console.error("LOAD COLLECTION PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [slug, meta]);

  if (metaLoading) {
    return null;
  }

  if (!meta) {
    return <NotFoundPage />;
  }

  if (meta.status === "coming-soon") {
    return <ComingSoonPage name={meta.name} />;
  }

  const sectionStyle: CSSProperties = {
    minHeight: "100vh",
    background: "#ffffff",
    padding: isPhone ? "96px 16px 60px" : "140px 5vw 80px",
    fontFamily: '"Outfit", sans-serif',
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isPhone
      ? "repeat(2, minmax(0, 1fr))"
      : "repeat(4, minmax(0, 1fr))",
    gap: isPhone ? "16px" : "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  return (
    <>
      <Navbar />

      <main style={sectionStyle}>
        <h1
          style={{
            margin: `0 0 ${isPhone ? "24px" : "36px"}`,
            fontSize: isPhone ? "26px" : "36px",
            fontWeight: 800,
            color: "#171717",
            textTransform: "uppercase",
          }}
        >
          {meta.name}
        </h1>

        {loading ? (
          <p style={{ color: "#77736c", fontSize: "13px" }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ color: "#77736c", fontSize: "13px" }}>
            No products in this collection yet.
          </p>
        ) : (
          <div style={gridStyle}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}