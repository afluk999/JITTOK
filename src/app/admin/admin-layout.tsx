"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // The login page itself ("/admin" exactly) shouldn't show the
  // sidebar — you're not logged in yet at that point.
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}