import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
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

  status?: ProductStatus;
  badge?: ProductBadge;

  isNewArrival: boolean;
  isFeatured: boolean;
  isIconic?: boolean;

  newArrivalRow?: "both" | "1" | "2";

  homepageOrder?: number;
  newArrivalOrder?: number;
  featuredOrder?: number;
  iconicOrder?: number;

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
function isPublicProduct(product: FirebaseProduct) {
  return (
    product.status !== "draft" &&
    product.status !== "archived"
  );
}

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

/*
 * Gets public New Arrival products.
 */
export async function getNewArrivalProducts() {
  const productsQuery = query(
    productsCollection,
    where("isNewArrival", "==", true),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs
    .map((item) =>
      normaliseProduct({
        id: item.id,
        ...item.data(),
      } as FirebaseProduct),
    )
    .filter(isPublicProduct)
    .sort(
      (firstProduct, secondProduct) =>
        (firstProduct.newArrivalOrder ?? 999) -
        (secondProduct.newArrivalOrder ?? 999),
    );
}

/*
 * Gets public Featured products.
 */
export async function getFeaturedProducts() {
  const productsQuery = query(
    productsCollection,
    where("isFeatured", "==", true),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs
    .map((item) =>
      normaliseProduct({
        id: item.id,
        ...item.data(),
      } as FirebaseProduct),
    )
    .filter(isPublicProduct)
    .sort(
      (firstProduct, secondProduct) =>
        (firstProduct.featuredOrder ?? 999) -
        (secondProduct.featuredOrder ?? 999),
    );
}

/*
 * Gets public Iconic products.
 */
export async function getIconicProducts() {
  const productsQuery = query(
    productsCollection,
    where("isIconic", "==", true),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs
    .map((item) =>
      normaliseProduct({
        id: item.id,
        ...item.data(),
      } as FirebaseProduct),
    )
    .filter(isPublicProduct)
    .sort(
      (firstProduct, secondProduct) =>
        (firstProduct.iconicOrder ?? 999) -
        (secondProduct.iconicOrder ?? 999),
    );
}

/*
 * Gets a public product using its slug.
 * Draft and archived products return null.
 */
export async function getProductBySlugFromFirebase(
  slug: string,
) {
  const productQuery = query(
    productsCollection,
    where("slug", "==", slug),
  );

  const snapshot = await getDocs(productQuery);

  if (snapshot.empty) {
    return null;
  }

  const productDocument = snapshot.docs[0];

  const product = normaliseProduct({
    id: productDocument.id,
    ...productDocument.data(),
  } as FirebaseProduct);

  if (!isPublicProduct(product)) {
    return null;
  }

  return product;
}

/*
 * Gets any product by ID.
 * This is used by the admin edit page.
 */
export async function getProductById(productId: string) {
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
 * Creates a new product.
 */
export async function createProduct(
  product: Omit<FirebaseProduct, "id">,
) {
  const sellingPrice =
    product.sellingPrice ?? product.price;

  const originalPrice =
    product.originalPrice ?? product.price;

  const status =
    product.status ?? "published";

  /*
   * Removes featuredOrder, iconicOrder and other optional
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
  const productReference = doc(
    db,
    "products",
    productId,
  );

  await deleteDoc(productReference);
}