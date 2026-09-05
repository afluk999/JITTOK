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

export type StoryCircleItem = {
  id: string;
  name: string;
  slug: string;

  // Up to 4 images that cycle automatically on the homepage.
  images: string[];

  // "Coming soon" circles show a blurred image + loading spinner
  // and open a popup instead of linking to a collection page.
  comingSoon: boolean;

  order: number;
};

export type CollectionDefinition = {
  id: string;
  name: string;
  slug: string;

  // "live" = real product page with a grid. "coming-soon" = a
  // placeholder page. This single list drives both the admin
  // product form's Collection dropdown AND the actual
  // /collections/[slug] page — add a collection here once,
  // it shows up in both places automatically.
  status: "live" | "coming-soon";

  order: number;
};

export type CategoryDefinition = {
  id: string;
  name: string;
  order: number;
};

export type HomeSectionVisibility = {
  hero: boolean;
  newArrivals: boolean;
  jittokLineup: boolean;
  editorial: boolean;
  reels: boolean;
  customerLove: boolean;
  brandStatement: boolean;
  trustStrip: boolean;
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

  // Homepage story-circle row (Ringer, Raglan Half, etc).
  storyCircles: StoryCircleItem[];

  // Single source of truth for which collections exist, their
  // display name, and whether they're live or coming soon.
  collectionsList: CollectionDefinition[];

  // Product category options (T-Shirts, Hoodies, etc), managed
  // from admin instead of hardcoded in the product form.
  categoriesList: CategoryDefinition[];

  // Kept for compatibility with older saved homepage data.
  instagramItems?: SocialItem[];

  brandStatement: string;
  whatsappNumber: string;
  instagramUsername: string;
  instagramUrl: string;

  sectionVisibility: HomeSectionVisibility;
  updatedAt?: unknown;
};

const defaultSectionVisibility: HomeSectionVisibility = {
  hero: true,
  newArrivals: true,
  jittokLineup: true,
  editorial: true,
  reels: true,
  customerLove: true,
  brandStatement: true,
  trustStrip: true,
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

export const defaultStoryCircles: StoryCircleItem[] = [
  {
    id: "ringer",
    name: "RINGER",
    slug: "ringer",
    images: [
      "/story/ringer-1.jpg",
      "/story/ringer-2.jpg",
      "/story/ringer-3.jpg",
      "/story/ringer-4.jpg",
    ],
    comingSoon: false,
    order: 0,
  },
  {
    id: "raglan-half",
    name: "RAGLAN HALF",
    slug: "raglan-half",
    images: [
      "/story/raglan-half-1.jpg",
      "/story/raglan-half-2.jpg",
      "/story/raglan-half-3.jpg",
      "/story/raglan-half-4.jpg",
    ],
    comingSoon: false,
    order: 1,
  },
  {
    id: "raglan-full",
    name: "RAGLAN FULL",
    slug: "raglan-full",
    images: [
      "/story/raglan-full-1.jpg",
      "/story/raglan-full-2.jpg",
      "/story/raglan-full-3.jpg",
      "/story/raglan-full-4.jpg",
    ],
    comingSoon: false,
    order: 2,
  },
  {
    id: "lovely",
    name: "LOVELY",
    slug: "lovely",
    images: ["/story/lovely-1.jpg"],
    comingSoon: true,
    order: 3,
  },
  {
    id: "terry",
    name: "TERRY",
    slug: "terry",
    images: ["/story/terry-1.jpg"],
    comingSoon: true,
    order: 4,
  },
  {
    id: "pollo",
    name: "POLLO",
    slug: "pollo",
    images: ["/story/pollo-1.jpg"],
    comingSoon: true,
    order: 5,
  },
];

export const defaultCollectionsList: CollectionDefinition[] = [
  { id: "ringer", name: "Ringer", slug: "ringer", status: "live", order: 0 },
  { id: "raglan-half", name: "Raglan Half", slug: "raglan-half", status: "live", order: 1 },
  { id: "raglan-full", name: "Raglan Full", slug: "raglan-full", status: "live", order: 2 },
  { id: "lovely", name: "Lovely", slug: "lovely", status: "live", order: 3 },
  { id: "terry", name: "Terry", slug: "terry", status: "coming-soon", order: 4 },
  { id: "pollo", name: "Pollo", slug: "pollo", status: "coming-soon", order: 5 },
];

export const defaultCategoriesList: CategoryDefinition[] = [
  { id: "t-shirts", name: "T-Shirts", order: 0 },
  { id: "hoodies", name: "Hoodies", order: 1 },
  { id: "pants", name: "Pants", order: 2 },
  { id: "accessories", name: "Accessories", order: 3 },
];

export const defaultHomeContent: HomeContent = {
  heroImages: [],
  editorialImages: [],
  iconicImages: [],

  signatureProductImages: {},
  signatureProductDetails: defaultSignatureProductDetails,

  reelsItems: [],
  instagramPosts: [],
  instagramItems: [],
  storyCircles: defaultStoryCircles,
  collectionsList: defaultCollectionsList,
  categoriesList: defaultCategoriesList,

  brandStatement:
    "JITTOK creates everyday essentials with clean design, comfort, and confidence.",
  whatsappNumber: "919605300701",
  instagramUsername: "@jittok.in",
  instagramUrl: "https://www.instagram.com/jittok.in/",

  sectionVisibility: defaultSectionVisibility,
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

function normaliseStoryCircles(value: unknown): StoryCircleItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultStoryCircles;
  }

  return value
    .map((item, index): StoryCircleItem | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Partial<StoryCircleItem>;

      const name =
        typeof data.name === "string" ? data.name.trim() : "";

      if (!name) {
        return null;
      }

      const slug =
        typeof data.slug === "string" && data.slug.trim()
          ? data.slug.trim()
          : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        id:
          typeof data.id === "string" && data.id.trim()
            ? data.id.trim()
            : slug,

        name,
        slug,

        images: cleanImageArray(data.images).slice(0, 4),

        comingSoon: data.comingSoon === true,

        order:
          typeof data.order === "number" &&
          Number.isFinite(data.order)
            ? data.order
            : index,
      };
    })
    .filter((item): item is StoryCircleItem => item !== null)
    .sort(
      (firstItem, secondItem) => firstItem.order - secondItem.order,
    );
}

