"use client";

import Image from "next/image";
import Link from "next/link";

export default function SpiderDropBanner() {
  return (
    <section
      id="spider-drop-banner"
      style={{
        width: "100%",
        overflow: "hidden",
        background: "#ffffff",
        padding: "3px 0 24px",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "0 clamp(12px, 3vw, 42px)",
          boxSizing: "border-box",
        }}
      >
        <Link
          href="/collections"
          aria-label="Explore the JITTOK Spider collection"
          className="spider-banner-link"
        >
          <div className="spider-banner-frame">
            <Image
              src="/spider-drop-banner.webp"
              alt="JITTOK Spider collection featuring black, red and white graphic T-shirts"
              fill
              sizes="(max-width: 768px) 100vw, 1600px"
              quality={90}
              className="spider-banner-image"
            />
          </div>
        </Link>
      </div>

      <style jsx>{`
        .spider-banner-link {
          display: block;
          width: 100%;
          color: inherit;
          text-decoration: none;
        }

        .spider-banner-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1942 / 809;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.08);
          border-radius: 3px;
          box-shadow: 0 12px 38px rgba(17, 17, 17, 0.07);
          isolation: isolate;
        }

        .spider-banner-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
        }

        :global(.spider-banner-image) {
          object-fit: contain;
          object-position: center;
          background: #ffffff;
          transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (hover: hover) and (pointer: fine) {
          .spider-banner-link:hover :global(.spider-banner-image) {
            transform: scale(1.012);
          }
        }

        @media (max-width: 768px) {
          .spider-banner-frame {
            width: 100%;
            aspect-ratio: 1942 / 809;
            border-radius: 2px;
            box-shadow: 0 8px 24px rgba(17, 17, 17, 0.055);
          }
        }

        @media (max-width: 480px) {
          .spider-banner-frame {
            border-left: 0;
            border-right: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.spider-banner-image) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}