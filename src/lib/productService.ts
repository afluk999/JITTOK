import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  writeBatch,
  doc,
  getDoc,
  getDocs,
  getDocsFromServer,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { requireAdmin } from "@/lib/adminAccess";
import { db } from "@/lib/firebase";

export type ProductStatus =
  | "draft"
  | "published"
  | "sold-out"
  | "archived";

export type ProductBadge =
  | "none"
  | "new"
  | "bestseller"
  | "limited"
  | "sold-out";

export type ProductImageRole = "front" | "back" | "gallery";

export type ProductImageFit = "cover" | "contain";

export type ProductImageRatio =
  | "original"
  | "1:1"
  | "4:5"
  | "16:9"
  | "9:16";

export type ProductImageSetting = {
  url: string;
  role: ProductImageRole;
  fit: ProductImageFit;
  ratio: ProductImageRatio;
  positionX: number;
  positionY: number;
  order: number;
};

export type FirebaseProduct = {
  id?: string;

  slug: string;
  name: string;
  variant: string;
  category: string;

  /*
   * Existing price fields.
   * These are preserved so older product components continue working.
   */
  price: number;
  displayPrice: string;

  /*
   * New pricing fields.
   */
  originalPrice?: number;
  sellingPrice?: number;

  description: string;

  /*
   * Existing image array.
   */
  images: string[];

  /*
   * Advanced image configuration.
   */
  imageSettings?: ProductImageSetting[];

  sizes: string[];
  stock: number;
  sizeStock?: Record<string, number>;

  status?: ProductStatus;
  badge?: ProductBadge;

  /*
   * Homepage row toggles — a product can appear on either or both
   * of these sections, independent of Featured/New Arrival/Collection.
   */
  isBestSeller?: boolean;

  /*
   * Which Store category this product belongs to (e.g. "shades",
   * "watches"). Separate system from Category/Collection — powers
   * the /Store page's filter buttons.
   */
  storeCategory?: string;

  // Shows this product in the homepage "Store Best Sellers" row,
  // independent of the main isBestSeller toggle.
  isStoreBestSeller?: boolean;
  storeBestSellerOrder?: number;

  /*
   * Which collection page this product belongs to
   * (e.g. "ringer", "raglan-half", "raglan-full", "lovely").
   * Leave undefined for products not shown on a collection page.
   */
  collection?: string;
  collectionOrder?: number;

  /*
   * Admin-editable text blocks shown on the product page.
   * productDetails: one bullet point per line.
   * The other three power the collapsible accordions.
   * All optional — the product page falls back to sensible
   * default text when these are left blank.
   */
  productDetails?: string;
  shippingReturns?: string;
  materialCare?: string;
  sizeGuideText?: string;

  homepageOrder?: number;
  bestSellerOrder?: number;

  createdAt?: unknown;
  updatedAt?: unknown;
  archivedAt?: unknown;
};

const productsCollection = collection(db, "products");

/*
 * Firestore does not accept undefined values.
 * This removes optional fields that were not filled in.
 */
function removeUndefinedFields<T extends Record<string, unknown>>(
  data: T,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
}

/*
 * Adds safe defaults to older products already stored in Firestore.
 * This does not modify those products permanently.
 */
