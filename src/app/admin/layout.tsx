import type { Metadata } from "next";
import AdminLayout from "./admin-layout";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
