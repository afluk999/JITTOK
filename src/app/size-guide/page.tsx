import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SizeGuidePage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f6f2eb",
          padding: "150px 54px 90px",
          fontFamily: '"Outfit", sans-serif',
          color: "#111",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p
            style={{
              margin: "0 0 14px",
              color: "#77736c",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.3px",
              textTransform: "uppercase",
            }}
          >
            JITTOK
          </p>

          <h1
            style={{
              margin: "0 0 32px",
              fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
              fontSize: "clamp(56px, 7vw, 96px)",
              lineHeight: 0.9,
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            Size Guide
          </h1>

          <p style={{ margin: "0 0 20px", color: "#4d4943", fontSize: "15px", lineHeight: 1.75 }}>
            This is a placeholder Size Guide for JITTOK. Replace this text
            with your real measurement chart — chest, length and shoulder
            measurements for each size (S, M, L, XL, XXL) across your
            product types (oversized tees, hoodies, etc).
          </p>

          <p style={{ margin: 0, color: "#4d4943", fontSize: "15px", lineHeight: 1.75 }}>
            Still unsure which size to pick? Contact us at
            jittokoofficial@gmail.com and we'll help you choose.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
