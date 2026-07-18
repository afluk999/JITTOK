"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { getHomeContent, SocialItem } from "@/lib/contentService";

type CardPosition = {
  x: number;
  y: number;
  scale: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;
};

const DESKTOP_POSITIONS: Record<number, CardPosition> = {
  [-2]: {
    x: -450,
    y: 52,
    scale: 0.76,
    rotateY: 0,
    rotateZ: 0,
    opacity: 0.58,
  },
  [-1]: {
    x: -240,
    y: 18,
    scale: 0.9,
    rotateY: 0,
    rotateZ: 0,
    opacity: 0.88,
  },
  [0]: {
    x: 0,
    y: -12,
    scale: 1,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
  },
  [1]: {
    x: 240,
    y: 18,
    scale: 0.9,
    rotateY: 0,
    rotateZ: 0,
    opacity: 0.88,
  },
  [2]: {
    x: 450,
    y: 52,
    scale: 0.76,
    rotateY: 0,
    rotateZ: 0,
    opacity: 0.58,
  },
};

const PHONE_POSITIONS: Record<number, CardPosition> = {
  [-1]: {
    x: -205,
    y: 24,
    scale: 0.84,
    rotateY: 0,
    rotateZ: 0,
    opacity: 0.62,
  },
  [0]: {
    x: 0,
    y: -8,
    scale: 1,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
  },
  [1]: {
    x: 205,
    y: 24,
    scale: 0.84,
    rotateY: 0,
    rotateZ: 0,
    opacity: 0.62,
  },
};

function isVideoFile(source: string) {
  return (
    source.includes(".mp4") ||
    source.includes(".webm") ||
    source.includes("/video/upload")
  );
}

function getRelativeIndex(index: number, activeIndex: number, length: number) {
  let difference = index - activeIndex;
  const half = length / 2;

  if (difference > half) difference -= length;
  if (difference < -half) difference += length;

  return difference;
}

function ReelMedia({
  reel,
  active,
  muted,
  index,
}: {
  reel: SocialItem;
  active: boolean;
  muted: boolean;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = isVideoFile(reel.image);

  useEffect(() => {
    if (!video || !videoRef.current) return;

    if (active) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Browser autoplay rules can block playback until user interaction.
      });
    } else {
      videoRef.current.pause();
    }
  }, [active, video]);

  if (video) {
    return (
      <video
        ref={videoRef}
        src={reel.image}
        muted={muted || !active}
        loop
        playsInline
        preload={active ? "auto" : "metadata"}
        style={mediaStyle}
      />
    );
  }

  return (
    <img
      src={reel.image}
      alt={`JITTOK reel ${index + 1}`}
      draggable={false}
      style={mediaStyle}
    />
  );
}

