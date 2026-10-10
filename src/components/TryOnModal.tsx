"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Camera, X } from "lucide-react";

type Keypoint = { x: number; y: number; score?: number; name?: string };

type Detector = {
  estimatePoses: (
    video: HTMLVideoElement,
  ) => Promise<{ keypoints: Keypoint[] }[]>;
  dispose: () => void;
};

type Point = { x: number; y: number };

type Props = {
  garmentUrl: string;
  productName: string;
  onClose: () => void;
};

const MIN_SCORE = 0.3;
const SMOOTHING = 0.45;
const LOST_AFTER_MS = 600;

// How wide the shirt is drawn compared with the distance between shoulders.
const WIDTH_FACTOR = 1.75;
// How far above the shoulder line the top of the shirt sits.
const NECK_LIFT = 0.14;

function lerpPoint(previous: Point | null, next: Point): Point {
  if (!previous) return next;
  return {
    x: previous.x + (next.x - previous.x) * SMOOTHING,
    y: previous.y + (next.y - previous.y) * SMOOTHING,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function TryOnModal({ garmentUrl, productName, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadingText, setLoadingText] = useState("Starting camera...");
  const [errorText, setErrorText] = useState("");
  const [bodyVisible, setBodyVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    let detector: Detector | null = null;
    let frameId = 0;
    let detecting = false;

    const smoothed: {
      ls: Point | null;
      rs: Point | null;
      lh: Point | null;
      rh: Point | null;
    } = { ls: null, rs: null, lh: null, rh: null };

    let lastSeen = 0;
    let lastVisibleFlag = true;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Camera is not available here. Please open the site on https in a modern browser.",
          );
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        await video.play();

        setLoadingText("Loading body detection (first time takes a few seconds)...");

        const garment = new Image();
        garment.crossOrigin = "anonymous";
        garment.src = garmentUrl;

        const garmentReady = new Promise<void>((resolve, reject) => {
          garment.onload = () => resolve();
          garment.onerror = () =>
            reject(new Error("Could not load the try-on image."));
        });

        const tf = await import("@tensorflow/tfjs");
        const poseDetection = await import("@tensorflow-models/pose-detection");

        try {
          await tf.setBackend("webgl");
        } catch {
          await tf.setBackend("cpu");
        }
        await tf.ready();

        detector = (await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableSmoothing: true,
          },
        )) as unknown as Detector;

        await garmentReady;

        if (cancelled) return;

        setStatus("ready");

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        function updatePoint(
          key: "ls" | "rs" | "lh" | "rh",
          keypoint: Keypoint | undefined,
          width: number,
        ) {
          if (!keypoint || (keypoint.score ?? 0) < MIN_SCORE) return false;
          // Mirror x so the picture behaves like a mirror.
          smoothed[key] = lerpPoint(smoothed[key], {
            x: width - keypoint.x,
            y: keypoint.y,
          });
          return true;
        }

        async function detect() {
          if (detecting || !detector || !video) return;
          detecting = true;
          try {
            const poses = await detector.estimatePoses(video);
            const keypoints = poses[0]?.keypoints ?? [];
            const find = (name: string) =>
              keypoints.find((point) => point.name === name);

            const width = video.videoWidth;
            const gotLeft = updatePoint("ls", find("left_shoulder"), width);
            const gotRight = updatePoint("rs", find("right_shoulder"), width);
            updatePoint("lh", find("left_hip"), width);
            updatePoint("rh", find("right_hip"), width);

            if (gotLeft && gotRight) {
              lastSeen = performance.now();
            }
          } catch {
            // Ignore a single failed frame.
          } finally {
            detecting = false;
          }
        }

        function draw() {
          if (cancelled || !video || !context || !canvas) return;

          const width = video.videoWidth;
          const height = video.videoHeight;

          if (width && height) {
            if (canvas.width !== width || canvas.height !== height) {
              canvas.width = width;
              canvas.height = height;
            }

            // Mirrored camera picture.
            context.save();
            context.translate(width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, width, height);
            context.restore();

            const visible = performance.now() - lastSeen < LOST_AFTER_MS;

            if (visible !== lastVisibleFlag) {
              lastVisibleFlag = visible;
              setBodyVisible(visible);
            }

            const { ls, rs, lh, rh } = smoothed;

            if (visible && ls && rs) {
              const left = ls.x < rs.x ? ls : rs;
              const right = ls.x < rs.x ? rs : ls;

              const shoulderWidth = Math.hypot(
                right.x - left.x,
                right.y - left.y,
              );

              const angle = Math.atan2(right.y - left.y, right.x - left.x);

              const shoulderMid = {
                x: (left.x + right.x) / 2,
                y: (left.y + right.y) / 2,
              };

              const drawWidth = shoulderWidth * WIDTH_FACTOR;
              const baseScale = drawWidth / garment.naturalWidth;
              let drawHeight = garment.naturalHeight * baseScale;

              if (lh && rh) {
                const hipMid = {
                  x: (lh.x + rh.x) / 2,
                  y: (lh.y + rh.y) / 2,
                };
                const torso = Math.hypot(
                  hipMid.x - shoulderMid.x,
                  hipMid.y - shoulderMid.y,
                );
                drawHeight = clamp(
                  torso * 1.25,
                  drawHeight * 0.85,
                  drawHeight * 1.15,
                );
              }

              const lift = shoulderWidth * NECK_LIFT;

              context.save();
              context.translate(shoulderMid.x, shoulderMid.y);
              context.rotate(angle);
              context.drawImage(
                garment,
                -drawWidth / 2,
                -lift,
                drawWidth,
                drawHeight,
              );
              context.restore();
            }
          }

          void detect();
          frameId = requestAnimationFrame(draw);
        }

        draw();
      } catch (error) {
        if (cancelled) return;

        let message =
          error instanceof Error ? error.message : "Something went wrong.";

        if (error instanceof DOMException) {
          if (error.name === "NotAllowedError") {
            message =
              "Camera permission was blocked. Allow the camera in your browser settings and try again.";
          } else if (error.name === "NotFoundError") {
            message = "No camera was found on this device.";
          } else if (error.name === "NotReadableError") {
            message = "The camera is being used by another app.";
          }
        }

        setErrorText(message);
        setStatus("error");
      }
    }

    void start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      try {
        detector?.dispose();
      } catch {
        // ignore
      }
    };
  }, [garmentUrl]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function saveSnapshot() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "jittok-try-on.png";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch {
      // Canvas could be blocked if the image host does not allow it.
    }
  }

  return (
    <div role="dialog" aria-modal="true" style={backdropStyle}>
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>JITTOK TRY ON</p>
          <p style={titleStyle}>{productName}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close try on"
          style={closeButtonStyle}
        >
          <X size={20} />
        </button>
      </div>

      <div style={stageStyle}>
        <video ref={videoRef} style={hiddenVideoStyle} playsInline muted />

        <canvas
          ref={canvasRef}
          style={{
            ...canvasStyle,
            visibility: status === "ready" ? "visible" : "hidden",
          }}
        />

        {status === "loading" ? (
          <div style={centerMessageStyle}>
            <div style={spinnerStyle} />
            <p style={messageTextStyle}>{loadingText}</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div style={centerMessageStyle}>
            <p style={messageTextStyle}>{errorText}</p>
            <button type="button" onClick={onClose} style={primaryButtonStyle}>
              Close
            </button>
          </div>
        ) : null}

        {status === "ready" && !bodyVisible ? (
          <div style={hintStyle}>
            Step back so your shoulders and chest are in view
          </div>
        ) : null}
      </div>

      {status === "ready" ? (
        <div style={footerStyle}>
          <p style={noteStyle}>
            Preview only. Stand facing the camera in good light.
          </p>

          <button type="button" onClick={saveSnapshot} style={primaryButtonStyle}>
            <Camera size={16} />
            Save photo
          </button>
        </div>
      ) : null}

      <style>{`@keyframes jittok-tryon-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100001,
  background: "#0b0b0b",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  fontFamily: '"Outfit", sans-serif',
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 18px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "2px",
  color: "rgba(255,255,255,0.6)",
};

const titleStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: "15px",
  fontWeight: 800,
  textTransform: "uppercase",
};

const closeButtonStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const stageStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  minHeight: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const hiddenVideoStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  opacity: 0,
  pointerEvents: "none",
};

const canvasStyle: CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
};

const centerMessageStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "18px",
  padding: "24px",
  textAlign: "center",
};

const messageTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "340px",
  fontSize: "14px",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.85)",
};

const spinnerStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "3px solid rgba(255,255,255,0.2)",
  borderTopColor: "#ffffff",
  animation: "jittok-tryon-spin 0.9s linear infinite",
};

const hintStyle: CSSProperties = {
  position: "absolute",
  top: "14px",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "10px 16px",
  borderRadius: "999px",
  background: "rgba(0,0,0,0.65)",
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const footerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  padding: "14px 18px",
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const noteStyle: CSSProperties = {
  margin: 0,
  fontSize: "11px",
  color: "rgba(255,255,255,0.55)",
};

const primaryButtonStyle: CSSProperties = {
  height: "44px",
  padding: "0 20px",
  border: "none",
  background: "#ffffff",
  color: "#111111",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};
