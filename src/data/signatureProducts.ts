export type SignatureProduct = {
  id: string;
  slug: string;
  name: string;
  variant: string;
  category: string;
  price: number;
  displayPrice: string;
  originalPrice: number;
  originalDisplayPrice: string;
  imageIndex: number;
  description: string;
  productDetails: string;
  sizes: string[];
  stock: number;
};

export const signatureProducts: SignatureProduct[] = [
  {
    id: "signature-01",
    slug: "signature-messi-oversized-tee",
    name: "Messi Oversized Tee",
    variant: "White",
    category: "Signature Collection",
    price: 799,
    displayPrice: "₹799.00",
    originalPrice: 999,
    originalDisplayPrice: "₹999.00",
    imageIndex: 0,
    description:
      "A relaxed oversized tee inspired by football greatness, made for everyday comfort and streetwear styling.",
    productDetails:
      "OVERSIZED BOXY FIT | PREMIUM COTTON | HEAVYWEIGHT FABRIC | SCREEN PRINTED ARTWORK | UNISEX STREETWEAR",
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
  },
  {
    id: "signature-02",
    slug: "signature-neymar-oversized-tee",
    name: "Neymar Oversized Tee",
    variant: "White",
    category: "Signature Collection",
    price: 799,
    displayPrice: "₹799.00",
    originalPrice: 999,
    originalDisplayPrice: "₹999.00",
    imageIndex: 1,
    description:
      "A premium oversized tee with a bold Neymar-inspired visual, created for comfort, movement, and modern streetwear.",
    productDetails:
      "OVERSIZED BOXY FIT | PREMIUM COTTON | HEAVYWEIGHT FABRIC | SCREEN PRINTED ARTWORK | UNISEX STREETWEAR",
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
  },
  {
    id: "signature-03",
    slug: "signature-ronaldo-oversized-tee",
    name: "Ronaldo Oversized Tee",
    variant: "White",
    category: "Signature Collection",
    price: 799,
    displayPrice: "₹799.00",
    originalPrice: 999,
    originalDisplayPrice: "₹999.00",
    imageIndex: 2,
    description:
      "A statement oversized tee inspired by Ronaldo, balancing a premium silhouette with comfortable everyday wear.",
    productDetails:
      "OVERSIZED BOXY FIT | PREMIUM COTTON | HEAVYWEIGHT FABRIC | SCREEN PRINTED ARTWORK | UNISEX STREETWEAR",
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
  },
];

export function getSignatureProductBySlug(slug: string) {
  return signatureProducts.find((product) => product.slug === slug) || null;
}