function ReelCard({
  reel,
  index,
  active,
  visible,
  relativeIndex,
  isPhone,
  muted,
  onActivate,
  onToggleMute,
}: {
  reel: SocialItem;
  index: number;
  active: boolean;
  visible: boolean;
  relativeIndex: number;
  isPhone: boolean;
  muted: boolean;
  onActivate: () => void;
  onToggleMute: () => void;
}) {
  const positions = isPhone ? PHONE_POSITIONS : DESKTOP_POSITIONS;
  const position =
    positions[relativeIndex] ||
    ({
      x: relativeIndex < 0 ? -650 : 650,
      y: 100,
      scale: 0.62,
      rotateY: 0,
      rotateZ: 0,
      opacity: 0,
    } satisfies CardPosition);

  function handleCardClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!active) {
      event.preventDefault();
      onActivate();
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: active ? 20 : 10 - Math.abs(relativeIndex),
        transform: "translate(-50%, -50%)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <motion.article
        initial={false}
        animate={{
          x: position.x,
          y: position.y,
          scale: position.scale,
          rotateY: position.rotateY,
          rotateZ: position.rotateZ,
          opacity: visible ? position.opacity : 0,
        }}
        transition={{
          duration: 0.72,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          width: isPhone ? "min(72vw, 300px)" : "310px",
          aspectRatio: "9 / 16",
          transformStyle: "flat",
          willChange: "transform, opacity",
        }}
      >
        <a
          href={reel.link || "https://www.instagram.com/"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCardClick}
          aria-label={
            active
              ? `Open JITTOK reel ${index + 1}`
              : `Show JITTOK reel ${index + 1}`
          }
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "0px",
            background: "#f1f1f1",
            border: active
              ? "1px solid rgba(17,17,17,0.72)"
              : "1px solid rgba(17,17,17,0.13)",
            boxShadow: active
              ? "0 34px 90px rgba(17,17,17,0.20)"
              : "0 20px 52px rgba(17,17,17,0.10)",
            color: "#ffffff",
            textDecoration: "none",
            transition:
              "border-color 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          <ReelMedia
            reel={reel}
            active={active}
            muted={muted}
            index={index}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 34%, transparent 58%, rgba(0,0,0,0.72) 100%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: isPhone ? "13px" : "15px",
              top: isPhone ? "13px" : "15px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              minHeight: "32px",
              padding: "0 11px",
              background: "rgba(17,17,17,0.46)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "999px",
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <FaInstagram size={13} />
            Reel {String(index + 1).padStart(2, "0")}
          </div>

          {active && isVideoFile(reel.image) ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggleMute();
              }}
              aria-label={muted ? "Unmute reel" : "Mute reel"}
              style={{
                position: "absolute",
                right: isPhone ? "13px" : "15px",
                top: isPhone ? "13px" : "15px",
                width: "34px",
                height: "34px",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                background: "rgba(17,17,17,0.46)",
                color: "#ffffff",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {muted ? (
                <VolumeX size={15} strokeWidth={1.8} />
              ) : (
                <Volume2 size={15} strokeWidth={1.8} />
              )}
            </button>
          ) : null}

          <div
            style={{
              position: "absolute",
              left: isPhone ? "16px" : "18px",
              right: isPhone ? "16px" : "18px",
              bottom: isPhone ? "16px" : "18px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: isPhone ? "16px" : "18px",
                fontWeight: 800,
                letterSpacing: "-0.2px",
              }}
            >
              JITTOK Styling
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                color: "rgba(255,255,255,0.78)",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              <span>{active ? "View on Instagram" : "Select reel"}</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
        </a>
      </motion.article>
    </div>
  );
}

