"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense, type CSSProperties, type MouseEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  getAllStoreProducts,
  getProductOriginalPrice,
  getProductSellingPrice,
  type FirebaseProduct,
} from "@/lib/productService";
import {
  getHomeContent,
  defaultStoreCategoriesList,
  type StoreCategoryDefinition,
} from "@/lib/contentService";

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}.00`;
}

function ProductCard({
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
            background: "#ffff",
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

function StoreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<StoreCategoryDefinition[]>(
    defaultStoreCategoriesList,
  );
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialCategory);
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
    async function loadStore() {
      try {
        setLoading(true);

        const [content, productData] = await Promise.all([
          getHomeContent(),
          getAllStoreProducts(),
        ]);

        setCategories(
          content.storeCategoriesList && content.storeCategoriesList.length > 0
            ? content.storeCategoriesList
            : defaultStoreCategoriesList,
        );
        setProducts(productData);
      } catch (error) {
        console.error("LOAD STORE ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStore();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.storeCategory === activeFilter);
  }, [products, activeFilter]);

  const columns = isPhone ? 2 : isTablet ? 3 : 5;

  const pageStyle: CSSProperties = {
    minHeight: "100vh",
    background: "#f8f4ec",
    fontFamily: '"Outfit", sans-serif',
    padding: isPhone ? "96px 16px 60px" : "140px 5vw 80px",
  };

  const buttonRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: isPhone ? "8px" : "12px",
    marginBottom: isPhone ? "26px" : "36px",
  };

  function getFilterButtonStyle(isActive: boolean): CSSProperties {
    return {
      height: isPhone ? "40px" : "46px",
      padding: isPhone ? "0 16px" : "0 22px",
      border: isActive ? "1px solid #111" : "1px solid #d4ccc1",
      borderRadius: "6px",
      background: isActive ? "#111" : "#ffffff",
      color: isActive ? "#ffffff" : "#111",
      fontSize: isPhone ? "11px" : "12px",
      fontWeight: 800,
      letterSpacing: "0.6px",
      textTransform: "uppercase",
      cursor: "pointer",
      whiteSpace: "nowrap",
    };
  }

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: isPhone ? "12px" : "20px",
  };

  return (
    <>
      <Navbar />

      <main style={pageStyle}>
        <h1
          style={{
            margin: `0 0 ${isPhone ? "20px" : "30px"}`,
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: isPhone ? "48px" : "72px",
            lineHeight: 0.9,
            fontWeight: 400,
            textTransform: "uppercase",
            color: "#171717",
          }}
        >
          Store
        </h1>

        <div style={buttonRowStyle}>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            style={getFilterButtonStyle(activeFilter === "all")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveFilter(category.slug)}
              style={getFilterButtonStyle(activeFilter === category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "#77736c", fontSize: "13px" }}>
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ color: "#77736c", fontSize: "13px" }}>
            No products in this category yet.
          </p>
        ) : (
          <div style={gridStyle}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id ?? product.slug}
                product={product}
                isPhone={isPhone}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={null}>
      <StoreContent />
    </Suspense>
  );
}