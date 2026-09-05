"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  getHomeContent,
  type StoryCircleItem,
} from "@/lib/contentService";

function IOSSpinner({ size, color }: { size: number; color: string }) {
  const tickCount = 8;
  const tickWidth = Math.max(size * 0.09, 2);
  const tickHeight = size * 0.26;

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {Array.from({ length: tickCount }).map((_, index) => (
        <span
          key={index}
          className="ios-spinner-tick"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${tickWidth}px`,
            height: `${tickHeight}px`,
            marginLeft: `${-tickWidth / 2}px`,
            marginTop: `${-size / 2}px`,
            borderRadius: `${tickWidth / 2}px`,
            background: color,
            transformOrigin: `50% ${size / 2}px`,
            transform: `rotate(${index * (360 / tickCount)}deg)`,
            animationDelay: `${-(1 - index / tickCount)}s`,
          }}
        />
      ))}
    </div>
  );
}

function CircleItem({
  circle,
  isPhone,
  onLockedClick,
}: {
  circle: StoryCircleItem;
  isPhone: boolean;
  onLockedClick: () => void;
}) {
  const [failedFlags, setFailedFlags] = useState<boolean[]>(
    () => circle.images.map(() => false),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  // Each circle gets its own random starting stagger (0-1200ms) so
  // they don't all flip in lockstep, even if mounted at the exact
  // same moment.
  const staggerOffsetRef = useRef(Math.floor(Math.random() * 1200));

  const validImages = circle.images.filter(
    (image, index) => Boolean(image) && !failedFlags[index],
  );

  useEffect(() => {
    if (validImages.length <= 1) return;

    let cycleTimeoutId: number;

    function scheduleNextCycle() {
      // Small random jitter (+/- 400ms) around the 3s base so
      // circles drift out of sync with each other over time,
      // instead of all changing at the exact same instant.
      const jitter = Math.floor(Math.random() * 800) - 400;
      const delay = 3000 + jitter;

      cycleTimeoutId = window.setTimeout(() => {
        setActiveIndex((previous) => (previous + 1) % validImages.length);
        scheduleNextCycle();
      }, delay);
    }

    const startTimeoutId = window.setTimeout(() => {
      scheduleNextCycle();
    }, staggerOffsetRef.current);

    return () => {
      window.clearTimeout(startTimeoutId);
      window.clearTimeout(cycleTimeoutId);
    };
  }, [validImages.length]);

  function markFailed(originalIndex: number) {
    setFailedFlags((previous) => {
      const next = [...previous];
      next[originalIndex] = true;
      return next;
    });
  }

  const circleSize = isPhone ? 112 : 150;

  const circleContent = (
    <div
      style={{
        position: "relative",
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        borderRadius: "50%",
        overflow: "hidden",
        background: circle.comingSoon ? "#f4f3ef" : "#f0eee9",
        border: circle.comingSoon
          ? "1px solid rgba(17,17,17,0.1)"
          : "1px solid rgba(17,17,17,0.08)",
      }}
    >
      {validImages.map((imageUrl, validIndex) => {
        const originalIndex = circle.images.indexOf(imageUrl);

        return (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt={circle.name}
            fill
            sizes="(max-width: 768px) 112px, 150px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              filter: circle.comingSoon ? "blur(9px)" : "none",
              transform: circle.comingSoon ? "scale(1.15)" : "none",
              opacity: validIndex === activeIndex ? 1 : 0,
              transition: "opacity 900ms ease",
            }}
            onError={() => {
              if (originalIndex >= 0) markFailed(originalIndex);
            }}
          />
        );
      })}

      {circle.comingSoon ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.24)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IOSSpinner size={circleSize * 0.26} color="#ffffff" />
          </div>
        </>
      ) : null}
    </div>
  );

  const itemStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: "0 0 auto",
    width: `${isPhone ? 118 : 165}px`,
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    textDecoration: "none",
    color: "#171717",
  };

  const nameStyle: CSSProperties = {
    marginTop: isPhone ? "10px" : "14px",
    fontFamily: '"Outfit", sans-serif',
    fontSize: isPhone ? "11px" : "13px",
    fontWeight: 600,
    lineHeight: 1.4,
    color: "#111111",
    textAlign: "center",
  };

  if (circle.comingSoon) {
    return (
      <button
        type="button"
        style={itemStyle}
        onClick={onLockedClick}
        aria-label={`${circle.name} coming soon`}
      >
        {circleContent}
        <span style={nameStyle}>{circle.name}</span>
      </button>
    );
  }

  return (
    <Link href={`/collections/${circle.slug}`} style={itemStyle}>
      {circleContent}
      <span style={nameStyle}>{circle.name}</span>
    </Link>
  );
}

export default function Story() {
  const [circles, setCircles] = useState<StoryCircleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    function checkSize() {
      setIsPhone(window.innerWidth <= 640);
    }

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    async function loadCircles() {
      try {
        const content = await getHomeContent();
        setCircles(content.storyCircles || []);
      } catch (error) {
        console.error("LOAD STORY CIRCLES ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCircles();
  }, []);

  if (loading || circles.length === 0) return null;

  const sectionStyle: CSSProperties = {
    width: "100%",
    background: "#ffffff",
    padding: isPhone ? "28px 18px" : "34px 20px",
    overflow: "hidden",
  };

  const rowStyle: CSSProperties = {
    maxWidth: "1160px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: isPhone ? "flex-start" : "center",
    gap: isPhone ? "18px" : "30px",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
  };

  return (
    <>
      <style>{`
        .ios-spinner-tick {
          animation: ios-spinner-fade 1s linear infinite;
        }

        @keyframes ios-spinner-fade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.15;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ios-spinner-tick {
            animation: none;
            opacity: 0.6;
          }
        }
      `}</style>

      <section style={sectionStyle}>
        <div style={rowStyle}>
          {circles.map((circle) => (
            <CircleItem
              key={circle.id}
              circle={circle}
              isPhone={isPhone}
              onLockedClick={() => setShowComingSoon(true)}
            />
          ))}
        </div>

        {showComingSoon && (
          <div
            onClick={() => setShowComingSoon(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                position: "relative",
                width: "min(400px, 100%)",
                padding: "38px 30px 32px",
                borderRadius: "14px",
                background: "#ffffff",
                textAlign: "center",
                boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowComingSoon(false)}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "14px",
                  width: "30px",
                  height: "30px",
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  fontWeight: 300,
                  color: "#171717",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  color: "#77736c",
                }}
              >
                JITTOK
              </p>

              <h3
                style={{
                  margin: "0 0 12px",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#171717",
                }}
              >
                Coming Soon
              </h3>

              <p
                style={{
                  margin: "0 0 22px",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#55524c",
                }}
              >
                This collection is currently under development. Follow
                JITTOK for the latest updates.
              </p>

              <a
                href="https://www.instagram.com/jittok.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "42px",
                  padding: "0 20px",
                  borderRadius: "6px",
                  background: "#171717",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  textDecoration: "none",
                }}
              >
                Follow @jittok.in
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}