export default function ReelsSection() {
  const [reels, setReels] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPhone, setIsPhone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [instagramUrl, setInstagramUrl] = useState(
    "https://www.instagram.com/"
  );

  useEffect(() => {
    function updateViewport() {
      setIsPhone(window.innerWidth <= 768);
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    async function loadReels() {
      try {
        const content = await getHomeContent();
        setReels((content.reelsItems || []).slice(0, 8));
        setInstagramUrl(
          content.instagramUrl || "https://www.instagram.com/"
        );
      } catch (error) {
        console.error("LOAD REELS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReels();
  }, []);

  useEffect(() => {
    if (paused || reels.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % reels.length);
    }, isPhone ? 3800 : 3400);

    return () => window.clearInterval(timer);
  }, [paused, reels.length, isPhone]);

  useEffect(() => {
    if (activeIndex > reels.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, reels.length]);

  const visibleRange = isPhone ? 1 : 2;

  const cards = useMemo(
    () =>
      reels.map((reel, index) => {
        const relativeIndex = getRelativeIndex(
          index,
          activeIndex,
          reels.length
        );

        return {
          reel,
          index,
          relativeIndex,
          visible: Math.abs(relativeIndex) <= visibleRange,
        };
      }),
    [reels, activeIndex, visibleRange]
  );

  function showPrevious() {
    if (reels.length === 0) return;

    setActiveIndex(
      (previous) => (previous - 1 + reels.length) % reels.length
    );
  }

  function showNext() {
    if (reels.length === 0) return;

    setActiveIndex((previous) => (previous + 1) % reels.length);
  }

  return (
    <section
      id="reels"
      style={{
        width: "100%",
        background: "#ffffff",
        color: "#111111",
        fontFamily: '"Outfit", sans-serif',
        padding: isPhone ? "68px 0 76px" : "92px 0 106px",
        overflow: "hidden",
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          width: "min(92vw, 920px)",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#77736c",
            fontSize: isPhone ? "9px" : "10px",
            fontWeight: 900,
            letterSpacing: isPhone ? "2.3px" : "3px",
            textTransform: "uppercase",
          }}
        >
          JITTOK Social Edit
        </p>

        <h2
          style={{
            margin: 0,
            fontFamily:
              '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
            fontSize: isPhone
              ? "clamp(62px, 19vw, 82px)"
              : "clamp(82px, 9vw, 132px)",
            lineHeight: 0.8,
            fontWeight: 400,
            letterSpacing: isPhone ? "0.5px" : "1px",
            textTransform: "uppercase",
          }}
        >
          Watch The Drop
        </h2>

        <div
          aria-hidden="true"
          style={{
            width: isPhone ? "44px" : "58px",
            height: "1px",
            margin: isPhone ? "19px auto 16px" : "24px auto 18px",
            background: "#111111",
          }}
        />

        <p
          style={{
            maxWidth: "540px",
            margin: "0 auto",
            color: "#6f6a63",
            fontSize: isPhone ? "12px" : "14px",
            lineHeight: 1.75,
          }}
        >
          Looks, movement, and behind-the-scenes moments from the JITTOK
          world.
        </p>
      </motion.header>

      <div
        onMouseEnter={() => {
          if (!isPhone) setPaused(true);
        }}
        onMouseLeave={() => {
          if (!isPhone) setPaused(false);
        }}
        style={{
          position: "relative",
          width: "100%",
          height: isPhone ? "530px" : "650px",
          marginTop: isPhone ? "28px" : "38px",
          perspective: "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            bottom: isPhone ? "48px" : "52px",
            width: isPhone ? "78vw" : "760px",
            height: isPhone ? "62px" : "92px",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(17,17,17,0.11) 0%, rgba(17,17,17,0.04) 44%, rgba(17,17,17,0) 72%)",
            filter: "blur(14px)",
          }}
        />

        {loading ? (
          <EmptyReel text="Loading reels..." isPhone={isPhone} />
        ) : reels.length === 0 ? (
          <EmptyReel
            text="Add reels from admin/content"
            isPhone={isPhone}
          />
        ) : (
          cards.map(({ reel, index, relativeIndex, visible }) => (
            <ReelCard
              key={`${reel.image}-${index}`}
              reel={reel}
              index={index}
              active={relativeIndex === 0}
              visible={visible}
              relativeIndex={relativeIndex}
              isPhone={isPhone}
              muted={muted}
              onActivate={() => setActiveIndex(index)}
              onToggleMute={() => setMuted((previous) => !previous)}
            />
          ))
        )}
      </div>

      {reels.length > 0 ? (
        <div
          style={{
            width: "min(92vw, 760px)",
            margin: isPhone ? "-2px auto 0" : "-8px auto 0",
            display: "grid",
            gridTemplateColumns: "44px 1fr 44px",
            alignItems: "center",
            gap: isPhone ? "12px" : "18px",
          }}
        >
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous reel"
            style={navigationButtonStyle}
          >
            <ChevronLeft size={17} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {reels.map((reel, index) => (
              <button
                key={`${reel.image}-dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show reel ${index + 1}`}
                style={{
                  width: activeIndex === index ? "26px" : "7px",
                  height: "7px",
                  padding: 0,
                  border: "none",
                  borderRadius: "999px",
                  background:
                    activeIndex === index
                      ? "#111111"
                      : "rgba(17,17,17,0.2)",
                  cursor: "pointer",
                  transition:
                    "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next reel"
            style={navigationButtonStyle}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      ) : null}

      <div
        style={{
          marginTop: isPhone ? "28px" : "34px",
          textAlign: "center",
        }}
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            minHeight: "44px",
            padding: "0 20px",
            border: "1px solid #111111",
            background: "#ffffff",
            color: "#111111",
            textDecoration: "none",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
          }}
        >
          <FaInstagram size={15} />
          View Instagram
        </a>
      </div>
    </section>
  );
}

function EmptyReel({
  text,
  isPhone,
}: {
  text: string;
  isPhone: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: isPhone ? "calc(100vw - 36px)" : "min(760px, 84vw)",
        minHeight: isPhone ? "300px" : "380px",
        transform: "translate(-50%, -50%)",
        border: "1px dashed #d4ccc1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#77736c",
        fontSize: "11px",
        fontWeight: 900,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

const mediaStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  display: "block",
};

const navigationButtonStyle: CSSProperties = {
  width: "44px",
  height: "44px",
  padding: 0,
  border: "1px solid rgba(17,17,17,0.22)",
  borderRadius: "50%",
  background: "#ffffff",
  color: "#111111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};