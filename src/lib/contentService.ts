import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SocialItem = {
  image: string;
  link: string;
};

export type HomeContent = {
  heroImages: string[];
  editorialImages: string[];
  iconicImages: string[];

  // Separate galleries for the 3 signature products.
  // Each slug can store up to 5 images.
  signatureProductImages: Record<string, string[]>;

  reelsItems: SocialItem[];
  instagramPosts: SocialItem[];

  instagramItems?: SocialItem[];

  brandStatement: string;
  whatsappNumber: string;
  instagramUsername: string;
  instagramUrl: string;

  updatedAt?: unknown;
};

const defaultHomeContent: HomeContent = {
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
  instagramUsername: "@jittok",
  instagramUrl: "https://www.instagram.com/",
};

const homeContentRef = doc(db, "siteContent", "home");

export async function getHomeContent() {
  const snapshot = await getDoc(homeContentRef);

  if (!snapshot.exists()) {
    return defaultHomeContent;
  }

  const data = snapshot.data() as Partial<HomeContent>;

  return {
    ...defaultHomeContent,
    ...data,
    heroImages: data.heroImages || [],
    editorialImages: data.editorialImages || [],
    iconicImages: data.iconicImages || [],
    signatureProductImages: data.signatureProductImages || {},
    reelsItems: data.reelsItems || data.instagramItems || [],
    instagramPosts: data.instagramPosts || [],
  } as HomeContent;
}

export async function updateHomeContent(content: Partial<HomeContent>) {
  await setDoc(
    homeContentRef,
    {
      ...content,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}