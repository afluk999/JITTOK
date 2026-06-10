"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/hero-slide-1.png",
  },

  // Add more later:
  // { id: 2, image: "/hero-slide-2.png" },
  // { id: 3, image: "/hero-slide-3.png" },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  function nextSlide() {
    setActive((prev) => (prev + 1) % slides.length);
  }

  function prevSlide() {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        width: "100%",
        height: "calc(100vh - 82px)",
        minHeight: "640px",
        marginTop: "82px",
        position: "relative",
        overflow: "hidden",
        background: "#e9e6e0",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={slides[active].id}
          src={slides[active].image}
          alt="JITTOK hero campaign"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
            display: "block",
          }}
        />
      </AnimatePresence>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 55%, rgba(0,0,0,0.06) 100%)",
          pointerEvents: "none",
        }}
      />

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            style={{
              position: "absolute",
              left: "42px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.65)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={22} strokeWidth={1.7} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            style={{
              position: "absolute",
              right: "42px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.65)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={22} strokeWidth={1.7} />
          </button>
        </>
      )}
    </section>
  );
}