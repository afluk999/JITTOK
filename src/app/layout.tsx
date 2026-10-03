import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RouteScrollManager } from "@/components/RouteScrollManager";
import { Bebas_Neue, Outfit } from "next/font/google";
import StorefrontShell from "@/components/StorefrontShell";
import { getServerHome } from "@/lib/serverCatalog";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const SITE_URL = "https://jittok.in";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getServerHome();

  const seoTitle =
    content.seoTitle || "JITTOK Store | Oversized T-Shirts & Streetwear India";
  const seoDescription =
    content.seoDescription ||
    "Shop JITTOK for premium oversized T-shirts, box-fit tees, graphic streetwear and limited fashion drops with delivery across India.";

  return {
    metadataBase: new URL(SITE_URL),

    applicationName: "JITTOK",

    title: {
      default: seoTitle,
      template: "%s | JITTOK Store",
    },

    description: seoDescription,

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
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: content.presentation.heroDesktop,
          alt: "JITTOK Store – premium oversized T-shirts and streetwear in India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [content.presentation.heroDesktop],
    },

    icons: {
      icon: [
        {
          url: "/icon.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],

      apple: [
        {
          url: "/icon.png",
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${bebasNeue.variable} ${outfit.variable}`}
    >
      <head>
        <link
          rel="preload"
          href="/jittok-logo.png"
          as="image"
          type="image/png"
        />



        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
        />

        <link
          rel="dns-prefetch"
          href="https://res.cloudinary.com"
        />
      </head>

      <body>
        <CartProvider>
          <WishlistProvider>

            <RouteScrollManager />


            <StorefrontShell>{children}</StorefrontShell>
          </WishlistProvider>
        </CartProvider>


      </body>
    </html>
  );
}
