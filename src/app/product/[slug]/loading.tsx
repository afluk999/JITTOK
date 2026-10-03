export default function LoadingProduct() {
  return <main style={{ minHeight: "75vh", background: "white", padding: "150px 24px" }} aria-busy="true">
    <p role="status">Loading product…</p>
  </main>;
}
