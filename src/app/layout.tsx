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
    <html lang="en-IN" className="jittok-preloading">
      <head>
        <style>{`
          html.jittok-preloading,
          html.jittok-preloading body {
            min-height: 100%;
            background: #ffffff;
          }

          html.jittok-preloading body {
            overflow: hidden !important;
          }

          html.jittok-preloading body > *:not(#jittok-initial-loader) {
            visibility: hidden !important;
          }

          #jittok-initial-loader {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            opacity: 1;
            visibility: visible;
          }

          .jittok-initial-logo-stage {
            position: relative;
            width: min(44vw, 160px);
            aspect-ratio: 3 / 1;
            display: grid;
            place-items: center;
            animation:
              jittokInitialEnter 900ms cubic-bezier(0.22, 1, 0.36, 1) both,
              jittokInitialFloat 3.2s ease-in-out 900ms infinite alternate;
          }

          .jittok-initial-logo,
          .jittok-initial-shine {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }

          .jittok-initial-logo {
            display: block;
            object-fit: contain;
            object-position: center;
            user-select: none;
            -webkit-user-drag: none;
          }

          .jittok-initial-shine {
            background: linear-gradient(
              105deg,
              transparent 34%,
              rgba(255, 255, 255, 0.1) 41%,
              rgba(255, 255, 255, 0.95) 50%,
              rgba(255, 255, 255, 0.12) 59%,
              transparent 66%
            );
            background-size: 260% 100%;
            background-position: 180% 0;

            -webkit-mask-image: url("/jittok-logo.png");
            mask-image: url("/jittok-logo.png");
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
            -webkit-mask-size: contain;
            mask-size: contain;

            mix-blend-mode: screen;
            animation: jittokInitialShine 3.8s ease-in-out infinite;
            pointer-events: none;
          }

          .jittok-initial-dots {
            display: flex;
            gap: 7px;
            margin-top: 18px;
          }

          .jittok-initial-dots span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #111111;
            opacity: 0.2;
            animation: jittokInitialDot 1.5s ease-in-out infinite;
          }

          .jittok-initial-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .jittok-initial-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes jittokInitialEnter {
            from {
              opacity: 0;
              transform: scale(0.9);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes jittokInitialFloat {
            from {
              transform: scale(1) translateY(0);
            }

            to {
              transform: scale(1.025) translateY(-3px);
            }
          }

          @keyframes jittokInitialShine {
            0% {
              background-position: 180% 0;
              opacity: 0;
            }

            18% {
              opacity: 1;
            }

            72% {
              opacity: 1;
            }

            100% {
              background-position: -80% 0;
              opacity: 0;
            }
          }

          @keyframes jittokInitialDot {
            0%,
            100% {
              opacity: 0.18;
              transform: scale(0.8);
            }

            50% {
              opacity: 0.75;
              transform: scale(1);
            }
          }

          @media (min-width: 601px) {
            .jittok-initial-logo-stage {
              width: min(34vw, 220px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .jittok-initial-logo-stage,
            .jittok-initial-shine,
            .jittok-initial-dots span {
              animation: none !important;
            }
          }
        `}</style>

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
        <div
          id="jittok-initial-loader"
          role="status"
          aria-label="Loading JITTOK"
        >
          <div className="jittok-initial-logo-stage">
            <img
              src="/jittok-logo.png"
              alt="JITTOK"
              className="jittok-initial-logo"
            />
            <span
              className="jittok-initial-shine"
              aria-hidden="true"
            />
          </div>

          <div
            className="jittok-initial-dots"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </div>

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