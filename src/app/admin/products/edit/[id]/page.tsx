"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getProductById,
  updateProduct,
  type ProductBadge,
  type ProductImageFit,
  type ProductImageRatio,
  type ProductImageRole,
  type ProductImageSetting,
  type ProductStatus,
} from "@/lib/productService";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ImagePlus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

const categories = ["T-Shirts", "Hoodies", "Pants", "Accessories"];

type NewArrivalRow = "both" | "1" | "2";

type EditableImageItem = {
  id: string;
  url: string;
  file?: File;
  previewUrl: string;
  role: ProductImageRole;
  fit: ProductImageFit;
  ratio: ProductImageRatio;
  positionX: number;
  positionY: number;
  isNew: boolean;
};

const arrivalRows: Array<{ value: NewArrivalRow; label: string }> = [
  { value: "both", label: "Both Rows" },
  { value: "1", label: "Top Row Only" },
  { value: "2", label: "Bottom Row Only" },
];

const statusOptions: Array<{ value: ProductStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "sold-out", label: "Sold Out" },
  { value: "archived", label: "Archived" },
];

const badgeOptions: Array<{ value: ProductBadge; label: string }> = [
  { value: "none", label: "No Badge" },
  { value: "new", label: "New" },
  { value: "bestseller", label: "Bestseller" },
  { value: "limited", label: "Limited" },
  { value: "sold-out", label: "Sold Out" },
];

const roleOptions: Array<{ value: ProductImageRole; label: string }> = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back / Hover" },
  { value: "gallery", label: "Gallery" },
];

const ratioOptions: Array<{ value: ProductImageRatio; label: string }> = [
  { value: "original", label: "Original" },
  { value: "1:1", label: "1:1 Square" },
  { value: "4:5", label: "4:5 Product" },
  { value: "16:9", label: "16:9 Banner" },
  { value: "9:16", label: "9:16 Mobile" },
];

const fitOptions: Array<{ value: ProductImageFit; label: string }> = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
];

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function formatPrice(price: string | number) {
  const number = Number(price || 0);
  return `₹${number.toLocaleString("en-IN")}.00`;
}

