"use client";

import { motion } from "framer-motion";

const messages = [
  "EASY RETURNS",
  "FREE SHIPPING ON PREPAID",
  "COD AVAILABLE",
];

export default function AnnouncementBar() {
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
        borderBottom: "1px solid rgba(255,255,255,0.14)",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 24,
          ease: "linear",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          minWidth: "200%",
        }}
      >
        {Array.from({ length: 8 }).flatMap((_, groupIndex) =>
          messages.map((message, messageIndex) => (
            <span
              key={`${groupIndex}-${messageIndex}`}
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
              {message}

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
          ))
        )}
      </motion.div>
    </div>
  );
}
