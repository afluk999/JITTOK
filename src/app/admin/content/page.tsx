"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  defaultCategoriesList,
  defaultCollectionsList,
  defaultSignatureProductDetails,
  defaultStoryCircles,
  getHomeContent,
  updateHomeContent,
  type CategoryDefinition,
  type CollectionDefinition,
  type HomeSectionVisibility,
  type SignatureProductContent,
  type SocialItem,
  type StoryCircleItem,
} from "@/lib/contentService";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { signatureProducts } from "@/data/signatureProducts";

const DEFAULT_SECTION_VISIBILITY: HomeSectionVisibility = {
  hero: true,
  jittokLineup: true,
  editorial: true,
  reels: true,
  customerLove: true,
  brandStatement: true,
  trustStrip: true,
  newArrivals: false
};

const SECTION_LABELS: Array<{
  key: keyof HomeSectionVisibility;
  label: string;
}> = [
  { key: "hero", label: "Hero Moving Wall" },
  { key: "jittokLineup", label: "JITTOK Lineup" },
  { key: "editorial", label: "Editorial" },
  { key: "reels", label: "Instagram Reels" },
  { key: "customerLove", label: "Customer Love" },
  { key: "brandStatement", label: "Brand Statement" },
  { key: "trustStrip", label: "Trust Strip" },
];

