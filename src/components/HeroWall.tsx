"use client";

import { useEffect, useMemo, useState } from "react";
import { getHomeContent } from "@/lib/contentService";

const MIN_HERO_IMAGES = 3;

const DESKTOP_COLUMN_WIDTH = 45;
const TABLET_COLUMN_WIDTH = 50;
const MOBILE_COLUMN_WIDTH = 82;
const SMALL_MOBILE_COLUMN_WIDTH = 92;

function preloadImages(images: string[]) {
  return Promise.all(
    images.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();

          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

export default function HeroWall() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeroImages() {
      try {
        const content = await getHomeContent();
        const images = content.heroImages || [];

        if (images.length >= MIN_HERO_IMAGES) {
          await preloadImages(images.slice(0, 5));
          setHeroImages(images);
        }
      } catch (error) {
        console.error("LOAD HERO CONTENT ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHeroImages();
  }, []);

  const loopImages = useMemo(() => {
    if (heroImages.length === 0) return [];

    return [...heroImages, ...heroImages];
  }, [heroImages]);

  if (loading) {
    return (
      <section className="hero-wall hero-wall-loading">
        <style jsx>{`
          .hero-wall {
            position: relative;
            width: 100%;
            height: calc(100vh - 76px +200px);
            min-height: 760px;
            background: #111;
            overflow: hidden;
          }

          .hero-wall-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f6f2eb;
            font-family: "Outfit", sans-serif;
          }

          .loader-box {
            text-align: center;
          }

          .loader-logo {
            margin: 0;
            font-family: "Bebas Neue", Impact, sans-serif;
            font-size: clamp(74px, 10vw, 150px);
            line-height: 0.82;
            font-weight: 400;
            letter-spacing: 8px;
            text-transform: uppercase;
          }

          .loader-text {
            margin: 14px 0 0;
            color: rgba(246, 242, 235, 0.65);
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
        `}</style>

        <div className="loader-box">
          <h1 className="loader-logo">JITTOK</h1>
          <p className="loader-text">Loading campaign wall</p>
        </div>
      </section>
    );
  }

  if (heroImages.length < MIN_HERO_IMAGES) {
    return (
      <section className="hero-wall hero-wall-fallback">
        <style jsx>{`
          .hero-wall {
            position: relative;
            width: 100%;
            height: calc(100vh - 76px);
            min-height: 620px;
            background: #111;
            overflow: hidden;
          }

          .hero-wall-fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f6f2eb;
            font-family: "Outfit", sans-serif;
            text-align: center;
            padding: 40px;
          }

          .hero-wall-fallback h1 {
            margin: 0 0 14px;
            font-family: "Bebas Neue", Impact, sans-serif;
            font-size: clamp(80px, 12vw, 160px);
            line-height: 0.82;
            font-weight: 400;
          }

          .hero-wall-fallback p {
            margin: 0;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: rgba(246, 242, 235, 0.7);
          }
        `}</style>

        <div>
          <h1>JITTOK</h1>
          <p>Add at least {MIN_HERO_IMAGES} hero images from admin/content</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-wall">
      <style jsx>{`
        .hero-wall {
          position: relative;
          width: 100%;
          height: calc(100vh - 76px);
          min-height: 620px;
          background: #111;
          overflow: hidden;
        }

        .hero-strip {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 46px;
          background: #ffffff;
          color: #111;
          overflow: hidden;
          display: flex;
          align-items: center;
          z-index: 7;
          border-top: 1px solid rgba(17, 17, 17, 0.08);
        }

        @keyframes stripMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .strip-track {
          display: flex;
          white-space: nowrap;
          min-width: 200%;
          animation: stripMove 22s linear infinite;
        }

        .strip-item {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding-right: 36px;
          font-family: "Bebas Neue", Impact, sans-serif;
          font-size: 26px;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .strip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #111;
          display: inline-block;
          opacity: 0.7;
        }

        .hero-images-wrap {
          position: absolute;
          inset: 0 0 46px;
          overflow: hidden;
        }

        @keyframes heroWallMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .hero-track {
          height: 100%;
          display: flex;
          width: ${loopImages.length * DESKTOP_COLUMN_WIDTH}vw;
          animation: heroWallMove 40s linear infinite;
          will-change: transform;
        }

        /*
          Desktop column width is 45vw.
          This displays about 2.2 images instead of 5 images.
        */
        .hero-item {
          position: relative;
          width: ${DESKTOP_COLUMN_WIDTH}vw;
          flex: 0 0 ${DESKTOP_COLUMN_WIDTH}vw;
          height: 100%;
          overflow: hidden;
          background: #d9d9d9;
        }

        .hero-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .hero-overlay {
          position: absolute;
          inset: 0 0 46px;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.08) 0%,
            rgba(0, 0, 0, 0.02) 40%,
            rgba(0, 0, 0, 0.28) 100%
          );
          z-index: 2;
        }

        .hero-left-text,
        .hero-right-text {
          position: absolute;
          bottom: 64px;
          color: #f6f2eb;
          font-family: "Outfit", sans-serif;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          font-size: 11px;
          font-weight: 900;
          z-index: 6;
        }

        .hero-left-text {
          left: 24px;
        }

        .hero-right-text {
          right: 24px;
        }

        @media (max-width: 1024px) {
          .hero-track {
            width: ${loopImages.length * TABLET_COLUMN_WIDTH}vw;
          }

          .hero-item {
            width: ${TABLET_COLUMN_WIDTH}vw;
            flex-basis: ${TABLET_COLUMN_WIDTH}vw;
          }
        }

        @media (max-width: 768px) {
          .hero-wall {
            height: calc(100vh - 64px);
            min-height: 540px;
          }

          .hero-strip {
            height: 42px;
          }

          .hero-images-wrap {
            bottom: 42px;
          }

          .hero-overlay {
            inset: 0 0 42px;
          }

          .strip-item {
            font-size: 22px;
            letter-spacing: 3px;
            gap: 12px;
            padding-right: 28px;
          }

          .hero-track {
            width: ${loopImages.length * MOBILE_COLUMN_WIDTH}vw;
            animation-duration: 32s;
          }

          .hero-item {
            width: ${MOBILE_COLUMN_WIDTH}vw;
            flex-basis: ${MOBILE_COLUMN_WIDTH}vw;
          }

          .hero-right-text {
            display: none;
          }

          .hero-left-text {
            left: 18px;
            bottom: 58px;
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .hero-track {
            width: ${loopImages.length * SMALL_MOBILE_COLUMN_WIDTH}vw;
            animation-duration: 28s;
          }

          .hero-item {
            width: ${SMALL_MOBILE_COLUMN_WIDTH}vw;
            flex-basis: ${SMALL_MOBILE_COLUMN_WIDTH}vw;
          }

          .strip-item {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="hero-images-wrap">
        <div className="hero-track">
          {loopImages.map((image, index) => (
            <div key={`${image}-${index}`} className="hero-item">
              <img
                src={image}
                alt={`JITTOK hero image ${
                  (index % heroImages.length) + 1
                }`}
                loading={index < 5 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-overlay" />

      <div className="hero-left-text">JITTOK / Moving Campaign Wall</div>
      <div className="hero-right-text">Scroll to explore</div>

      <div className="hero-strip">
        <div className="strip-track">
          {Array.from({ length: 20 }).map((_, index) => (
            <span key={index} className="strip-item">
              JITTOK <small className="strip-dot" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}