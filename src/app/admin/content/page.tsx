"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getHomeContent,
  updateHomeContent,
  SocialItem,
} from "@/lib/contentService";
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { signatureProducts } from "@/data/signatureProducts";

export default function AdminContentPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [brandStatement, setBrandStatement] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [heroPreviews, setHeroPreviews] = useState<string[]>([]);

  const [editorialImages, setEditorialImages] = useState<string[]>([]);
  const [editorialFiles, setEditorialFiles] = useState<File[]>([]);
  const [editorialPreviews, setEditorialPreviews] = useState<string[]>([]);

  const [iconicImages, setIconicImages] = useState<string[]>([]);
const [iconicFiles, setIconicFiles] = useState<File[]>([]);
const [iconicPreviews, setIconicPreviews] = useState<string[]>([]);
const [savingIconic, setSavingIconic] = useState(false);

  const [signatureImages, setSignatureImages] = useState<
    Record<string, string[]>
  >({});
  const [signatureFiles, setSignatureFiles] = useState<
    Record<string, File[]>
  >({});
  const [signaturePreviews, setSignaturePreviews] = useState<
    Record<string, string[]>
  >({});
  const [savingSignatureSlug, setSavingSignatureSlug] = useState("");

  const [reelsItems, setReelsItems] = useState<SocialItem[]>([]);
  const [reelFile, setReelFile] = useState<File | null>(null);
  const [reelPreview, setReelPreview] = useState("");
  const [reelLink, setReelLink] = useState("");

  const [instagramPosts, setInstagramPosts] = useState<SocialItem[]>([]);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState("");
  const [postLink, setPostLink] = useState("");

  const [savingHero, setSavingHero] = useState(false);
  const [savingEditorial, setSavingEditorial] = useState(false);
  const [savingReel, setSavingReel] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin");
        return;
      }

      setCheckingAuth(false);
      await loadContent();
    });

    return () => unsubscribe();
  }, [router]);

  async function loadContent() {
    try {
      setLoading(true);

      const content = await getHomeContent();

      setBrandStatement(content.brandStatement || "");
      setWhatsappNumber(content.whatsappNumber || "");
      setInstagramUsername(content.instagramUsername || "");
      setInstagramUrl(content.instagramUrl || "");

      setHeroImages(content.heroImages || []);
      setEditorialImages(content.editorialImages || []);
      setIconicImages(content.iconicImages || []);
      setSignatureImages(content.signatureProductImages || {});
      setReelsItems(content.reelsItems || []);
      setInstagramPosts(content.instagramPosts || []);
    } catch (error) {
      console.error("LOAD CONTENT ERROR:", error);
      alert("Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return [];

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary cloud name or upload preset is missing.");
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
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
        console.error("CLOUDINARY CONTENT UPLOAD ERROR:", data);
        throw new Error(
          data?.error?.message ||
            data?.message ||
            data?.rawResponse ||
            "Upload failed"
        );
      }

      uploadedUrls.push(data.secure_url);
    }

    return uploadedUrls;
  }

  async function saveSettings() {
    try {
      setSavingSettings(true);

      await updateHomeContent({
        brandStatement,
        whatsappNumber,
        instagramUsername,
        instagramUrl,
      });

      alert("Site settings saved successfully!");
    } catch (error: any) {
      console.error("SAVE SETTINGS ERROR:", error);
      alert(error?.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveHero() {
    try {
      setSavingHero(true);

      const uploaded = await uploadFiles(heroFiles);
      const finalImages = [...heroImages, ...uploaded].slice(0, 12);

      if (finalImages.length < 3) {
        alert("Please add at least 3 hero images.");
        return;
      }

      await updateHomeContent({ heroImages: finalImages });

      setHeroImages(finalImages);
      setHeroFiles([]);
      setHeroPreviews([]);

      alert("Hero saved successfully!");
    } catch (error: any) {
      console.error("SAVE HERO ERROR:", error);
      alert(error?.message || "Failed to save hero.");
    } finally {
      setSavingHero(false);
    }
  }

  async function saveEditorial() {
    try {
      setSavingEditorial(true);

      const uploaded = await uploadFiles(editorialFiles);
      const finalImages = [...editorialImages, ...uploaded].slice(0, 6);

      if (finalImages.length < 1) {
        alert("Please add at least 1 editorial image.");
        return;
      }

      await updateHomeContent({ editorialImages: finalImages });

      setEditorialImages(finalImages);
      setEditorialFiles([]);
      setEditorialPreviews([]);

      alert("Editorial saved successfully!");
    } catch (error: any) {
      console.error("SAVE EDITORIAL ERROR:", error);
      alert(error?.message || "Failed to save editorial.");
    } finally {
      setSavingEditorial(false);
    }
  }
  async function saveIconicImages() {
  try {
    setSavingIconic(true);

    const uploaded = await uploadFiles(iconicFiles);
    const finalImages = [...iconicImages, ...uploaded].slice(0, 3);

    if (finalImages.length !== 3) {
      alert("Please add exactly 3 iconic product images.");
      return;
    }

    await updateHomeContent({ iconicImages: finalImages });

    setIconicImages(finalImages);
    setIconicFiles([]);
    setIconicPreviews([]);

    alert("Iconic product images saved successfully!");
  } catch (error: any) {
    console.error("SAVE ICONIC IMAGES ERROR:", error);
    alert(error?.message || "Failed to save iconic images.");
  } finally {
    setSavingIconic(false);
  }
}


  async function saveSignatureImages(slug: string) {
    try {
      setSavingSignatureSlug(slug);

      const currentImages = signatureImages[slug] || [];
      const selectedFiles = signatureFiles[slug] || [];
      const uploaded = await uploadFiles(selectedFiles);
      const finalImages = [...currentImages, ...uploaded].slice(0, 3);

      if (finalImages.length < 1) {
        alert("Please add at least 1 image for this signature product.");
        return;
      }

      const updatedSignatureImages = {
        ...signatureImages,
        [slug]: finalImages,
      };

      await updateHomeContent({
        signatureProductImages: updatedSignatureImages,
      });

      setSignatureImages(updatedSignatureImages);
      setSignatureFiles((previous) => ({
        ...previous,
        [slug]: [],
      }));
      setSignaturePreviews((previous) => ({
        ...previous,
        [slug]: [],
      }));

      alert("Signature product gallery saved successfully!");
    } catch (error: any) {
      console.error("SAVE SIGNATURE PRODUCT IMAGES ERROR:", error);
      alert(error?.message || "Failed to save signature product images.");
    } finally {
      setSavingSignatureSlug("");
    }
  }

  async function addReelItem() {
    try {
      if (!reelFile) {
        alert("Please upload reel video/image.");
        return;
      }

      if (!reelLink.trim()) {
        alert("Please paste Instagram reel link.");
        return;
      }

      if (reelsItems.length >= 8) {
        alert("Maximum 8 reels allowed.");
        return;
      }

      setSavingReel(true);

      const uploaded = await uploadFiles([reelFile]);

      const finalItems = [
        ...reelsItems,
        {
          image: uploaded[0],
          link: reelLink.trim(),
        },
      ];

      await updateHomeContent({ reelsItems: finalItems });

      setReelsItems(finalItems);
      setReelFile(null);
      setReelPreview("");
      setReelLink("");

      alert("Reel added successfully!");
    } catch (error: any) {
      console.error("SAVE REEL ERROR:", error);
      alert(error?.message || "Failed to save reel.");
    } finally {
      setSavingReel(false);
    }
  }

  async function addPostItem() {
    try {
      if (!postFile) {
        alert("Please upload Instagram post image.");
        return;
      }

      if (!postLink.trim()) {
        alert("Please paste Instagram post link.");
        return;
      }

      if (instagramPosts.length >= 6) {
        alert("Maximum 6 Instagram posts allowed.");
        return;
      }

      setSavingPost(true);

      const uploaded = await uploadFiles([postFile]);

      const finalItems = [
        ...instagramPosts,
        {
          image: uploaded[0],
          link: postLink.trim(),
        },
      ];

      await updateHomeContent({ instagramPosts: finalItems });

      setInstagramPosts(finalItems);
      setPostFile(null);
      setPostPreview("");
      setPostLink("");

      alert("Instagram post added successfully!");
    } catch (error: any) {
      console.error("SAVE POST ERROR:", error);
      alert(error?.message || "Failed to save post.");
    } finally {
      setSavingPost(false);
    }
  }

  async function removeReelItem(index: number) {
    const finalItems = reelsItems.filter((_, itemIndex) => itemIndex !== index);
    setReelsItems(finalItems);
    await updateHomeContent({ reelsItems: finalItems });
  }

  async function removePostItem(index: number) {
    const finalItems = instagramPosts.filter(
      (_, itemIndex) => itemIndex !== index
    );
    setInstagramPosts(finalItems);
    await updateHomeContent({ instagramPosts: finalItems });
  }

  function handleHeroChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const selectedFiles = files.slice(0, Math.max(0, 12 - heroImages.length));

    setHeroFiles(selectedFiles);
    setHeroPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  }

  function handleEditorialChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const selectedFiles = files.slice(
      0,
      Math.max(0, 6 - editorialImages.length)
    );

    setEditorialFiles(selectedFiles);
    setEditorialPreviews(
      selectedFiles.map((file) => URL.createObjectURL(file))
    );
  }

  function handleIconicChange(event: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(event.target.files || []);
  const selectedFiles = files.slice(0, Math.max(0, 3 - iconicImages.length));

  setIconicFiles(selectedFiles);
  setIconicPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
}


  function handleSignatureChange(
    slug: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);
    const existingCount = signatureImages[slug]?.length || 0;
    const selectedFiles = files.slice(0, Math.max(0, 5 - existingCount));

    setSignatureFiles((previous) => ({
      ...previous,
      [slug]: selectedFiles,
    }));

    setSignaturePreviews((previous) => ({
      ...previous,
      [slug]: selectedFiles.map((file) => URL.createObjectURL(file)),
    }));
  }

  function handleReelChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setReelFile(file);
    setReelPreview(URL.createObjectURL(file));
  }

  function handlePostChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPostFile(file);
    setPostPreview(URL.createObjectURL(file));
  }

  if (checkingAuth || loading) {
    return (
      <main style={loadingStyle}>
        Checking admin access...
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <Link href="/admin/products" style={backLinkStyle}>
          <ArrowLeft size={15} />
          Back to Products
        </Link>

        <header style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>Homepage Content</p>
            <h1 style={titleStyle}>Content Manager</h1>
          </div>

          <Link href="/" target="_blank" style={outlineButtonStyle}>
            View Site
          </Link>
        </header>

        <SettingsBlock
          brandStatement={brandStatement}
          whatsappNumber={whatsappNumber}
          instagramUsername={instagramUsername}
          instagramUrl={instagramUrl}
          setBrandStatement={setBrandStatement}
          setWhatsappNumber={setWhatsappNumber}
          setInstagramUsername={setInstagramUsername}
          setInstagramUrl={setInstagramUrl}
          onSave={saveSettings}
          saving={savingSettings}
        />

        <Spacer />

        <ImageContentBlock
          title="Hero Moving Wall"
          description="Upload 5 to 12 images. The homepage shows 4 images at a time and moves continuously."
          existingImages={heroImages}
          previewImages={heroPreviews}
          maxCount={12}
          uploadLabel="Add Hero Images"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          onFileChange={handleHeroChange}
          onRemoveExisting={(image) =>
            setHeroImages((prev) => prev.filter((item) => item !== image))
          }
          onClearSelected={() => {
            setHeroFiles([]);
            setHeroPreviews([]);
          }}
          onSave={saveHero}
          saving={savingHero}
          saveText="Save Hero"
        />

        <Spacer />

<ImageContentBlock
  title="Iconic Product Images"
  description="Upload exactly 3 images for the main iconic product cards on the homepage."
  existingImages={iconicImages}
  previewImages={iconicPreviews}
  maxCount={3}
  uploadLabel="Add 3 Iconic Images"
  inputAccept="image/png,image/jpeg,image/jpg,image/webp"
  onFileChange={handleIconicChange}
  onRemoveExisting={(image) =>
    setIconicImages((prev) => prev.filter((item) => item !== image))
  }
  onClearSelected={() => {
    setIconicFiles([]);
    setIconicPreviews([]);
  }}
  onSave={saveIconicImages}
  saving={savingIconic}
  saveText="Save Iconic Images"
/>

        <Spacer />

        <section
          style={{
            background: "#111",
            color: "#f6f2eb",
            padding: "30px",
            marginBottom: "22px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: "rgba(246,242,235,0.58)",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            Separate from New Arrivals
          </p>

          <h2
            style={{
              margin: 0,
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              fontSize: "54px",
              lineHeight: 0.88,
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            Signature Product Galleries
          </h2>

          <p
            style={{
              maxWidth: "720px",
              margin: "16px 0 0",
              color: "rgba(246,242,235,0.7)",
              fontSize: "13px",
              lineHeight: 1.7,
            }}
          >
            Upload up to 5 separate images for Messi, Neymar, and Ronaldo.
            These images are used only on their signature product pages. The
            first image is also used on the homepage signature card.
          </p>
        </section>

        {signatureProducts.map((product, index) => (
          <div key={product.slug}>
            <ImageContentBlock
              title={`${product.name} Gallery`}
              description="Upload 1 to 5 images. These images will not use or affect New Arrival product images."
              existingImages={signatureImages[product.slug] || []}
              previewImages={signaturePreviews[product.slug] || []}
              maxCount={5}
              uploadLabel={`Add ${product.name} Images`}
              inputAccept="image/png,image/jpeg,image/jpg,image/webp"
              onFileChange={(event) =>
                handleSignatureChange(product.slug, event)
              }
              onRemoveExisting={(image) =>
                setSignatureImages((previous) => ({
                  ...previous,
                  [product.slug]: (
                    previous[product.slug] || []
                  ).filter((item) => item !== image),
                }))
              }
              onClearSelected={() => {
                setSignatureFiles((previous) => ({
                  ...previous,
                  [product.slug]: [],
                }));
                setSignaturePreviews((previous) => ({
                  ...previous,
                  [product.slug]: [],
                }));
              }}
              onSave={() => saveSignatureImages(product.slug)}
              saving={savingSignatureSlug === product.slug}
              saveText={`Save ${product.name} Gallery`}
            />

            {index < signatureProducts.length - 1 ? <Spacer /> : null}
          </div>
        ))}

        <Spacer />

        <ImageContentBlock
          title="Editorial Images"
          description="Upload 1 to 6 images for the editorial campaign section."
          existingImages={editorialImages}
          previewImages={editorialPreviews}
          maxCount={6}
          uploadLabel="Add Editorial Images"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          onFileChange={handleEditorialChange}
          onRemoveExisting={(image) =>
            setEditorialImages((prev) => prev.filter((item) => item !== image))
          }
          onClearSelected={() => {
            setEditorialFiles([]);
            setEditorialPreviews([]);
          }}
          onSave={saveEditorial}
          saving={savingEditorial}
          saveText="Save Editorial"
        />

        <Spacer />

        <SocialBlock
          title="Instagram Reels"
          description="Upload reel video or thumbnail and paste the Instagram reel link."
          uploadLabel="Upload Reel Video"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm"
          items={reelsItems}
          preview={reelPreview}
          previewFile={reelFile}
          link={reelLink}
          maxCount={8}
          aspectRatio="9 / 16"
          onFileChange={handleReelChange}
          onLinkChange={setReelLink}
          onAdd={addReelItem}
          onRemove={removeReelItem}
          saving={savingReel}
        />

        <Spacer />

        <SocialBlock
          title="Instagram Posts"
          description="Upload Instagram post image and paste the Instagram post link."
          uploadLabel="Upload Post Image"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          items={instagramPosts}
          preview={postPreview}
          previewFile={postFile}
          link={postLink}
          maxCount={6}
          aspectRatio="1 / 1"
          onFileChange={handlePostChange}
          onLinkChange={setPostLink}
          onAdd={addPostItem}
          onRemove={removePostItem}
          saving={savingPost}
        />
      </div>
    </main>
  );
}

function SettingsBlock({
  brandStatement,
  whatsappNumber,
  instagramUsername,
  instagramUrl,
  setBrandStatement,
  setWhatsappNumber,
  setInstagramUsername,
  setInstagramUrl,
  onSave,
  saving,
}: {
  brandStatement: string;
  whatsappNumber: string;
  instagramUsername: string;
  instagramUrl: string;
  setBrandStatement: (value: string) => void;
  setWhatsappNumber: (value: string) => void;
  setInstagramUsername: (value: string) => void;
  setInstagramUrl: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <section style={sectionGridStyle}>
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>Site Settings</h2>
        <p style={blockTextStyle}>
          Edit brand text, WhatsApp number, and Instagram details.
        </p>

        <button onClick={onSave} disabled={saving} style={lightButtonStyle}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        <label style={labelStyle}>Brand Statement</label>
        <textarea
          value={brandStatement}
          onChange={(event) => setBrandStatement(event.target.value)}
          style={{ ...inputStyle, height: "120px", paddingTop: "14px" }}
        />

        <div style={twoColStyle}>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <input
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="919876543210"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Instagram Username</label>
            <input
              value={instagramUsername}
              onChange={(event) => setInstagramUsername(event.target.value)}
              placeholder="@jittok"
              style={inputStyle}
            />
          </div>
        </div>

        <label style={labelStyle}>Instagram URL</label>
        <input
          value={instagramUrl}
          onChange={(event) => setInstagramUrl(event.target.value)}
          placeholder="https://www.instagram.com/jittok.in/"
          style={inputStyle}
        />
      </section>
    </section>
  );
}

function ImageContentBlock({
  title,
  description,
  existingImages,
  previewImages,
  maxCount,
  uploadLabel,
  inputAccept,
  onFileChange,
  onRemoveExisting,
  onClearSelected,
  onSave,
  saving,
  saveText,
}: {
  title: string;
  description: string;
  existingImages: string[];
  previewImages: string[];
  maxCount: number;
  uploadLabel: string;
  inputAccept: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExisting: (image: string) => void;
  onClearSelected: () => void;
  onSave: () => void;
  saving: boolean;
  saveText: string;
}) {
  return (
    <section style={sectionGridStyle}>
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>{title}</h2>
        <p style={blockTextStyle}>{description}</p>

        <label style={uploadBoxStyle}>
          <Upload size={30} strokeWidth={1.5} />
          <span style={uploadTitleStyle}>{uploadLabel}</span>
          <span style={{ fontSize: "13px" }}>
            {existingImages.length}/{maxCount} added
          </span>

          <input
            type="file"
            multiple
            accept={inputAccept}
            onChange={onFileChange}
            style={{ display: "none" }}
          />
        </label>

        {previewImages.length > 0 ? (
          <button type="button" onClick={onClearSelected} style={ghostButtonStyle}>
            Clear Selected
          </button>
        ) : null}

        <button onClick={onSave} disabled={saving} style={lightButtonStyle}>
          <Save size={16} />
          {saving ? "Saving..." : saveText}
        </button>
      </aside>

      <GalleryPreview
        existingImages={existingImages}
        previewImages={previewImages}
        onRemoveExisting={onRemoveExisting}
      />
    </section>
  );
}

function SocialBlock({
  title,
  description,
  uploadLabel,
  inputAccept,
  items,
  preview,
  previewFile,
  link,
  maxCount,
  aspectRatio,
  onFileChange,
  onLinkChange,
  onAdd,
  onRemove,
  saving,
}: {
  title: string;
  description: string;
  uploadLabel: string;
  inputAccept: string;
  items: SocialItem[];
  preview: string;
  previewFile: File | null;
  link: string;
  maxCount: number;
  aspectRatio: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLinkChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  saving: boolean;
}) {
  return (
    <section style={sectionGridStyle}>
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>{title}</h2>
        <p style={blockTextStyle}>{description}</p>

        <label style={uploadBoxStyle}>
          <Upload size={30} strokeWidth={1.5} />
          <span style={uploadTitleStyle}>{uploadLabel}</span>
          <span style={{ fontSize: "13px" }}>
            {items.length}/{maxCount} added
          </span>

          <input
            type="file"
            accept={inputAccept}
            onChange={onFileChange}
            style={{ display: "none" }}
          />
        </label>

        {preview ? (
          <div
            style={{
              width: "140px",
              aspectRatio,
              background: "#222",
              overflow: "hidden",
              margin: "16px 0",
            }}
          >
            {previewFile?.type.startsWith("video/") ? (
              <video
                src={preview}
                muted
                loop
                autoPlay
                playsInline
                style={mediaStyle}
              />
            ) : (
              <img src={preview} alt="Preview" style={mediaStyle} />
            )}
          </div>
        ) : null}

        <input
          value={link}
          onChange={(event) => onLinkChange(event.target.value)}
          placeholder="Paste Instagram link"
          style={darkInputStyle}
        />

        <button onClick={onAdd} disabled={saving} style={lightButtonStyle}>
          <Plus size={16} />
          {saving ? "Saving..." : "Add Item"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        {items.length === 0 ? (
          <EmptyBox text={`No ${title.toLowerCase()} yet`} />
        ) : (
          <div style={gridStyle}>
            {items.map((item, index) => (
              <MediaBox
                key={`${item.image}-${index}`}
                item={item}
                index={index}
                aspectRatio={aspectRatio}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function GalleryPreview({
  existingImages,
  previewImages,
  onRemoveExisting,
}: {
  existingImages: string[];
  previewImages: string[];
  onRemoveExisting: (image: string) => void;
}) {
  return (
    <section style={previewPanelStyle}>
      {[...existingImages, ...previewImages].length === 0 ? (
        <EmptyBox text="No images yet" />
      ) : (
        <div style={gridStyle}>
          {existingImages.map((image, index) => (
            <SimpleImageBox
              key={image}
              image={image}
              index={index}
              onRemove={() => onRemoveExisting(image)}
            />
          ))}

          {previewImages.map((image, index) => (
            <SimpleImageBox
              key={image}
              image={image}
              index={existingImages.length + index}
              isNew
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SimpleImageBox({
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
    <div style={imageBoxStyle}>
      <img src={image} alt={`Content ${index + 1}`} style={mediaStyle} />
      <NumberBadge index={index} />

      {isNew ? <NewBadge /> : null}

      {onRemove ? (
        <button type="button" onClick={onRemove} style={removeButtonStyle}>
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

function MediaBox({
  item,
  index,
  aspectRatio,
  onRemove,
}: {
  item: SocialItem;
  index: number;
  aspectRatio: string;
  onRemove: () => void;
}) {
  const isVideo =
    item.image.includes(".mp4") ||
    item.image.includes(".webm") ||
    item.image.includes("/video/upload");

  return (
    <div style={{ ...imageBoxStyle, aspectRatio }}>
      {isVideo ? (
        <video
          src={item.image}
          muted
          loop
          autoPlay
          playsInline
          style={mediaStyle}
        />
      ) : (
        <img src={item.image} alt={`Social ${index + 1}`} style={mediaStyle} />
      )}

      <NumberBadge index={index} />

      <div style={instagramBadgeStyle}>
        <FaInstagram size={15} />
      </div>

      <button type="button" onClick={onRemove} style={removeButtonStyle}>
        <X size={16} />
      </button>
    </div>
  );
}

function NumberBadge({ index }: { index: number }) {
  return <span style={numberBadgeStyle}>{index + 1}</span>;
}

function NewBadge() {
  return <span style={newBadgeStyle}>New</span>;
}

function EmptyBox({ text }: { text: string }) {
  return <div style={emptyBoxStyle}>{text}</div>;
}

function Spacer() {
  return <div style={{ height: "30px" }} />;
}

const loadingStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#111",
  color: "#f6f2eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: '"Outfit", sans-serif',
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f6f2eb",
  color: "#111",
  padding: "42px",
  fontFamily: '"Outfit", sans-serif',
};

const backLinkStyle: CSSProperties = {
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

const headerStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "28px",
  alignItems: "end",
  marginBottom: "38px",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 10px",
  color: "#77736c",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: '"Bebas Neue", Impact, sans-serif',
  fontSize: "78px",
  lineHeight: 0.85,
  fontWeight: 400,
  textTransform: "uppercase",
};

const outlineButtonStyle: CSSProperties = {
  height: "48px",
  padding: "0 20px",
  border: "1px solid #d4ccc1",
  background: "transparent",
  color: "#111",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const sectionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.85fr 1.15fr",
  gap: "28px",
  alignItems: "start",
};

const darkPanelStyle: CSSProperties = {
  background: "#111",
  color: "#f6f2eb",
  padding: "34px",
  minHeight: "420px",
};

const previewPanelStyle: CSSProperties = {
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  padding: "24px",
};

const blockTitleStyle: CSSProperties = {
  margin: "0 0 18px",
  fontFamily: '"Bebas Neue", Impact, sans-serif',
  fontSize: "54px",
  lineHeight: 0.9,
  fontWeight: 400,
  textTransform: "uppercase",
};

const blockTextStyle: CSSProperties = {
  margin: "0 0 26px",
  color: "rgba(246,242,235,0.68)",
  fontSize: "14px",
  lineHeight: 1.7,
};

const uploadBoxStyle: CSSProperties = {
  minHeight: "170px",
  border: "1px dashed rgba(246,242,235,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "12px",
  cursor: "pointer",
  color: "rgba(246,242,235,0.72)",
  textAlign: "center",
};

const uploadTitleStyle: CSSProperties = {
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const ghostButtonStyle: CSSProperties = {
  width: "100%",
  height: "46px",
  marginTop: "16px",
  border: "1px solid rgba(246,242,235,0.24)",
  background: "transparent",
  color: "#f6f2eb",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const lightButtonStyle: CSSProperties = {
  width: "100%",
  height: "52px",
  marginTop: "24px",
  border: "none",
  background: "#f6f2eb",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "48px",
  border: "1px solid #d8d0c4",
  background: "#f6f2eb",
  outline: "none",
  padding: "0 14px",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "14px",
  color: "#111",
  marginBottom: "18px",
};

const darkInputStyle: CSSProperties = {
  width: "100%",
  height: "48px",
  border: "1px solid rgba(246,242,235,0.22)",
  background: "transparent",
  color: "#f6f2eb",
  outline: "none",
  padding: "0 14px",
  fontSize: "13px",
  marginTop: "16px",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const twoColStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "10px",
};

const imageBoxStyle: CSSProperties = {
  position: "relative",
  aspectRatio: "3 / 4",
  background: "#e6dfd3",
  overflow: "hidden",
};

const mediaStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const emptyBoxStyle: CSSProperties = {
  minHeight: "360px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#77736c",
  border: "1px dashed #d4ccc1",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const numberBadgeStyle: CSSProperties = {
  position: "absolute",
  left: "10px",
  top: "10px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#111",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 900,
};

const newBadgeStyle: CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "10px",
  background: "#25D366",
  color: "#111",
  fontSize: "10px",
  fontWeight: 900,
  padding: "6px 8px",
  textTransform: "uppercase",
};

const instagramBadgeStyle: CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "10px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#111",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const removeButtonStyle: CSSProperties = {
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
};