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

export type FirebaseProduct = {
  id?: string;
  slug: string;
  name: string;
  variant: string;
  category: string;
  price: number;
  displayPrice: string;
  description: string;
  images: string[];
  sizes: string[];
  stock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  createdAt?: unknown;
};

const productsCollection = collection(db, "products");

export async function getProducts() {
  const productsQuery = query(productsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as FirebaseProduct[];
}

export async function getNewArrivalProducts() {
  const productsQuery = query(
    productsCollection,
    where("isNewArrival", "==", true),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as FirebaseProduct[];
}

export async function getFeaturedProducts() {
  const productsQuery = query(
    productsCollection,
    where("isFeatured", "==", true),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as FirebaseProduct[];
}

export async function getProductBySlugFromFirebase(slug: string) {
  const productQuery = query(productsCollection, where("slug", "==", slug));
  const snapshot = await getDocs(productQuery);

  if (snapshot.empty) return null;

  const productDoc = snapshot.docs[0];

  return {
    id: productDoc.id,
    ...productDoc.data(),
  } as FirebaseProduct;
}

export async function getProductById(productId: string) {
  const productRef = doc(db, "products", productId);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as FirebaseProduct;
}

export async function createProduct(product: Omit<FirebaseProduct, "id">) {
  const result = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
  });

  return result.id;
}

export async function updateProduct(
  productId: string,
  product: Partial<FirebaseProduct>
) {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    ...product,
  });
}

export async function deleteProduct(productId: string) {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}