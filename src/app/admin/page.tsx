"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  FirebaseProduct,
  getProducts,
  deleteProduct,
} from "@/lib/productService";
import {
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Package,
  Eye,
  Image,
  Home,
} from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin");
        return;
      }

      setCheckingAuth(false);
      await loadProducts();
    });

    return () => unsubscribe();
  }, [router]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("LOAD ADMIN PRODUCTS ERROR:", error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId?: string) {
    if (!productId) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      alert("Failed to delete product.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/admin");
  }

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#111",
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
        background: "#f6f2eb",
        color: "#111",
        padding: "42px",
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "42px",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 10px",
                color: "#77736c",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              JITTOK Admin
            </p>

            <h1
              style={{
                margin: 0,
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: "76px",
                lineHeight: 0.85,
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              Products
            </h1>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/" style={outlineButtonStyle}>
              <Eye size={16} />
              View Site
            </Link>

            <Link href="/admin/content" style={outlineButtonStyle}>
              <Image size={16} />
              Homepage Content
            </Link>

            <Link href="/admin/products/new" style={blackButtonStyle}>
              <Plus size={16} />
              Add Product
            </Link>

            <button onClick={handleLogout} style={outlineButtonStyle}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <StatCard label="Total Products" value={products.length} />
          <StatCard
            label="New Arrivals"
            value={products.filter((item) => item.isNewArrival).length}
          />
          <StatCard
            label="Featured"
            value={products.filter((item) => item.isFeatured).length}
          />
          <StatCard
            label="Total Stock"
            value={products.reduce(
              (total, item) => total + Number(item.stock || 0),
              0
            )}
          />
          <QuickCard />
        </section>

        {loading ? (
          <section style={emptyBoxStyle}>
            <p>Loading products...</p>
          </section>
        ) : products.length === 0 ? (
          <section style={emptyBoxStyle}>
            <Package size={42} strokeWidth={1.4} />

            <h2
              style={{
                margin: "20px 0 12px",
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: "52px",
                lineHeight: 0.9,
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              No Products Yet
            </h2>

            <p style={{ margin: "0 0 28px", color: "#4d4943" }}>
              Add your first JITTOK product from the admin panel.
            </p>

            <Link href="/admin/products/new" style={blackButtonStyle}>
              <Plus size={16} />
              Add Product
            </Link>
          </section>
        ) : (
          <section style={{ display: "grid", gap: "14px" }}>
            {products.map((product) => (
              <article
                key={product.id}
                style={{
                  background: "#f2eee7",
                  border: "1px solid #e5ded4",
                  display: "grid",
                  gridTemplateColumns: "96px 1fr auto",
                  gap: "22px",
                  alignItems: "center",
                  padding: "14px",
                }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  target="_blank"
                  style={{
                    width: "96px",
                    height: "118px",
                    background: "#e6dfd3",
                    overflow: "hidden",
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8d867b",
                        fontSize: "10px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        textAlign: "center",
                        padding: "10px",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </Link>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    {product.isNewArrival ? (
                      <Badge label="New Arrival" />
                    ) : null}

                    {product.isFeatured ? <Badge label="Featured" /> : null}

                    <Badge label={product.category} light />
                  </div>

                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontFamily: '"Bebas Neue", Impact, sans-serif',
                      fontSize: "42px",
                      lineHeight: 0.9,
                      fontWeight: 400,
                      textTransform: "uppercase",
                    }}
                  >
                    {product.name}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 8px",
                      color: "#77736c",
                      fontSize: "12px",
                      fontWeight: 900,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.variant} / Slug: {product.slug}
                  </p>

                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>
                    {product.displayPrice} · Stock {product.stock} ·{" "}
                    {product.images?.length || 0} image
                    {(product.images?.length || 0) === 1 ? "" : "s"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    style={iconButtonStyle}
                    title="View product"
                  >
                    <Eye size={16} />
                  </Link>

                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    style={iconButtonStyle}
                    title="Edit product"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={iconButtonStyle}
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        background: "#f2eee7",
        border: "1px solid #e5ded4",
        padding: "22px",
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          color: "#77736c",
          fontSize: "11px",
          fontWeight: 900,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>

      <p
        style={{
          margin: 0,
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: "54px",
          lineHeight: 0.85,
          fontWeight: 400,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function QuickCard() {
  return (
    <Link
      href="/admin/content"
      style={{
        background: "#111",
        color: "#f6f2eb",
        border: "1px solid #111",
        padding: "22px",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "124px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          fontWeight: 900,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "rgba(246,242,235,0.72)",
        }}
      >
        Manage
      </p>

      <div>
        <Home size={24} />
        <p
          style={{
            margin: "12px 0 0",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Homepage Content
        </p>
      </div>
    </Link>
  );
}

function Badge({ label, light }: { label: string; light?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "24px",
        padding: "0 10px",
        background: light ? "transparent" : "#111",
        color: light ? "#111" : "#fff",
        border: light ? "1px solid #d4ccc1" : "1px solid #111",
        fontSize: "10px",
        fontWeight: 900,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

const blackButtonStyle: React.CSSProperties = {
  height: "48px",
  padding: "0 20px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  border: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const outlineButtonStyle: React.CSSProperties = {
  height: "48px",
  padding: "0 20px",
  background: "transparent",
  color: "#111",
  border: "1px solid #d4ccc1",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
};

const iconButtonStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  border: "1px solid #d4ccc1",
  background: "transparent",
  color: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  textDecoration: "none",
};

const emptyBoxStyle: React.CSSProperties = {
  minHeight: "420px",
  background: "#f2eee7",
  border: "1px solid #e5ded4",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "40px",
};