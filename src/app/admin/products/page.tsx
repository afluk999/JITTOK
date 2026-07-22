"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  archiveProduct,
  deleteProduct,
  FirebaseProduct,
  getProductOriginalPrice,
  getProductSellingPrice,
  getProducts,
  ProductStatus,
  restoreProduct,
} from "@/lib/productService";
import {
  Archive as ArchiveIcon,
  LogOut,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

type StatusFilter = "all" | ProductStatus;

const statusOptions: Array<{
  value: StatusFilter;
  label: string;
}> = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "sold-out", label: "Sold Out" },
  { value: "archived", label: "Archived" },
];

const badgeLabels: Record<string, string> = {
  none: "",
  new: "New",
  bestseller: "Bestseller",
  limited: "Limited",
  "sold-out": "Sold Out",
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionProductId, setActionProductId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin");
        return;
      }

      await loadProducts();
    });

    return () => unsubscribe();
  }, [router]);

  async function loadProducts(showLoader = true) {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const data = await getProducts();
      setProducts(data);
    } catch (loadError) {
      console.error("LOAD PRODUCTS ERROR:", loadError);
      setError("Products could not be loaded. Please try again.");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }

  async function handleArchive(product: FirebaseProduct) {
    if (!product.id) return;

    const confirmed = window.confirm(
      `Archive "${product.name}"?\n\nThe product will disappear from the public website, but its information will remain safe in the admin panel.`,
    );

    if (!confirmed) return;

    try {
      setActionProductId(product.id);
      await archiveProduct(product.id);
      await loadProducts(false);
    } catch (archiveError) {
      console.error("ARCHIVE PRODUCT ERROR:", archiveError);
      alert("The product could not be archived.");
    } finally {
      setActionProductId(null);
    }
  }

  async function handleRestore(product: FirebaseProduct) {
    if (!product.id) return;

    const confirmed = window.confirm(
      `Restore "${product.name}"?\n\nThe product status will change back to Published.`,
    );

    if (!confirmed) return;

    try {
      setActionProductId(product.id);
      await restoreProduct(product.id);
      await loadProducts(false);
    } catch (restoreError) {
      console.error("RESTORE PRODUCT ERROR:", restoreError);
      alert("The product could not be restored.");
    } finally {
      setActionProductId(null);
    }
  }

  async function handlePermanentDelete(product: FirebaseProduct) {
    if (!product.id) return;

    const confirmationText = window.prompt(
      `Permanently delete "${product.name}"?\n\nThis action cannot be undone.\n\nType DELETE to continue.`,
    );

    if (confirmationText !== "DELETE") {
      return;
    }

    try {
      setActionProductId(product.id);
      await deleteProduct(product.id);
      await loadProducts(false);
    } catch (deleteError) {
      console.error("DELETE PRODUCT ERROR:", deleteError);
      alert("The product could not be permanently deleted.");
    } finally {
      setActionProductId(null);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/admin");
    } catch (logoutError) {
      console.error("LOGOUT ERROR:", logoutError);
      alert("Logout failed. Please try again.");
    }
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const productStatus = getResolvedStatus(product);

      const matchesStatus =
        statusFilter === "all" || productStatus === statusFilter;

      const searchableText = [
        product.name,
        product.variant,
        product.category,
        product.slug,
        product.badge,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [products, searchQuery, statusFilter]);

  const productCounts = useMemo(() => {
    return {
      total: products.length,
      published: products.filter(
        (product) => getResolvedStatus(product) === "published",
      ).length,
      draft: products.filter(
        (product) => getResolvedStatus(product) === "draft",
      ).length,
      soldOut: products.filter(
        (product) => getResolvedStatus(product) === "sold-out",
      ).length,
      archived: products.filter(
        (product) => getResolvedStatus(product) === "archived",
      ).length,
    };
  }, [products]);

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
      <style>{`
        .admin-products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 34px;
        }

        .admin-header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .product-toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px;
          gap: 12px;
          margin-bottom: 20px;
        }

        .product-row {
          background: #f2eee7;
          border: 1px solid #e5ded4;
          display: grid;
          grid-template-columns: 90px minmax(0, 1fr) auto;
          gap: 22px;
          align-items: center;
          padding: 14px;
        }

        .product-actions {
          display: flex;
          gap: 9px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .product-meta-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 10px;
        }

        @media (max-width: 1000px) {
          .summary-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .admin-products-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-header-actions {
            width: 100%;
          }

          .admin-header-actions a,
          .admin-header-actions button {
            flex: 1;
          }

          .summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .product-toolbar {
            grid-template-columns: 1fr;
          }

          .product-row {
            grid-template-columns: 72px minmax(0, 1fr);
            gap: 14px;
          }

          .product-actions {
            grid-column: 1 / -1;
            justify-content: flex-start;
            border-top: 1px solid #ddd5ca;
            padding-top: 13px;
          }
        }

        @media (max-width: 520px) {
          main {
            padding: 24px 16px !important;
          }

          .summary-grid {
            grid-template-columns: 1fr 1fr;
          }

          .admin-header-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <header className="admin-products-header">
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

          <div className="admin-header-actions">
            <Link href="/admin/products/new" style={blackButtonStyle}>
              <Plus size={16} />
              Add Product
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={outlineButtonStyle}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {!loading && products.length > 0 ? (
          <>
            <section className="summary-grid">
              <SummaryCard
                label="Total Products"
                value={productCounts.total}
              />

              <SummaryCard
                label="Published"
                value={productCounts.published}
              />

              <SummaryCard
                label="Draft"
                value={productCounts.draft}
              />

              <SummaryCard
                label="Sold Out"
                value={productCounts.soldOut}
              />

              <SummaryCard
                label="Archived"
                value={productCounts.archived}
              />
            </section>

            <section className="product-toolbar">
              <div style={{ position: "relative" }}>
                <Search
                  size={17}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#77736c",
                    pointerEvents: "none",
                  }}
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search products, categories or badges..."
                  style={{
                    ...filterInputStyle,
                    paddingLeft: "46px",
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter,
                  )
                }
                style={filterInputStyle}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </section>
          </>
        ) : null}

        {error ? (
          <section
            style={{
              ...emptyBoxStyle,
              minHeight: "240px",
              color: "#8f1d1d",
            }}
          >
            <p style={{ margin: "0 0 20px" }}>{error}</p>

            <button
              type="button"
              onClick={() => loadProducts()}
              style={blackButtonStyle}
            >
              Try Again
            </button>
          </section>
        ) : loading ? (
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
        ) : filteredProducts.length === 0 ? (
          <section
            style={{
              ...emptyBoxStyle,
              minHeight: "280px",
            }}
          >
            <Search size={38} strokeWidth={1.4} />

            <h2
              style={{
                margin: "18px 0 10px",
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: "46px",
                lineHeight: 0.9,
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              No Matching Products
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#77736c",
              }}
            >
              Try another search or status filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              style={outlineButtonStyle}
            >
              Clear Filters
            </button>
          </section>
        ) : (
          <section style={{ display: "grid", gap: "14px" }}>
            {filteredProducts.map((product) => {
              const productStatus = getResolvedStatus(product);
              const sellingPrice =
                getProductSellingPrice(product);
              const originalPrice =
                getProductOriginalPrice(product);
              const isProcessing =
                actionProductId === product.id;
              const badgeLabel =
                badgeLabels[product.badge ?? "none"];

              return (
                <article
                  key={product.id}
                  className="product-row"
                  style={{
                    opacity: isProcessing ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "90px",
                      aspectRatio: "9 / 11",
                      background: "#e6dfd3",
                      overflow: "hidden",
                      position: "relative",
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
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#948d83",
                        }}
                      >
                        <Package size={24} strokeWidth={1.4} />
                      </div>
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div className="product-meta-row">
                      <StatusBadge status={productStatus} />

                      {badgeLabel ? (
                        <span
                          style={{
                            minHeight: "26px",
                            padding: "0 10px",
                            background: "#111",
                            color: "#fff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: 900,
                            letterSpacing: "0.8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {badgeLabel}
                        </span>
                      ) : null}

                      {product.isNewArrival ? (
                        <SmallLabel>New Arrival</SmallLabel>
                      ) : null}

                      {product.isFeatured ? (
                        <SmallLabel>Featured</SmallLabel>
                      ) : null}

                      {product.isIconic ? (
                        <SmallLabel>Iconic</SmallLabel>
                      ) : null}
                    </div>

                    <h2
                      style={{
                        margin: "0 0 8px",
                        fontFamily:
                          '"Bebas Neue", Impact, sans-serif',
                        fontSize: "42px",
                        lineHeight: 0.9,
                        fontWeight: 400,
                        textTransform: "uppercase",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {product.name}
                    </h2>

                    <p
                      style={{
                        margin: "0 0 9px",
                        color: "#77736c",
                        fontSize: "12px",
                        fontWeight: 900,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {product.variant} / {product.category}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 900,
                        }}
                      >
                        {formatCurrency(sellingPrice)}
                      </span>

                      {originalPrice !== null ? (
                        <span
                          style={{
                            color: "#8d877e",
                            fontSize: "13px",
                            fontWeight: 700,
                            textDecoration: "line-through",
                          }}
                        >
                          {formatCurrency(originalPrice)}
                        </span>
                      ) : null}

                      <span
                        style={{
                          color: "#77736c",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        Stock {product.stock}
                      </span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      style={iconButtonStyle}
                      title="Edit product"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={16} />
                    </Link>

                    {productStatus === "archived" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRestore(product)}
                          disabled={isProcessing}
                          style={iconButtonStyle}
                          title="Restore product"
                          aria-label={`Restore ${product.name}`}
                        >
                          <RotateCcw size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handlePermanentDelete(product)
                          }
                          disabled={isProcessing}
                          style={{
                            ...iconButtonStyle,
                            borderColor: "#c85d55",
                            color: "#a52118",
                          }}
                          title="Permanently delete"
                          aria-label={`Permanently delete ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleArchive(product)}
                        disabled={isProcessing}
                        style={iconButtonStyle}
                        title="Archive product"
                        aria-label={`Archive ${product.name}`}
                      >
                        <ArchiveIcon size={16} />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article
      style={{
        minHeight: "105px",
        background: "#f2eee7",
        border: "1px solid #e5ded4",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          color: "#77736c",
          fontSize: "10px",
          fontWeight: 900,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: "40px",
          lineHeight: 0.9,
          fontWeight: 400,
        }}
      >
        {value}
      </strong>
    </article>
  );
}

function SmallLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        minHeight: "26px",
        padding: "0 9px",
        border: "1px solid #d4ccc1",
        color: "#59544e",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 900,
        letterSpacing: "0.7px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const styles: Record<
    ProductStatus,
    React.CSSProperties
  > = {
    published: {
      background: "#dfe9dd",
      border: "1px solid #b8ceb4",
      color: "#31512c",
    },
    draft: {
      background: "#eee5cc",
      border: "1px solid #d8c799",
      color: "#6c5519",
    },
    "sold-out": {
      background: "#ead9d7",
      border: "1px solid #d4aaa5",
      color: "#7b2820",
    },
    archived: {
      background: "#dedbd7",
      border: "1px solid #c5bfb8",
      color: "#56504a",
    },
  };

  const labels: Record<ProductStatus, string> = {
    published: "Published",
    draft: "Draft",
    "sold-out": "Sold Out",
    archived: "Archived",
  };

  return (
    <span
      style={{
        minHeight: "26px",
        padding: "0 10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        fontWeight: 900,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        ...styles[status],
      }}
    >
      {labels[status]}
    </span>
  );
}

function getResolvedStatus(
  product: FirebaseProduct,
): ProductStatus {
  return product.status ?? "published";
}

function formatCurrency(price: number) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}.00`;
}

const blackButtonStyle: React.CSSProperties = {
  minHeight: "48px",
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
  minHeight: "48px",
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
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  textDecoration: "none",
};

const filterInputStyle: React.CSSProperties = {
  width: "100%",
  height: "52px",
  border: "1px solid #d8d0c4",
  background: "#f2eee7",
  outline: "none",
  padding: "0 15px",
  fontFamily: '"Outfit", sans-serif',
  fontSize: "14px",
  color: "#111",
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