function optionalNumber(value: string) {
  if (value.trim() === "") return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function numberToInput(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong while updating the product.";
}

function getPreviewAspectRatio(ratio: ProductImageRatio) {
  switch (ratio) {
    case "1:1":
      return "1 / 1";
    case "4:5":
      return "4 / 5";
    case "16:9":
      return "16 / 9";
    case "9:16":
      return "9 / 16";
    default:
      return "3 / 4";
  }
}

function ensureRequiredImageRoles(items: EditableImageItem[]) {
  if (items.length === 0) return items;

  const next = items.map((item) => ({ ...item }));

  if (!next.some((item) => item.role === "front")) {
    next[0].role = "front";
  }

  if (next.length > 1 && !next.some((item) => item.role === "back")) {
    const backIndex = next.findIndex((item) => item.role !== "front");

    if (backIndex >= 0) {
      next[backIndex].role = "back";
    }
  }

  return next;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );

  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [sellingPrice, setSellingPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("S,M,L,XL");
  const [stock, setStock] = useState("10");
  const [status, setStatus] = useState<ProductStatus>("published");
  const [badge, setBadge] = useState<ProductBadge>("none");

  const [isNewArrival, setIsNewArrival] = useState(true);
  const [newArrivalRow, setNewArrivalRow] =
    useState<NewArrivalRow>("both");
  const [newArrivalOrder, setNewArrivalOrder] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState("");

  const [isIconic, setIsIconic] = useState(false);
  const [iconicOrder, setIconicOrder] = useState("");
  const [homepageOrder, setHomepageOrder] = useState("");

  const [imageItems, setImageItems] = useState<EditableImageItem[]>([]);

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
    const urls = previewUrlsRef.current;

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  async function loadProduct() {
    try {
      setLoading(true);

      const product = await getProductById(productId);

      if (!product) {
        alert("Product not found.");
        router.push("/admin/products");
        return;
      }

      const currentSellingPrice = product.sellingPrice ?? product.price ?? 0;
      const currentOriginalPrice =
        product.originalPrice ?? product.price ?? currentSellingPrice;

      setName(product.name || "");
      setVariant(product.variant || "");
      setCategory(product.category || "T-Shirts");
      setSellingPrice(String(currentSellingPrice));
      setOriginalPrice(String(currentOriginalPrice));
      setDescription(product.description || "");
      setSizes((product.sizes || []).join(","));
      setStock(String(product.stock ?? 0));
      setStatus(product.status ?? "published");
      setBadge(product.badge ?? "none");

      setIsNewArrival(Boolean(product.isNewArrival));
      setNewArrivalRow(
        product.newArrivalRow === "1" || product.newArrivalRow === "2"
          ? product.newArrivalRow
          : "both",
      );
      setNewArrivalOrder(numberToInput(product.newArrivalOrder));

      setIsFeatured(Boolean(product.isFeatured));
      setFeaturedOrder(numberToInput(product.featuredOrder));

      setIsIconic(Boolean(product.isIconic));
      setIconicOrder(numberToInput(product.iconicOrder));
      setHomepageOrder(numberToInput(product.homepageOrder));

      const savedSettings =
        product.imageSettings && product.imageSettings.length > 0
          ? [...product.imageSettings].sort(
              (first, second) => first.order - second.order,
            )
          : (product.images || []).map((url, index) => ({
              url,
              role:
                index === 0
                  ? ("front" as ProductImageRole)
                  : index === 1
                    ? ("back" as ProductImageRole)
                    : ("gallery" as ProductImageRole),
              fit: "cover" as ProductImageFit,
              ratio: "original" as ProductImageRatio,
              positionX: 50,
              positionY: 50,
              order: index,
            }));

      setImageItems(
        ensureRequiredImageRoles(
          savedSettings.map((setting, index) => ({
            id: `existing-${index}-${setting.url}`,
            url: setting.url,
            previewUrl: setting.url,
            role: setting.role,
            fit: setting.fit,
            ratio: setting.ratio,
            positionX: setting.positionX,
            positionY: setting.positionY,
            isNew: false,
          })),
        ),
      );
    } catch (error) {
      console.error("LOAD EDIT PRODUCT ERROR:", error);
      alert("Failed to load product.");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  }

  function createNewImageItem(
    file: File,
    index: number,
  ): EditableImageItem {
    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(previewUrl);

    const futureIndex = imageItems.length + index;

    return {
      id: `new-${Date.now()}-${index}-${file.name}-${file.lastModified}`,
      url: "",
      file,
      previewUrl,
      role:
        futureIndex === 0
          ? "front"
          : futureIndex === 1
            ? "back"
            : "gallery",
      fit: "cover",
      ratio: "original",
      positionX: 50,
      positionY: 50,
      isNew: true,
    };
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = Math.max(0, 5 - imageItems.length);

    if (remainingSlots === 0) {
      alert("You can keep a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const acceptedFiles = selectedFiles.slice(0, remainingSlots);

    if (selectedFiles.length > remainingSlots) {
      alert(`Only ${remainingSlots} more image(s) can be added.`);
    }

    const newItems = acceptedFiles.map((file, index) =>
      createNewImageItem(file, index),
    );

    setImageItems((current) =>
      ensureRequiredImageRoles([...current, ...newItems]),
    );

    event.target.value = "";
  }

  function removeImage(imageId: string) {
    setImageItems((current) => {
      const imageToRemove = current.find((item) => item.id === imageId);

      if (imageToRemove?.file) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
        previewUrlsRef.current.delete(imageToRemove.previewUrl);
      }

      return ensureRequiredImageRoles(
        current.filter((item) => item.id !== imageId),
      );
    });
  }

  function replaceImage(
    imageId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const replacementFile = event.target.files?.[0];

    if (!replacementFile) return;

    const replacementPreview = URL.createObjectURL(replacementFile);
    previewUrlsRef.current.add(replacementPreview);

    setImageItems((current) =>
      current.map((item) => {
        if (item.id !== imageId) return item;

        if (item.file) {
          URL.revokeObjectURL(item.previewUrl);
          previewUrlsRef.current.delete(item.previewUrl);
        }

        return {
          ...item,
          id: `replacement-${Date.now()}-${replacementFile.name}-${replacementFile.lastModified}`,
          url: "",
          file: replacementFile,
          previewUrl: replacementPreview,
          isNew: true,
        };
      }),
    );

    event.target.value = "";
  }

  function updateImageItem(
    imageId: string,
    update: Partial<
      Omit<
        EditableImageItem,
        "id" | "url" | "file" | "previewUrl" | "isNew"
      >
    >,
  ) {
    setImageItems((current) =>
      current.map((item) =>
        item.id === imageId ? { ...item, ...update } : item,
      ),
    );
  }

  function changeImageRole(imageId: string, role: ProductImageRole) {
    setImageItems((current) => {
      if (role === "gallery") {
        return ensureRequiredImageRoles(
          current.map((item) =>
            item.id === imageId ? { ...item, role } : item,
          ),
        );
      }

      const selectedImage = current.find((item) => item.id === imageId);
      if (!selectedImage) return current;

      return current.map((item) => {
        if (item.id === imageId) {
          return { ...item, role };
        }

        if (item.role === role) {
          return {
            ...item,
            role:
              selectedImage.role === "gallery"
                ? "gallery"
                : selectedImage.role,
          };
        }

        return item;
      });
    });
  }

  function moveImage(fromIndex: number, toIndex: number) {
    if (
      toIndex < 0 ||
      toIndex >= imageItems.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    setImageItems((current) => {
      const next = [...current];
      const [movedItem] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, movedItem);
      return next;
    });
  }

  function handleImageDrop(targetIndex: number) {
    if (draggedImageIndex === null) return;

    moveImage(draggedImageIndex, targetIndex);
    setDraggedImageIndex(null);
  }

  function handleStatusChange(nextStatus: ProductStatus) {
    setStatus(nextStatus);

    if (nextStatus === "sold-out") {
      setBadge("sold-out");
      setStock("0");
      return;
    }

    if (badge === "sold-out") {
      setBadge("none");
    }
  }

  function handleBadgeChange(nextBadge: ProductBadge) {
    setBadge(nextBadge);

    if (nextBadge === "sold-out") {
      setStatus("sold-out");
      setStock("0");
    }
  }

  async function uploadImage(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary cloud name or upload preset is missing.");
    }

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
    let data: Record<string, unknown> = {};

    try {
      data = JSON.parse(responseText) as Record<string, unknown>;
    } catch {
      data = { rawResponse: responseText };
    }

    if (!response.ok) {
      console.error("CLOUDINARY EDIT UPLOAD ERROR:", data);

      const cloudinaryError = data.error as
        | { message?: string }
        | undefined;

      throw new Error(
        cloudinaryError?.message ||
          (typeof data.message === "string" ? data.message : "") ||
          (typeof data.rawResponse === "string" ? data.rawResponse : "") ||
          "Image upload failed",
      );
    }

    if (typeof data.secure_url !== "string") {
      throw new Error("Cloudinary did not return an image URL.");
    }

    return data.secure_url;
  }

  async function buildFinalImages() {
    const imageUrls: string[] = [];
    const imageSettings: ProductImageSetting[] = [];

    for (let index = 0; index < imageItems.length; index += 1) {
      const item = imageItems[index];
      const finalUrl = item.file ? await uploadImage(item.file) : item.url;

      if (!finalUrl) {
        throw new Error(`Image ${index + 1} does not have a valid URL.`);
      }

      imageUrls.push(finalUrl);
      imageSettings.push({
        url: finalUrl,
        role: item.role,
        fit: item.fit,
        ratio: item.ratio,
        positionX: item.positionX,
        positionY: item.positionY,
        order: index,
      });
    }

    return { imageUrls, imageSettings };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsedSellingPrice = Number(sellingPrice);
    const parsedOriginalPrice = originalPrice.trim()
      ? Number(originalPrice)
      : parsedSellingPrice;
    const parsedStock = Number(stock);

    if (!name.trim() || !variant.trim() || !description.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    if (!Number.isFinite(parsedSellingPrice) || parsedSellingPrice <= 0) {
      alert("Please enter a valid selling price.");
      return;
    }

    if (
      !Number.isFinite(parsedOriginalPrice) ||
      parsedOriginalPrice < parsedSellingPrice
    ) {
      alert("Original price must be equal to or greater than selling price.");
      return;
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      alert("Please enter a valid stock amount.");
      return;
    }

    if (imageItems.length === 0) {
      alert("Please keep at least one product image.");
      return;
    }

    try {
      setSaving(true);
      setUploading(imageItems.some((item) => Boolean(item.file)));

      const { imageUrls, imageSettings } = await buildFinalImages();

      let finalStatus = status;
      let finalBadge = badge;
      let finalStock = parsedStock;

      if (status === "sold-out" || parsedStock === 0) {
        finalStatus = "sold-out";
        finalBadge = "sold-out";
        finalStock = 0;
      }

      await updateProduct(productId, {
        slug: makeSlug(`${name}-${variant}`),
        name: name.trim(),
        variant: variant.trim(),
        category,

        // Preserve the old price fields for the current storefront.
        price: parsedSellingPrice,
        displayPrice: formatPrice(parsedSellingPrice),

        sellingPrice: parsedSellingPrice,
        originalPrice: parsedOriginalPrice,

        description: description.trim(),
        images: imageUrls,
        imageSettings,

        sizes: sizes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        stock: finalStock,

        status: finalStatus,
        badge: finalBadge,

        isNewArrival,
        newArrivalRow: isNewArrival ? newArrivalRow : "both",
        newArrivalOrder: isNewArrival
          ? optionalNumber(newArrivalOrder)
          : undefined,

        isFeatured,
        featuredOrder: isFeatured
          ? optionalNumber(featuredOrder)
          : undefined,

        isIconic,
        iconicOrder: isIconic ? optionalNumber(iconicOrder) : undefined,
        homepageOrder: optionalNumber(homepageOrder),
      });

      alert("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      console.error("UPDATE PRODUCT ERROR:", error);
      alert(getErrorMessage(error));
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
        {checkingAuth ? "Checking admin access..." : "Loading product..."}
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f2eb",
        color: "#111",
        padding: "clamp(22px, 4vw, 42px)",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Link href="/admin/products" style={backLinkStyle}>
          <ArrowLeft size={15} />
          Back to Products
        </Link>

        <h1 style={titleStyle}>Edit Product</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "34px",
            alignItems: "start",
          }}
        >
          <section style={panelStyle}>
            <SectionTitle>Product Information</SectionTitle>

            <div style={twoColStyle}>
              <Input
                label="Product Name *"
                value={name}
                onChange={setName}
                placeholder="Oversized Tee"
              />

              <Input
                label="Variant / Color *"
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

              <div>
                <label style={labelStyle}>Product Status</label>

                <select
                  value={status}
                  onChange={(event) =>
                    handleStatusChange(event.target.value as ProductStatus)
                  }
                  style={inputStyle}
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={twoColStyle}>
              <Input
                label="Selling Price *"
                value={sellingPrice}
                onChange={setSellingPrice}
                placeholder="999"
                type="number"
                min="0"
              />

              <Input
                label="Original Price"
                value={originalPrice}
                onChange={setOriginalPrice}
                placeholder="1299"
                type="number"
                min="0"
              />
            </div>

            <p style={{ ...helpTextStyle, marginTop: "-8px" }}>
              The original price is shown crossed out only when it is greater
              than the selling price.
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Description *</label>

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
                min="0"
                disabled={status === "sold-out"}
              />
            </div>

            <div style={twoColStyle}>
              <div>
                <label style={labelStyle}>Product Badge</label>

                <select
                  value={badge}
                  onChange={(event) =>
                    handleBadgeChange(event.target.value as ProductBadge)
                  }
                  style={inputStyle}
                >
                  {badgeOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="General Homepage Order"
                value={homepageOrder}
                onChange={setHomepageOrder}
                placeholder="Optional"
                type="number"
                min="0"
              />
            </div>

            <div style={dividerStyle} />

            <SectionTitle>Homepage Placement</SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              <ToggleCard
                checked={isNewArrival}
                onChange={setIsNewArrival}
                label="New Arrival"
              />

              <ToggleCard
                checked={isFeatured}
                onChange={setIsFeatured}
                label="Featured"
              />

              <ToggleCard
                checked={isIconic}
                onChange={setIsIconic}
                label="Iconic Product"
              />
            </div>

            {isNewArrival ? (
              <div style={twoColStyle}>
                <div>
                  <label style={labelStyle}>New Arrival Display Row</label>

                  <select
                    value={newArrivalRow}
                    onChange={(event) =>
                      setNewArrivalRow(
                        event.target.value as NewArrivalRow,
                      )
                    }
                    style={inputStyle}
                  >
                    {arrivalRows.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="New Arrival Order"
                  value={newArrivalOrder}
                  onChange={setNewArrivalOrder}
                  placeholder="Optional"
                  type="number"
                  min="0"
                />
              </div>
            ) : null}

            {isFeatured ? (
              <div style={{ marginBottom: "18px" }}>
                <Input
                  label="Featured Order"
                  value={featuredOrder}
                  onChange={setFeaturedOrder}
                  placeholder="Optional"
                  type="number"
                  min="0"
                />
              </div>
            ) : null}

            {isIconic ? (
              <div style={{ marginBottom: "22px" }}>
                <Input
                  label="Iconic Product Order"
                  value={iconicOrder}
                  onChange={setIconicOrder}
                  placeholder="1, 2 or 3"
                  type="number"
                  min="1"
                />
              </div>
            ) : null}

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
              padding: "clamp(22px, 4vw, 34px)",
              minHeight: "520px",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: "clamp(42px, 6vw, 52px)",
                lineHeight: 0.9,
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              Product Images
            </h2>

            <p
              style={{
                margin: "0 0 24px",
                color: "rgba(246,242,235,0.62)",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Existing images are preserved unless you replace or remove them.
              Drag cards or use the arrow buttons to change their order.
            </p>

            <label
              style={{
                minHeight: "150px",
                border: "1px dashed rgba(246,242,235,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
                cursor: imageItems.length >= 5 ? "not-allowed" : "pointer",
                marginBottom: "22px",
                color: "rgba(246,242,235,0.72)",
                textAlign: "center",
                opacity: imageItems.length >= 5 ? 0.5 : 1,
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
                {imageItems.length >= 5
                  ? "Maximum 5 images reached"
                  : "Add more images"}
              </span>

              <span style={{ fontSize: "13px" }}>
                {imageItems.length} of 5 image slots used
              </span>

              <input
                type="file"
                multiple
                disabled={imageItems.length >= 5}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>

            {imageItems.length === 0 ? (
              <div
                style={{
                  minHeight: "240px",
                  border: "1px solid rgba(246,242,235,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "12px",
                  color: "rgba(246,242,235,0.45)",
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                <ImagePlus size={34} strokeWidth={1.2} />
                <span style={{ fontSize: "14px" }}>
                  No images remain. Add at least one image before saving.
                </span>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "18px" }}>
                {imageItems.map((item, index) => (
                  <article
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedImageIndex(index)}
                    onDragEnd={() => setDraggedImageIndex(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleImageDrop(index)}
                    style={{
                      border: "1px solid rgba(246,242,235,0.16)",
                      background: "#191919",
                      padding: "14px",
                      opacity: draggedImageIndex === index ? 0.55 : 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <GripVertical
                          size={18}
                          color="rgba(246,242,235,0.5)"
                        />

                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          Image {index + 1}
                        </span>

                        {item.isNew ? (
                          <span
                            style={{
                              minHeight: "24px",
                              padding: "0 8px",
                              background: "#25d366",
                              color: "#111",
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: "9px",
                              fontWeight: 900,
                              letterSpacing: "0.7px",
                              textTransform: "uppercase",
                            }}
                          >
                            New Upload
                          </span>
                        ) : null}
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <IconButton
                          title="Move left"
                          disabled={index === 0}
                          onClick={() => moveImage(index, index - 1)}
                        >
                          <ChevronLeft size={16} />
                        </IconButton>

                        <IconButton
                          title="Move right"
                          disabled={index === imageItems.length - 1}
                          onClick={() => moveImage(index, index + 1)}
                        >
                          <ChevronRight size={16} />
                        </IconButton>

                        <IconButton
                          title="Remove image"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Remove this image from the product? The change is applied when you save.",
                            );

                            if (confirmed) removeImage(item.id);
                          }}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: "16px",
                        alignItems: "start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: getPreviewAspectRatio(item.ratio),
                            background: "#272727",
                            position: "relative",
                            overflow: "hidden",
                            transition: "aspect-ratio 180ms ease",
                          }}
                        >
                          <img
                            src={item.previewUrl}
                            alt={`${item.role} preview`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: item.fit,
                              objectPosition: `${item.positionX}% ${item.positionY}%`,
                            }}
                          />

                          <span
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "10px",
                              minHeight: "28px",
                              padding: "0 10px",
                              borderRadius: "999px",
                              background: "#111",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              fontWeight: 900,
                              letterSpacing: "0.7px",
                              textTransform: "uppercase",
                            }}
                          >
                            {roleOptions.find(
                              (option) => option.value === item.role,
                            )?.label ?? item.role}
                          </span>
                        </div>

                        <label
                          htmlFor={`replace-${item.id}`}
                          style={{
                            height: "40px",
                            marginTop: "10px",
                            border: "1px solid rgba(246,242,235,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "10px",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          <Upload size={14} />
                          Replace Image
                        </label>

                        <input
                          id={`replace-${item.id}`}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={(event) => replaceImage(item.id, event)}
                          style={{ display: "none" }}
                        />
                      </div>

                      <div>
                        <DarkSelect
                          label="Image Role"
                          value={item.role}
                          onChange={(value) =>
                            changeImageRole(
                              item.id,
                              value as ProductImageRole,
                            )
                          }
                          options={roleOptions}
                        />

                        <div style={darkTwoColStyle}>
                          <DarkSelect
                            label="Ratio"
                            value={item.ratio}
                            onChange={(value) =>
                              updateImageItem(item.id, {
                                ratio: value as ProductImageRatio,
                              })
                            }
                            options={ratioOptions}
                          />

                          <DarkSelect
                            label="Fit"
                            value={item.fit}
                            onChange={(value) =>
                              updateImageItem(item.id, {
                                fit: value as ProductImageFit,
                              })
                            }
                            options={fitOptions}
                          />
                        </div>

                        <RangeControl
                          label="Horizontal Position"
                          value={item.positionX}
                          onChange={(value) =>
                            updateImageItem(item.id, { positionX: value })
                          }
                        />

                        <RangeControl
                          label="Vertical Position"
                          value={item.positionY}
                          onChange={(value) =>
                            updateImageItem(item.id, { positionY: value })
                          }
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </form>
      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: "0 0 22px",
        fontFamily: '"Bebas Neue", Impact, sans-serif',
        fontSize: "34px",
        lineHeight: 1,
        fontWeight: 400,
        textTransform: "uppercase",
      }}
    >
      {children}
    </h2>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  min?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <input
        type={type}
        min={min}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          opacity: disabled ? 0.55 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </div>
  );
}

function ToggleCard({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        minHeight: "54px",
        padding: "0 15px",
        border: checked ? "1px solid #111" : "1px solid #d8d0c4",
        background: checked ? "#111" : "#f6f2eb",
        color: checked ? "#fff" : "#111",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: 900,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function DarkSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={darkLabelStyle}>{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={darkInputStyle}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RangeControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <label style={{ ...darkLabelStyle, marginBottom: 0 }}>{label}</label>
        <span
          style={{
            color: "rgba(246,242,235,0.6)",
            fontSize: "11px",
          }}
        >
          {value}%
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ width: "100%", cursor: "pointer" }}
      />
    </div>
  );
}

function IconButton({
  title,
  disabled = false,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "34px",
        height: "34px",
        border: "1px solid rgba(246,242,235,0.18)",
        background: "transparent",
        color: "#f6f2eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
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
  fontSize: "clamp(54px, 8vw, 78px)",
  lineHeight: 0.85,
  fontWeight: 400,
  textTransform: "uppercase",
};

const panelStyle: React.CSSProperties = {
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  padding: "clamp(22px, 4vw, 34px)",
};

const twoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "18px",
};

const darkTwoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "12px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const darkLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "rgba(246,242,235,0.72)",
  fontSize: "10px",
  fontWeight: 900,
  letterSpacing: "0.9px",
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
  boxSizing: "border-box",
};

const darkInputStyle: React.CSSProperties = {
  width: "100%",
  height: "42px",
  border: "1px solid rgba(246,242,235,0.18)",
  background: "#111",
  color: "#f6f2eb",
  outline: "none",
  padding: "0 11px",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "12px",
  boxSizing: "border-box",
};

const helpTextStyle: React.CSSProperties = {
  margin: "9px 0 18px",
  color: "#77736c",
  fontSize: "12px",
  lineHeight: 1.55,
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  background: "#ddd5ca",
  margin: "30px 0",
};