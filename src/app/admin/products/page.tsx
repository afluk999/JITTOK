"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseProduct, getProducts, deleteProduct } from "@/lib/productService";
import { Plus, Trash2, Pencil, LogOut, Package } from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin");
        return;
      }

      await loadProducts();
    });

    return () => unsubscribe();
  }, [router]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId?: string) {
    if (!productId) return;

    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await deleteProduct(productId);
    await loadProducts();
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/admin");
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

          <div style={{ display: "flex", gap: "12px" }}>
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
          <section
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            {products.map((product) => (
              <article
                key={product.id}
                style={{
                  background: "#f2eee7",
                  border: "1px solid #e5ded4",
                  display: "grid",
                  gridTemplateColumns: "90px 1fr auto",
                  gap: "22px",
                  alignItems: "center",
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "110px",
                    background: "#e6dfd3",
                    overflow: "hidden",
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
                      }}
                    />
                  ) : null}
                </div>

                <div>
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
                    {product.variant} / {product.category}
                  </p>

                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>
                    {product.displayPrice} · Stock {product.stock}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    style={iconButtonStyle}
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={iconButtonStyle}
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