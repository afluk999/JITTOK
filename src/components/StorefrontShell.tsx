"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import SiteLoader from "@/components/SiteLoader";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const admin = path === "/admin" || path.startsWith("/admin/");
  return <>
    {!admin && <><SiteLoader /><AnnouncementBar /><Navbar /></>}
    {children}
    {!admin && <FloatingSocialButtons />}
  </>;
}
