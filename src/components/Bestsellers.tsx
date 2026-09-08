"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { useCart } from "@/context/CartContext";
import {
  getBestSellerProducts,
  getProductOriginalPrice,
  getProductSellingPrice,
  type FirebaseProduct,
} from "@/lib/productService";

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}.00`;
}

function BestSellerCard({
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
  const originalPrice = getProductOriginalPrice(product);
  const hasDiscount = originalPrice !== null && originalPrice > price;
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
            <Image
              src={frontImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 20vw"
              style={{
                objectFit: "cover",
                opacity: hovering && backImage ? 0 : 1,
                transition: "opacity 300ms ease",
              }}
            />
          ) : null}

          {backImage ? (
            <Image
              src={backImage}
              alt={`${product.name} back`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 20vw"
              style={{
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
              fontSize: isPhone ? "11px" : "13px",
              fontWeight: 600,
              lineHeight: 1.35,
              color: "#111111",
            }}
          >
            {product.name}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              marginTop: "4px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: isPhone ? "11px" : "13px",
                fontWeight: 600,
                color: "#4a4a4a",
              }}
            >
              {formatPrice(price)}
            </span>

            {hasDiscount ? (
              <span
                style={{
                  fontSize: isPhone ? "10px" : "12px",
                  fontWeight: 500,
                  color: "#a19c94",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(originalPrice!)}
              </span>
            ) : null}
          </div>
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
            width: isPhone ? "22px" : "26px",
            height: isPhone ? "22px" : "26px",
            borderRadius: "50%",
            border: "1px solid rgba(17,17,17,0.2)",
            background: added ? "#237a35" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            fontSize: isPhone ? "13px" : "16px",
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

export default function BestSellers() {
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
    async function loadBestSellers() {
      try {
        const data = await getBestSellerProducts();
        setProducts(data);
      } catch (error) {
        console.error("LOAD BEST SELLERS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBestSellers();
  }, []);

  if (loading || products.length === 0) return null;

  const columns = isPhone ? 2 : isTablet ? 3 : 5;

  const sectionStyle: CSSProperties = {
    width: "100%",
    background: "#ffffff",
    padding: isPhone ? "32px 16px 40px" : "46px 5vw 60px",
    fontFamily: '"Outfit", sans-serif',
  };

  const headingStyle: CSSProperties = {
    margin: "0 0 26px",
    fontSize: isPhone ? "18px" : "22px",
    fontWeight: 800,
    color: "#111111",
    letterSpacing: "0.1px",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: isPhone ? "12px" : "18px",
  };

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>Best Seller</h2>

      <div style={gridStyle}>
        {products.map((product) => (
          <BestSellerCard
            key={product.id ?? product.slug}
            product={product}
            isPhone={isPhone}
          />
        ))}
      </div>
    </section>
  );
}