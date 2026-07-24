"use client";

import type {
  CSSProperties,
  FormEvent,
} from "react";
import {
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { LockKeyhole } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          window.location.replace(
            "/admin/products",
          );
        }
      },
      (authError) => {
        console.error(
          "ADMIN AUTH CHECK ERROR:",
          authError,
        );

        setError(
          "Firebase authentication could not be loaded. Check the live environment variables.",
        );
      },
    );

    return () => unsubscribe();
  }, []);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError(
        "Enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );

      window.location.replace(
        "/admin/products",
      );
    } catch (loginError: unknown) {
      console.error(
        "ADMIN LOGIN ERROR:",
        loginError,
      );

      setError(
        "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
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
        fontFamily:
          '"Outfit", sans-serif',
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
                setEmail(
                  event.target.value,
                )
              }
              placeholder="admin@jittok.in"
              autoComplete="email"
              required
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
                setPassword(
                  event.target.value,
                )
              }
              placeholder="Enter password"
              autoComplete="current-password"
              required
              style={inputStyle}
            />
          </div>

          {error ? (
            <p
              style={{
                margin: 0,
                padding: "12px 14px",
                border:
                  "1px solid rgba(255,138,138,0.28)",
                background:
                  "rgba(255,138,138,0.06)",
                color: "#ff9b9b",
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
              opacity: loading
                ? 0.65
                : 1,
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

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "9px",
  color: "rgba(246,242,235,0.62)",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: "56px",
  border:
    "1px solid rgba(246,242,235,0.18)",
  outline: "none",
  background:
    "rgba(246,242,235,0.04)",
  color: "#f6f2eb",
  padding: "0 16px",
  fontSize: "14px",
  fontFamily:
    '"Outfit", sans-serif',
  boxSizing: "border-box",
};