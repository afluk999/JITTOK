"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const editorialImages = [
  {
    id: "01",
    src: "/editorial-1.png",
  },
  {
    id: "02",
    src: "/editorial-2.png",
  },
  {
    id: "03",
    src: "/editorial-3.png",
  },
  {
    id: "04",
    src: "/editorial-4.png",
  },
  {
    id: "05",
    src: "/editorial-5.png",
  },
];

function ImageBlock({
  src,
  index,
  style,
}: {
  src: string;
  index: number;
  style?: React.CSSProperties;
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
      whileHover={{ scale: 0.985 }}
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
      {!loaded || error ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8d8579",
            fontSize: "12px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            zIndex: 1,
          }}
        >
          Image
        </div>
      ) : null}

      <motion.img
        src={src}
        alt={`JITTOK editorial ${index + 1}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        whileHover={{ scale: 1.055 }}
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
  return (
    <section
      id="editorial"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f6f2eb",
        padding: "96px 54px",
        fontFamily: '"Outfit", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          height: "calc(100vh - 192px)",
          minHeight: "680px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr 0.9fr",
          gridTemplateRows: "1fr 1fr",
          gap: "18px",
        }}
      >
        {/* LARGE LEFT IMAGE */}
        <ImageBlock
          src={editorialImages[0].src}
          index={0}
          style={{
            gridRow: "1 / 3",
            height: "100%",
          }}
        />

        {/* TOP CENTER IMAGE */}
        <ImageBlock
          src={editorialImages[1].src}
          index={1}
          style={{
            height: "100%",
          }}
        />

        {/* TOP RIGHT IMAGE */}
        <ImageBlock
          src={editorialImages[2].src}
          index={2}
          style={{
            height: "100%",
          }}
        />

        {/* BOTTOM WIDE IMAGE */}
        <ImageBlock
          src={editorialImages[3].src}
          index={3}
          style={{
            gridColumn: "2 / 4",
            height: "100%",
          }}
        />
      </div>
    </section>
  );
}