import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p style={{ margin: "0 0 20px", color: "#4d4943", fontSize: "15px", lineHeight: 1.75 }}>
            This is a placeholder Privacy Policy for JITTOK. Replace this
            text with your real policy covering what customer data you
            collect (name, phone, address), how it's used to process orders,
            and that it is never sold to third parties.
          </p>

          <p style={{ margin: 0, color: "#4d4943", fontSize: "15px", lineHeight: 1.75 }}>
            Questions about your data? Contact us at
            jittokoofficial@gmail.com.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
