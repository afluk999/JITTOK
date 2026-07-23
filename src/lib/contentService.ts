import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signatureProducts } from "@/data/signatureProducts";

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

export type SignatureProductContent = {
  id: string;
  slug: string;
  name: string;
  variant: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  productDetails: string;
  sizes: string[];
  stock: number;
  visible: boolean;
  order: number;
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

  // Up to 5 images for each Signature product.
  signatureProductImages: Record<string, string[]>;

  // Editable Signature product names, prices, descriptions,
  // sizes, stock, visibility and display order.
  signatureProductDetails: Record<
    string,
    SignatureProductContent
  >;

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

export const defaultSignatureProductDetails: Record<
  string,
  SignatureProductContent
> = Object.fromEntries(
  signatureProducts.map((product, index) => [
    product.slug,
    {
      id: product.id,
      slug: product.slug,
      name: product.name,
      variant: product.variant,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      productDetails: product.productDetails,
      sizes: product.sizes,
      stock: product.stock,
      visible: true,
      order: index,
    },
  ]),
);

export const defaultHomeContent: HomeContent = {
  heroImages: [],
  editorialImages: [],
  iconicImages: [],

  signatureProductImages: {},
  signatureProductDetails: defaultSignatureProductDetails,

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

function cleanStringArray(
  value: unknown,
  fallback: string[],
): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    )
    .map((item) => item.trim());

  return cleaned.length > 0 ? cleaned : fallback;
}

function cleanFiniteNumber(
  value: unknown,
  fallback: number,
  minimum = 0,
): number {
  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value ?? "").replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.max(minimum, numericValue);
}

function normaliseSignatureProductDetails(
  value: unknown,
): Record<string, SignatureProductContent> {
  const saved =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return Object.fromEntries(
    signatureProducts.map((fallbackProduct, index) => {
      const savedValue = saved[fallbackProduct.slug];

      const item =
        savedValue &&
        typeof savedValue === "object" &&
        !Array.isArray(savedValue)
          ? (savedValue as Partial<SignatureProductContent>)
          : {};

      const fallback =
        defaultSignatureProductDetails[fallbackProduct.slug];

      return [
        fallbackProduct.slug,
        {
          id:
            typeof item.id === "string" && item.id.trim()
              ? item.id.trim()
              : fallback.id,

          slug: fallback.slug,

          name:
            typeof item.name === "string" && item.name.trim()
              ? item.name.trim()
              : fallback.name,

          variant:
            typeof item.variant === "string"
              ? item.variant.trim()
              : fallback.variant,

          category:
            typeof item.category === "string" &&
            item.category.trim()
              ? item.category.trim()
              : fallback.category,

          price: cleanFiniteNumber(
            item.price,
            fallback.price,
          ),

          originalPrice: cleanFiniteNumber(
            item.originalPrice,
            fallback.originalPrice,
          ),

          description:
            typeof item.description === "string"
              ? item.description.trim()
              : fallback.description,

          productDetails:
            typeof item.productDetails === "string"
              ? item.productDetails.trim()
              : fallback.productDetails,

          sizes: cleanStringArray(
            item.sizes,
            fallback.sizes,
          ),

          stock: cleanFiniteNumber(
            item.stock,
            fallback.stock,
          ),

          visible: item.visible !== false,

          order: cleanFiniteNumber(
            item.order,
            index,
          ),
        },
      ];
    }),
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
    Array.isArray(data.reelsItems) &&
    data.reelsItems.length > 0
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

    signatureProductDetails: normaliseSignatureProductDetails(
      data.signatureProductDetails,
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

    signatureProductDetails: Object.fromEntries(
      Object.entries(content.signatureProductDetails)
        .filter(([, product]) => product.visible !== false)
        .sort(
          ([, firstProduct], [, secondProduct]) =>
            firstProduct.order - secondProduct.order,
        ),
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
