"use client";

import { motion } from "framer-motion";

const MESSAGE = "JITTOK ON FITTOK";

export default function PosterStrip() {
  return (
    <div
      style={{
        width: "100%",
        height: "34px",
        overflow: "hidden",
        background: "#111111",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          minWidth: "200%",
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "22px",
              paddingRight: "38px",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            {MESSAGE}

            <span
              aria-hidden="true"
              style={{
                fontSize: "12px",
                opacity: 0.7,
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}