import { cache } from "react";
import { getProductBySlugFromFirebase } from "@/lib/productService";
import { getHomeContent, defaultHomeContent } from "@/lib/contentService";

// Share the product read between metadata and server rendering for this request.
export const getServerProduct = cache(getProductBySlugFromFirebase);
export const getServerHome = cache(async () => ({
  content: await getHomeContent().catch(() => defaultHomeContent),
  renderedAt: Date.now(),
}));
