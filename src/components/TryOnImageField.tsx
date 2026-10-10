"use client";

import { useState, type CSSProperties } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function TryOnImageField({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setError("");

    if (file.type !== "image/png" && file.type !== "image/webp") {
      setError("Please choose a PNG (or WebP) with a transparent background.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cloudinary-upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok || typeof data.secure_url !== "string") {
        throw new Error(
          typeof data.error === "string" ? data.error : "Upload failed.",
        );
      }

      onChange(data.secure_url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={labelStyle}>Try-On Image (transparent PNG)</label>

      <p style={hintStyle}>
        The front of the item with the background removed (PNG). Customers
        see this on the camera. Leave empty to hide the &quot;Try It On&quot;
        button for this product.
      </p>

      {value ? (
        <div style={previewBoxStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Try-on preview" style={previewImageStyle} />
        </div>
      ) : null}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <label style={buttonStyle}>
          {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/png,image/webp"
            disabled={uploading}
            style={{ display: "none" }}
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ ...buttonStyle, background: "#ffffff", color: "#111111" }}
          >
            Remove
          </button>
        ) : null}
      </div>

      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const hintStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "12px",
  lineHeight: 1.6,
  color: "#77736c",
};

const previewBoxStyle: CSSProperties = {
  width: "160px",
  height: "160px",
  marginBottom: "12px",
  border: "1px solid rgba(17,17,17,0.12)",
  background:
    "repeating-conic-gradient(#e6e3dc 0% 25%, #ffffff 0% 50%) 50% / 16px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const previewImageStyle: CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
};

const buttonStyle: CSSProperties = {
  height: "42px",
  padding: "0 18px",
  border: "1px solid #111111",
  background: "#111111",
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const errorStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: "12px",
  color: "#c1121f",
};
