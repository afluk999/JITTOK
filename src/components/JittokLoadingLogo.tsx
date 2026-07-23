"use client";

type JittokLoadingLogoProps = {
  minHeight?: number | string;
  background?: string;
  logoWidth?: number;
  compact?: boolean;
  label?: string;
};

export default function JittokLoadingLogo({
  minHeight = 280,
  background = "#ffffff",
  logoWidth = 132,
  compact = false,
  label = "Loading",
}: JittokLoadingLogoProps) {
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
        style={{
          width: compact ? Math.min(logoWidth, 104) : logoWidth,
        }}
      >
        <img
          src="/jittok-logo.png"
          alt="JITTOK"
          className="jittokInlineLogo"
          draggable={false}
        />

        <span
          className="jittokInlineShine"
          aria-hidden="true"
        />
      </div>

      <div className="jittokInlineDots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <style jsx>{`
        .jittokInlineLoader {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          overflow: hidden;
        }

        .jittokInlineLogoStage {
          position: relative;
          aspect-ratio: 3 / 1;
          display: grid;
          place-items: center;
          animation: jittokInlineFloat 2.8s ease-in-out infinite alternate;
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
            105deg,
            transparent 34%,
            rgba(255, 255, 255, 0.08) 42%,
            rgba(255, 255, 255, 0.92) 50%,
            rgba(255, 255, 255, 0.1) 58%,
            transparent 66%
          );
          background-size: 260% 100%;
          background-position: 180% 0;

          -webkit-mask-image: url("/jittok-logo.png");
          mask-image: url("/jittok-logo.png");
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;

          mix-blend-mode: screen;
          animation: jittokInlineShine 3.4s ease-in-out infinite;
          pointer-events: none;
        }

        .jittokInlineDots {
          display: flex;
          gap: 7px;
          margin-top: 16px;
        }

        .jittokInlineDots span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #111111;
          opacity: 0.2;
          animation: jittokInlineDot 1.4s ease-in-out infinite;
        }

        .jittokInlineDots span:nth-child(2) {
          animation-delay: 0.18s;
        }

        .jittokInlineDots span:nth-child(3) {
          animation-delay: 0.36s;
        }

        @keyframes jittokInlineFloat {
          from {
            transform: translateY(0) scale(1);
          }

          to {
            transform: translateY(-2px) scale(1.018);
          }
        }

        @keyframes jittokInlineShine {
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

        @keyframes jittokInlineDot {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.8);
          }

          50% {
            opacity: 0.7;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jittokInlineLogoStage,
          .jittokInlineShine,
          .jittokInlineDots span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
