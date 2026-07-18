"use client";

import { useEffect, useMemo, useState } from "react";
import { getHomeContent } from "@/lib/contentService";
import BlurImage from "@/components/BlurImage";

const MIN_HERO_IMAGES = 4;

const DESKTOP_COLUMN_WIDTH = 45;
const TABLET_COLUMN_WIDTH = 50;
const MOBILE_COLUMN_WIDTH = 82;
const SMALL_MOBILE_COLUMN_WIDTH = 92;

export default function HeroWall() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeroImages() {
      try {
        const content = await getHomeContent();
        const images = content.heroImages || [];

        if (images.length >= MIN_HERO_IMAGES) {
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
      <section className="hero-wall hero-wall-skeleton">
        <style jsx>{`
          .hero-wall {
            position: relative;
            width: 100%;
            height: calc(100vh - 76px);
            min-height: 620px;
            background: #f4f1eb;
            overflow: hidden;
          }

          .hero-wall-skeleton {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 2px;
          }

          .skeleton-panel {
            background:
              linear-gradient(
                110deg,
                #e8e3db 8%,
                #f8f6f2 18%,
                #e8e3db 33%
              );
            background-size: 220% 100%;
            animation: heroSkeleton 1.3s linear infinite;
          }

          @keyframes heroSkeleton {
            from {
              background-position: 200% 0;
            }

            to {
              background-position: -20% 0;
            }
          }

          @media (max-width: 768px) {
            .hero-wall {
              height: calc(125vw + 34px);
              min-height: 0;
            }

            .hero-wall-skeleton {
              grid-template-columns: 1fr;
            }

            .skeleton-panel:not(:first-child) {
              display: none;
            }
          }
        `}</style>

        <div className="skeleton-panel" />
        <div className="skeleton-panel" />
        <div className="skeleton-panel" />
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
          height: 34px;
          background: #111111;
          color: #ffffff;
          overflow: hidden;
          display: flex;
          align-items: center;
          z-index: 7;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
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
          gap: 10px;
          padding-right: 24px;
          font-family: "Outfit", sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.4px;
          line-height: 1;
          text-transform: uppercase;
        }

        .strip-dot {
          display: inline-block;
          color: #ffffff;
          font-size: 9px;
          line-height: 1;
          opacity: 0.78;
        }

        .hero-images-wrap {
          position: absolute;
          inset: 0 0 34px;
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
          --hero-fit: cover;
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
          inset: 0 0 34px;
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
          bottom: 52px;
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
            height: calc(125vw + 34px);
            min-height: 0;
            max-height: calc(100svh - 64px);
            background: #ffffff;
          }

          .hero-strip {
            height: 34px;
          }

          .hero-images-wrap {
            bottom: 34px;
          }

          .hero-overlay {
            inset: 0 0 34px;
          }

          .strip-item {
            font-size: 11px;
            letter-spacing: 1.4px;
            gap: 10px;
            padding-right: 24px;
          }

          .hero-track {
            width: ${loopImages.length * 100}vw;
            animation-duration: 32s;
          }

          .hero-item {
            --hero-fit: contain;
            width: 100vw;
            flex-basis: 100vw;
            background: #ffffff;
          }

          .hero-item img {
            object-fit: contain;
            object-position: center;
            background: #ffffff;
          }

          .hero-right-text {
            display: none;
          }

          .hero-left-text {
            left: 18px;
            bottom: 48px;
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .hero-wall {
            height: calc(125vw + 34px);
            min-height: 0;
          }

          .hero-track {
            width: ${loopImages.length * 100}vw;
            animation-duration: 28s;
          }

          .hero-item {
            width: 100vw;
            flex-basis: 100vw;
          }

          .strip-item {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="hero-images-wrap">
        <div className="hero-track">
          {loopImages.map((image, index) => (
            <div key={`${image}-${index}`} className="hero-item">
              <BlurImage
                src={image}
                alt={`JITTOK hero image ${
                  (index % heroImages.length) + 1
                }`}
                loading={index < 5 ? "eager" : "lazy"}
                decoding="async"
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
                imageStyle={{
                  width: "100%",
                  height: "100%",
                  objectFit: "var(--hero-fit)" as any,
                  objectPosition: "center",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-overlay" />



      <div className="hero-strip">
        <div className="strip-track">
          {Array.from({ length: 20 }).map((_, index) => (
            <span key={index} className="strip-item">
              JITTOK <small className="strip-dot">✦</small>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}