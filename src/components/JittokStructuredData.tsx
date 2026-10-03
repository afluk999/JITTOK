import type { HomeContent } from "@/lib/contentService";
import { serializeJsonLd } from "@/lib/jsonLd";

const SITE_URL = "https://jittok.in";

export default function JittokStructuredData({ content }: { content: HomeContent }) {

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "JITTOK",
      alternateName: ["JITTOK Store", "Jitto Store"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
        width: 512,
        height: 512,
      },
      image: content.presentation.heroDesktop.startsWith("/") ? SITE_URL + content.presentation.heroDesktop : content.presentation.heroDesktop,
      description:
        "JITTOK is an Indian fashion and streetwear store offering oversized T-shirts, box-fit tees, graphic apparel and limited fashion drops.",
      sameAs: [
        content.instagramUrl,
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+" + content.whatsappNumber.replace(/\D/g, ""),
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Malayalam"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "JITTOK",
      alternateName: ["JITTOK Store", "Jitto Store"],
      description:
        "Official JITTOK online store for oversized T-shirts, box-fit tees, streetwear and limited fashion drops in India.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-IN",
    },
  ],
};

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(structuredData),
      }}
    />
  );
}
