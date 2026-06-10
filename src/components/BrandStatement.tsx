"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BrandStatement() {
  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "760px",
        position: "relative",
        overflow: "hidden",
        background: "#2f302b",
        color: "#eee9df",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(23,24,21,0.88) 0%, rgba(43,43,38,0.72) 43%, rgba(28,29,25,0.86) 100%), linear-gradient(135deg, #5b594f 0%, #272823 100%)",
          zIndex: 1,
        }}
      />

      {/* REAL IMAGE SLOT */}
      <img
        src="/brand-model.png"
        alt="JITTOK model"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center right",
          opacity: 0,
          zIndex: 2,
        }}
      />

      {/* DIAGONAL LIGHT SHAFT */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "18%",
          width: "38%",
          height: "145%",
          background:
            "linear-gradient(116deg, rgba(255,246,224,0.43) 0%, rgba(255,246,224,0.17) 32%, transparent 57%)",
          transform: "rotate(-18deg)",
          transformOrigin: "top left",
          mixBlendMode: "screen",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* DARK EDGE VIGNETTE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 66% 48%, transparent 0%, rgba(0,0,0,0.08) 36%, rgba(0,0,0,0.34) 100%)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* MODEL PLACEHOLDER */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          right: "23%",
          bottom: "-5%",
          width: "330px",
          height: "82vh",
          borderRadius: "220px 220px 0 0",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.11)",
          boxShadow: "0 45px 120px rgba(0,0,0,0.35)",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.28)",
          fontSize: "11px",
          letterSpacing: "7px",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        Model Image
      </motion.div>

      {/* TOP LEFT LOGO */}
      <div
        style={{
          position: "absolute",
          top: "42px",
          left: "52px",
          zIndex: 10,
          fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
          fontSize: "34px",
          letterSpacing: "4px",
          color: "#090908",
          lineHeight: 1,
        }}
      >
        JITTOK
        <sup
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "9px",
            marginLeft: "4px",
            position: "relative",
            top: "-14px",
          }}
        >
          ®
        </sup>
      </div>

      {/* TOP RIGHT LINKS */}
      <div
        style={{
          position: "absolute",
          top: "46px",
          right: "55px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "58px",
        }}
      >
        <a
          href="#"
          style={{
            color: "#eee9df",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.3px",
            textTransform: "uppercase",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(238,233,223,0.72)",
          }}
        >
          Our Story
        </a>

        <a
          href="#"
          style={{
            color: "#eee9df",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.3px",
            textTransform: "uppercase",
          }}
        >
          Quality
        </a>
      </div>

      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: "52px",
          top: "17.5%",
          zIndex: 10,
          width: "520px",
        }}
      >
        <p
          style={{
            margin: "0 0 18px",
            color: "rgba(238,233,223,0.82)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
          }}
        >
          Built on Purpose
        </p>

        <div
          style={{
            width: "34px",
            height: "1px",
            background: "rgba(238,233,223,0.72)",
            marginBottom: "26px",
          }}
        />

        <h2
          style={{
            margin: 0,
            fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
            fontSize: "clamp(88px, 8.3vw, 132px)",
            lineHeight: 0.86,
            letterSpacing: "-1px",
            fontWeight: 400,
            color: "#eee9df",
            textTransform: "uppercase",
          }}
        >
          Essentials
          <br />
          That Move
          <br />
          With You.
        </h2>

        <p
          style={{
            margin: "28px 0 28px",
            color: "rgba(238,233,223,0.9)",
            fontSize: "15px",
            lineHeight: 1.6,
            width: "300px",
          }}
        >
          Timeless design. Thoughtful details.
          <br />
          Made for everyday life.
        </p>

        <motion.a
          href="#"
          whileHover={{ x: 5 }}
          style={{
            width: "fit-content",
            display: "inline-flex",
            alignItems: "center",
            gap: "22px",
            color: "#eee9df",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(238,233,223,0.72)",
          }}
        >
          Discover Our Philosophy <ArrowRight size={15} strokeWidth={1.8} />
        </motion.a>
      </motion.div>

      {/* RIGHT QUOTE */}
      <p
        style={{
          position: "absolute",
          right: "76px",
          top: "51%",
          zIndex: 10,
          margin: 0,
          width: "250px",
          color: "rgba(238,233,223,0.88)",
          fontSize: "15px",
          lineHeight: 1.7,
          textAlign: "center",
        }}
      >
        Not just what you wear,
        <br />
        but how you live in it.
      </p>

      {/* BOTTOM PROGRESS */}
      <div
        style={{
          position: "absolute",
          left: "52px",
          bottom: "44px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "34px",
          width: "44%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            minWidth: "58px",
            color: "#eee9df",
          }}
        >
          <span
            style={{
              fontSize: "25px",
              fontWeight: 500,
            }}
          >
            01
          </span>
          <span
            style={{
              fontSize: "13px",
              opacity: 0.55,
            }}
          >
            / 06
          </span>
        </div>

        <div
          style={{
            position: "relative",
            flex: 1,
            height: "1px",
            background: "rgba(238,233,223,0.18)",
          }}
        >
          <div
            style={{
              width: "22%",
              height: "1px",
              background: "#eee9df",
            }}
          />
        </div>
      </div>
    </section>
  );
}