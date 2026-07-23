"use client";

import loaderLogo from "@/assets/jittok-loader-logo.png";

type JittokLoadingLogoProps = {
  minHeight?: number | string;
  background?: string;
  logoWidth?: number;
  compact?: boolean;
  label?: string;
};

export default function JittokLoadingLogo({
  minHeight = 260,
  background = "#050505",
  logoWidth = 138,
  compact = false,
  label = "Loading",
}: JittokLoadingLogoProps) {
  const finalLogoWidth = compact
    ? Math.min(logoWidth, 112)
    : logoWidth;

  return (
    <div
      className="jittokInlineLoader"
      role="status"
      aria-label={label}
      style={{
        minHeight,
        background,
      }}
    >
      <div
        className="jittokInlineLogoStage"
        style={{ width: finalLogoWidth }}
      >
        <img
          src={loaderLogo.src}
          alt="JITTOK"
          className="jittokInlineLogo"
          draggable={false}
        />

        <span
          className="jittokInlineShine"
          aria-hidden="true"
          style={{
            WebkitMaskImage: `url("${loaderLogo.src}")`,
            maskImage: `url("${loaderLogo.src}")`,
          }}
        />
      </div>

      <style jsx>{`
        .jittokInlineLoader {
          width: 100%;
          display: grid;
          place-items: center;
          overflow: hidden;
          box-sizing: border-box;
        }

        .jittokInlineLogoStage {
          position: relative;
          max-width: 72vw;
          aspect-ratio: 412 / 295;
          display: grid;
          place-items: center;
          animation:
            inlineOpen 760ms
              cubic-bezier(0.22, 1, 0.36, 1)
              both,
            inlineDance 3.2s ease-in-out 760ms
              infinite alternate;
          will-change: transform, opacity;
        }

        .jittokInlineLogo,
        .jittokInlineShine {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .jittokInlineLogo {
          display: block;
          object-fit: contain;
          object-position: center;
          user-select: none;
          -webkit-user-drag: none;
        }

        .jittokInlineShine {
          background: linear-gradient(
            110deg,
            transparent 35%,
            rgba(255, 255, 255, 0.08) 43%,
            rgba(255, 255, 255, 0.92) 50%,
            rgba(255, 255, 255, 0.1) 57%,
            transparent 65%
          );
          background-size: 260% 100%;
          background-position: 180% 0;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
          mix-blend-mode: screen;
          animation: inlineShine 3.2s
            ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes inlineOpen {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }

          68% {
            opacity: 1;
            transform: scale(1.02);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes inlineDance {
          from {
            transform: translateY(0)
              rotate(-0.2deg);
          }

          to {
            transform: translateY(-3px)
              rotate(0.2deg);
          }
        }

        @keyframes inlineShine {
          0% {
            background-position: 180% 0;
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          74% {
            opacity: 1;
          }

          100% {
            background-position: -80% 0;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jittokInlineLogoStage,
          .jittokInlineShine {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
