"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "OVERSIZED TEE",
    variant: "IVORY",
    price: "₹1,299.00",
    image: "/arrival-1.png",
  },
  {
    id: 2,
    name: "GRAPHIC TEE",
    variant: "CHARCOAL",
    price: "₹1,399.00",
    image: "/arrival-2.png",
  },
  {
    id: 3,
    name: "SIGNATURE HOODIE",
    variant: "BLACK",
    price: "₹2,499.00",
    image: "/arrival-3.png",
  },
  {
    id: 4,
    name: "WIDE SWEATPANTS",
    variant: "GREY",
    price: "₹1,899.00",
    image: "/arrival-4.png",
  },
  {
    id: 5,
    name: "POCKET TEE",
    variant: "TAUPE",
    price: "₹1,299.00",
    image: "/arrival-5.png",
  },
  {
    id: 6,
    name: "MINIMAL LOGO TEE",
    variant: "BLACK",
    price: "₹1,199.00",
    image: "/arrival-6.png",
  },
  {
    id: 7,
    name: "CARGO PANTS",
    variant: "BLACK",
    price: "₹2,299.00",
    image: "/arrival-7.png",
  },
  {
    id: 8,
    name: "CORE HOODIE",
    variant: "SANDSTONE",
    price: "₹2,499.00",
    image: "/arrival-8.png",
  },
  {
    id: 9,
    name: "LOGO CAP",
    variant: "BLACK",
    price: "₹899.00",
    image: "/arrival-9.png",
  },
  {
    id: 10,
    name: "PREMIUM TEE",
    variant: "BONE",
    price: "₹1,299.00",
    image: "/arrival-10.png",
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.55,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
      }}
    >
      {/* IMAGE AREA */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "0.86 / 1",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #eee9e0 0%, #ddd6ca 100%)",
          marginBottom: "14px",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{
            objectFit: "cover",
            display: "block",
            opacity: 0,
          }}
        />

        {/* PLACEHOLDER */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8d867b",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        >
          Product Image
        </div>

        {/* HEART */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            fill={liked ? "#111" : "none"}
            color="#111"
          />
        </button>

        {/* QUICK ADD */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "44px",
            border: "none",
            background: added ? "#4a7c59" : "#111",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1.4px",
            cursor: "pointer",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.28s ease, background 0.2s ease",
          }}
        >
          {added ? "ADDED ✓" : "QUICK ADD"}
        </button>
      </div>

      {/* INFO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "12px",
          padding: "0 8px",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 7px",
              color: "#111",
              fontSize: "12px",
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              margin: 0,
              color: "#77736c",
              fontSize: "11px",
              lineHeight: 1,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            {product.variant}
          </p>
        </div>

        <p
          style={{
            margin: 0,
            color: "#111",
            fontSize: "12px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {product.price}
        </p>
      </div>
    </motion.article>
  );
}

export default function NewArrivals() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f6f2eb",
        color: "#111",
        fontFamily: '"Outfit", sans-serif',
        padding: "130px 50px 58px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "36px",
        }}
      >
        <p
          style={{
            margin: "0 0 16px",
            color: "#77736c",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
          }}
        >
          05 / New Arrivals
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr auto",
            alignItems: "end",
            gap: "80px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: "clamp(66px, 6vw, 92px)",
              lineHeight: 0.86,
              letterSpacing: "-1px",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            New Arrivals
          </h2>

          <p
            style={{
              margin: "0 0 8px",
              color: "#44413d",
              fontSize: "13px",
              lineHeight: 1.55,
              maxWidth: "340px",
            }}
          >
            The latest additions to the JITTOK collection.
            <br />
            Timeless pieces, made to move with you.
          </p>

          <a
            href="#"
            style={{
              marginBottom: "10px",
              color: "#111",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "13px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            View All <ArrowRight size={15} strokeWidth={1.8} />
          </a>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "36px 14px",
        }}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}