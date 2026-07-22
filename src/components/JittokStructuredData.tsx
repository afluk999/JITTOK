const SITE_URL = "https://jittok.in";

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
      image: `${SITE_URL}/jittok-og-image.jpg`,
      description:
        "JITTOK is an Indian fashion and streetwear store offering oversized T-shirts, box-fit tees, graphic apparel and limited fashion drops.",
      sameAs: [
        "https://www.instagram.com/jittok.in/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-96053-00701",
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

export default function JittokStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}