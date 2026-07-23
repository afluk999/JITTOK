"use client";

import { useEffect, useRef, useState } from "react";

const MINIMUM_VISIBLE_TIME = 4500;
const MAXIMUM_VISIBLE_TIME = 15000;
const EXIT_DURATION = 700;

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);

  const finished = useRef(false);
  const minimumTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);
  const previousOverflow = useRef("");

  useEffect(() => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const initialLoader = document.getElementById(
      "jittok-initial-loader",
    );

    document.documentElement.classList.remove(
      "jittok-preloading",
    );

    if (initialLoader) {
      initialLoader.remove();
    }

    function markPageReady() {
      setPageReady(true);
    }

    if (document.readyState === "complete") {
      markPageReady();
    } else {
      window.addEventListener("load", markPageReady, {
        once: true,
      });
    }

    minimumTimer.current = window.setTimeout(() => {
      setMinimumTimePassed(true);
    }, MINIMUM_VISIBLE_TIME);

    safetyTimer.current = window.setTimeout(() => {
      if (finished.current) return;

      finished.current = true;
      setLeaving(true);

      exitTimer.current = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow.current;
        setVisible(false);
      }, EXIT_DURATION);
    }, MAXIMUM_VISIBLE_TIME);

    return () => {
      window.removeEventListener("load", markPageReady);

      if (minimumTimer.current) {
        window.clearTimeout(minimumTimer.current);
      }

      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
      }

      if (safetyTimer.current) {
        window.clearTimeout(safetyTimer.current);
      }

      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  useEffect(() => {
    if (
      !visible ||
      finished.current ||
      !pageReady ||
      !minimumTimePassed
    ) {
      return;
    }

    finished.current = true;
    setLeaving(true);

    exitTimer.current = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow.current;
      setVisible(false);
    }, EXIT_DURATION);
  }, [minimumTimePassed, pageReady, visible]);

  if (!visible) return null;

  return (
    <div
      className={`jittok-loader${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-label="Loading JITTOK"
      aria-live="polite"
    >
      <div className="logoStage">
        <img
          src="/jittok-logo.png"
          alt="JITTOK"
          className="loaderLogo"
          draggable={false}
        />

        <span className="logoShine" aria-hidden="true" />
      </div>

      <span className="loadingDot loadingDotOne" aria-hidden="true" />
      <span className="loadingDot loadingDotTwo" aria-hidden="true" />
      <span className="loadingDot loadingDotThree" aria-hidden="true" />

      <style jsx>{`
        .jittok-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #ffffff;
          opacity: 1;
          visibility: visible;
          pointer-events: all;
          transition:
            opacity ${EXIT_DURATION}ms ease,
            visibility ${EXIT_DURATION}ms ease;
        }

        .jittok-loader.is-leaving {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .logoStage {
          position: relative;
          width: min(34vw, 220px);
          aspect-ratio: 3 / 1;
          display: grid;
          place-items: center;
          animation:
            logoEnter 900ms cubic-bezier(0.22, 1, 0.36, 1) both,
            logoFloat 3.2s ease-in-out 900ms infinite alternate;
          will-change: transform, opacity;
        }

        .loaderLogo,
        .logoShine {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .loaderLogo {
          display: block;
          object-fit: contain;
          object-position: center;
          filter: contrast(1.04);
          user-select: none;
          -webkit-user-drag: none;
        }

        .logoShine {
          background: linear-gradient(
            105deg,
            transparent 34%,
            rgba(255, 255, 255, 0.1) 41%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.12) 59%,
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
          animation: shineSweep 3.8s ease-in-out infinite;
          pointer-events: none;
        }

        .loadingDot {
          position: absolute;
          left: 50%;
          top: calc(50% + 72px);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #111111;
          opacity: 0.2;
          transform: translateX(-50%);
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .loadingDotOne {
          margin-left: -14px;
        }

        .loadingDotTwo {
          animation-delay: 0.2s;
        }

        .loadingDotThree {
          margin-left: 14px;
          animation-delay: 0.4s;
        }

        .is-leaving .logoStage,
        .is-leaving .loadingDot {
          opacity: 0;
          transform: scale(1.05);
          transition:
            transform ${EXIT_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity ${EXIT_DURATION}ms ease;
        }

        @keyframes logoEnter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes logoFloat {
          from {
            transform: scale(1) translateY(0);
          }

          to {
            transform: scale(1.025) translateY(-3px);
          }
        }

        @keyframes shineSweep {
          0% {
            background-position: 180% 0;
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          72% {
            opacity: 1;
          }

          100% {
            background-position: -80% 0;
            opacity: 0;
          }
        }

        @keyframes dotPulse {
          0%,
          100% {
            opacity: 0.18;
            transform: translateX(-50%) scale(0.8);
          }

          50% {
            opacity: 0.75;
            transform: translateX(-50%) scale(1);
          }
        }

        @media (max-width: 600px) {
          .logoStage {
            width: min(44vw, 160px);
          }

          .loadingDot {
            top: calc(50% + 58px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logoStage,
          .logoShine,
          .loadingDot {
            animation: none !important;
          }

          .jittok-loader,
          .logoStage {
            transition-duration: 250ms !important;
          }
        }
      `}</style>
    </div>
  );
}