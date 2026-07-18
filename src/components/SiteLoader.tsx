"use client";

import { useEffect, useRef, useState } from "react";

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressTimer = useRef<number | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    const minimumVisibleTime = 1250;

    progressTimer.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current;

        const increase =
          current < 35 ? 7 : current < 70 ? 4 : current < 86 ? 2 : 1;

        return Math.min(92, current + increase);
      });
    }, 85);

    function finishLoader() {
      if (finished.current) return;
      finished.current = true;

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, minimumVisibleTime - elapsed);

      window.setTimeout(() => {
        if (progressTimer.current) {
          window.clearInterval(progressTimer.current);
        }

        setProgress(100);

        window.setTimeout(() => {
          setLeaving(true);

          window.setTimeout(() => {
            setVisible(false);
          }, 850);
        }, 280);
      }, remaining);
    }

    if (document.readyState === "complete") {
      finishLoader();
    } else {
      window.addEventListener("load", finishLoader, { once: true });
    }

    const safetyTimer = window.setTimeout(finishLoader, 5000);

    return () => {
      window.removeEventListener("load", finishLoader);

      if (progressTimer.current) {
        window.clearInterval(progressTimer.current);
      }

      window.clearTimeout(safetyTimer);
    };
  }, []);

  if (!visible) return null;

  const panelBase: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "50.5%",
    background: "#ffffff",
    zIndex: 1,
    transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)",
    willChange: "transform",
  };

  return (
    <div
      className={leaving ? "jittok-loader is-leaving" : "jittok-loader"}
      role="status"
      aria-label="Loading JITTOK"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "hidden",
        background: "#ffffff",
        color: "#111111",
        fontFamily: '"Outfit", sans-serif',
        pointerEvents: "all",
      }}
    >
      <div
        className="panel panelTop"
        style={{
          ...panelBase,
          top: 0,
          borderBottom: "1px solid rgba(17,17,17,0.07)",
        }}
      />

      <div
        className="panel panelBottom"
        style={{
          ...panelBase,
          bottom: 0,
          borderTop: "1px solid rgba(17,17,17,0.07)",
        }}
      />

      <div
        className="backgroundWord"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: 2,
          transform: "translate(-50%, -50%)",
          color: "rgba(17,17,17,0.035)",
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: "clamp(180px, 34vw, 620px)",
          lineHeight: 0.72,
          letterSpacing: "-0.045em",
          whiteSpace: "nowrap",
          userSelect: "none",
          WebkitUserSelect: "none",
          animation: "backgroundDrift 7s ease-in-out infinite alternate",
          transition: "opacity 0.34s ease",
        }}
      >
        JITTOK
      </div>

      <span
        className="corner cornerTop"
        style={{
          position: "absolute",
          top: "22px",
          left: "24px",
          zIndex: 4,
          color: "rgba(17,17,17,0.5)",
          fontSize: "8px",
          fontWeight: 900,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          transition: "opacity 0.25s ease",
        }}
      >
        JITTOK / Loading
      </span>

      <span
        className="corner cornerBottom"
        style={{
          position: "absolute",
          right: "24px",
          bottom: "22px",
          zIndex: 4,
          color: "rgba(17,17,17,0.5)",
          fontSize: "8px",
          fontWeight: 900,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          transition: "opacity 0.25s ease",
        }}
      >
        Too loud to blend in
      </span>

      <div
        className="content"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "grid",
          placeItems: "center",
          padding: "28px",
          boxSizing: "border-box",
          transition:
            "opacity 0.35s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className="center"
          style={{
            width: "min(88vw, 560px)",
            display: "grid",
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          <div
            className="logoStage"
            style={{
              position: "relative",
              width: "min(72vw, 360px)",
              height: "clamp(92px, 15vw, 138px)",
              overflow: "hidden",
              animation:
                "logoEnter 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <img
              src="/jittok-logo.png"
              alt=""
              aria-hidden="true"
              className="logoBase"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                opacity: 0.18,
                filter: "blur(8px)",
                transform: "scale(1.08)",
              }}
            />

            <img
              src="/jittok-logo.png"
              alt="JITTOK"
              className="logoSharp"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                clipPath: `inset(0 ${100 - progress}% 0 0)`,
                transition: "clip-path 0.16s linear",
                filter: "contrast(1.04)",
              }}
            />

            <span
              className="scanLine"
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "11%",
                bottom: "11%",
                left: `${progress}%`,
                width: "1px",
                background: "rgba(17,17,17,0.55)",
                boxShadow:
                  "0 0 0 5px rgba(255,255,255,0.54), 0 0 28px rgba(17,17,17,0.12)",
                transform: "translateX(-1px)",
                transition: "left 0.16s linear",
              }}
            />
          </div>

          <div
            className="meta"
            style={{
              width: "min(78vw, 360px)",
              marginTop: "26px",
            }}
          >
            <div
              className="metaRow"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "18px",
                marginBottom: "10px",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "1.7px",
                textTransform: "uppercase",
              }}
            >
              <span>Preparing the drop</span>
              <span>{String(progress).padStart(2, "0")}%</span>
            </div>

            <div
              className="progressTrack"
              style={{
                position: "relative",
                width: "100%",
                height: "2px",
                overflow: "hidden",
                background: "rgba(17,17,17,0.11)",
              }}
            >
              <div
                className="progressFill"
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#111111",
                  transition: "width 0.16s linear",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .is-leaving .panelTop {
          transform: translateY(-102%);
        }

        .is-leaving .panelBottom {
          transform: translateY(102%);
        }

        .is-leaving .content,
        .is-leaving .backgroundWord,
        .is-leaving .corner {
          opacity: 0;
        }

        .is-leaving .content {
          transform: scale(0.96);
        }

        @keyframes logoEnter {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes backgroundDrift {
          from {
            transform: translate(-51.5%, -50%);
          }

          to {
            transform: translate(-48.5%, -50%);
          }
        }

        @media (max-width: 600px) {
          .backgroundWord {
            font-size: 58vw !important;
          }

          .logoStage {
            width: min(76vw, 300px) !important;
            height: 104px !important;
          }

          .meta {
            width: min(78vw, 300px) !important;
            margin-top: 20px !important;
          }

          .cornerTop {
            top: 16px !important;
            left: 16px !important;
          }

          .cornerBottom {
            right: 16px !important;
            bottom: 16px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .backgroundWord,
          .logoStage {
            animation: none !important;
          }

          .panel,
          .content {
            transition-duration: 0.25s !important;
          }
        }
      `}</style>
    </div>
  );
}