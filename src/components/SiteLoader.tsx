"use client";

import { useEffect, useRef, useState } from "react";
import loaderLogo from "@/assets/jittok-loader-logo.png";

const MINIMUM_VISIBLE_TIME = 4500;
const MAXIMUM_VISIBLE_TIME = 15000;
const EXIT_DURATION = 700;

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [minimumTimePassed, setMinimumTimePassed] =
    useState(false);

  const finished = useRef(false);
  const minimumTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);
  const previousOverflow = useRef("");

  useEffect(() => {
    previousOverflow.current =
      document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
        document.body.style.overflow =
          previousOverflow.current;
        setVisible(false);
      }, EXIT_DURATION);
    }, MAXIMUM_VISIBLE_TIME);

    return () => {
      window.removeEventListener("load", markPageReady);

      if (minimumTimer.current !== null) {
        window.clearTimeout(minimumTimer.current);
      }

      if (exitTimer.current !== null) {
        window.clearTimeout(exitTimer.current);
      }

      if (safetyTimer.current !== null) {
        window.clearTimeout(safetyTimer.current);
      }

      document.body.style.overflow =
        previousOverflow.current;
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
      document.body.style.overflow =
        previousOverflow.current;
      setVisible(false);
    }, EXIT_DURATION);
  }, [minimumTimePassed, pageReady, visible]);

  if (!visible) return null;

  return (
    <div
      className={`jittokLoader${
        leaving ? " isLeaving" : ""
      }`}
      role="status"
      aria-label="Loading JITTOK"
      aria-live="polite"
    >
      <div className="logoStage">
        <img
          src={loaderLogo.src}
          alt="JITTOK"
          className="loaderLogo"
          draggable={false}
        />

        <span
          className="logoShine"
          aria-hidden="true"
          style={{
            WebkitMaskImage: `url("${loaderLogo.src}")`,
            maskImage: `url("${loaderLogo.src}")`,
          }}
        />
      </div>

      <style jsx>{`
        .jittokLoader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #050505;
          opacity: 1;
          visibility: visible;
          pointer-events: all;
          transition:
            opacity ${EXIT_DURATION}ms ease,
            visibility ${EXIT_DURATION}ms ease;
        }

        .jittokLoader.isLeaving {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .logoStage {
          position: relative;
          width: min(52vw, 340px);
          aspect-ratio: 412 / 295;
          display: grid;
          place-items: center;
          animation:
            logoOpen 900ms
              cubic-bezier(0.22, 1, 0.36, 1)
              both,
            logoDance 3.4s ease-in-out 900ms
              infinite alternate;
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
          user-select: none;
          -webkit-user-drag: none;
        }

        .logoShine {
          background: linear-gradient(
            110deg,
            transparent 35%,
            rgba(255, 255, 255, 0.08) 43%,
            rgba(255, 255, 255, 0.94) 50%,
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
          animation: shineSweep 3.2s
            ease-in-out infinite;
          pointer-events: none;
        }

        .isLeaving .logoStage {
          opacity: 0;
          transform: scale(1.035);
          transition:
            transform ${EXIT_DURATION}ms
              cubic-bezier(0.22, 1, 0.36, 1),
            opacity ${EXIT_DURATION}ms ease;
        }

        @keyframes logoOpen {
          0% {
            opacity: 0;
            transform: scale(0.91);
          }

          68% {
            opacity: 1;
            transform: scale(1.025);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes logoDance {
          from {
            transform: translateY(0)
              rotate(-0.25deg);
          }

          to {
            transform: translateY(-4px)
              rotate(0.25deg);
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

          74% {
            opacity: 1;
          }

          100% {
            background-position: -80% 0;
            opacity: 0;
          }
        }

        @media (max-width: 600px) {
          .logoStage {
            width: min(68vw, 260px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logoStage,
          .logoShine {
            animation: none !important;
          }

          .jittokLoader,
          .logoStage {
            transition-duration: 250ms !important;
          }
        }
      `}</style>
    </div>
  );
}
