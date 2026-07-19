import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteLoader from "@/components/SiteLoader";
import AnnouncementBar from "@/components/AnnouncementBar";

export const metadata: Metadata = {
  title: "JITTOK",
  description: "Premium everyday essentials",
  icons: {
    icon: "/jittok-logo.png",
    shortcut: "/jittok-logo.png",
    apple: "/jittok-logo.png",
  },
};

const loaderSessionScript = `
  try {
    if (sessionStorage.getItem("jittok-loader-seen") === "1") {
      document.documentElement.classList.add("jittok-loader-already-seen");
    }
  } catch (error) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: loaderSessionScript,
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.jittok-loader-already-seen .jittok-loader {
                display: none !important;
              }
            `,
          }}
        />

        <link
          rel="preload"
          href="/jittok-logo.png"
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
      </body>
    </html>
  );
}