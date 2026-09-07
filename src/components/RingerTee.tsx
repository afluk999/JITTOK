"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { useCart } from "@/context/CartContext";
import {
  getProducts,
  getProductSellingPrice,
  type FirebaseProduct,
} from "@/lib/productService";

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}.00`;
}

function RingerTeeCard({
  product,
  isPhone,
}: {
  product: FirebaseProduct;
  isPhone: boolean;
}) {
  const { addToCart } = useCart();

  const [hovering, setHovering] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);

  const frontImage = product.images?.[0];
  const backImage = product.images?.[1] || frontImage;
  const price = getProductSellingPrice(product);
  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["Free Size"];

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
        </div>
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "10px",
          marginTop: "14px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: isPhone ? "12px" : "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "#111111",
            }}
          >
            {product.name}
          </p>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: isPhone ? "12px" : "14px",
              fontWeight: 500,
              color: "#bea7a7",
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
            marginTop: "2px",
            width: isPhone ? "24px" : "28px",
            height: isPhone ? "24px" : "28px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            fontSize: isPhone ? "16px" : "19px",
            fontWeight: 300,
            lineHeight: 1,
            color: added ? "#237a35" : "#e8dede",
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
              top: "calc(100% + 8px)",
              zIndex: 50,
              width: isPhone ? "170px" : "200px",
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
                color: "#f1efed",
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

export default function RingerTee() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    function checkSize() {
      setIsPhone(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1100);
    }

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    async function loadRingerTeeProducts() {
      try {
        const data = await getProducts();
        setProducts(
          data.filter((product) => {
            const candidate = product as FirebaseProduct & {
              category?: string;
              collection?: string;
              collectionName?: string;
            };
            const collection =
              candidate.category ??
              candidate.collection ??
              candidate.collectionName ??
              "";

            return collection.toLowerCase().includes("ringer");
          }),
        );
      } catch (error) {
        console.error("LOAD RINGER TEE PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRingerTeeProducts();
  }, []);

  if (loading || products.length === 0) return null;

  const columns = isPhone ? 2 : isTablet ? 3 : 5;

  const sectionStyle: CSSProperties = {
    width: "100%",
    background: "#f7f6f2",
    padding: isPhone ? "32px 16px 40px" : "46px 5vw 60px",
    fontFamily: '"Outfit", sans-serif',
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: isPhone ? "20px" : "28px",
  };

  const headingStyle: CSSProperties = {
    margin: 0,
    fontSize: isPhone ? "18px" : "22px",
    fontWeight: 800,
    color: "#111111",
  };

  const discoverButtonStyle: CSSProperties = {
    flexShrink: 0,
    height: isPhone ? "34px" : "40px",
    padding: isPhone ? "0 14px" : "0 20px",
    borderRadius: "999px",
    background: "#f5e7e7",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isPhone ? "10px" : "12px",
    fontWeight: 800,
    letterSpacing: "0.4px",
    textDecoration: "none",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: isPhone ? "16px" : "24px",
  };

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={headingStyle}>Ringer Tee</h2>

        <Link href="/collections" style={discoverButtonStyle}>
          Discover more
        </Link>
      </div>

      <div style={gridStyle}>
        {products.map((product) => (
          <RingerTeeCard
            key={product.id ?? product.slug}
            product={product}
            isPhone={isPhone}
          />
        ))}
      </div>
    </section>
  );
}