function normaliseCollectionsList(
  value: unknown,
): CollectionDefinition[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultCollectionsList;
  }

  return value
    .map((item, index): CollectionDefinition | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Partial<CollectionDefinition>;

      const name =
        typeof data.name === "string" ? data.name.trim() : "";

      if (!name) {
        return null;
      }

      const slug =
        typeof data.slug === "string" && data.slug.trim()
          ? data.slug.trim()
          : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        id:
          typeof data.id === "string" && data.id.trim()
            ? data.id.trim()
            : slug,

        name,
        slug,

        status: data.status === "coming-soon" ? "coming-soon" : "live",

        order:
          typeof data.order === "number" &&
          Number.isFinite(data.order)
            ? data.order
            : index,
      };
    })
    .filter((item): item is CollectionDefinition => item !== null)
    .sort(
      (firstItem, secondItem) => firstItem.order - secondItem.order,
    );
}

function normaliseCategoriesList(value: unknown): CategoryDefinition[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultCategoriesList;
  }

  return value
    .map((item, index): CategoryDefinition | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Partial<CategoryDefinition>;

      const name =
        typeof data.name === "string" ? data.name.trim() : "";

      if (!name) {
        return null;
      }

      return {
        id:
          typeof data.id === "string" && data.id.trim()
            ? data.id.trim()
            : name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),

        name,

        order:
          typeof data.order === "number" &&
          Number.isFinite(data.order)
            ? data.order
            : index,
      };
    })
    .filter((item): item is CategoryDefinition => item !== null)
    .sort(
      (firstItem, secondItem) => firstItem.order - secondItem.order,
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

    storyCircles: normaliseStoryCircles(data.storyCircles),
    collectionsList: normaliseCollectionsList(data.collectionsList),
    categoriesList: normaliseCategoriesList(data.categoriesList),

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