function createSocialId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `social-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const updated = [...items];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);

  return updated;
}

function withUpdatedOrder(items: SocialItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

function isVideoSource(source: string) {
  const value = source.toLowerCase();

  return (
    value.includes(".mp4") ||
    value.includes(".webm") ||
    value.includes(".mov") ||
    value.includes("/video/upload")
  );
}

/*
 * Revokes any blob preview URLs so re-selecting files repeatedly
 * doesn't leak memory. Safe to call with an empty array.
 */
function revokePreviews(previews: string[]) {
  previews.filter(Boolean).forEach((preview) => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  });
}

export default function AdminContentPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [brandStatement, setBrandStatement] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const [sectionVisibility, setSectionVisibility] =
    useState<HomeSectionVisibility>(
      DEFAULT_SECTION_VISIBILITY,
    );

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [heroPreviews, setHeroPreviews] = useState<string[]>([]);

  const [editorialImages, setEditorialImages] = useState<string[]>([]);
  const [editorialFiles, setEditorialFiles] = useState<File[]>([]);
  const [editorialPreviews, setEditorialPreviews] = useState<string[]>([]);

  const [iconicImages, setIconicImages] = useState<string[]>([]);
  const [iconicFiles, setIconicFiles] = useState<File[]>([]);
  const [iconicPreviews, setIconicPreviews] = useState<string[]>([]);

  const [signatureImages, setSignatureImages] = useState<
    Record<string, string[]>
  >({});
  const [signatureFiles, setSignatureFiles] = useState<
    Record<string, File[]>
  >({});
  const [signaturePreviews, setSignaturePreviews] = useState<
    Record<string, string[]>
  >({});

  const [signatureDetails, setSignatureDetails] = useState<
    Record<string, SignatureProductContent>
  >(defaultSignatureProductDetails);

  const [reelsItems, setReelsItems] = useState<SocialItem[]>([]);
  const [reelFile, setReelFile] = useState<File | null>(null);
  const [reelPreview, setReelPreview] = useState("");
  const [reelTitle, setReelTitle] = useState("");
  const [reelLink, setReelLink] = useState("");
  const [reelProductName, setReelProductName] = useState("");
  const [reelProductUrl, setReelProductUrl] = useState("");

  const [instagramPosts, setInstagramPosts] = useState<SocialItem[]>([]);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postLink, setPostLink] = useState("");

  const [storyCircles, setStoryCircles] = useState<StoryCircleItem[]>(
    defaultStoryCircles,
  );
  const [storyCircleFiles, setStoryCircleFiles] = useState<
    Record<string, File[]>
  >({});
  const [storyCirclePreviews, setStoryCirclePreviews] = useState<
    Record<string, string[]>
  >({});
  const [savingStoryCircleId, setSavingStoryCircleId] = useState("");
  const [savingStoryOrder, setSavingStoryOrder] = useState(false);

  const [collectionsList, setCollectionsList] = useState<
    CollectionDefinition[]
  >(defaultCollectionsList);
  const [savingCollectionsList, setSavingCollectionsList] = useState(false);

  const [categoriesList, setCategoriesList] = useState<CategoryDefinition[]>(
    defaultCategoriesList,
  );
  const [savingCategoriesList, setSavingCategoriesList] = useState(false);

  const [savingHero, setSavingHero] = useState(false);
  const [savingEditorial, setSavingEditorial] = useState(false);
  const [savingIconic, setSavingIconic] = useState(false);
  const [savingSignatureSlug, setSavingSignatureSlug] = useState("");
  const [savingReel, setSavingReel] = useState(false);
  const [savingReelList, setSavingReelList] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [savingPostList, setSavingPostList] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin");
        return;
      }

      setCheckingAuth(false);
      await loadContent();
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    return () => {
      revokePreviews([
        ...heroPreviews,
        ...editorialPreviews,
        ...iconicPreviews,
        ...Object.values(signaturePreviews).flat(),
        reelPreview,
        postPreview,
      ]);
    };
  }, [
    editorialPreviews,
    heroPreviews,
    iconicPreviews,
    postPreview,
    reelPreview,
    signaturePreviews,
  ]);

  async function loadContent() {
    try {
      setLoading(true);

      const content = await getHomeContent();

      setBrandStatement(content.brandStatement || "");
      setWhatsappNumber(content.whatsappNumber || "");
      setInstagramUsername(content.instagramUsername || "");
      setInstagramUrl(content.instagramUrl || "");

      setSectionVisibility({
        ...DEFAULT_SECTION_VISIBILITY,
        ...(content.sectionVisibility || {}),
      });

      setHeroImages(content.heroImages || []);
      setEditorialImages(content.editorialImages || []);
      setIconicImages(content.iconicImages || []);
      setSignatureImages(content.signatureProductImages || {});
      setSignatureDetails(
        content.signatureProductDetails ||
          defaultSignatureProductDetails,
      );
      setReelsItems(content.reelsItems || []);
      setInstagramPosts(content.instagramPosts || []);
      setStoryCircles(
        content.storyCircles && content.storyCircles.length > 0
          ? content.storyCircles
          : defaultStoryCircles,
      );
      setCollectionsList(
        content.collectionsList && content.collectionsList.length > 0
          ? content.collectionsList
          : defaultCollectionsList,
      );
      setCategoriesList(
        content.categoriesList && content.categoriesList.length > 0
          ? content.categoriesList
          : defaultCategoriesList,
      );
    } catch (error) {
      console.error("LOAD CONTENT ERROR:", error);
      alert("Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  /*
   * Uploads all files in parallel instead of one at a time.
   * If any single upload fails, the whole batch rejects, matching
   * the previous sequential behaviour (first error stops the save).
   */
  async function uploadFiles(files: File[]) {
    if (files.length === 0) return [];

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/cloudinary-upload", {
          method: "POST",
          body: formData,
        });

        const responseText = await response.text();

        let data: Record<string, any> = {};

        try {
          data = JSON.parse(responseText);
        } catch {
          data = { rawResponse: responseText };
        }

        if (!response.ok) {
          console.error("CONTENT UPLOAD ERROR:", data);

          throw new Error(
            data?.error ||
              data?.message ||
              data?.rawResponse ||
              "Upload failed.",
          );
        }

        if (!data.secure_url) {
          throw new Error("Upload completed without returning a file URL.");
        }

        return data.secure_url as string;
      }),
    );

    return uploadResults;
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

      alert("Site settings saved successfully.");
    } catch (error: any) {
      console.error("SAVE SETTINGS ERROR:", error);
      alert(error?.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveVisibility() {
    try {
      setSavingVisibility(true);

      await updateHomeContent({
        sectionVisibility,
      });

      alert("Homepage visibility saved successfully.");
    } catch (error: any) {
      console.error("SAVE VISIBILITY ERROR:", error);
      alert(error?.message || "Failed to save section visibility.");
    } finally {
      setSavingVisibility(false);
    }
  }

  async function saveHero() {
    try {
      setSavingHero(true);

      const uploaded = await uploadFiles(heroFiles);
      const finalImages = [...heroImages, ...uploaded].slice(0, 12);

      if (finalImages.length < 3) {
        alert("Please keep at least 3 hero images.");
        return;
      }

      await updateHomeContent({ heroImages: finalImages });

      setHeroImages(finalImages);
      revokePreviews(heroPreviews);
      setHeroFiles([]);
      setHeroPreviews([]);

      alert("Hero images saved successfully.");
    } catch (error: any) {
      console.error("SAVE HERO ERROR:", error);
      alert(error?.message || "Failed to save hero images.");
    } finally {
      setSavingHero(false);
    }
  }

  async function saveEditorial() {
    try {
      setSavingEditorial(true);

      const uploaded = await uploadFiles(editorialFiles);
      const finalImages = [
        ...editorialImages,
        ...uploaded,
      ].slice(0, 6);

      if (finalImages.length < 1) {
        alert("Please keep at least 1 editorial image.");
        return;
      }

      await updateHomeContent({
        editorialImages: finalImages,
      });

      setEditorialImages(finalImages);
      revokePreviews(editorialPreviews);
      setEditorialFiles([]);
      setEditorialPreviews([]);

      alert("Editorial images saved successfully.");
    } catch (error: any) {
      console.error("SAVE EDITORIAL ERROR:", error);
      alert(error?.message || "Failed to save editorial images.");
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
        alert("Please keep exactly 3 fallback iconic images.");
        return;
      }

      await updateHomeContent({
        iconicImages: finalImages,
      });

      setIconicImages(finalImages);
      revokePreviews(iconicPreviews);
      setIconicFiles([]);
      setIconicPreviews([]);

      alert("Fallback iconic images saved successfully.");
    } catch (error: any) {
      console.error("SAVE ICONIC IMAGES ERROR:", error);
      alert(error?.message || "Failed to save iconic images.");
    } finally {
      setSavingIconic(false);
    }
  }

  async function saveSignatureProduct(slug: string) {
    try {
      setSavingSignatureSlug(slug);

      const details = signatureDetails[slug];

      if (!details) {
        throw new Error("Signature product details are missing.");
      }

      if (!details.name.trim()) {
        alert("Please enter the Signature product name.");
        return;
      }

      if (details.price <= 0) {
        alert("Please enter a valid selling price.");
        return;
      }

      const currentImages = signatureImages[slug] || [];
      const selectedFiles = signatureFiles[slug] || [];
      const uploaded = await uploadFiles(selectedFiles);
      const finalImages = [
        ...currentImages,
        ...uploaded,
      ].slice(0, 5);

      if (finalImages.length < 1) {
        alert("Please keep at least 1 image for this Signature product.");
        return;
      }

      const cleanedSizes = details.sizes
        .map((size) => size.trim())
        .filter(Boolean);

      const cleanedDetails: SignatureProductContent = {
        ...details,
        slug,
        name: details.name.trim(),
        variant: details.variant.trim(),
        category: details.category.trim() || "Signature",
        price: Math.max(0, Number(details.price) || 0),
        originalPrice: Math.max(
          0,
          Number(details.originalPrice) || 0,
        ),
        stock: Math.max(0, Number(details.stock) || 0),
        order: Math.max(0, Number(details.order) || 0),
        sizes:
          cleanedSizes.length > 0
            ? cleanedSizes
            : ["S", "M", "L", "XL"],
        description: details.description.trim(),
        productDetails: details.productDetails.trim(),
        visible: details.visible !== false,
      };

      const updatedSignatureImages = {
        ...signatureImages,
        [slug]: finalImages,
      };

      const updatedSignatureDetails = {
        ...signatureDetails,
        [slug]: cleanedDetails,
      };

      await updateHomeContent({
        signatureProductImages: updatedSignatureImages,
        signatureProductDetails: updatedSignatureDetails,
      });

      setSignatureImages(updatedSignatureImages);
      setSignatureDetails(updatedSignatureDetails);

      revokePreviews(signaturePreviews[slug] || []);

      setSignatureFiles((previous) => ({
        ...previous,
        [slug]: [],
      }));

      setSignaturePreviews((previous) => ({
        ...previous,
        [slug]: [],
      }));

      alert(`${cleanedDetails.name} saved successfully.`);
    } catch (error: any) {
      console.error("SAVE SIGNATURE PRODUCT ERROR:", error);
      alert(error?.message || "Failed to save Signature product.");
    } finally {
      setSavingSignatureSlug("");
    }
  }

  async function addReelItem() {
    try {
      if (!reelFile) {
        alert("Please upload a Reel video or image.");
        return;
      }

      if (!reelLink.trim()) {
        alert("Please paste the Instagram Reel link.");
        return;
      }

      if (reelsItems.length >= 8) {
        alert("Maximum 8 Reels are allowed.");
        return;
      }

      setSavingReel(true);

      const uploaded = await uploadFiles([reelFile]);

      const finalItems = withUpdatedOrder([
        ...reelsItems,
        {
          id: createSocialId(),
          image: uploaded[0],
          link: reelLink.trim(),
          title: reelTitle.trim() || "JITTOK Styling",
          productName: reelProductName.trim(),
          productUrl: reelProductUrl.trim(),
          visible: true,
        },
      ]);

      await updateHomeContent({
        reelsItems: finalItems,
      });

      setReelsItems(finalItems);
      clearReelDraft();

      alert("Reel added successfully.");
    } catch (error: any) {
      console.error("ADD REEL ERROR:", error);
      alert(error?.message || "Failed to add Reel.");
    } finally {
      setSavingReel(false);
    }
  }

  async function saveReelItems() {
    try {
      setSavingReelList(true);

      const finalItems = withUpdatedOrder(reelsItems);

      await updateHomeContent({
        reelsItems: finalItems,
      });

      setReelsItems(finalItems);
      alert("Reel changes saved successfully.");
    } catch (error: any) {
      console.error("SAVE REELS ERROR:", error);
      alert(error?.message || "Failed to save Reels.");
    } finally {
      setSavingReelList(false);
    }
  }

  async function addPostItem() {
    try {
      if (!postFile) {
        alert("Please upload an Instagram post image.");
        return;
      }

      if (!postLink.trim()) {
        alert("Please paste the Instagram post link.");
        return;
      }

      if (instagramPosts.length >= 6) {
        alert("Maximum 6 Instagram posts are allowed.");
        return;
      }

      setSavingPost(true);

      const uploaded = await uploadFiles([postFile]);

      const finalItems = withUpdatedOrder([
        ...instagramPosts,
        {
          id: createSocialId(),
          image: uploaded[0],
          link: postLink.trim(),
          title: postTitle.trim(),
          visible: true,
        },
      ]);

      await updateHomeContent({
        instagramPosts: finalItems,
      });

      setInstagramPosts(finalItems);
      clearPostDraft();

      alert("Instagram post added successfully.");
    } catch (error: any) {
      console.error("ADD POST ERROR:", error);
      alert(error?.message || "Failed to add Instagram post.");
    } finally {
      setSavingPost(false);
    }
  }

  async function savePostItems() {
    try {
      setSavingPostList(true);

      const finalItems = withUpdatedOrder(instagramPosts);

      await updateHomeContent({
        instagramPosts: finalItems,
      });

      setInstagramPosts(finalItems);
      alert("Instagram post changes saved successfully.");
    } catch (error: any) {
      console.error("SAVE POSTS ERROR:", error);
      alert(error?.message || "Failed to save Instagram posts.");
    } finally {
      setSavingPostList(false);
    }
  }

  function createCircleId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return `circle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function addStoryCircle() {
    const newCircle: StoryCircleItem = {
      id: createCircleId(),
      name: "New Circle",
      slug: "",
      images: [],
      comingSoon: true,
      order: storyCircles.length,
    };

    setStoryCircles((previous) => [...previous, newCircle]);
  }

  function updateStoryCircleField(
    id: string,
    patch: Partial<StoryCircleItem>,
  ) {
    setStoryCircles((previous) =>
      previous.map((circle) =>
        circle.id === id ? { ...circle, ...patch } : circle,
      ),
    );
  }

  function removeStoryCircle(id: string) {
    const confirmed = window.confirm(
      "Remove this circle from the homepage? This cannot be undone once saved.",
    );

    if (!confirmed) return;

    revokePreviews(storyCirclePreviews[id] || []);

    setStoryCircles((previous) =>
      previous
        .filter((circle) => circle.id !== id)
        .map((circle, index) => ({ ...circle, order: index })),
    );

    setStoryCirclePreviews((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });

    setStoryCircleFiles((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }

  function moveStoryCircle(fromIndex: number, toIndex: number) {
    setStoryCircles((previous) =>
      moveItem(previous, fromIndex, toIndex).map((circle, index) => ({
        ...circle,
        order: index,
      })),
    );
  }

  function handleStoryCircleFileChange(
    id: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    revokePreviews(storyCirclePreviews[id] || []);

    const circle = storyCircles.find((item) => item.id === id);
    const existingCount = circle?.images.length || 0;

    const files = Array.from(event.target.files || []);
    const selectedFiles = files.slice(0, Math.max(0, 4 - existingCount));

    setStoryCircleFiles((previous) => ({
      ...previous,
      [id]: selectedFiles,
    }));

    setStoryCirclePreviews((previous) => ({
      ...previous,
      [id]: selectedFiles.map((file) => URL.createObjectURL(file)),
    }));

    event.target.value = "";
  }

  async function saveStoryCircle(id: string) {
    try {
      setSavingStoryCircleId(id);

      const circle = storyCircles.find((item) => item.id === id);

      if (!circle) {
        throw new Error("Circle not found.");
      }

      if (!circle.name.trim()) {
        alert("Please enter a name for this circle.");
        return;
      }

      const selectedFiles = storyCircleFiles[id] || [];
      const uploaded = await uploadFiles(selectedFiles);
      const finalImages = [...circle.images, ...uploaded].slice(0, 4);

      const finalSlug =
        circle.slug.trim() ||
        circle.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const updatedCircles = storyCircles.map((item) =>
        item.id === id
          ? { ...item, images: finalImages, slug: finalSlug }
          : item,
      );

      await updateHomeContent({ storyCircles: updatedCircles });

      setStoryCircles(updatedCircles);
      revokePreviews(storyCirclePreviews[id] || []);

      setStoryCircleFiles((previous) => ({ ...previous, [id]: [] }));
      setStoryCirclePreviews((previous) => ({ ...previous, [id]: [] }));

      alert(`${circle.name} saved successfully.`);
    } catch (error: any) {
      console.error("SAVE STORY CIRCLE ERROR:", error);
      alert(error?.message || "Failed to save this circle.");
    } finally {
      setSavingStoryCircleId("");
    }
  }

  async function saveStoryCircleOrder() {
    try {
      setSavingStoryOrder(true);

      await updateHomeContent({ storyCircles });

      alert("Story circle order saved successfully.");
    } catch (error: any) {
      console.error("SAVE STORY ORDER ERROR:", error);
      alert(error?.message || "Failed to save circle order.");
    } finally {
      setSavingStoryOrder(false);
    }
  }

  function removeStoryCircleImage(circleId: string, imageIndex: number) {
    setStoryCircles((previous) =>
      previous.map((circle) =>
        circle.id === circleId
          ? {
              ...circle,
              images: circle.images.filter((_, index) => index !== imageIndex),
            }
          : circle,
      ),
    );
  }

  function addCollectionDefinition() {
    const newCollection: CollectionDefinition = {
      id: createCircleId(),
      name: "New Collection",
      slug: "",
      status: "coming-soon",
      order: collectionsList.length,
    };

    setCollectionsList((previous) => [...previous, newCollection]);
  }

  function updateCollectionDefinition(
    id: string,
    patch: Partial<CollectionDefinition>,
  ) {
    setCollectionsList((previous) =>
      previous.map((collection) =>
        collection.id === id ? { ...collection, ...patch } : collection,
      ),
    );
  }

  function removeCollectionDefinition(id: string) {
    const confirmed = window.confirm(
      "Remove this collection? Products already tagged with it will keep the tag, but it will no longer appear as a dropdown option or have a working page.",
    );

    if (!confirmed) return;

    setCollectionsList((previous) =>
      previous
        .filter((collection) => collection.id !== id)
        .map((collection, index) => ({ ...collection, order: index })),
    );
  }

  function moveCollectionDefinition(fromIndex: number, toIndex: number) {
    setCollectionsList((previous) =>
      moveItem(previous, fromIndex, toIndex).map((collection, index) => ({
        ...collection,
        order: index,
      })),
    );
  }

  async function saveCollectionsList() {
    try {
      setSavingCollectionsList(true);

      const cleanedList = collectionsList.map((collection) => ({
        ...collection,
        slug:
          collection.slug.trim() ||
          collection.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      }));

      await updateHomeContent({ collectionsList: cleanedList });

      setCollectionsList(cleanedList);
      alert("Collections list saved successfully.");
    } catch (error: any) {
      console.error("SAVE COLLECTIONS LIST ERROR:", error);
      alert(error?.message || "Failed to save collections list.");
    } finally {
      setSavingCollectionsList(false);
    }
  }

  function addCategoryDefinition() {
    const newCategory: CategoryDefinition = {
      id: createCircleId(),
      name: "New Category",
      order: categoriesList.length,
    };

    setCategoriesList((previous) => [...previous, newCategory]);
  }

  function updateCategoryDefinition(id: string, name: string) {
    setCategoriesList((previous) =>
      previous.map((category) =>
        category.id === id ? { ...category, name } : category,
      ),
    );
  }

  function removeCategoryDefinition(id: string) {
    const confirmed = window.confirm(
      "Remove this category? Products already tagged with it will keep the tag as plain text.",
    );

    if (!confirmed) return;

    setCategoriesList((previous) =>
      previous
        .filter((category) => category.id !== id)
        .map((category, index) => ({ ...category, order: index })),
    );
  }

  function moveCategoryDefinition(fromIndex: number, toIndex: number) {
    setCategoriesList((previous) =>
      moveItem(previous, fromIndex, toIndex).map((category, index) => ({
        ...category,
        order: index,
      })),
    );
  }

  async function saveCategoriesList() {
    try {
      setSavingCategoriesList(true);

      await updateHomeContent({ categoriesList });

      alert("Categories list saved successfully.");
    } catch (error: any) {
      console.error("SAVE CATEGORIES LIST ERROR:", error);
      alert(error?.message || "Failed to save categories list.");
    } finally {
      setSavingCategoriesList(false);
    }
  }

  function clearReelDraft() {
    if (reelPreview) {
      revokePreviews([reelPreview]);
    }

    setReelFile(null);
    setReelPreview("");
    setReelTitle("");
    setReelLink("");
    setReelProductName("");
    setReelProductUrl("");
  }

  function clearPostDraft() {
    if (postPreview) {
      revokePreviews([postPreview]);
    }

    setPostFile(null);
    setPostPreview("");
    setPostTitle("");
    setPostLink("");
  }

  function handleMultipleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    existingCount: number,
    maxCount: number,
    previousPreviews: string[],
    setFiles: (files: File[]) => void,
    setPreviews: (previews: string[]) => void,
  ) {
    // Revoke any previews from a prior selection before replacing them,
    // so repeatedly picking files doesn't leak blob URLs.
    revokePreviews(previousPreviews);

    const files = Array.from(event.target.files || []);
    const selectedFiles = files.slice(
      0,
      Math.max(0, maxCount - existingCount),
    );

    setFiles(selectedFiles);
    setPreviews(
      selectedFiles.map((file) => URL.createObjectURL(file)),
    );

    event.target.value = "";
  }

  function handleSignatureChange(
    slug: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    // Revoke this slug's previous previews before replacing them.
    revokePreviews(signaturePreviews[slug] || []);

    const files = Array.from(event.target.files || []);
    const existingCount = signatureImages[slug]?.length || 0;
    const selectedFiles = files.slice(
      0,
      Math.max(0, 5 - existingCount),
    );

    setSignatureFiles((previous) => ({
      ...previous,
      [slug]: selectedFiles,
    }));

    setSignaturePreviews((previous) => ({
      ...previous,
      [slug]: selectedFiles.map((file) =>
        URL.createObjectURL(file),
      ),
    }));

    event.target.value = "";
  }

  function handleSingleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    previousPreview: string,
    setFile: (file: File | null) => void,
    setPreview: (preview: string) => void,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Revoke the previously selected preview, if any, before replacing it.
    if (previousPreview) {
      revokePreviews([previousPreview]);
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
    event.target.value = "";
  }

  const visibleReelCount = useMemo(
    () =>
      reelsItems.filter((item) => item.visible !== false).length,
    [reelsItems],
  );

  const visiblePostCount = useMemo(
    () =>
      instagramPosts.filter((item) => item.visible !== false)
        .length,
    [instagramPosts],
  );

  if (checkingAuth || loading) {
    return (
      <main style={loadingStyle}>
        Loading content manager...
      </main>
    );
  }

  return (
    <main style={pageStyle} className="adminContentPage">
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <Link href="/admin/products" style={backLinkStyle}>
          <ArrowLeft size={15} />
          Back to Products
        </Link>

        <header style={headerStyle} className="adminContentHeader">
          <div>
            <p style={eyebrowStyle}>Homepage Content</p>
            <h1 style={titleStyle}>Content Manager</h1>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/admin/dashboard" style={outlineButtonStyle}>
              Dashboard
            </Link>

            <Link href="/" target="_blank" style={outlineButtonStyle}>
              View Site
            </Link>
          </div>
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

        <VisibilityBlock
          value={sectionVisibility}
          onChange={(key, visible) =>
            setSectionVisibility((previous) => ({
              ...previous,
              [key]: visible,
            }))
          }
          onSave={saveVisibility}
          saving={savingVisibility}
        />

        <Spacer />

        <section style={signatureHeadingStyle}>
          <p style={signatureEyebrowStyle}>Homepage Story Row</p>

          <h2 style={signatureTitleStyle}>Story Circles Manager</h2>

          <p style={signatureTextStyle}>
            Add, remove, and reorder the story circles shown on the
            homepage. Each circle can have up to 4 images that cycle
            automatically. Mark a circle "Coming Soon" to show a
            blurred preview and loading spinner instead of a working
            link.
          </p>

          <button
            type="button"
            onClick={addStoryCircle}
            style={{ ...ghostButtonStyle, marginTop: "20px" }}
          >
            <Plus size={16} />
            Add New Circle
          </button>

          <button
            type="button"
            onClick={saveStoryCircleOrder}
            disabled={savingStoryOrder}
            style={{
              ...ghostButtonStyle,
              marginTop: "12px",
              background: "rgba(37,211,102,0.12)",
            }}
          >
            <Save size={16} />
            {savingStoryOrder ? "Saving Order..." : "Save Circle Order"}
          </button>
        </section>

        {storyCircles.map((circle, index) => (
          <div key={circle.id}>
            <StoryCircleManager
              circle={circle}
              index={index}
              total={storyCircles.length}
              previewImages={storyCirclePreviews[circle.id] || []}
              onChange={(patch) =>
                updateStoryCircleField(circle.id, patch)
              }
              onFileChange={(event) =>
                handleStoryCircleFileChange(circle.id, event)
              }
              onRemoveExistingImage={(imageIndex) =>
                removeStoryCircleImage(circle.id, imageIndex)
              }
              onMoveUp={() => moveStoryCircle(index, index - 1)}
              onMoveDown={() => moveStoryCircle(index, index + 1)}
              onRemoveCircle={() => removeStoryCircle(circle.id)}
              onSave={() => saveStoryCircle(circle.id)}
              saving={savingStoryCircleId === circle.id}
            />

            {index < storyCircles.length - 1 ? <Spacer /> : null}
          </div>
        ))}

        <Spacer />

        <section style={signatureHeadingStyle}>
          <p style={signatureEyebrowStyle}>Product Form Dropdown</p>

          <h2 style={signatureTitleStyle}>Manage Collections</h2>

          <p style={signatureTextStyle}>
            This list controls the "Collection" dropdown on the Add/Edit
            Product pages, and the actual /collections/[slug] page for
            each one. Mark a collection "Live" for a real product grid,
            or "Coming Soon" for a placeholder page. Add a new one here
            and it appears everywhere automatically — no code changes.
          </p>

          <button
            type="button"
            onClick={addCollectionDefinition}
            style={{ ...ghostButtonStyle, marginTop: "20px" }}
          >
            <Plus size={16} />
            Add New Collection
          </button>

          <button
            type="button"
            onClick={saveCollectionsList}
            disabled={savingCollectionsList}
            style={{
              ...ghostButtonStyle,
              marginTop: "12px",
              background: "rgba(37,211,102,0.12)",
            }}
          >
            <Save size={16} />
            {savingCollectionsList ? "Saving..." : "Save Collections List"}
          </button>
        </section>

        <section style={previewPanelStyle}>
          <div style={{ display: "grid", gap: "10px" }}>
            {collectionsList.map((collection, index) => (
              <div
                key={collection.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto auto auto auto",
                  gap: "10px",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid #e5ded4",
                  padding: "12px",
                }}
              >
                <input
                  value={collection.name}
                  onChange={(event) =>
                    updateCollectionDefinition(collection.id, {
                      name: event.target.value,
                    })
                  }
                  placeholder="Collection name"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />

                <input
                  value={collection.slug}
                  onChange={(event) =>
                    updateCollectionDefinition(collection.id, {
                      slug: event.target.value,
                    })
                  }
                  placeholder="url-slug (auto if blank)"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />

                <button
                  type="button"
                  onClick={() =>
                    updateCollectionDefinition(collection.id, {
                      status:
                        collection.status === "live"
                          ? "coming-soon"
                          : "live",
                    })
                  }
                  style={{
                    ...smallControlButton,
                    background:
                      collection.status === "live"
                        ? "#dfe9dd"
                        : "#eee5cc",
                  }}
                >
                  {collection.status === "live" ? "Live" : "Coming Soon"}
                </button>

                <button
                  type="button"
                  onClick={() => moveCollectionDefinition(index, index - 1)}
                  disabled={index === 0}
                  style={smallControlButton}
                >
                  <ArrowUp size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => moveCollectionDefinition(index, index + 1)}
                  disabled={index === collectionsList.length - 1}
                  style={smallControlButton}
                >
                  <ArrowDown size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => removeCollectionDefinition(collection.id)}
                  style={smallControlButton}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <Spacer />

        <section style={signatureHeadingStyle}>
          <p style={signatureEyebrowStyle}>Product Form Dropdown</p>

          <h2 style={signatureTitleStyle}>Manage Categories</h2>

          <p style={signatureTextStyle}>
            This list controls the "Category" dropdown on the Add/Edit
            Product pages (T-Shirts, Hoodies, etc). Add a new one here
            and it appears in the dropdown automatically.
          </p>

          <button
            type="button"
            onClick={addCategoryDefinition}
            style={{ ...ghostButtonStyle, marginTop: "20px" }}
          >
            <Plus size={16} />
            Add New Category
          </button>

          <button
            type="button"
            onClick={saveCategoriesList}
            disabled={savingCategoriesList}
            style={{
              ...ghostButtonStyle,
              marginTop: "12px",
              background: "rgba(37,211,102,0.12)",
            }}
          >
            <Save size={16} />
            {savingCategoriesList ? "Saving..." : "Save Categories List"}
          </button>
        </section>

        <section style={previewPanelStyle}>
          <div style={{ display: "grid", gap: "10px" }}>
            {categoriesList.map((category, index) => (
              <div
                key={category.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: "10px",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid #e5ded4",
                  padding: "12px",
                }}
              >
                <input
                  value={category.name}
                  onChange={(event) =>
                    updateCategoryDefinition(category.id, event.target.value)
                  }
                  placeholder="Category name"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />

                <button
                  type="button"
                  onClick={() => moveCategoryDefinition(index, index - 1)}
                  disabled={index === 0}
                  style={smallControlButton}
                >
                  <ArrowUp size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => moveCategoryDefinition(index, index + 1)}
                  disabled={index === categoriesList.length - 1}
                  style={smallControlButton}
                >
                  <ArrowDown size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => removeCategoryDefinition(category.id)}
                  style={smallControlButton}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <Spacer />

        <ImageContentBlock
          title="Hero Moving Wall"
          description="Upload 3 to 12 images. Their order here controls their order on the homepage."
          existingImages={heroImages}
          previewImages={heroPreviews}
          maxCount={12}
          uploadLabel="Add Hero Images"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          onFileChange={(event) =>
            handleMultipleFileChange(
              event,
              heroImages.length,
              12,
              heroPreviews,
              setHeroFiles,
              setHeroPreviews,
            )
          }
          onRemoveExisting={(index) =>
            setHeroImages((previous) =>
              previous.filter((_, itemIndex) => itemIndex !== index),
            )
          }
          onMoveExisting={(fromIndex, toIndex) =>
            setHeroImages((previous) =>
              moveItem(previous, fromIndex, toIndex),
            )
          }
          onClearSelected={() => {
            revokePreviews(heroPreviews);
            setHeroFiles([]);
            setHeroPreviews([]);
          }}
          onSave={saveHero}
          saving={savingHero}
          saveText="Save Hero"
        />

        <Spacer />

        <ImageContentBlock
          title="Fallback Iconic Images"
          description="These 3 images are used only when no Firebase products are marked as Iconic."
          existingImages={iconicImages}
          previewImages={iconicPreviews}
          maxCount={3}
          uploadLabel="Add Iconic Images"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          onFileChange={(event) =>
            handleMultipleFileChange(
              event,
              iconicImages.length,
              3,
              iconicPreviews,
              setIconicFiles,
              setIconicPreviews,
            )
          }
          onRemoveExisting={(index) =>
            setIconicImages((previous) =>
              previous.filter((_, itemIndex) => itemIndex !== index),
            )
          }
          onMoveExisting={(fromIndex, toIndex) =>
            setIconicImages((previous) =>
              moveItem(previous, fromIndex, toIndex),
            )
          }
          onClearSelected={() => {
            revokePreviews(iconicPreviews);
            setIconicFiles([]);
            setIconicPreviews([]);
          }}
          onSave={saveIconicImages}
          saving={savingIconic}
          saveText="Save Iconic Images"
        />

        <Spacer />

        <section style={signatureHeadingStyle}>
          <p style={signatureEyebrowStyle}>
            Signature collection
          </p>

          <h2 style={signatureTitleStyle}>
            Signature Product Manager
          </h2>

          <p style={signatureTextStyle}>
            Edit each Signature product’s name, price, description,
            sizes, stock, display order and 1–5 image gallery. These
            products remain separate from Iconic products.
          </p>
        </section>

        {signatureProducts.map((fallbackProduct, index) => {
          const details =
            signatureDetails[fallbackProduct.slug] ||
            defaultSignatureProductDetails[fallbackProduct.slug];

          return (
            <div key={fallbackProduct.slug}>
              <SignatureProductManager
                value={details}
                existingImages={
                  signatureImages[fallbackProduct.slug] || []
                }
                previewImages={
                  signaturePreviews[fallbackProduct.slug] || []
                }
                onChange={(patch) =>
                  setSignatureDetails((previous) => ({
                    ...previous,
                    [fallbackProduct.slug]: {
                      ...(previous[fallbackProduct.slug] ||
                        defaultSignatureProductDetails[
                          fallbackProduct.slug
                        ]),
                      ...patch,
                    },
                  }))
                }
                onFileChange={(event) =>
                  handleSignatureChange(
                    fallbackProduct.slug,
                    event,
                  )
                }
                onRemoveExisting={(imageIndex) =>
                  setSignatureImages((previous) => ({
                    ...previous,
                    [fallbackProduct.slug]: (
                      previous[fallbackProduct.slug] || []
                    ).filter(
                      (_, itemIndex) =>
                        itemIndex !== imageIndex,
                    ),
                  }))
                }
                onMoveExisting={(fromIndex, toIndex) =>
                  setSignatureImages((previous) => ({
                    ...previous,
                    [fallbackProduct.slug]: moveItem(
                      previous[fallbackProduct.slug] || [],
                      fromIndex,
                      toIndex,
                    ),
                  }))
                }
                onClearSelected={() => {
                  revokePreviews(
                    signaturePreviews[fallbackProduct.slug] || [],
                  );

                  setSignatureFiles((previous) => ({
                    ...previous,
                    [fallbackProduct.slug]: [],
                  }));

                  setSignaturePreviews((previous) => ({
                    ...previous,
                    [fallbackProduct.slug]: [],
                  }));
                }}
                onSave={() =>
                  saveSignatureProduct(fallbackProduct.slug)
                }
                saving={
                  savingSignatureSlug ===
                  fallbackProduct.slug
                }
              />

              {index < signatureProducts.length - 1 ? (
                <Spacer />
              ) : null}
            </div>
          );
        })}

        <Spacer />

        <ImageContentBlock
          title="Editorial Images"
          description="Upload 1 to 6 images for the editorial campaign section."
          existingImages={editorialImages}
          previewImages={editorialPreviews}
          maxCount={6}
          uploadLabel="Add Editorial Images"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          onFileChange={(event) =>
            handleMultipleFileChange(
              event,
              editorialImages.length,
              6,
              editorialPreviews,
              setEditorialFiles,
              setEditorialPreviews,
            )
          }
          onRemoveExisting={(index) =>
            setEditorialImages((previous) =>
              previous.filter((_, itemIndex) => itemIndex !== index),
            )
          }
          onMoveExisting={(fromIndex, toIndex) =>
            setEditorialImages((previous) =>
              moveItem(previous, fromIndex, toIndex),
            )
          }
          onClearSelected={() => {
            revokePreviews(editorialPreviews);
            setEditorialFiles([]);
            setEditorialPreviews([]);
          }}
          onSave={saveEditorial}
          saving={savingEditorial}
          saveText="Save Editorial"
        />

        <Spacer />

        <SocialManager
          title="Instagram Reels"
          description="Upload a Reel video or image. Add its Instagram link, title and optional linked product."
          uploadLabel="Upload Reel Video or Image"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/quicktime"
          items={reelsItems}
          visibleCount={visibleReelCount}
          maxCount={8}
          aspectRatio="9 / 16"
          preview={reelPreview}
          previewFile={reelFile}
          draftFields={[
            {
              label: "Reel Title",
              value: reelTitle,
              placeholder: "JITTOK Styling",
              onChange: setReelTitle,
            },
            {
              label: "Instagram Reel Link",
              value: reelLink,
              placeholder:
                "https://www.instagram.com/reel/...",
              onChange: setReelLink,
            },
            {
              label: "Linked Product Name",
              value: reelProductName,
              placeholder: "Optional",
              onChange: setReelProductName,
            },
            {
              label: "Linked Product URL",
              value: reelProductUrl,
              placeholder:
                "/product/product-slug",
              onChange: setReelProductUrl,
            },
          ]}
          onFileChange={(event) =>
            handleSingleFileChange(
              event,
              reelPreview,
              setReelFile,
              setReelPreview,
            )
          }
          onAdd={addReelItem}
          onClearDraft={clearReelDraft}
          onChangeItem={(index, patch) =>
            setReelsItems((previous) =>
              previous.map((item, itemIndex) =>
                itemIndex === index
                  ? { ...item, ...patch }
                  : item,
              ),
            )
          }
          onMoveItem={(fromIndex, toIndex) =>
            setReelsItems((previous) =>
              withUpdatedOrder(
                moveItem(previous, fromIndex, toIndex),
              ),
            )
          }
          onRemoveItem={(index) =>
            setReelsItems((previous) =>
              withUpdatedOrder(
                previous.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              ),
            )
          }
          onSaveAll={saveReelItems}
          savingAdd={savingReel}
          savingAll={savingReelList}
        />

        <Spacer />

        <SocialManager
          title="Instagram Posts"
          description="Upload Instagram post images and control their order and visibility."
          uploadLabel="Upload Post Image"
          inputAccept="image/png,image/jpeg,image/jpg,image/webp"
          items={instagramPosts}
          visibleCount={visiblePostCount}
          maxCount={6}
          aspectRatio="1 / 1"
          preview={postPreview}
          previewFile={postFile}
          draftFields={[
            {
              label: "Post Title",
              value: postTitle,
              placeholder: "Optional",
              onChange: setPostTitle,
            },
            {
              label: "Instagram Post Link",
              value: postLink,
              placeholder:
                "https://www.instagram.com/p/...",
              onChange: setPostLink,
            },
          ]}
          onFileChange={(event) =>
            handleSingleFileChange(
              event,
              postPreview,
              setPostFile,
              setPostPreview,
            )
          }
          onAdd={addPostItem}
          onClearDraft={clearPostDraft}
          onChangeItem={(index, patch) =>
            setInstagramPosts((previous) =>
              previous.map((item, itemIndex) =>
                itemIndex === index
                  ? { ...item, ...patch }
                  : item,
              ),
            )
          }
          onMoveItem={(fromIndex, toIndex) =>
            setInstagramPosts((previous) =>
              withUpdatedOrder(
                moveItem(previous, fromIndex, toIndex),
              ),
            )
          }
          onRemoveItem={(index) =>
            setInstagramPosts((previous) =>
              withUpdatedOrder(
                previous.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              ),
            )
          }
          onSaveAll={savePostItems}
          savingAdd={savingPost}
          savingAll={savingPostList}
        />
      </div>

      <style jsx global>{`
        .adminSectionGrid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 28px;
          align-items: start;
        }

        .adminGalleryGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .visibilityGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .socialItemEditor {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 18px;
          padding: 16px;
          background: #ffffff;
          border: 1px solid #e5ded4;
        }

        @media (max-width: 900px) {
          .adminContentPage {
            padding: 26px 16px !important;
          }

          .adminContentHeader {
            grid-template-columns: 1fr !important;
            align-items: start !important;
          }

          .adminSectionGrid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .adminGalleryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .visibilityGrid {
            grid-template-columns: 1fr;
          }

          .socialItemEditor {
            grid-template-columns: 92px 1fr;
            gap: 12px;
            padding: 12px;
          }
        }

        @media (max-width: 520px) {
          .adminGalleryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .socialItemEditor {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
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
    <section className="adminSectionGrid">
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>Site Settings</h2>
        <p style={blockTextStyle}>
          Edit brand text, WhatsApp number and Instagram details.
        </p>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={lightButtonStyle}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        <label style={labelStyle}>Brand Statement</label>
        <textarea
          value={brandStatement}
          onChange={(event) =>
            setBrandStatement(event.target.value)
          }
          style={{
            ...inputStyle,
            minHeight: "120px",
            paddingTop: "14px",
          }}
        />

        <div style={twoColStyle}>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <input
              value={whatsappNumber}
              onChange={(event) =>
                setWhatsappNumber(event.target.value)
              }
              placeholder="919605300701"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Instagram Username</label>
            <input
              value={instagramUsername}
              onChange={(event) =>
                setInstagramUsername(event.target.value)
              }
              placeholder="@jittok.in"
              style={inputStyle}
            />
          </div>
        </div>

        <label style={labelStyle}>Instagram URL</label>
        <input
          value={instagramUrl}
          onChange={(event) =>
            setInstagramUrl(event.target.value)
          }
          placeholder="https://www.instagram.com/jittok.in/"
          style={inputStyle}
        />
      </section>
    </section>
  );
}

function VisibilityBlock({
  value,
  onChange,
  onSave,
  saving,
}: {
  value: HomeSectionVisibility;
  onChange: (
    key: keyof HomeSectionVisibility,
    visible: boolean,
  ) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <section className="adminSectionGrid">
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>Section Visibility</h2>
        <p style={blockTextStyle}>
          Show or hide individual homepage sections without deleting
          their content.
        </p>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={lightButtonStyle}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Visibility"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        <div className="visibilityGrid">
          {SECTION_LABELS.map((section) => {
            const visible = value[section.key];

            return (
              <button
                key={section.key}
                type="button"
                onClick={() =>
                  onChange(section.key, !visible)
                }
                style={{
                  minHeight: "66px",
                  padding: "14px 16px",
                  border: visible
                    ? "1px solid #111"
                    : "1px solid #d8d0c4",
                  background: visible ? "#111" : "#f6f2eb",
                  color: visible ? "#fff" : "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  }}
                >
                  {section.label}
                </span>

                {visible ? (
                  <Eye size={17} />
                ) : (
                  <EyeOff size={17} />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function SignatureProductManager({
  value,
  existingImages,
  previewImages,
  onChange,
  onFileChange,
  onRemoveExisting,
  onMoveExisting,
  onClearSelected,
  onSave,
  saving,
}: {
  value: SignatureProductContent;
  existingImages: string[];
  previewImages: string[];
  onChange: (
    patch: Partial<SignatureProductContent>,
  ) => void;
  onFileChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveExisting: (index: number) => void;
  onMoveExisting: (
    fromIndex: number,
    toIndex: number,
  ) => void;
  onClearSelected: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <section className="adminSectionGrid">
      <aside style={darkPanelStyle}>
        <p style={signatureCardEyebrowStyle}>
          Signature Product
        </p>

        <h2 style={blockTitleStyle}>{value.name}</h2>

        <p style={blockTextStyle}>
          This information appears on the Signature card and its
          complete product page.
        </p>

        <button
          type="button"
          onClick={() =>
            onChange({ visible: !value.visible })
          }
          style={{
            ...ghostButtonStyle,
            marginTop: 0,
            background: value.visible
              ? "rgba(37,211,102,0.12)"
              : "transparent",
          }}
        >
          {value.visible ? (
            <Eye size={16} />
          ) : (
            <EyeOff size={16} />
          )}
          {value.visible ? "Product Visible" : "Product Hidden"}
        </button>

        <label style={uploadBoxStyle}>
          <Upload size={30} strokeWidth={1.5} />

          <span style={uploadTitleStyle}>
            Add Signature Images
          </span>

          <span style={{ fontSize: "13px" }}>
            {existingImages.length}/5 saved
          </span>

          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
        </label>

        {previewImages.length > 0 ? (
          <button
            type="button"
            onClick={onClearSelected}
            style={ghostButtonStyle}
          >
            Clear Selected
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={lightButtonStyle}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Signature Product"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        <div style={twoColStyle}>
          <Field
            label="Product Name"
            value={value.name}
            onChange={(name) => onChange({ name })}
          />

          <Field
            label="Variant / Colour"
            value={value.variant}
            onChange={(variant) => onChange({ variant })}
          />
        </div>

        <div style={twoColStyle}>
          <Field
            label="Category"
            value={value.category}
            onChange={(category) => onChange({ category })}
          />

          <NumberField
            label="Display Order"
            value={value.order}
            min={0}
            onChange={(order) => onChange({ order })}
          />
        </div>

        <div style={threeColStyle}>
          <NumberField
            label="Selling Price"
            value={value.price}
            min={0}
            onChange={(price) => onChange({ price })}
          />

          <NumberField
            label="Original Price"
            value={value.originalPrice}
            min={0}
            onChange={(originalPrice) =>
              onChange({ originalPrice })
            }
          />

          <NumberField
            label="Stock"
            value={value.stock}
            min={0}
            onChange={(stock) => onChange({ stock })}
          />
        </div>

        <label style={labelStyle}>
          Available Sizes — separated by commas
        </label>

        <input
          value={value.sizes.join(", ")}
          onChange={(event) =>
            onChange({
              sizes: event.target.value
                .split(",")
                .map((size) => size.trim()),
            })
          }
          placeholder="S, M, L, XL"
          style={inputStyle}
        />

        <label style={labelStyle}>Short Description</label>

        <textarea
          value={value.description}
          onChange={(event) =>
            onChange({ description: event.target.value })
          }
          style={textareaStyle}
        />

        <label style={labelStyle}>Product Details</label>

        <textarea
          value={value.productDetails}
          onChange={(event) =>
            onChange({
              productDetails: event.target.value,
            })
          }
          style={{
            ...textareaStyle,
            minHeight: "180px",
          }}
        />

        <label style={labelStyle}>Signature Gallery</label>

        <GalleryPreview
          existingImages={existingImages}
          previewImages={previewImages}
          onRemoveExisting={onRemoveExisting}
          onMoveExisting={onMoveExisting}
          embedded
        />
      </section>
    </section>
  );
}

function StoryCircleManager({
  circle,
  index,
  total,
  previewImages,
  onChange,
  onFileChange,
  onRemoveExistingImage,
  onMoveUp,
  onMoveDown,
  onRemoveCircle,
  onSave,
  saving,
}: {
  circle: StoryCircleItem;
  index: number;
  total: number;
  previewImages: string[];
  onChange: (patch: Partial<StoryCircleItem>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingImage: (imageIndex: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemoveCircle: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <section className="adminSectionGrid">
      <aside style={darkPanelStyle}>
        <p style={signatureCardEyebrowStyle}>
          Circle {index + 1} of {total}
        </p>

        <h2 style={blockTitleStyle}>{circle.name || "Untitled"}</h2>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            style={smallControlButton}
          >
            <ArrowUp size={14} />
            Move Up
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={smallControlButton}
          >
            <ArrowDown size={14} />
            Move Down
          </button>

          <button
            type="button"
            onClick={onRemoveCircle}
            style={{
              ...smallControlButton,
              background: "rgba(200,80,70,0.15)",
              color: "#f6f2eb",
            }}
          >
            <X size={14} />
            Remove Circle
          </button>
        </div>

        <button
          type="button"
          onClick={() => onChange({ comingSoon: !circle.comingSoon })}
          style={{
            ...ghostButtonStyle,
            marginTop: 0,
            background: circle.comingSoon
              ? "rgba(255,193,7,0.15)"
              : "rgba(37,211,102,0.12)",
          }}
        >
          {circle.comingSoon ? <EyeOff size={16} /> : <Eye size={16} />}
          {circle.comingSoon ? "Coming Soon (Locked)" : "Live (Clickable)"}
        </button>

        <label style={uploadBoxStyle}>
          <Upload size={30} strokeWidth={1.5} />

          <span style={uploadTitleStyle}>Add Circle Images</span>

          <span style={{ fontSize: "13px" }}>
            {circle.images.length}/4 saved
          </span>

          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={lightButtonStyle}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Circle"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        <div style={twoColStyle}>
          <Field
            label="Circle Name"
            value={circle.name}
            onChange={(name) => onChange({ name })}
          />

          <Field
            label="Collection Slug (optional — auto-generated if blank)"
            value={circle.slug}
            onChange={(slug) => onChange({ slug })}
          />
        </div>

        <label style={labelStyle}>Circle Images</label>

        <GalleryPreview
          existingImages={circle.images}
          previewImages={previewImages}
          onRemoveExisting={onRemoveExistingImage}
          onMoveExisting={() => {}}
          embedded
        />
      </section>
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value) || 0)
        }
        style={inputStyle}
      />
    </div>
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
  onMoveExisting,
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
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveExisting: (index: number) => void;
  onMoveExisting: (
    fromIndex: number,
    toIndex: number,
  ) => void;
  onClearSelected: () => void;
  onSave: () => void;
  saving: boolean;
  saveText: string;
}) {
  return (
    <section className="adminSectionGrid">
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>{title}</h2>
        <p style={blockTextStyle}>{description}</p>

        <label style={uploadBoxStyle}>
          <Upload size={30} strokeWidth={1.5} />
          <span style={uploadTitleStyle}>{uploadLabel}</span>
          <span style={{ fontSize: "13px" }}>
            {existingImages.length}/{maxCount} saved
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
          <button
            type="button"
            onClick={onClearSelected}
            style={ghostButtonStyle}
          >
            Clear Selected
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={lightButtonStyle}
        >
          <Save size={16} />
          {saving ? "Saving..." : saveText}
        </button>
      </aside>

      <GalleryPreview
        existingImages={existingImages}
        previewImages={previewImages}
        onRemoveExisting={onRemoveExisting}
        onMoveExisting={onMoveExisting}
      />
    </section>
  );
}

type DraftField = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function SocialManager({
  title,
  description,
  uploadLabel,
  inputAccept,
  items,
  visibleCount,
  maxCount,
  aspectRatio,
  preview,
  previewFile,
  draftFields,
  onFileChange,
  onAdd,
  onClearDraft,
  onChangeItem,
  onMoveItem,
  onRemoveItem,
  onSaveAll,
  savingAdd,
  savingAll,
}: {
  title: string;
  description: string;
  uploadLabel: string;
  inputAccept: string;
  items: SocialItem[];
  visibleCount: number;
  maxCount: number;
  aspectRatio: string;
  preview: string;
  previewFile: File | null;
  draftFields: DraftField[];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onClearDraft: () => void;
  onChangeItem: (
    index: number,
    patch: Partial<SocialItem>,
  ) => void;
  onMoveItem: (
    fromIndex: number,
    toIndex: number,
  ) => void;
  onRemoveItem: (index: number) => void;
  onSaveAll: () => void;
  savingAdd: boolean;
  savingAll: boolean;
}) {
  return (
    <section className="adminSectionGrid">
      <aside style={darkPanelStyle}>
        <h2 style={blockTitleStyle}>{title}</h2>
        <p style={blockTextStyle}>{description}</p>

        <label style={uploadBoxStyle}>
          <Upload size={30} strokeWidth={1.5} />
          <span style={uploadTitleStyle}>{uploadLabel}</span>
          <span style={{ fontSize: "13px" }}>
            {items.length}/{maxCount} saved · {visibleCount} visible
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
              margin: "16px 0",
              overflow: "hidden",
              background: "#222",
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
              <img
                src={preview}
                alt="Selected preview"
                style={mediaStyle}
              />
            )}
          </div>
        ) : null}

        {draftFields.map((field) => (
          <div key={field.label}>
            <label style={darkLabelStyle}>{field.label}</label>
            <input
              value={field.value}
              onChange={(event) =>
                field.onChange(event.target.value)
              }
              placeholder={field.placeholder}
              style={darkInputStyle}
            />
          </div>
        ))}

        {preview ? (
          <button
            type="button"
            onClick={onClearDraft}
            style={ghostButtonStyle}
          >
            Clear New Item
          </button>
        ) : null}

        <button
          type="button"
          onClick={onAdd}
          disabled={savingAdd}
          style={lightButtonStyle}
        >
          <Plus size={16} />
          {savingAdd ? "Uploading..." : "Add Item"}
        </button>

        <button
          type="button"
          onClick={onSaveAll}
          disabled={savingAll}
          style={ghostButtonStyle}
        >
          <Save size={16} />
          {savingAll ? "Saving..." : "Save All Changes"}
        </button>
      </aside>

      <section style={previewPanelStyle}>
        {items.length === 0 ? (
          <EmptyBox text={`No ${title.toLowerCase()} saved`} />
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {items.map((item, index) => (
              <SocialItemEditor
                key={item.id || `${item.image}-${index}`}
                item={item}
                index={index}
                total={items.length}
                aspectRatio={aspectRatio}
                onChange={(patch) =>
                  onChangeItem(index, patch)
                }
                onMoveUp={() =>
                  onMoveItem(index, index - 1)
                }
                onMoveDown={() =>
                  onMoveItem(index, index + 1)
                }
                onRemove={() =>
                  onRemoveItem(index)
                }
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function SocialItemEditor({
  item,
  index,
  total,
  aspectRatio,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  item: SocialItem;
  index: number;
  total: number;
  aspectRatio: string;
  onChange: (patch: Partial<SocialItem>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const visible = item.visible !== false;

  return (
    <article className="socialItemEditor">
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio,
          overflow: "hidden",
          background: "#e6dfd3",
        }}
      >
        {isVideoSource(item.image) ? (
          <video
            src={item.image}
            muted
            loop
            playsInline
            controls
            style={mediaStyle}
          />
        ) : (
          <img
            src={item.image}
            alt={`Social item ${index + 1}`}
            style={mediaStyle}
          />
        )}

        <span style={numberBadgeStyle}>{index + 1}</span>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() =>
              onChange({ visible: !visible })
            }
            style={{
              ...smallControlButton,
              background: visible ? "#111" : "#f6f2eb",
              color: visible ? "#fff" : "#111",
            }}
          >
            {visible ? (
              <Eye size={14} />
            ) : (
              <EyeOff size={14} />
            )}
            {visible ? "Visible" : "Hidden"}
          </button>

          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            style={smallControlButton}
          >
            <ArrowUp size={14} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={smallControlButton}
          >
            <ArrowDown size={14} />
          </button>

          <button
            type="button"
            onClick={onRemove}
            style={{
              ...smallControlButton,
              marginLeft: "auto",
            }}
          >
            <X size={14} />
            Remove
          </button>
        </div>

        <Field
          label="Title"
          value={item.title || ""}
          onChange={(value) =>
            onChange({ title: value })
          }
        />

        <Field
          label="Instagram Link"
          value={item.link || ""}
          onChange={(value) =>
            onChange({ link: value })
          }
        />

        <div style={twoColStyle}>
          <Field
            label="Product Name"
            value={item.productName || ""}
            onChange={(value) =>
              onChange({ productName: value })
            }
          />

          <Field
            label="Product URL"
            value={item.productUrl || ""}
            onChange={(value) =>
              onChange({ productUrl: value })
            }
          />
        </div>
      </div>
    </article>
  );
}

function GalleryPreview({
  existingImages,
  previewImages,
  onRemoveExisting,
  onMoveExisting,
  embedded = false,
}: {
  existingImages: string[];
  previewImages: string[];
  onRemoveExisting: (index: number) => void;
  onMoveExisting: (
    fromIndex: number,
    toIndex: number,
  ) => void;
  embedded?: boolean;
}) {
  return (
    <section
      style={
        embedded
          ? {
              padding: 0,
              background: "transparent",
              border: "none",
            }
          : previewPanelStyle
      }
    >
      {[...existingImages, ...previewImages].length === 0 ? (
        <EmptyBox text="No media saved" />
      ) : (
        <div className="adminGalleryGrid">
          {existingImages.map((image, index) => (
            <SimpleImageBox
              key={`${image}-${index}`}
              image={image}
              index={index}
              total={existingImages.length}
              onRemove={() =>
                onRemoveExisting(index)
              }
              onMoveUp={() =>
                onMoveExisting(index, index - 1)
              }
              onMoveDown={() =>
                onMoveExisting(index, index + 1)
              }
            />
          ))}

          {previewImages.map((image, index) => (
            <SimpleImageBox
              key={`${image}-${index}`}
              image={image}
              index={existingImages.length + index}
              total={
                existingImages.length + previewImages.length
              }
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
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
  isNew,
}: {
  image: string;
  index: number;
  total: number;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isNew?: boolean;
}) {
  return (
    <div style={imageBoxStyle}>
      <img
        src={image}
        alt={`Content ${index + 1}`}
        style={mediaStyle}
      />

      <span style={numberBadgeStyle}>{index + 1}</span>

      {isNew ? <span style={newBadgeStyle}>New</span> : null}

      {!isNew ? (
        <div style={imageControlsStyle}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            style={imageControlButtonStyle}
            aria-label="Move image up"
          >
            <ArrowUp size={14} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={imageControlButtonStyle}
            aria-label="Move image down"
          >
            <ArrowDown size={14} />
          </button>

          <button
            type="button"
            onClick={onRemove}
            style={imageControlButtonStyle}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
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
  fontSize: "clamp(58px, 8vw, 92px)",
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

const darkPanelStyle: CSSProperties = {
  background: "#111",
  color: "#f6f2eb",
  padding: "34px",
  minHeight: "360px",
};

const previewPanelStyle: CSSProperties = {
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  padding: "24px",
  minWidth: 0,
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
  padding: "20px",
};

const uploadTitleStyle: CSSProperties = {
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const ghostButtonStyle: CSSProperties = {
  width: "100%",
  minHeight: "46px",
  marginTop: "16px",
  border: "1px solid rgba(246,242,235,0.24)",
  background: "transparent",
  color: "#f6f2eb",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const lightButtonStyle: CSSProperties = {
  width: "100%",
  minHeight: "52px",
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
  boxSizing: "border-box",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "14px",
  color: "#111",
  marginBottom: "18px",
};

const darkInputStyle: CSSProperties = {
  width: "100%",
  minHeight: "48px",
  border: "1px solid rgba(246,242,235,0.22)",
  background: "transparent",
  color: "#f6f2eb",
  outline: "none",
  padding: "0 14px",
  boxSizing: "border-box",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "13px",
  marginBottom: "14px",
};

const darkLabelStyle: CSSProperties = {
  display: "block",
  margin: "15px 0 8px",
  color: "rgba(246,242,235,0.72)",
  fontSize: "10px",
  fontWeight: 900,
  letterSpacing: "0.9px",
  textTransform: "uppercase",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "0.9px",
  textTransform: "uppercase",
};

const twoColStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "18px",
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
  minHeight: "300px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#77736c",
  border: "1px dashed #d4ccc1",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  textAlign: "center",
  padding: "24px",
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
  background: "#25d366",
  color: "#111",
  fontSize: "9px",
  fontWeight: 900,
  padding: "6px 8px",
  textTransform: "uppercase",
};

const imageControlsStyle: CSSProperties = {
  position: "absolute",
  right: "8px",
  bottom: "8px",
  display: "flex",
  gap: "5px",
};

const imageControlButtonStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  border: "none",
  borderRadius: "50%",
  background: "#fff",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const smallControlButton: CSSProperties = {
  minHeight: "34px",
  padding: "0 10px",
  border: "1px solid #d8d0c4",
  background: "#f6f2eb",
  color: "#111",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontSize: "9px",
  fontWeight: 900,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const threeColStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "18px",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: "120px",
  paddingTop: "14px",
  paddingBottom: "14px",
  resize: "vertical",
  lineHeight: 1.6,
};

const signatureCardEyebrowStyle: CSSProperties = {
  margin: "0 0 10px",
  color: "rgba(246,242,235,0.52)",
  fontSize: "10px",
  fontWeight: 900,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
};

const signatureHeadingStyle: CSSProperties = {
  background: "#111",
  color: "#f6f2eb",
  padding: "30px",
  marginBottom: "22px",
};

const signatureEyebrowStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "rgba(246,242,235,0.58)",
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "1.4px",
  textTransform: "uppercase",
};

const signatureTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: '"Bebas Neue", Impact, sans-serif',
  fontSize: "54px",
  lineHeight: 0.88,
  fontWeight: 400,
  textTransform: "uppercase",
};

const signatureTextStyle: CSSProperties = {
  maxWidth: "720px",
  margin: "16px 0 0",
  color: "rgba(246,242,235,0.7)",
  fontSize: "13px",
  lineHeight: 1.7,
};