"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";

type Review = {
  name: string;
  initials: string;
  rating: number;
  text: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const reviews: Review[] = [
  {
    name: "Sahil",
    initials: "S",
    rating: 5,
    text: "The cotton feels premium and the oversized fit sits perfectly on the shoulders. It looks even better in person.",
  },
  {
    name: "Ishaan",
    initials: "I",
    rating: 5,
    text: "Ordered it for the artwork, but the fabric surprised me. Comfortable enough for all-day wear and the fit is clean.",
  },
  {
    name: "Ayaan",
    initials: "A",
    rating: 5,
    text: "The print is sharp, the material feels heavy, and the sizing matches the product photos. Very satisfied.",
  },
  {
    name: "Reyansh P",
    initials: "RP",
    rating: 5,
    text: "A proper oversized silhouette without feeling too loose. The quality is better than many tees in this price range.",
  },
  {
    name: "Arjun",
    initials: "AR",
    rating: 5,
    text: "Clean packaging, quick dispatch, and a really comfortable tee. The neck and sleeves keep their shape well.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "What makes JITTOK oversized tees different?",
    answer:
      "JITTOK tees are designed with a structured oversized silhouette, premium cotton fabric, clean neck construction, and durable printed artwork.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes. Cash on Delivery is available for eligible pin codes. Prepaid orders may receive extra shipping benefits.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are normally dispatched within 24 hours. Delivery usually takes 3–7 working days depending on your location.",
  },
  {
    question: "Can I exchange the size?",
    answer:
      "Yes. Size exchange is available when the item is unused, unwashed, and returned with its original packaging and tags.",
  },
  {
    question: "How should I wash the printed tee?",
    answer:
      "Turn the tee inside out, wash it in cold water, avoid bleach, air dry it, and do not iron directly over the print.",
  },
];

export default function CustomerLoveSection() {
  const [isPhone, setIsPhone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    function updateViewport() {
      setIsPhone(window.innerWidth <= 768);
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <section
      id="customer-love"
      style={{
        width: "100%",
        background: "#ffffff",
        color: "#111111",
        fontFamily: '"Outfit", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          padding: isPhone ? "44px 14px 58px" : "72px 54px 88px",
        }}
      >
        <div
          className="review-scroll"
          style={{
            display: "flex",
            gap: isPhone ? "12px" : "14px",
            width: "100%",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "8px",
          }}
        >
          {reviews.map((review, index) => (
            <motion.article
              key={`${review.name}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index, 4) * 0.05,
              }}
              style={{
                width: isPhone ? "82vw" : "calc((100% - 42px) / 4)",
                minWidth: isPhone ? "82vw" : "280px",
                minHeight: isPhone ? "220px" : "238px",
                flex: "0 0 auto",
                scrollSnapAlign: "start",
                background: "#ffffff",
                border: "1px solid rgba(17,17,17,0.12)",
                padding: isPhone ? "22px" : "24px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "3px",
                  marginBottom: isPhone ? "20px" : "22px",
                }}
              >
                {Array.from({ length: review.rating }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={isPhone ? 14 : 15}
                    fill="#111111"
                    color="#111111"
                    strokeWidth={1}
                  />
                ))}
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#3f3a35",
                  fontSize: isPhone ? "13px" : "14px",
                  lineHeight: 1.72,
                }}
              >
                “{review.text}”
              </p>

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: isPhone ? "24px" : "28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#111111",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                  }}
                >
                  {review.initials}
                </div>

                <strong
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                  }}
                >
                  {review.name}
                </strong>
              </div>
            </motion.article>
          ))}
        </div>

        <div
          style={{
            height: "1px",
            margin: isPhone ? "54px 0 24px" : "72px 0 30px",
            background: "rgba(17,17,17,0.12)",
          }}
        />

        <div
          id="faq"
          style={{
            borderTop: "1px solid rgba(17,17,17,0.14)",
          }}
        >
          {faqItems.map((item, index) => {
            const open = openFaq === index;

            return (
              <div
                key={item.question}
                style={{
                  borderBottom: "1px solid rgba(17,17,17,0.14)",
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : index)}
                  style={{
                    width: "100%",
                    minHeight: isPhone ? "64px" : "72px",
                    border: "none",
                    background: "transparent",
                    color: "#111111",
                    display: "grid",
                    gridTemplateColumns: "1fr 38px",
                    gap: "18px",
                    alignItems: "center",
                    padding: isPhone ? "16px 0" : "18px 0",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: '"Outfit", sans-serif',
                  }}
                >
                  <span
                    style={{
                      fontSize: isPhone ? "12px" : "14px",
                      fontWeight: 900,
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.question}
                  </span>

                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      border: "1px solid rgba(17,17,17,0.14)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.28s ease",
                    }}
                  >
                    <ChevronDown size={15} strokeWidth={1.7} />
                  </span>
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        maxWidth: "820px",
                        margin: 0,
                        padding: open
                          ? isPhone
                            ? "0 44px 22px 0"
                            : "0 64px 24px 0"
                          : "0 44px 0 0",
                        color: "#625d56",
                        fontSize: isPhone ? "12px" : "13px",
                        lineHeight: 1.7,
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.2s ease, padding 0.3s ease",
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .review-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .review-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}