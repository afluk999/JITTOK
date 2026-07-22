import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SocialItem = {
  id?: string;
  image: string;
  link: string;

  title?: string;
  productUrl?: string;
  productName?: string;

  visible?: boolean;
  order?: number;
};

export type HomeSectionVisibility = {
  hero: boolean;
  iconicProducts: boolean;
  spiderDropBanner: boolean;
  newArrivals: boolean;
  jittokLineup: boolean;
  editorial: boolean;
  reels: boolean;
  customerLove: boolean;
  brandStatement: boolean;
  trustStrip: boolean;
};

export type DropBannerContent = {
  enabled: boolean;
  desktopImage: string;
  mobileImage: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
};

export type HomeContent = {
  heroImages: string[];
  editorialImages: string[];
  iconicImages: string[];

  // Separate galleries for the signature-product fallback cards.
  // Each slug can store up to 5 images.
  signatureProductImages: Record<string, string[]>;

  reelsItems: SocialItem[];
  instagramPosts: SocialItem[];

  // Kept for compatibility with older saved homepage data.
  instagramItems?: SocialItem[];

  brandStatement: string;
  whatsappNumber: string;
  instagramUsername: string;
  instagramUrl: string;

  sectionVisibility: HomeSectionVisibility;
  dropBanner: DropBannerContent;

  updatedAt?: unknown;
};

const defaultSectionVisibility: HomeSectionVisibility = {
  hero: true,
  iconicProducts: true,
  spiderDropBanner: true,
  newArrivals: true,
  jittokLineup: true,
  editorial: true,
  reels: true,
  customerLove: true,
  brandStatement: true,
  trustStrip: true,
};

const defaultDropBanner: DropBannerContent = {
  enabled: true,
  desktopImage: "",
  mobileImage: "",
  eyebrow: "JITTOK Limited Drop",
  title: "Spider Drop",
  description: "",
  buttonLabel: "Shop the Drop",
  buttonUrl: "/collections",
};

export const defaultHomeContent: HomeContent = {
  heroImages: [],
  editorialImages: [],
  iconicImages: [],
  signatureProductImages: {},

  reelsItems: [],
  instagramPosts: [],
  instagramItems: [],

  brandStatement:
    "JITTOK creates everyday essentials with clean design, comfort, and confidence.",
  whatsappNumber: "919605300701",
  instagramUsername: "@jittok.in",
  instagramUrl: "https://www.instagram.com/jittok.in/",

  sectionVisibility: defaultSectionVisibility,
  dropBanner: defaultDropBanner,
};

const homeContentRef = doc(db, "siteContent", "home");

function cleanImageArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    )
    .map((item) => item.trim());
}

function cleanSignatureProductImages(
  value: unknown,
): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([slug, images]) => [
        slug,
        cleanImageArray(images).slice(0, 5),
      ])
      .filter(([, images]) => (images as string[]).length > 0),
  );
}

function normaliseSocialItems(value: unknown): SocialItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index): SocialItem | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Partial<SocialItem>;

      const image =
        typeof data.image === "string" ? data.image.trim() : "";

      if (!image) {
        return null;
      }

      return {
        id:
          typeof data.id === "string" && data.id.trim()
            ? data.id.trim()
            : `social-${index + 1}`,
        image,
        link:
          typeof data.link === "string" && data.link.trim()
            ? data.link.trim()
            : defaultHomeContent.instagramUrl,
        title:
          typeof data.title === "string"
            ? data.title.trim()
            : "",
        productUrl:
          typeof data.productUrl === "string"
            ? data.productUrl.trim()
            : "",
        productName:
          typeof data.productName === "string"
            ? data.productName.trim()
            : "",
        visible: data.visible !== false,
        order:
          typeof data.order === "number" &&
          Number.isFinite(data.order)
            ? data.order
            : index,
      };
    })
    .filter((item): item is SocialItem => item !== null)
    .sort(
      (firstItem, secondItem) =>
        (firstItem.order ?? 0) - (secondItem.order ?? 0),
    );
}

function cleanPhoneNumber(value: unknown): string {
  if (typeof value !== "string") {
    return defaultHomeContent.whatsappNumber;
  }

  const cleaned = value.replace(/[^\d]/g, "");

  return cleaned || defaultHomeContent.whatsappNumber;
}

function cleanText(
  value: unknown,
  fallback: string,
): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

function removeUndefinedDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedDeep);
  }

  if (
    value &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [
          key,
          removeUndefinedDeep(item),
        ]),
    );
  }

  return value;
}

function normaliseHomeContent(
  data: Partial<HomeContent>,
): HomeContent {
  const legacyInstagramItems = Array.isArray(data.instagramItems)
    ? data.instagramItems
    : [];

  const reelsSource =
    Array.isArray(data.reelsItems) && data.reelsItems.length > 0
      ? data.reelsItems
      : legacyInstagramItems;

  return {
    ...defaultHomeContent,
    ...data,

    heroImages: cleanImageArray(data.heroImages),
    editorialImages: cleanImageArray(data.editorialImages),
    iconicImages: cleanImageArray(data.iconicImages),

    signatureProductImages: cleanSignatureProductImages(
      data.signatureProductImages,
    ),

    reelsItems: normaliseSocialItems(reelsSource),
    instagramPosts: normaliseSocialItems(
      data.instagramPosts,
    ),
    instagramItems: normaliseSocialItems(
      data.instagramItems,
    ),

    brandStatement: cleanText(
      data.brandStatement,
      defaultHomeContent.brandStatement,
    ),

    whatsappNumber: cleanPhoneNumber(
      data.whatsappNumber,
    ),

    instagramUsername: cleanText(
      data.instagramUsername,
      defaultHomeContent.instagramUsername,
    ),

    instagramUrl: cleanText(
      data.instagramUrl,
      defaultHomeContent.instagramUrl,
    ),

    sectionVisibility: {
      ...defaultSectionVisibility,
      ...(data.sectionVisibility ?? {}),
    },

    dropBanner: {
      ...defaultDropBanner,
      ...(data.dropBanner ?? {}),
    },
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const snapshot = await getDoc(homeContentRef);

  if (!snapshot.exists()) {
    return normaliseHomeContent({});
  }

  return normaliseHomeContent(
    snapshot.data() as Partial<HomeContent>,
  );
}

export async function getPublicHomeContent(): Promise<HomeContent> {
  const content = await getHomeContent();

  return {
    ...content,
    reelsItems: content.reelsItems.filter(
      (item) => item.visible !== false,
    ),
    instagramPosts: content.instagramPosts.filter(
      (item) => item.visible !== false,
    ),
  };
}

export async function updateHomeContent(
  content: Partial<HomeContent>,
) {
  const cleanedContent = removeUndefinedDeep(
    content,
  ) as Partial<HomeContent>;

  await setDoc(
    homeContentRef,
    {
      ...cleanedContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}