"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHomeContent } from "@/lib/contentService";

const BANNER_LINK = "/Store";

export default function LandscapePromoBanner() {
  const [bannerImage, setBannerImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    async function loadBanner() {
      try {
        const content = await getHomeContent();
        setBannerImage(content.landscapeBannerImage || "");
      } catch (error) {
        console.error("LOAD LANDSCAPE BANNER ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBanner();
  }, []);

  const showImage = Boolean(bannerImage) && !imageFailed;

  if (loading) return null;

  return (
    <section style={{ width: "100%", background: "#ffffff" }}>
      <Link
        href={BANNER_LINK}
        aria-label="Shop the JITTOK Store"
        style={{
          display: "block",
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 6",
          overflow: "hidden",
          background: "#ececec",
        }}
      >
        {showImage ? (
          <img
            src={bannerImage}
            alt="JITTOK promotional banner"
            onError={() => setImageFailed(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : null}
      </Link>
    </section>
  );
}