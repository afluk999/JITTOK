import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteLoader from "@/components/SiteLoader";
import AnnouncementBar from "@/components/AnnouncementBar";

const SITE_URL = "https://jittok.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "JITTOK",

  title: {
    default:
      "JITTOK Store | Oversized T-Shirts & Streetwear India",
    template: "%s | JITTOK Store",
  },

  description:
    "Shop JITTOK for premium oversized T-shirts, box-fit tees, graphic streetwear and limited fashion drops with delivery across India.",

  creator: "JITTOK",
  publisher: "JITTOK",
  category: "fashion",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "JITTOK",
    title:
      "JITTOK Store | Oversized T-Shirts & Streetwear India",
    description:
      "Premium oversized T-shirts, box-fit tees, graphic streetwear and limited JITTOK fashion drops across India.",
    images: [
      {
        url: "/jittok-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JITTOK Store – premium oversized T-shirts and streetwear in India",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "JITTOK Store | Oversized T-Shirts & Streetwear India",
    description:
      "Premium oversized T-shirts, graphic streetwear and limited JITTOK fashion drops across India.",
    images: ["/jittok-og-image.jpg"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111111",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link
          rel="preload"
          href="/jittok-logo.png"
          as="image"
          type="image/png"
        />

        <link
          rel="preload"
          href="/hero/hero-1.webp"
          as="image"
          type="image/webp"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
        />

        <link
          rel="dns-prefetch"
          href="https://res.cloudinary.com"
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