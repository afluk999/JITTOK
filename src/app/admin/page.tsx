"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { LockKeyhole } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          router.replace("/admin/products");
          return;
        }

        setCheckingAuth(false);
      },
      (authError) => {
        console.error(
          "ADMIN AUTH CHECK ERROR:",
          authError,
        );

        setError(
          "Unable to check admin access. Please refresh and try again.",
        );

        setCheckingAuth(false);
      },
    );

    return () => unsubscribe();
  }, [router]);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      router.replace("/admin/products");
    } catch (loginError) {
      console.error(
        "ADMIN LOGIN ERROR:",
        loginError,
      );

      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#111111",
          color: "#f6f2eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        Checking admin access...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111111",
        color: "#f6f2eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <div
          style={{
            marginBottom: "36px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              margin: "0 auto 22px",
              border:
                "1px solid rgba(246,242,235,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockKeyhole
              size={22}
              strokeWidth={1.6}
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily:
                '"Bebas Neue", Impact, sans-serif',
              fontSize: "72px",
              lineHeight: 0.85,
              fontWeight: 400,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            JITTOK
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              color:
                "rgba(246,242,235,0.55)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Admin Access
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <label style={labelStyle}>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@jittok.in"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error ? (
            <p
              style={{
                margin: 0,
                color: "#ff8a8a",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: "56px",
              marginTop: "4px",
              border: "none",
              background: "#f6f2eb",
              color: "#111111",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading
              ? "Signing In..."
              : "Enter Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "9px",
  color: "rgba(246,242,235,0.62)",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "56px",
  border:
    "1px solid rgba(246,242,235,0.18)",
  outline: "none",
  background: "rgba(246,242,235,0.04)",
  color: "#f6f2eb",
  padding: "0 16px",
  fontSize: "14px",
  fontFamily: '"Outfit", sans-serif',
  boxSizing: "border-box",
};