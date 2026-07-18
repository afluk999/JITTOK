"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHomeContent } from "@/lib/contentService";

function ImageBlock({
  src,
  index,
  style,
  isPhone,
}: {
  src?: string;
  index: number;
  style?: React.CSSProperties;
  isPhone: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.75,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={isPhone ? undefined : { scale: 0.985 }}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #e8e1d7 0%, #d3c8b9 100%)",
        border: "1px solid rgba(255,255,255,0.78)",
        boxShadow: "0 22px 60px rgba(45,35,25,0.11)",
        clipPath: "polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)",
        ...style,
      }}
    >
      {!src || !loaded || error ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8d8579",
            fontSize: isPhone ? "10px" : "12px",
            letterSpacing: isPhone ? "3px" : "5px",
            textTransform: "uppercase",
            zIndex: 1,
          }}
        >
          Image
        </div>
      ) : null}

      {src ? (
        <motion.img
          src={src}
          alt={`JITTOK editorial ${index + 1}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          whileHover={isPhone ? undefined : { scale: 1.055 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            opacity: loaded && !error ? 1 : 0,
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 42%, rgba(0,0,0,0.08) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </motion.div>
  );
}

export default function Editorial() {
  const [editorialImages, setEditorialImages] = useState<string[]>([]);
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
    async function loadEditorialImages() {
      try {
        const content = await getHomeContent();
        setEditorialImages(content.editorialImages || []);
      } catch (error) {
        console.error("LOAD EDITORIAL CONTENT ERROR:", error);
      }
    }

    loadEditorialImages();
  }, []);

  const images = editorialImages.slice(0, 5);

  return (
    <section
      id="editorial"
      style={{
        width: "100%",
        minHeight: isPhone ? "auto" : "100vh",
        background: "#ffffff",
        padding: isPhone ? "72px 18px" : "96px 54px",
        fontFamily: '"Outfit", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          height: isPhone ? "auto" : "calc(100vh - 192px)",
          minHeight: isPhone ? "auto" : "680px",
          display: "grid",
          gridTemplateColumns: isPhone
            ? "repeat(2, minmax(0, 1fr))"
            : "1.1fr 0.9fr 0.9fr",
          gridTemplateRows: isPhone ? "220px 220px 220px" : "1fr 1fr",
          gap: isPhone ? "12px" : "18px",
        }}
      >
        <ImageBlock
          src={images[0]}
          index={0}
          isPhone={isPhone}
          style={{
            gridRow: isPhone ? "auto" : "1 / 3",
            gridColumn: isPhone ? "1 / 3" : "auto",
            height: "100%",
          }}
        />

        <ImageBlock
          src={images[1]}
          index={1}
          isPhone={isPhone}
          style={{
            height: "100%",
          }}
        />

        <ImageBlock
          src={images[2]}
          index={2}
          isPhone={isPhone}
          style={{
            height: "100%",
          }}
        />

        <ImageBlock
          src={images[3]}
          index={3}
          isPhone={isPhone}
          style={{
            gridColumn: isPhone ? "1 / 3" : "2 / 4",
            height: "100%",
          }}
        />
      </div>
    </section>
  );
}
