"use client";



import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAdminStateChanged } from "@/lib/adminAccess";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [access, setAccess] = useState<"checking" | "allowed" | "denied">("checking");
  useEffect(() => onAdminStateChanged(auth, (user) => {
    setAccess(user ? "allowed" : "denied");
  }), []);

  // The login page itself ("/admin" exactly) shouldn't show the
  // sidebar — you're not logged in yet at that point.
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (access !== "allowed") {
    return <main className="admin-access">
      <h1>{access === "checking" ? "Checking admin access…" : "Admin access required"}</h1>
      {access === "denied" && <>
        <p>Sign in with an account approved to manage JITTOK.</p>
        <a href="/admin" onClick={() => { void signOut(auth); }}>Return to sign in</a>
      </>}
    </main>;
  }

  return (
    <div className="admin-shell" style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
