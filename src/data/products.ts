export type Product = {
  id: number;
  slug: string;
  name: string;
  variant: string;
  category: string;
  price: number;
  displayPrice: string;
  description: string;
  images: string[];
  sizes: string[];
  stock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "oversized-tee-ivory",
    name: "Oversized Tee",
    variant: "Ivory",
    category: "T-Shirts",
    price: 1299,
    displayPrice: "₹1,299.00",
    description:
      "Crafted from premium cotton with a relaxed oversized fit. Minimal design, clean structure, and everyday comfort.",
    images: [
      "/products/oversized-tee-ivory-1.png",
      "/products/oversized-tee-ivory-2.png",
      "/products/oversized-tee-ivory-3.png",
      "/products/oversized-tee-ivory-4.png",
      "/products/oversized-tee-ivory-5.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 2,
    slug: "graphic-tee-charcoal",
    name: "Graphic Tee",
    variant: "Charcoal",
    category: "T-Shirts",
    price: 1399,
    displayPrice: "₹1,399.00",
    description:
      "A relaxed charcoal tee with clean graphics and a premium streetwear silhouette.",
    images: [
      "/products/graphic-tee-charcoal-1.png",
      "/products/graphic-tee-charcoal-2.png",
      "/products/graphic-tee-charcoal-3.png",
      "/products/graphic-tee-charcoal-4.png",
      "/products/graphic-tee-charcoal-5.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 3,
    slug: "signature-hoodie-black",
    name: "Signature Hoodie",
    variant: "Black",
    category: "Hoodies",
    price: 2499,
    displayPrice: "₹2,499.00",
    description:
      "Heavyweight hoodie with drop shoulders, soft fleece texture, and a clean everyday silhouette.",
    images: [
      "/products/signature-hoodie-black-1.png",
      "/products/signature-hoodie-black-2.png",
      "/products/signature-hoodie-black-3.png",
      "/products/signature-hoodie-black-4.png",
      "/products/signature-hoodie-black-5.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 12,
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 4,
    slug: "wide-sweatpants-grey",
    name: "Wide Sweatpants",
    variant: "Grey",
    category: "Pants",
    price: 1899,
    displayPrice: "₹1,899.00",
    description:
      "Relaxed wide-leg sweatpants designed for movement, comfort, and everyday styling.",
    images: [
      "/products/wide-sweatpants-grey-1.png",
      "/products/wide-sweatpants-grey-2.png",
      "/products/wide-sweatpants-grey-3.png",
      "/products/wide-sweatpants-grey-4.png",
      "/products/wide-sweatpants-grey-5.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 5,
    slug: "pocket-tee-taupe",
    name: "Pocket Tee",
    variant: "Taupe",
    category: "T-Shirts",
    price: 1299,
    displayPrice: "₹1,299.00",
    description:
      "A soft everyday pocket tee with a neutral taupe tone and relaxed fit.",
    images: [
      "/products/pocket-tee-taupe-1.png",
      "/products/pocket-tee-taupe-2.png",
      "/products/pocket-tee-taupe-3.png",
      "/products/pocket-tee-taupe-4.png",
      "/products/pocket-tee-taupe-5.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 6,
    slug: "minimal-logo-tee-black",
    name: "Minimal Logo Tee",
    variant: "Black",
    category: "T-Shirts",
    price: 1199,
    displayPrice: "₹1,199.00",
    description:
      "A clean black tee with subtle branding and a premium oversized profile.",
    images: [
      "/products/minimal-logo-tee-black-1.png",
      "/products/minimal-logo-tee-black-2.png",
      "/products/minimal-logo-tee-black-3.png",
      "/products/minimal-logo-tee-black-4.png",
      "/products/minimal-logo-tee-black-5.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 22,
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 7,
    slug: "cargo-pants-black",
    name: "Cargo Pants",
    variant: "Black",
    category: "Pants",
    price: 2299,
    displayPrice: "₹2,299.00",
    description:
      "Relaxed cargo pants with utility pockets and a clean streetwear structure.",
    images: [
      "/products/cargo-pants-black-1.png",
      "/products/cargo-pants-black-2.png",
      "/products/cargo-pants-black-3.png",
      "/products/cargo-pants-black-4.png",
      "/products/cargo-pants-black-5.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 8,
    slug: "core-hoodie-sandstone",
    name: "Core Hoodie",
    variant: "Sandstone",
    category: "Hoodies",
    price: 2499,
    displayPrice: "₹2,499.00",
    description:
      "A sandstone hoodie made for everyday layering with a relaxed premium fit.",
    images: [
      "/products/core-hoodie-sandstone-1.png",
      "/products/core-hoodie-sandstone-2.png",
      "/products/core-hoodie-sandstone-3.png",
      "/products/core-hoodie-sandstone-4.png",
      "/products/core-hoodie-sandstone-5.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 14,
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 9,
    slug: "logo-cap-black",
    name: "Logo Cap",
    variant: "Black",
    category: "Accessories",
    price: 899,
    displayPrice: "₹899.00",
    description:
      "Minimal black cap with subtle JITTOK branding and adjustable back strap.",
    images: [
      "/products/logo-cap-black-1.png",
      "/products/logo-cap-black-2.png",
      "/products/logo-cap-black-3.png",
      "/products/logo-cap-black-4.png",
      "/products/logo-cap-black-5.png",
    ],
    sizes: ["Free Size"],
    stock: 30,
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 10,
    slug: "premium-tee-bone",
    name: "Premium Tee",
    variant: "Bone",
    category: "T-Shirts",
    price: 1299,
    displayPrice: "₹1,299.00",
    description:
      "A premium bone-colored tee with soft cotton feel and timeless minimal design.",
    images: [
      "/products/premium-tee-bone-1.png",
      "/products/premium-tee-bone-2.png",
      "/products/premium-tee-bone-3.png",
      "/products/premium-tee-bone-4.png",
      "/products/premium-tee-bone-5.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 16,
    isNewArrival: true,
    isFeatured: false,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export const categories = ["All", "T-Shirts", "Hoodies", "Pants", "Accessories"];