function normaliseProduct(product: FirebaseProduct): FirebaseProduct {
  const sellingPrice = product.sellingPrice ?? product.price;
  const originalPrice = product.originalPrice ?? product.price;
  const status = product.status ?? "published";

  const imageSettings =
    product.imageSettings ??
    product.images.map((url, index) => ({
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

  return {
    ...product,
    sellingPrice,
    originalPrice,
    status,
    badge:
      product.badge ??
      (status === "sold-out" ? "sold-out" : "none"),
    imageSettings,
  };
}

/*
 * Draft and archived products are hidden from the public website.
 * Sold-out products remain visible.
 */


/*
 * Returns the actual selling price.
 * It also supports products created before sellingPrice was added.
 */
export function getProductSellingPrice(
  product: FirebaseProduct,
): number {
  return product.sellingPrice ?? product.price;
}

/*
 * Returns the original price only when it is higher
 * than the current selling price.
 */
export function getProductOriginalPrice(
  product: FirebaseProduct,
): number | null {
  const sellingPrice = getProductSellingPrice(product);
  const originalPrice = product.originalPrice ?? product.price;

  return originalPrice > sellingPrice ? originalPrice : null;
}

/*
 * Gets every product for the admin panel.
 * Draft and archived products are included.
 */
export async function getProducts() {
  await requireAdmin();
  const productsQuery = query(
    productsCollection,
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) =>
    normaliseProduct({
      id: item.id,
      ...item.data(),
    } as FirebaseProduct),
  );
}

// Public queries must constrain status: Firestore rules are not result filters.
export async function getPublicProducts(): Promise<FirebaseProduct[]> {
  const snapshot = await getDocsFromServer(query(productsCollection, where("status", "in", ["published", "sold-out"])));
  return snapshot.docs.map(item => normaliseProduct({ ...item.data(), id: item.id } as FirebaseProduct));
}

export async function getProductsByCollection(slug: string) {
  return (await getPublicProducts()).filter(p => p.collection === slug)
    .sort((a,b) => (a.collectionOrder ?? 999) - (b.collectionOrder ?? 999));
}
export async function getProductsByCategory(category: string) {
  return (await getPublicProducts()).filter(p => p.category === category);
}
export async function getAllStoreProducts() {
  return (await getPublicProducts()).filter(p => Boolean(p.storeCategory));
}
export async function getStoreBestSellerProducts() {
  return (await getPublicProducts()).filter(p => p.isStoreBestSeller)
    .sort((a,b) => (a.storeBestSellerOrder ?? 999) - (b.storeBestSellerOrder ?? 999));
}
export async function getBestSellerProducts() {
  return (await getPublicProducts()).filter(p => p.isBestSeller)
    .sort((a,b) => (a.bestSellerOrder ?? 999) - (b.bestSellerOrder ?? 999));
}
export async function getProductBySlugFromFirebase(slug: string) {
  return (await getPublicProducts()).find(p => p.slug === slug) ?? null;
}

/*
 * Gets any product by ID.
 * This is used by the admin edit page.
 */
export async function getProductById(productId: string) {
  await requireAdmin();
  const productReference = doc(db, "products", productId);
  const snapshot = await getDoc(productReference);

  if (!snapshot.exists()) {
    return null;
  }

  return normaliseProduct({
    id: snapshot.id,
    ...snapshot.data(),
  } as FirebaseProduct);
}

/*
 * Checks whether another product already uses this slug.
 * Pass the current product's id (when editing) so it doesn't
 * flag the product's own slug as taken.
 */
export async function isSlugTaken(
  slug: string,
  excludeProductId?: string,
): Promise<boolean> {
  await requireAdmin();
  const productQuery = query(productsCollection, where("slug", "==", slug));
  const snapshot = await getDocs(productQuery);
  return snapshot.docs.some((item) => item.id !== excludeProductId);
}

/*
 * Creates a new product.
 */
export async function createProduct(
  product: Omit<FirebaseProduct, "id">,
) {
  await requireAdmin();
  const sellingPrice =
    product.sellingPrice ?? product.price;

  const originalPrice =
    product.originalPrice ?? product.price;

  const status =
    product.status ?? "published";

  /*
   * Removes bestSellerOrder, collectionOrder and other optional
   * values when they are undefined.
   */
  const cleanProduct = removeUndefinedFields(
    product as unknown as Record<string, unknown>,
  );

  const result = await addDoc(productsCollection, {
    ...cleanProduct,

    /*
     * Keep the old price field synchronized with sellingPrice
     * until all older components are updated.
     */
    price: sellingPrice,
    sellingPrice,
    originalPrice,

    status,

    badge:
      product.badge ??
      (status === "sold-out" ? "sold-out" : "none"),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
}

/*
 * Updates an existing product.
 */
export async function updateProduct(
  productId: string,
  product: Partial<FirebaseProduct>,
) {
  await requireAdmin();
  const productReference = doc(
    db,
    "products",
    productId,
  );

  /*
   * Remove undefined optional fields before sending
   * the update to Firestore.
   */
  const cleanProduct = removeUndefinedFields(
    product as unknown as Record<string, unknown>,
  );

  const updateData: Record<string, unknown> = {
    ...cleanProduct,
    ...Object.fromEntries(Object.entries(product).filter(([, value]) => value === undefined).map(([key]) => [key, deleteField()])),
    updatedAt: serverTimestamp(),
  };

  /*
   * Keep the existing price field synchronized.
   */
  if (
    typeof product.sellingPrice === "number" &&
    typeof product.price !== "number"
  ) {
    updateData.price = product.sellingPrice;
  }

  /*
   * Automatically display the sold-out badge.
   */
  if (product.status === "sold-out") {
    updateData.badge = "sold-out";
  }

  await updateDoc(productReference, updateData);
}

/*
 * Archives a product without permanently deleting it.
 */
export async function archiveProduct(productId: string) {
  await requireAdmin();
  const productReference = doc(
    db,
    "products",
    productId,
  );

  await updateDoc(productReference, {
    status: "archived",
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/*
 * Restores an archived product.
 */
export async function restoreProduct(productId: string) {
  await requireAdmin();
  const productReference = doc(
    db,
    "products",
    productId,
  );

  await updateDoc(productReference, {
    status: "published",
    archivedAt: null,
    updatedAt: serverTimestamp(),
  });
}

/*
 * Permanently deletes a product.
 * Use this only from the admin Danger Zone.
 */
export async function deleteProduct(productId: string) {
  await requireAdmin();
  const productReference = doc(
    db,
    "products",
    productId,
  );

  await deleteDoc(productReference);
}
export async function bulkSetProductStatus(ids: string[], status: ProductStatus) {
  await requireAdmin();
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length || uniqueIds.length > 200) throw new Error("Select between 1 and 200 products.");
  const batch = writeBatch(db);
  for (const id of uniqueIds) batch.update(doc(db, "products", id), {
    status, updatedAt: serverTimestamp(),
    badge: status === "sold-out" ? "sold-out" : "none",
    archivedAt: status === "archived" ? serverTimestamp() : null,
  });
  await batch.commit();
}

export async function duplicateProduct(product: FirebaseProduct) {
  const { id, createdAt, updatedAt, archivedAt, ...copy } = product;
  void id; void createdAt; void updatedAt; void archivedAt;
  return createProduct({ ...copy, name: copy.name + " (Copy)",
    slug: copy.slug + "-copy-" + crypto.randomUUID().slice(0, 8),
    status: "draft", isBestSeller: false, isStoreBestSeller: false, badge: "none" });
}

export async function bulkUpdateProductDetails(ids: string[], patch: { category: string }) {
  await requireAdmin();
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length || uniqueIds.length > 200 || !patch.category.trim()) throw new Error("Select up to 200 products and enter a category.");
  const batch = writeBatch(db);
  for (const id of uniqueIds) batch.update(doc(db, "products", id), { category: patch.category.trim(), updatedAt: serverTimestamp() });
  await batch.commit();
}
