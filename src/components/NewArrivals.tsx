"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import {
  getNewArrivalProducts,
  type FirebaseProduct,
} from "@/lib/productService";

function ProductCard({
  product,
  index,
  isPhone,
}: {
  product: FirebaseProduct;
  index: number;
  isPhone: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const frontImage = product.images?.[0];
  const backImage = product.images?.[1] || product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: Math.min(index, 4) * 0.05,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        style={{
          color: "#111",
          textDecoration: "none",
          display: "block",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "3 / 4",
            background: "linear-gradient(180deg, #eee9e0 0%, #ddd6ca 100%)",
            marginBottom: isPhone ? "10px" : "12px",
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
                opacity: hovered && backImage && !isPhone ? 0 : 1,
                transform: hovered && !isPhone ? "scale(1.04)" : "scale(1)",
                transition: "opacity 0.35s ease, transform 0.55s ease",
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
                fontSize: isPhone ? "9px" : "11px",
                letterSpacing: isPhone ? "3px" : "4px",
                textTransform: "uppercase",
                textAlign: "center",
                padding: "10px",
              }}
            >
              Product Image
            </div>
          )}

          {backImage && !isPhone ? (
            <img
              src={backImage}
              alt={`${product.name} back`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered ? 1 : 0,
                transform: hovered ? "scale(1)" : "scale(1.04)",
                transition: "opacity 0.35s ease, transform 0.55s ease",
              }}
            />
          ) : null}

          <button
            type="button"
            aria-label={liked ? "Remove from favourites" : "Add to favourites"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLiked((previous) => !previous);
            }}
            style={{
              position: "absolute",
              top: isPhone ? "10px" : "14px",
              right: isPhone ? "10px" : "14px",
              width: isPhone ? "30px" : "32px",
              height: isPhone ? "30px" : "32px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 3,
            }}
          >
            <Heart
              size={isPhone ? 13 : 15}
              fill={liked ? "#111" : "none"}
              stroke="#111"
              strokeWidth={1.8}
            />
          </button>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: isPhone ? "38px" : "44px",
              background: "rgba(17,17,17,0.9)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isPhone ? "10px" : "11px",
              fontWeight: 900,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              transform: isPhone
                ? "translateY(0)"
                : hovered
                  ? "translateY(0)"
                  : "translateY(100%)",
              transition: "transform 0.28s ease",
            }}
          >
            View Product
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
            gap: isPhone ? "6px" : "10px",
            padding: "0 4px",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: isPhone ? "10px" : "11px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                color: "#111",
                textTransform: "uppercase",
                lineHeight: 1.25,
                display: "-webkit-box",
                WebkitLineClamp: isPhone ? 2 : 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.name}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: isPhone ? "9px" : "10px",
                color: "#77736c",
                letterSpacing: "1px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.variant}
            </p>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 800,
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            {product.displayPrice}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function getUniqueProducts(products: FirebaseProduct[]) {
  const usedKeys = new Set<string>();

  return products.filter((product, index) => {
    const key =
      product.id ||
      product.slug ||
      `${product.name}-${product.variant}-${index}`;

    if (usedKeys.has(key)) {
      return false;
    }

    usedKeys.add(key);
    return true;
  });
}

export default function NewArrivals() {
  const [orderedProducts, setOrderedProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);
  const [cardWidth, setCardWidth] = useState(250);
  const [translateX, setTranslateX] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const viewportRef = useRef<HTMLDivElement>(null);
  const movingRef = useRef(false);

  const gap = isPhone ? 14 : 16;

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
    async function loadNewArrivals() {
      try {
        const data = await getNewArrivalProducts();
        const uniqueProducts = getUniqueProducts(data);

        setOrderedProducts(uniqueProducts);
      } catch (error) {
        console.error("LOAD NEW ARRIVALS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    function calculateCardWidth() {
      const viewportElement = viewportRef.current;
      const productCount = orderedProducts.length;

      if (!viewportElement || productCount === 0) {
        return;
      }

      const visibleCount = isPhone
        ? 1
        : Math.min(productCount, 4);

      const totalGapWidth = gap * Math.max(visibleCount - 1, 0);
      const calculatedWidth =
        (viewportElement.clientWidth - totalGapWidth) / visibleCount;

      setTransitionEnabled(false);
      setTranslateX(0);
      setCardWidth(Math.max(calculatedWidth, 1));
      movingRef.current = false;

      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    }

    calculateCardWidth();

    const resizeObserver = new ResizeObserver(calculateCardWidth);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [gap, isPhone, orderedProducts.length]);

  const moveNext = useCallback(() => {
    if (
      orderedProducts.length < 2 ||
      movingRef.current ||
      cardWidth <= 0
    ) {
      return;
    }

    movingRef.current = true;
    setTransitionEnabled(true);
    setTranslateX(-(cardWidth + gap));
  }, [cardWidth, gap, orderedProducts.length]);

  useEffect(() => {
    if (orderedProducts.length < 2) {
      return;
    }

    const interval = window.setInterval(
      moveNext,
      isPhone ? 2800 : 3200
    );

    return () => window.clearInterval(interval);
  }, [isPhone, moveNext, orderedProducts.length]);

  function handleTrackTransitionEnd(
    event: TransitionEvent<HTMLDivElement>
  ) {
    if (
      event.propertyName !== "transform" ||
      !movingRef.current ||
      orderedProducts.length < 2
    ) {
      return;
    }

    setTransitionEnabled(false);

    setOrderedProducts((currentProducts) => {
      if (currentProducts.length < 2) {
        return currentProducts;
      }

      return [...currentProducts.slice(1), currentProducts[0]];
    });

    setTranslateX(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
        movingRef.current = false;
      });
    });
  }

  const productsForTrack =
    orderedProducts.length > 1
      ? [...orderedProducts, orderedProducts[0]]
      : orderedProducts;

  return (
    <section
      id="new-arrivals"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#ffffff",
        padding: isPhone ? "28px 0 44px" : "36px 48px 54px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <StatusBox text="Loading new arrivals..." isPhone={isPhone} />
        ) : orderedProducts.length === 0 ? (
          <StatusBox text="No new arrivals yet." isPhone={isPhone} />
        ) : (
          <div
            ref={viewportRef}
            style={{
              overflow: "hidden",
              width: "100%",
              touchAction: "pan-y",
            }}
          >
            <div
              onTransitionEnd={handleTrackTransitionEnd}
              style={{
                display: "flex",
                gap: `${gap}px`,
                width: "max-content",
                transform: `translate3d(${translateX}px, 0, 0)`,
                transition: transitionEnabled
                  ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
                willChange: "transform",
              }}
            >
              {productsForTrack.map((product, index) => {
                const isLoopClone =
                  orderedProducts.length > 1 &&
                  index === productsForTrack.length - 1;

                const productKey =
                  product.id ||
                  product.slug ||
                  `${product.name}-${product.variant}`;

                return (
                  <div
                    key={
                      isLoopClone
                        ? `loop-clone-${productKey}`
                        : productKey
                    }
                    aria-hidden={isLoopClone}
                    style={{
                      width: `${cardWidth}px`,
                      flex: `0 0 ${cardWidth}px`,
                    }}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      isPhone={isPhone}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBox({
  text,
  isPhone,
}: {
  text: string;
  isPhone: boolean;
}) {
  return (
    <div
      style={{
        minHeight: isPhone ? "240px" : "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#77736c",
        fontSize: "12px",
        fontWeight: 900,
        letterSpacing: "1px",
        textTransform: "uppercase",
        textAlign: "center",
        padding: isPhone ? "0 18px" : "0",
      }}
    >
      {text}
    </div>
  );
}