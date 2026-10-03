import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerProduct } from "@/lib/serverCatalog";
import { getProductSellingPrice, type FirebaseProduct } from "@/lib/productService";
import ProductPage from "./product-client";
import { serializeJsonLd } from "@/lib/jsonLd";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getServerProduct((await params).slug);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  const title = product.name + (product.variant ? " — " + product.variant : "");
  const description = product.description.slice(0, 160);
  const url = "https://jittok.in/product/" + encodeURIComponent(product.slug);
  const images = product.images.slice(0, 1);
  return { title, description, alternates: { canonical: url },
    openGraph: { title, description, url, images, type: "website" },
    twitter: { card: "summary_large_image", title, description, images } };
}
export default async function Page({ params }: Props) {
  const product = await getServerProduct((await params).slug);
  if (!product) notFound();
  const serializable = JSON.parse(JSON.stringify(product)) as FirebaseProduct;
  const structured = {
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.description, image: product.images.map(image => image.startsWith("/") ? "https://jittok.in" + image : image),
    sku: product.id, brand: { "@type": "Brand", name: "JITTOK" },
    offers: { "@type": "Offer", priceCurrency: "INR", price: getProductSellingPrice(product),
      availability: product.status === "sold-out" || product.stock <= 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: "https://jittok.in/product/" + encodeURIComponent(product.slug) },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structured) }} />
    <ProductPage key={product.id || product.slug} initialProduct={serializable} /></>;
}
