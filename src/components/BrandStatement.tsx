"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BrandStatement() {
  return (
    <section
      id="brand-story"
      style={{
        width: "100%",
        background: "#f6f2eb",
        color: "#111",
        fontFamily: '"Outfit", sans-serif',
        padding: "110px 54px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          borderTop: "1px solid rgba(17,17,17,0.14)",
          borderBottom: "1px solid rgba(17,17,17,0.14)",
          padding: "74px 0",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.4fr",
          gap: "70px",
          alignItems: "center",
        }}
      >
        {/* LEFT SMALL CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            style={{
              margin: "0 0 22px",
              color: "#77736c",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            08 / Brand Statement
          </p>

          <div
            style={{
              width: "38px",
              height: "1px",
              background: "#111",
              marginBottom: "30px",
            }}
          />

          <p
            style={{
              margin: 0,
              maxWidth: "270px",
              color: "#4d4943",
              fontSize: "15px",
              lineHeight: 1.75,
            }}
          >
            JITTOK creates everyday essentials with a clean fit, soft feel, and
            timeless streetwear attitude.
          </p>
        </motion.div>

        {/* RIGHT BIG STATEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
              fontSize: "clamp(64px, 7vw, 124px)",
              lineHeight: 0.86,
              fontWeight: 400,
              letterSpacing: "-1px",
              textTransform: "uppercase",
            }}
          >
            Built for comfort.
            <br />
            Made for everyday.
          </h2>

          <a
            href="/collections"
            style={{
              marginTop: "38px",
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              color: "#111",
              textDecoration: "none",
              paddingBottom: "10px",
              borderBottom: "1px solid rgba(17,17,17,0.72)",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Explore Collection
            <ArrowRight size={15} strokeWidth={1.8} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}