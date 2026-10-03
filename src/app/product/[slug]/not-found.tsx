import Link from "next/link";

export default function ProductNotFound() {
  return <main style={{ minHeight: "75vh", background: "white", padding: "150px 24px", color: "#111" }}>
    <h1>Product not found</h1><p>This product is not available on the storefront.</p>
    <Link href="/collections">Explore our collections</Link>
  </main>;
}
