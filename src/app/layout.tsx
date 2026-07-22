import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteLoader from "@/components/SiteLoader";
import AnnouncementBar from "@/components/AnnouncementBar";

export const metadata: Metadata = {
  title: "JITTOK",
  description: "Premium everyday essentials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/jittok-loader-poster.png"
          as="image"
          type="image/png"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <CartProvider>
          <SiteLoader />
          <AnnouncementBar />
          {children}
        </CartProvider>

        <FloatingSocialButtons />
      </body>
    </html>
  );
}