"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

/*
 * IMAGES — put your real product photos in /public/accessories/
 * using these exact filenames, then they'll show automatically:
 *   /public/accessories/watches.jpg
 *   /public/accessories/belts.jpg
 *   /public/accessories/shades.jpg
 *   /public/accessories/caps.jpg
 *
 * Until a file exists, that item shows nothing (just the label) —
 * never a broken image icon.
 */
type AccessoryItem = {
  name: string;
  image: string;
  slug: string;
};

const items: AccessoryItem[] = [
  { name: "WATCHES", image: "/accessories/watches.jpg", slug: "watches" },
  { name: "Shades", image: "/accessories/shades.jpg", slug: "shades" },
  { name: "CHAINS", image: "/accessories/chains.jpg", slug: "chains" },
  { name: "CAPS", image: "/accessories/caps.jpg", slug: "caps" },
  { name: "SHOES", image: "/accessories/shoes.jpg", slug: "shoes" },
  { name: "PANTS", image: "/accessories/pants.jpg", slug: "pants" },
];

function AccessoryCard({
  item,
  imageSize,
}: {
  item: AccessoryItem;
  imageSize: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const showImage = Boolean(item.image) && !imageFailed;

  return (
    <Link
      href={`/collections/${item.slug}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "#171717",
        transform: hovering ? "translateY(-3px)" : "none",
        transition: "transform 240ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${imageSize}px`,
          height: `${imageSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showImage ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageFailed(true)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 10px 18px rgba(17,17,17,0.14))",
            }}
          />
        ) : null}
      </div>

      <span
        style={{
          marginTop: "18px",
          fontFamily: '"Outfit", sans-serif',
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: hovering ? "#171717" : "#8a8680",
          transition: "color 220ms ease",
        }}
      >
        {item.name}
      </span>
    </Link>
  );
}

export default function AccessoriesSection() {
  const [isPhone, setIsPhone] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    function checkSize() {
      setIsPhone(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1000);
    }

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const imageSize = isPhone ? 88 : isTablet ? 110 : 140;
  const gap = isPhone ? 28 : isTablet ? 50 : 90;

  const sectionStyle: CSSProperties = {
    width: "100%",
    background: "#ffffff",
    padding: isPhone ? "36px 20px 44px" : "52px 5vw 64px",
    fontFamily: '"Outfit", sans-serif',
  };

  const headingStyle: CSSProperties = {
    margin: `0 0 ${isPhone ? "26px" : "36px"}`,
    fontSize: isPhone ? "18px" : "22px",
    fontWeight: 800,
    color: "#171717",
    textAlign: isPhone ? "left" : "left",
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    flexWrap: isPhone ? "wrap" : "nowrap",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: `${gap}px`,
    maxWidth: "1200px",
    margin: "0 auto",
  };

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>Accessories</h2>

      <div style={rowStyle}>
        {items.map((item) => (
          <AccessoryCard key={item.slug} item={item} imageSize={imageSize} />
        ))}
      </div>
    </section>
  );
}