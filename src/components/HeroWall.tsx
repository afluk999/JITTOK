"use client";

import { useEffect, useState } from "react";

/*
 * DESKTOP_IMAGE = wide landscape photo, used on tablet/desktop.
 * MOBILE_IMAGE = a separate PORTRAIT-oriented photo for phones.
 *
 * Add your real portrait photo to /public/hero/ and update
 * MOBILE_IMAGE below, e.g. "/hero/hero-mobile-1.jpg"
 * Until that file exists, mobile falls back to the desktop image
 * automatically (no broken image will ever show).
 */
const DESKTOP_IMAGE = "/hero-slide-1.png";
const MOBILE_IMAGE = "/hero/hero-mobile-1.jpg";

export default function HeroWall() {
  const [isPhone, setIsPhone] = useState(false);
  const [mobileImageFailed, setMobileImageFailed] = useState(false);

  useEffect(() => {
    function checkPhone() {
      setIsPhone(window.innerWidth <= 768);
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  const activeImage =
    isPhone && !mobileImageFailed ? MOBILE_IMAGE : DESKTOP_IMAGE;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
        background: "#111111",
      }}
    >
      <img
        src={activeImage}
        alt="JITTOK hero"
        onError={() => setMobileImageFailed(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </section>
  );
}