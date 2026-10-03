"use client";

import Link from "next/link";

export default function ProductError({ unstable_retry }: { unstable_retry: () => void }) {
  return <main style={{ minHeight: "70vh", padding: "160px 24px 64px", textAlign: "center" }}>
    <h1>We couldn’t load this product</h1>
    <p>Please check your connection and try again.</p>
    <button type="button" onClick={unstable_retry} style={{ margin: 16, padding: "12px 24px", border: "1px solid currentColor" }}>Try again</button>
    <p><Link href="/collections">Browse collections</Link></p>
  </main>;
}
