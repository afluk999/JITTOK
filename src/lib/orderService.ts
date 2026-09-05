import {
  addDoc,
  collection,
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

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type OrderItem = {
  productId: string;
  productName: string;
  variant: string;
  slug: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id?: string;

  orderReference: string;

  items: OrderItem[];

  subtotal: number;
  shipping: number;
  total: number;

  /*
   * These start empty — the customer types them inside WhatsApp,
   * not on the website. Fill them in from the admin Orders page
   * once you see the customer's message.
   */
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  pincode?: string;

  status: OrderStatus;

  // Where the order was placed from, useful for tracking which
  // page converts best.
  source: "cart" | "product-page";

  createdAt?: unknown;
  updatedAt?: unknown;
};

const ordersCollection = collection(db, "orders");

export function generateOrderReference() {
  return `JT-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

/*
 * Saves a new order the moment the customer clicks a WhatsApp
 * order button. Customer details are filled in later by admin.
 */
export async function createOrder(
  order: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">,
) {
  const result = await addDoc(ordersCollection, {
    ...order,
    status: "new" as OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
}

/*
 * Gets every order, most recent first, for the admin Orders page.
 */
export async function getOrders() {
  const ordersQuery = query(ordersCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as Order,
  );
}

/*
 * Gets orders filtered to a single status, for tab/filter views.
 */
export async function getOrdersByStatus(status: OrderStatus) {
  const ordersQuery = query(
    ordersCollection,
    where("status", "==", status),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as Order,
  );
}

export async function getOrderById(orderId: string) {
  const orderReference = doc(db, "orders", orderId);
  const snapshot = await getDoc(orderReference);

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as Order;
}

/*
 * Updates status and/or customer details on an existing order.
 */
export async function updateOrder(
  orderId: string,
  patch: Partial<
    Pick<
      Order,
      | "status"
      | "customerName"
      | "customerPhone"
      | "deliveryAddress"
      | "pincode"
    >
  >,
) {
  const orderReference = doc(db, "orders", orderId);

  await updateDoc(orderReference, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}