"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { getHomeContent, SocialItem } from "@/lib/contentService";

function ReelCard({
  reel,
  index,
  isPhone,
}: {
  reel: SocialItem;
  index: number;
  isPhone: boolean;
}) {
  const isVideo =
    reel.image.includes(".mp4") ||
    reel.image.includes(".webm") ||
    reel.image.includes("/video/upload");

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={isPhone ? undefined : { y: -8 }}
      style={{
        width: "100%",
        maxWidth: isPhone ? "none" : "285px",
        margin: "0 auto",
        flex: isPhone ? "0 0 76vw" : undefined,
      }}
    >
      <a
        href={reel.link || "https://www.instagram.com/"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "9 / 16",
          position: "relative",
          overflow: "hidden",
          borderRadius: isPhone ? "20px" : "22px",
          background: "#e7ded2",
          boxShadow: "0 24px 60px rgba(52,42,30,0.14)",
          border: "1px solid rgba(255,255,255,0.75)",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {isVideo ? (
          <video
            src={reel.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        ) : (
          <img
            src={reel.image}
            alt={`JITTOK reel ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.02) 48%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: isPhone ? "14px" : "16px",
            right: isPhone ? "14px" : "16px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Volume2 size={15} strokeWidth={1.7} />
        </div>

        <div
          style={{
            position: "absolute",
            top: isPhone ? "14px" : "16px",
            left: isPhone ? "14px" : "16px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <FaInstagram size={17} />
        </div>

        <div
          style={{
            position: "absolute",
            left: isPhone ? "16px" : "18px",
            right: isPhone ? "16px" : "18px",
            bottom: isPhone ? "16px" : "18px",
            color: "#fff",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            JITTOK Styling
          </p>
        </div>
      </a>
    </motion.article>
  );
}

export default function ReelsSection() {
  const [reels, setReels] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const smallScreen = window.innerWidth <= 768;

      setIsPhone(phoneUserAgent && smallScreen);
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadReels() {
      try {
        const content = await getHomeContent();
        setReels(content.reelsItems || []);
      } catch (error) {
        console.error("LOAD REELS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReels();
  }, []);

  return (
    <section
      id="reels"
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #fbf7ef 0%, #f6f2eb 50%, #eee6da 100%)",
        color: "#111",
        fontFamily: '"Outfit", sans-serif',
        padding: isPhone ? "78px 0 76px" : "112px 54px 104px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: isPhone ? "0 18px 34px" : "0 auto 42px",
          display: isPhone ? "grid" : "grid",
          gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
          alignItems: "end",
          gap: isPhone ? "20px" : "40px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 16px",
              color: "#77736c",
              fontSize: isPhone ? "11px" : "12px",
              fontWeight: 800,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            Fashion Store Reels
          </p>

          <h2
            style={{
              margin: 0,
              fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
              fontSize: isPhone ? "64px" : "clamp(58px, 6vw, 96px)",
              lineHeight: 0.86,
              fontWeight: 400,
              letterSpacing: "-1px",
              textTransform: "uppercase",
            }}
          >
            Watch The Drop
          </h2>
        </div>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#111",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(17,17,17,0.7)",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <FaInstagram size={17} />
          View Instagram
        </a>
      </div>

      <div
        style={{
          maxWidth: "1240px",
          margin: isPhone ? "0" : "0 auto",
          display: isPhone ? "flex" : "grid",
          gridTemplateColumns: isPhone ? undefined : "repeat(4, minmax(0, 1fr))",
          gap: isPhone ? "18px" : "26px",
          alignItems: "start",
          overflowX: isPhone ? "auto" : "visible",
          padding: isPhone ? "0 18px 12px" : "0",
          scrollSnapType: isPhone ? "x mandatory" : undefined,
          scrollbarWidth: isPhone ? "none" : undefined,
        }}
      >
        {loading ? (
          <EmptyReel text="Loading reels..." isPhone={isPhone} />
        ) : reels.length === 0 ? (
          <EmptyReel text="Add reels from admin/content" isPhone={isPhone} />
        ) : (
          reels
            .slice(0, 4)
            .map((reel, index) => (
              <div
                key={`${reel.image}-${index}`}
                style={{
                  scrollSnapAlign: isPhone ? "start" : undefined,
                }}
              >
                <ReelCard reel={reel} index={index} isPhone={isPhone} />
              </div>
            ))
        )}
      </div>
    </section>
  );
}

function EmptyReel({
  text,
  isPhone,
}: {
  text: string;
  isPhone: boolean;
}) {
  return (
    <div
      style={{
        gridColumn: isPhone ? undefined : "1 / -1",
        minHeight: isPhone ? "320px" : "420px",
        width: isPhone ? "calc(100vw - 36px)" : "auto",
        border: "1px dashed #d4ccc1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#77736c",
        fontSize: "12px",
        fontWeight: 900,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        textAlign: "center",
        flex: isPhone ? "0 0 calc(100vw - 36px)" : undefined,
      }}
    >
      {text}
    </div>
  );
}