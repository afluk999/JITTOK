"use client";

import { useCallback, useState, type CSSProperties } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X, Check, ZoomIn } from "lucide-react";

type ImageCropModalProps = {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (croppedFile: File) => void;
};

/*
 * Draws the selected crop area onto a canvas and exports it as a
 * real File, so it can be uploaded exactly like any other image.
 */
async function getCroppedFile(
  imageSrc: string,
  cropPixels: Area,
): Promise<File> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context for cropping.");
  }

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/jpeg", 0.92);
  });

  if (!blob) {
    throw new Error("Failed to generate cropped image.");
  }

  return new File([blob], `cropped-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export default function ImageCropModal({
  imageSrc,
  aspect = 3 / 4,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixelsResult: Area) => {
      setCroppedAreaPixels(croppedAreaPixelsResult);
    },
    [],
  );

  async function handleConfirm() {
    if (!croppedAreaPixels) return;

    try {
      setProcessing(true);
      const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels);
      onConfirm(croppedFile);
    } catch (error) {
      console.error("IMAGE CROP ERROR:", error);
      alert("Failed to crop this image. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div
      onClick={onCancel}
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Crop image"
    >
      <div onClick={(event) => event.stopPropagation()} style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Crop Image</h2>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close crop tool"
            style={closeButtonStyle}
          >
            <X size={18} />
          </button>
        </div>

        <div style={cropperWrapperStyle}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div style={controlsStyle}>
          <ZoomIn size={16} color="#f6f2eb" />

          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            style={sliderStyle}
            aria-label="Zoom"
          />
        </div>

        <div style={footerStyle}>
          <button
            type="button"
            onClick={onCancel}
            style={cancelButtonStyle}
            disabled={processing}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            style={confirmButtonStyle}
            disabled={processing || !croppedAreaPixels}
          >
            <Check size={16} />
            {processing ? "Cropping..." : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 200000,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modalStyle: CSSProperties = {
  width: "min(560px, 100%)",
  background: "#111111",
  borderRadius: "12px",
  overflow: "hidden",
  fontFamily: '"Outfit", sans-serif',
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  borderBottom: "1px solid rgba(246,242,235,0.1)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: "#f6f2eb",
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
};

const closeButtonStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  border: "none",
  background: "transparent",
  color: "#f6f2eb",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cropperWrapperStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "360px",
  background: "#000",
};

const controlsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px 20px",
};

const sliderStyle: CSSProperties = {
  flex: 1,
  cursor: "pointer",
};

const footerStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  padding: "16px 20px",
  borderTop: "1px solid rgba(246,242,235,0.1)",
};

const cancelButtonStyle: CSSProperties = {
  flex: 1,
  height: "44px",
  border: "1px solid rgba(246,242,235,0.24)",
  background: "transparent",
  color: "#f6f2eb",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  cursor: "pointer",
  borderRadius: "6px",
};

const confirmButtonStyle: CSSProperties = {
  flex: 1,
  height: "44px",
  border: "none",
  background: "#f6f2eb",
  color: "#111111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  cursor: "pointer",
  borderRadius: "6px",
};