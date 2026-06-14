import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Mail, Lock, ArrowRight, Package, Heart, MapPin } from "lucide-react";

export default function AccountPage() {
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
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <section
            style={{
              marginBottom: "54px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "40px",
              alignItems: "end",
            }}
          >
            <div>
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
                01 / Account
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: "clamp(78px, 8vw, 128px)",
                  lineHeight: 0.84,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                My Account
              </h1>
            </div>

            <p
              style={{
                margin: "0 0 10px",
                maxWidth: "360px",
                color: "#4d4943",
                fontSize: "14px",
                lineHeight: 1.65,
              }}
            >
              Login to view orders, wishlist, saved addresses, and checkout
              faster.
            </p>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              gap: "34px",
              alignItems: "start",
            }}
          >
            {/* LOGIN CARD */}
            <div
              style={{
                background: "#111",
                color: "#f6f2eb",
                padding: "42px",
                minHeight: "540px",
              }}
            >
              <User size={38} strokeWidth={1.4} />

              <h2
                style={{
                  margin: "28px 0 18px",
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: "60px",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Login
              </h2>

              <p
                style={{
                  margin: "0 0 34px",
                  color: "rgba(246,242,235,0.68)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  maxWidth: "360px",
                }}
              >
                Account authentication will be connected later with backend.
                This page is ready for login UI.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label style={darkLabelStyle}>Email</label>

                <div style={darkInputWrapStyle}>
                  <Mail size={18} strokeWidth={1.6} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={darkInputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={darkLabelStyle}>Password</label>

                <div style={darkInputWrapStyle}>
                  <Lock size={18} strokeWidth={1.6} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={darkInputStyle}
                  />
                </div>
              </div>

              <button
                type="button"
                style={{
                  height: "54px",
                  padding: "0 26px",
                  border: "none",
                  background: "#f6f2eb",
                  color: "#111",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginRight: "16px",
                }}
              >
                Login <ArrowRight size={16} />
              </button>

              <button
                type="button"
                style={{
                  height: "54px",
                  padding: "0 26px",
                  border: "1px solid rgba(246,242,235,0.28)",
                  background: "transparent",
                  color: "#f6f2eb",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Create Account
              </button>
            </div>

            {/* ACCOUNT BENEFITS */}
            <div
              style={{
                background: "#f2eee7",
                border: "1px solid #e5ded4",
                padding: "42px",
                minHeight: "540px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 30px",
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: "58px",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Account Benefits
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "34px",
                }}
              >
                <BenefitCard
                  icon={<Package size={24} />}
                  title="Track Orders"
                  text="View your purchase history and order updates."
                />

                <BenefitCard
                  icon={<Heart size={24} />}
                  title="Wishlist"
                  text="Save your favourite essentials for later."
                />

                <BenefitCard
                  icon={<MapPin size={24} />}
                  title="Addresses"
                  text="Save delivery addresses for faster checkout."
                />

                <BenefitCard
                  icon={<User size={24} />}
                  title="Profile"
                  text="Manage your account details and preferences."
                />
              </div>

              <div
                style={{
                  background: "#f6f2eb",
                  border: "1px solid #ddd5ca",
                  padding: "26px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 16px",
                    color: "#77736c",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  New to JITTOK?
                </p>

                <p
                  style={{
                    margin: "0 0 24px",
                    color: "#4d4943",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  You can shop without an account now. Backend login and order
                  history can be connected later.
                </p>

                <Link
                  href="/collections"
                  style={{
                    color: "#111",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Start Shopping <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "#f6f2eb",
        border: "1px solid #ddd5ca",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "18px" }}>{icon}</div>

      <h3
        style={{
          margin: "0 0 10px",
          fontSize: "12px",
          fontWeight: 900,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#4d4943",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>
    </div>
  );
}

const darkLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "10px",
  color: "rgba(246,242,235,0.72)",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const darkInputWrapStyle: React.CSSProperties = {
  height: "54px",
  borderBottom: "1px solid rgba(246,242,235,0.32)",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  color: "rgba(246,242,235,0.72)",
};

const darkInputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#f6f2eb",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "15px",
};