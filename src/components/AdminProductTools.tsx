"use client";
import { useState } from "react";
import { bulkSetProductStatus, bulkUpdateProductDetails, type FirebaseProduct, type ProductStatus } from "@/lib/productService";
import { downloadCsv } from "@/lib/csv";

export default function AdminProductTools({ products, selected, setSelected, refresh }: {
  products: FirebaseProduct[]; selected: string[]; setSelected: (ids: string[]) => void; refresh: () => Promise<void>;
}) {
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const visibleIds = products.flatMap(p => p.id ? [p.id] : []);
  async function apply(action: "status" | "category") {
    if (!selected.length) return;
    const description = action === "status" ? `set status to ${status}` : `set category to ${category.trim()}`;
    if (action === "category" && !category.trim()) { setMessage("Enter a category."); return; }
    if (!window.confirm(`Update ${selected.length} selected products: ${description}?`)) return;
    setBusy(true); setMessage("");
    try {
      if (action === "status") await bulkSetProductStatus(selected, status);
      else await bulkUpdateProductDetails(selected, { category: category.trim() });
      await refresh(); setSelected([]); setMessage("Selected products updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Update failed."); }
    finally { setBusy(false); }
  }
  return <section className="admin-tool-panel">
    <h2>Bulk product tools</h2>
    <fieldset disabled={busy}>
      <div className="admin-toolbar">
        <button type="button" onClick={() => setSelected(visibleIds.slice(0,200))}>Select visible (up to 200)</button>
        <button type="button" onClick={() => setSelected([])}>Clear selection</button>
        <span>{selected.length} selected</span>
        <button type="button" onClick={() => downloadCsv("jittok-products.csv", [
          ["ID","Name","Variant","Category","Collection","Status","Price","Slug"],
          ...products.map(p => [p.id,p.name,p.variant,p.category,p.collection,p.status,p.sellingPrice ?? p.price,p.slug]),
        ])}>Export visible products</button>
      </div>
      <div className="admin-toolbar">
        <label>Status <select aria-label="Bulk product status" value={status} onChange={e => setStatus(e.target.value as ProductStatus)}>
          <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
        </select></label>
        <button type="button" disabled={!selected.length} onClick={() => void apply("status")}>Apply status</button>
        <label>Category <input aria-label="Bulk category" value={category} onChange={e => setCategory(e.target.value)} /></label>
        <button type="button" disabled={!selected.length} onClick={() => void apply("category")}>Apply category</button>
      </div>
    </fieldset>
    <p role="status">{message}</p>
  </section>;
}
