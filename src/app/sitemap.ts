import type { MetadataRoute } from "next";
import {
  getPublicProducts,
  type FirebaseProduct,
} from "@/lib/productService";
import { getHomeContent } from "@/lib/contentService";

const SITE_URL = "https://jittok.in";

export const revalidate = 3600;

function makeAbsoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return "";

  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://")
  ) {
    return pathOrUrl;
  }

  return `${SITE_URL}${
    pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  }`;
}

function getProductImages(product: FirebaseProduct) {
  const settingImages = (product.imageSettings ?? [])
    .map((image) => image.url)
    .filter(Boolean);

  const fallbackImages = (product.images ?? []).filter(Boolean);

  return Array.from(
    new Set([...settingImages, ...fallbackImages]),
  )
    .slice(0, 5)
    .map(makeAbsoluteUrl)
    .filter(Boolean);
}

function getLastModified(value: unknown): Date | undefined {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    ).toDate();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
      images: [`${SITE_URL}/hero-slide-1.png`],
    },
    {
      url: `${SITE_URL}/collections`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const [products, content] = await Promise.all([getPublicProducts(), getHomeContent()]);
    staticPages[0].images = [content.presentation.heroDesktop, content.presentation.heroMobile]
      .filter(Boolean).map(makeAbsoluteUrl);
    const collectionPages = content.collectionsList.filter(c => c.status === "live").map(c => ({ url: `${SITE_URL}/collections/${c.slug}` }));

    const productPages: MetadataRoute.Sitemap = products
      .filter(
        (product) =>
          Boolean(product.slug) &&
          product.status !== "draft" &&
          product.status !== "archived",
      )
      .map((product) => {
        const lastModified =
          getLastModified(
            (product as FirebaseProduct & {
              updatedAt?: unknown;
              createdAt?: unknown;
            }).updatedAt,
          ) ||
          getLastModified(
            (product as FirebaseProduct & {
              createdAt?: unknown;
            }).createdAt,
          );

        return {
          url: `${SITE_URL}/product/${product.slug}`,
          ...(lastModified ? { lastModified } : {}),
          changeFrequency: "weekly" as const,
          priority: 0.8,
          images: getProductImages(product),
        };
      });

    return [
      ...staticPages,
      ...productPages,
      ...collectionPages,
      { url: `${SITE_URL}/Store` },
      { url: `${SITE_URL}/about` },
      { url: `${SITE_URL}/contact` },
    ];
  } catch (error) {
    console.error("SITEMAP PRODUCT LOAD ERROR:", error);

    return staticPages;
  }
}
