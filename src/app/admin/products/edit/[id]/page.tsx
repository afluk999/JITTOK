"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProductById, updateProduct } from "@/lib/productService";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

const categories = ["T-Shirts", "Hoodies", "Pants", "Accessories"];

type NewArrivalRow = "both" | "1" | "2";

const arrivalRows: Array<{ value: NewArrivalRow; label: string }> = [
  { value: "both", label: "Both Rows" },
  { value: "1", label: "Top Row Only" },
  { value: "2", label: "Bottom Row Only" },
];

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
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
  const [newArrivalRow, setNewArrivalRow] = useState<NewArrivalRow>("both");
  const [isFeatured, setIsFeatured] = useState(false);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
      await loadProduct();
    });

    return () => unsubscribe();
  }, [router, productId]);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [previewImages]);

  async function loadProduct() {
    try {
      setLoading(true);

      const product = await getProductById(productId);

      if (!product) {
        alert("Product not found.");
        router.push("/admin/products");
        return;
      }

      setName(product.name || "");
      setVariant(product.variant || "");
      setCategory(product.category || "T-Shirts");
      setPrice(String(product.price || ""));
      setDescription(product.description || "");
      setSizes((product.sizes || []).join(","));
      setStock(String(product.stock || 0));
      setIsNewArrival(Boolean(product.isNewArrival));
      setNewArrivalRow(
        product.newArrivalRow === "1" || product.newArrivalRow === "2"
          ? product.newArrivalRow
          : "both",
      );
      setIsFeatured(Boolean(product.isFeatured));
      setExistingImages(product.images || []);
    } catch (error) {
      console.error("LOAD EDIT PRODUCT ERROR:", error);
      alert("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const remainingSlots = Math.max(5 - existingImages.length, 0);
    const files = Array.from(event.target.files || []).slice(0, remainingSlots);

    previewImages.forEach((image) => URL.revokeObjectURL(image));
    setImageFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  }

  function removeExistingImage(imageUrl: string) {
    setExistingImages((previous) =>
      previous.filter((image) => image !== imageUrl),
    );
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
        },
      );

      const responseText = await response.text();

      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { rawResponse: responseText };
      }

      if (!response.ok) {
        console.error("CLOUDINARY EDIT UPLOAD ERROR:", data);
        setUploading(false);

        throw new Error(
          data?.error?.message ||
            data?.message ||
            data?.rawResponse ||
            "Image upload failed",
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

      const newUploadedImages = await uploadImages();
      const finalImages = [...existingImages, ...newUploadedImages].slice(0, 5);

      await updateProduct(productId, {
        slug: makeSlug(`${name}-${variant}`),
        name,
        variant,
        category,
        price: Number(price),
        displayPrice: formatPrice(price),
        description,
        images: finalImages,
        sizes: sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        stock: Number(stock),
        isNewArrival,
        newArrivalRow: isNewArrival ? newArrivalRow : "both",
        isFeatured,
      });

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("UPDATE PRODUCT ERROR:", error);
      alert(error?.message || "Something went wrong while updating product.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  if (checkingAuth || loading) {
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
        <Link href="/admin/products" style={backLinkStyle}>
          <ArrowLeft size={15} />
          Back to Products
        </Link>

        <h1 style={titleStyle}>Edit Product</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.9fr",
            gap: "34px",
            alignItems: "start",
          }}
        >
          <section style={panelStyle}>
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

            {isNewArrival ? (
              <div style={{ marginBottom: "22px" }}>
                <label style={labelStyle}>New Arrival Display Row</label>

                <select
                  value={newArrivalRow}
                  onChange={(event) =>
                    setNewArrivalRow(event.target.value as NewArrivalRow)
                  }
                  style={inputStyle}
                >
                  {arrivalRows.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <p style={helpTextStyle}>
                  Choose whether the product appears in the top row, bottom row,
                  or both.
                </p>
              </div>
            ) : null}

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
                  ? "Saving Changes..."
                  : "Update Product"}
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
                minHeight: "150px",
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
                Add new images
              </span>

              <span style={{ fontSize: "13px" }}>
                First image is front. Second image is used on hover.
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
              {[...existingImages, ...previewImages].length === 0 ? (
                <p
                  style={{
                    color: "rgba(246,242,235,0.54)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  No images yet.
                </p>
              ) : (
                <>
                  {existingImages.map((image, index) => (
                    <ImageBox
                      key={image}
                      image={image}
                      index={index}
                      onRemove={() => removeExistingImage(image)}
                    />
                  ))}

                  {previewImages.map((image, index) => (
                    <ImageBox
                      key={image}
                      image={image}
                      index={existingImages.length + index}
                      isNew
                    />
                  ))}
                </>
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

function ImageBox({
  image,
  index,
  onRemove,
  isNew,
}: {
  image: string;
  index: number;
  onRemove?: () => void;
  isNew?: boolean;
}) {
  return (
    <div
      style={{
        aspectRatio: "3 / 4",
        background: "#272727",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        alt={`Product image ${index + 1}`}
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
          minWidth: "28px",
          height: "28px",
          padding: "0 8px",
          borderRadius: "999px",
          background: "#111",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        {index === 0 ? "Front" : index === 1 ? "Back" : index + 1}
      </span>

      {isNew ? (
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            background: "#25D366",
            color: "#111",
            fontSize: "10px",
            fontWeight: 900,
            padding: "6px 8px",
            textTransform: "uppercase",
          }}
        >
          New
        </span>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          style={{
            position: "absolute",
            right: "10px",
            bottom: "10px",
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "50%",
            background: "#fff",
            color: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

const backLinkStyle: React.CSSProperties = {
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
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 38px",
  fontFamily: '"Bebas Neue", Impact, sans-serif',
  fontSize: "78px",
  lineHeight: 0.85,
  fontWeight: 400,
  textTransform: "uppercase",
};

const panelStyle: React.CSSProperties = {
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  padding: "34px",
};

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

const helpTextStyle: React.CSSProperties = {
  margin: "9px 0 0",
  color: "#77736c",
  fontSize: "12px",
  lineHeight: 1.55,
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