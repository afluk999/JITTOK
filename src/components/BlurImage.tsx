"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
} from "react";

type BlurImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "style" | "onLoad" | "onError"
> & {
  wrapperStyle?: CSSProperties;
  imageStyle?: CSSProperties;
  loadingBlur?: number;
  onLoaded?: () => void;
  onImageError?: () => void;
};

export default function BlurImage({
  src,
  alt,
  wrapperStyle,
  imageStyle,
  loadingBlur = 18,
  onLoaded,
  onImageError,
  ...imageProps
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <span
      className="jittok-blur-image"
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        background:
          "linear-gradient(110deg, #eeeae3 8%, #faf9f7 18%, #eeeae3 33%)",
        backgroundSize: "220% 100%",
        ...wrapperStyle,
      }}
    >
      {!loaded && !failed ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.72) 44%, transparent 68%)",
            backgroundSize: "220% 100%",
            animation: "jittokImageShimmer 1.35s linear infinite",
            zIndex: 1,
          }}
        />
      ) : null}

      {!failed ? (
        <img
          {...imageProps}
          src={src}
          alt={alt}
          onLoad={() => {
            setLoaded(true);
            onLoaded?.();
          }}
          onError={() => {
            setFailed(true);
            onImageError?.();
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            opacity: loaded ? 1 : 0.58,
            filter: loaded ? "blur(0px)" : `blur(${loadingBlur}px)`,
            transform: loaded ? "scale(1)" : "scale(1.055)",
            transition:
              "filter 0.72s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)",
            ...imageStyle,
          }}
        />
      ) : (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "#8a857d",
            fontSize: "9px",
            fontWeight: 900,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          Image unavailable
        </span>
      )}

      <style jsx>{`
        @keyframes jittokImageShimmer {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -20% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          span {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}
