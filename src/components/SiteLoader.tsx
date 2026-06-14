"use client";

import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [showLoader, setShowLoader] = useState(true);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const minimumLoadingTime = 900;

    const startTime = Date.now();

    function finishLoading() {
      const passedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - passedTime);

      setTimeout(() => {
        setHide(true);

        setTimeout(() => {
          setShowLoader(false);
        }, 650);
      }, remainingTime);
    }

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading);
    }

    return () => {
      window.removeEventListener("load", finishLoading);
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background:
          "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.08), transparent 30%), #111",
        color: "#f6f2eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Outfit", sans-serif',
        opacity: hide ? 0 : 1,
        transform: hide ? "scale(1.015)" : "scale(1)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
        pointerEvents: "all",
      }}
    >
      <style jsx>{`
        @keyframes jittokLoaderSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes jittokLoaderPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scaleX(0.7);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes jittokTextReveal {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        style={{
          textAlign: "center",
          display: "grid",
          justifyItems: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "1px solid rgba(246,242,235,0.18)",
            borderTopColor: "#f6f2eb",
            animation: "jittokLoaderSpin 1s linear infinite",
            marginBottom: "28px",
          }}
        />

        <h1
          style={{
            margin: 0,
            fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
            fontSize: "clamp(64px, 10vw, 122px)",
            lineHeight: 0.82,
            fontWeight: 400,
            letterSpacing: "7px",
            textTransform: "uppercase",
            animation: "jittokTextReveal 0.75s ease both",
          }}
        >
          JITTOK
        </h1>

        <p
          style={{
            margin: "16px 0 0",
            color: "rgba(246,242,235,0.62)",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "2.2px",
            textTransform: "uppercase",
            animation: "jittokTextReveal 0.75s ease 0.12s both",
          }}
        >
          Loading essentials
        </p>

        <div
          style={{
            width: "120px",
            height: "1px",
            background: "rgba(246,242,235,0.18)",
            marginTop: "28px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#f6f2eb",
              transformOrigin: "center",
              animation: "jittokLoaderPulse 1.1s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}