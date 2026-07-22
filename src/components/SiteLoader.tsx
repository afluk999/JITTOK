"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const LOADER_SESSION_KEY = "jittok-loader-seen";
const MINIMUM_VISIBLE_TIME = 1600;
const MAXIMUM_VISIBLE_TIME = 5200;
const EXIT_DURATION = 700;

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const finishing = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);
  const minimumTimer = useRef<number | null>(null);
  const previousBodyOverflow = useRef("");

  const finishLoader = useCallback(() => {
    if (finishing.current) return;

    finishing.current = true;
    setLeaving(true);

    exitTimer.current = window.setTimeout(() => {
      document.body.style.overflow = previousBodyOverflow.current;
      setVisible(false);

    }, EXIT_DURATION);
  }, []);

  useEffect(() => {
    

    previousBodyOverflow.current = document.body.style.overflow;
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
      finishLoader();
    }, MAXIMUM_VISIBLE_TIME);

    return () => {
      window.removeEventListener("load", markPageReady);
      document.body.style.overflow = previousBodyOverflow.current;

      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
      }

      if (safetyTimer.current) {
        window.clearTimeout(safetyTimer.current);
      }

      if (minimumTimer.current) {
        window.clearTimeout(minimumTimer.current);
      }
    };
  }, [finishLoader]);

  useEffect(() => {
    if (!visible || finishing.current) return;

    if (
      pageReady &&
      minimumTimePassed &&
      (animationFinished || videoFailed)
    ) {
      finishLoader();
    }
  }, [
    animationFinished,
    finishLoader,
    minimumTimePassed,
    pageReady,
    videoFailed,
    visible,
  ]);

  useEffect(() => {
    if (!videoReady || videoFailed || !videoRef.current) return;

    videoRef.current.play().catch(() => {
      setVideoFailed(true);
      setAnimationFinished(true);
    });
  }, [videoReady, videoFailed]);

  if (!visible) return null;

  return (
    <div
      className={`jittok-loader${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-label="Loading JITTOK"
    >
      <div className="loaderGlow loaderGlowOne" aria-hidden="true" />
      <div className="loaderGlow loaderGlowTwo" aria-hidden="true" />

      <div className="loaderStage">
        <img
          src="/jittok-loader-poster.png"
          alt=""
          aria-hidden="true"
          className={`loaderPoster${
            videoReady && !videoFailed ? " is-hidden" : ""
          }`}
        />

        {!videoFailed ? (
          <video
            ref={videoRef}
            className={`loaderVideo${
              videoReady ? " is-ready" : ""
            }`}
            src="/jittok-loader.mp4"
            poster="/jittok-loader-poster.png"
            autoPlay
            muted
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            onEnded={() => setAnimationFinished(true)}
            onError={() => {
              setVideoFailed(true);
              setAnimationFinished(true);
            }}
          />
        ) : null}
      </div>

      <div className="loaderFrame" aria-hidden="true" />

      <style jsx>{`
        .jittok-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #000000;
          opacity: 1;
          pointer-events: all;
          isolation: isolate;
          transition:
            opacity ${EXIT_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility ${EXIT_DURATION}ms ease;
        }

        .jittok-loader.is-leaving {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .loaderStage {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #000000;
          transform: scale(1.035);
          animation:
            loaderEntrance 900ms cubic-bezier(0.22, 1, 0.36, 1)
              both,
            loaderBreath 3.2s ease-in-out 900ms infinite alternate;
          will-change: transform, opacity;
        }

        .loaderVideo,
        .loaderPoster {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          background: #000000;
        }

        .loaderVideo {
          z-index: 2;
          opacity: 0;
          transform: scale(1.015);
          transition:
            opacity 320ms ease,
            transform 1.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .loaderVideo.is-ready {
          opacity: 1;
          transform: scale(1);
        }

        .loaderPoster {
          z-index: 1;
          opacity: 1;
          animation: fallbackDance 2.4s ease-in-out infinite;
          transition: opacity 360ms ease;
        }

        .loaderPoster.is-hidden {
          opacity: 0;
        }

        .loaderGlow {
          position: absolute;
          z-index: 3;
          width: 52vw;
          height: 52vw;
          max-width: 760px;
          max-height: 760px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.065) 0%,
            rgba(255, 255, 255, 0.018) 42%,
            rgba(255, 255, 255, 0) 72%
          );
          filter: blur(30px);
          pointer-events: none;
          mix-blend-mode: screen;
          animation: glowFloat 4s ease-in-out infinite alternate;
        }

        .loaderGlowOne {
          left: -14vw;
          top: -18vw;
        }

        .loaderGlowTwo {
          right: -18vw;
          bottom: -22vw;
          animation-delay: -1.8s;
        }

        .loaderFrame {
          position: absolute;
          inset: 14px;
          z-index: 4;
          border: 1px solid rgba(255, 255, 255, 0.08);
          pointer-events: none;
          opacity: 0.8;
          transition: opacity 300ms ease;
        }

        .is-leaving .loaderStage {
          transform: scale(1.09);
          opacity: 0;
          transition:
            transform ${EXIT_DURATION}ms
              cubic-bezier(0.22, 1, 0.36, 1),
            opacity ${EXIT_DURATION}ms ease;
        }

        .is-leaving .loaderGlow,
        .is-leaving .loaderFrame {
          opacity: 0;
        }

        @keyframes loaderEntrance {
          from {
            opacity: 0;
            transform: scale(1.13);
          }

          to {
            opacity: 1;
            transform: scale(1.035);
          }
        }

        @keyframes loaderBreath {
          from {
            transform: scale(1.025) rotate(-0.18deg);
          }

          to {
            transform: scale(1.055) rotate(0.18deg);
          }
        }

        @keyframes fallbackDance {
          0%,
          100% {
            transform: scale(1.02) translateY(0) rotate(-0.25deg);
          }

          45% {
            transform: scale(1.07) translateY(-5px) rotate(0.35deg);
          }

          70% {
            transform: scale(1.045) translateY(2px) rotate(-0.1deg);
          }
        }

        @keyframes glowFloat {
          from {
            transform: translate3d(-2%, -1%, 0) scale(0.96);
          }

          to {
            transform: translate3d(2%, 2%, 0) scale(1.04);
          }
        }

        @media (max-width: 768px) {
          .loaderStage {
            transform: scale(1.02);
          }

          .loaderVideo,
          .loaderPoster {
            object-fit: cover;
          }

          .loaderFrame {
            inset: 8px;
          }

          .loaderGlow {
            width: 92vw;
            height: 92vw;
          }
        }

        @media (orientation: landscape) and (max-height: 620px) {
          .loaderVideo,
          .loaderPoster {
            object-fit: contain;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loaderStage,
          .loaderPoster,
          .loaderGlow {
            animation: none !important;
          }

          .jittok-loader,
          .loaderStage {
            transition-duration: 250ms !important;
          }
        }
      `}</style>
    </div>
  );
}