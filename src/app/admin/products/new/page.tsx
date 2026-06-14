"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createProduct } from "@/lib/productService";
import { ArrowLeft, Save, Upload } from "lucide-react";

const categories = ["T-Shirts", "Hoodies", "Pants", "Accessories"];

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function formatPrice(price: string) {
  const number = Number(price || 0);
  return `₹${number.toLocaleString("en-IN")}.00`;
}

export default function NewProductPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("S,M,L,XL");
  const [stock, setStock] = useState("10");
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
        return;
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 5);

    setImageFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  }

  async function uploadImages() {
    if (imageFiles.length === 0) return [];

    setUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setUploading(false);
      throw new Error("Cloudinary cloud name or upload preset is missing.");
    }

    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { rawResponse: responseText };
      }

      if (!response.ok) {
        console.error("CLOUDINARY DIRECT UPLOAD ERROR:", data);
        setUploading(false);

        throw new Error(
          data?.error?.message ||
            data?.message ||
            data?.rawResponse ||
            "Image upload failed"
        );
      }

      uploadedUrls.push(data.secure_url);
    }

    setUploading(false);

    return uploadedUrls;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name || !variant || !price || !description) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const uploadedImageUrls = await uploadImages();

      await createProduct({
        slug: makeSlug(`${name}-${variant}`),
        name,
        variant,
        category,
        price: Number(price),
        displayPrice: formatPrice(price),
        description,
        images: uploadedImageUrls,
        sizes: sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        stock: Number(stock),
        isNewArrival,
        isFeatured,
      });

      alert("Product added successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("SAVE PRODUCT ERROR:", error);
      alert(error?.message || "Something went wrong while saving product.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#111",
          color: "#f6f2eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        Checking admin access...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f2eb",
        color: "#111",
        padding: "42px",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <Link
          href="/admin/products"
          style={{
            color: "#77736c",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={15} />
          Back to Products
        </Link>

        <h1
          style={{
            margin: "0 0 38px",
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: "78px",
            lineHeight: 0.85,
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.9fr",
            gap: "34px",
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "#f2eee7",
              border: "1px solid #e5ded4",
              padding: "34px",
            }}
          >
            <div style={twoColStyle}>
              <Input
                label="Product Name"
                value={name}
                onChange={setName}
                placeholder="Oversized Tee"
              />

              <Input
                label="Variant / Color"
                value={variant}
                onChange={setVariant}
                placeholder="Ivory"
              />
            </div>

            <div style={twoColStyle}>
              <div>
                <label style={labelStyle}>Category</label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  style={inputStyle}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Price"
                value={price}
                onChange={setPrice}
                placeholder="1299"
                type="number"
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Description</label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Product description..."
                style={{
                  ...inputStyle,
                  height: "140px",
                  paddingTop: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={twoColStyle}>
              <Input
                label="Sizes"
                value={sizes}
                onChange={setSizes}
                placeholder="S,M,L,XL"
              />

              <Input
                label="Stock"
                value={stock}
                onChange={setStock}
                placeholder="10"
                type="number"
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <label style={checkboxStyle}>
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(event) => setIsNewArrival(event.target.checked)}
                />
                New Arrival
              </label>

              <label style={checkboxStyle}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(event) => setIsFeatured(event.target.checked)}
                />
                Featured
              </label>
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              style={{
                width: "100%",
                height: "58px",
                border: "none",
                background: "#111",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: saving || uploading ? "not-allowed" : "pointer",
                opacity: saving || uploading ? 0.7 : 1,
              }}
            >
              <Save size={16} />
              {uploading
                ? "Uploading Images..."
                : saving
                ? "Saving Product..."
                : "Save Product"}
            </button>
          </section>

          <section
            style={{
              background: "#111",
              color: "#f6f2eb",
              padding: "34px",
              minHeight: "520px",
            }}
          >
            <h2
              style={{
                margin: "0 0 24px",
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: "52px",
                lineHeight: 0.9,
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              Product Images
            </h2>

            <label
              style={{
                minHeight: "170px",
                border: "1px dashed rgba(246,242,235,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
                cursor: "pointer",
                marginBottom: "22px",
                color: "rgba(246,242,235,0.72)",
                textAlign: "center",
              }}
            >
              <Upload size={28} strokeWidth={1.5} />

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Upload up to 5 images
              </span>

              <span style={{ fontSize: "13px" }}>
                First image will be used as main image.
              </span>

              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {previewImages.length === 0 ? (
                <p
                  style={{
                    color: "rgba(246,242,235,0.54)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  No images selected yet.
                </p>
              ) : (
                previewImages.map((image, index) => (
                  <div
                    key={image}
                    style={{
                      aspectRatio: "3 / 4",
                      background: "#272727",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <span
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "10px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#111",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 900,
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const twoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
  marginBottom: "18px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "52px",
  border: "1px solid #d8d0c4",
  background: "#f6f2eb",
  outline: "none",
  padding: "0 15px",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "14px",
  color: "#111",
};

const checkboxStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "9px",
  fontSize: "13px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};