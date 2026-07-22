"use client";

import { useMemo } from "react";

const HERO_IMAGES = [
  "/hero/hero-1.webp",
  "/hero/hero-2.webp",
  "/hero/hero-3.webp",
  "/hero/hero-4.webp",
  "/hero/hero-5.webp",
];

const DESKTOP_COLUMN_WIDTH = 45;
const TABLET_COLUMN_WIDTH = 50;
const MOBILE_COLUMN_WIDTH = 82;
const SMALL_MOBILE_COLUMN_WIDTH = 92;

const STRIP_ITEM_COUNT = 24;

export default function HeroWall() {
  const loopImages = useMemo(
    () => [...HERO_IMAGES, ...HERO_IMAGES],
    [],
  );

  return (
    <section className="hero-wall">
      <style jsx>{`
        .hero-wall {
          position: relative;
          width: 100%;
          height: calc(100vh - 76px);
          min-height: 620px;
          overflow: hidden;
          background: #111111;
        }

        /* =========================
           CONTINUOUS JITTOK STRIP
           ========================= */

        .hero-strip {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 7;
          display: flex;
          width: 100%;
          height: 34px;
          align-items: center;
          overflow: hidden;
          color: #ffffff;
          background: #111111;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .strip-track {
          display: flex;
          width: max-content;
          min-width: max-content;
          flex-shrink: 0;
          will-change: transform;
          animation: stripContinuousMove 30s linear infinite;
        }

        .strip-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .strip-item {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          gap: 10px;
          padding: 0 13px;
          color: #ffffff;
          font-family: "Outfit", sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.4px;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .strip-dot {
          display: inline-block;
          color: #ffffff;
          font-size: 9px;
          line-height: 1;
          opacity: 0.78;
        }

        @keyframes stripContinuousMove {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        /* =========================
           HERO IMAGE WALL
           ========================= */

        .hero-images-wrap {
          position: absolute;
          inset: 0 0 34px;
          overflow: hidden;
          background: #ffffff;
        }

        @keyframes heroWallMove {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .hero-track {
          display: flex;
          width: ${loopImages.length * DESKTOP_COLUMN_WIDTH}vw;
          height: 100%;
          will-change: transform;
          animation: heroWallMove 40s linear infinite;
        }

        .hero-item {
          --hero-fit: cover;
          position: relative;
          width: ${DESKTOP_COLUMN_WIDTH}vw;
          height: 100%;
          flex: 0 0 ${DESKTOP_COLUMN_WIDTH}vw;
          overflow: hidden;
          background: #ffffff;
        }

        .hero-item img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0 0 34px;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.08) 0%,
            rgba(0, 0, 0, 0.02) 40%,
            rgba(0, 0, 0, 0.28) 100%
          );
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

          .hero-images-wrap,
          .hero-track,
          .hero-item {
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

          .strip-track {
            animation-duration: 25s;
          }

          .strip-item {
            gap: 9px;
            padding: 0 12px;
            font-size: 10px;
            letter-spacing: 1.25px;
          }

          .hero-track {
            width: ${loopImages.length * MOBILE_COLUMN_WIDTH}vw;
            animation-duration: 32s;
          }

          .hero-item {
            --hero-fit: contain;
            width: ${MOBILE_COLUMN_WIDTH}vw;
            flex-basis: ${MOBILE_COLUMN_WIDTH}vw;
            background: #ffffff;
          }

          .hero-item img {
            object-fit: contain;
            object-position: center;
            background: #ffffff;
          }
        }

        @media (max-width: 480px) {
          .hero-wall {
            height: calc(125vw + 34px);
            min-height: 0;
          }

          .hero-track {
            width: ${loopImages.length * SMALL_MOBILE_COLUMN_WIDTH}vw;
            animation-duration: 28s;
          }

          .hero-item {
            width: ${SMALL_MOBILE_COLUMN_WIDTH}vw;
            flex-basis: ${SMALL_MOBILE_COLUMN_WIDTH}vw;
          }

          .strip-track {
            animation-duration: 22s;
          }

          .strip-item {
            padding: 0 11px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-track {
            animation-duration: 90s;
          }

          .strip-track {
            animation-duration: 70s;
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
                  (index % HERO_IMAGES.length) + 1
                }`}
                loading={index < HERO_IMAGES.length ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-overlay" />

      <div className="hero-strip">
        <div className="strip-track">
          <div className="strip-group">
            {Array.from({ length: STRIP_ITEM_COUNT }).map(
              (_, index) => (
                <span
                  key={`first-${index}`}
                  className="strip-item"
                >
                  JITTOK <small className="strip-dot">✦</small>
                </span>
              ),
            )}
          </div>

          <div className="strip-group" aria-hidden="true">
            {Array.from({ length: STRIP_ITEM_COUNT }).map(
              (_, index) => (
                <span
                  key={`second-${index}`}
                  className="strip-item"
                >
                  JITTOK <small className="strip-dot">✦</small>
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}