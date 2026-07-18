"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getHomeContent } from "@/lib/contentService";

export default function BrandStatement() {
  const [brandStatement, setBrandStatement] = useState(
    "JITTOK creates everyday essentials with a clean fit, soft feel, and timeless streetwear attitude."
  );
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const smallScreen = window.innerWidth <= 768;
      const touchLikeDevice =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsPhone(smallScreen && (phoneUserAgent || touchLikeDevice));
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadBrandStatement() {
      try {
        const content = await getHomeContent();

        setBrandStatement(
          content.brandStatement ||
            "JITTOK creates everyday essentials with a clean fit, soft feel, and timeless streetwear attitude."
        );
      } catch (error) {
        console.error("LOAD BRAND STATEMENT ERROR:", error);
      }
    }

    loadBrandStatement();
  }, []);

  return (
    <section
      id="brand-story"
      style={{
        width: "100%",
        background: "#ffffff",
        color: "#111",
        fontFamily: '"Outfit", sans-serif',
        padding: isPhone ? "78px 0" : "110px 54px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          borderTop: "1px solid rgba(17,17,17,0.14)",
          borderBottom: "1px solid rgba(17,17,17,0.14)",
          padding: isPhone ? "54px 18px" : "74px 0",
          display: "grid",
          gridTemplateColumns: isPhone ? "1fr" : "0.9fr 1.4fr",
          gap: isPhone ? "40px" : "70px",
          alignItems: "center",
        }}
      >
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
              maxWidth: isPhone ? "100%" : "270px",
              color: "#4d4943",
              fontSize: isPhone ? "14px" : "15px",
              lineHeight: 1.75,
            }}
          >
            {brandStatement}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            overflow: isPhone ? "hidden" : "visible",
            marginLeft: isPhone ? "-18px" : "0",
            marginRight: isPhone ? "-18px" : "0",
          }}
        >
          {isPhone ? (
            <div
              style={{
                width: "100%",
                overflow: "hidden",
                borderTop: "1px solid rgba(17,17,17,0.12)",
                borderBottom: "1px solid rgba(17,17,17,0.12)",
                padding: "18px 0 14px",
              }}
            >
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "linear",
                }}
                style={{
                  display: "flex",
                  whiteSpace: "nowrap",
                  width: "max-content",
                }}
              >
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      paddingRight: "32px",
                      fontFamily:
                        '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                      fontSize: "72px",
                      lineHeight: 0.86,
                      fontWeight: 400,
                      letterSpacing: "-1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Built for comfort. Made for everyday.
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#111",
                        display: "inline-block",
                        margin: "0 24px",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
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
          )}

          <a
            href="/collections"
            style={{
              marginTop: isPhone ? "30px" : "38px",
              marginLeft: isPhone ? "18px" : "0",
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
