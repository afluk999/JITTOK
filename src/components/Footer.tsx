"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { getHomeContent } from "@/lib/contentService";

export default function Footer() {
  const [isPhone, setIsPhone] = useState(false);
  const [brandStatement, setBrandStatement] = useState(
    "Premium everyday essentials designed for comfort, movement, and timeless streetwear style."
  );
  const [instagramUsername, setInstagramUsername] = useState("@jittok");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/jittok.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==");
  const [whatsappNumber, setWhatsappNumber] = useState("919605300701");

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const smallScreen = window.innerWidth <= 768;

      setIsPhone(phoneUserAgent && smallScreen);
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const content = await getHomeContent();

        setBrandStatement(
          content.brandStatement ||
            "Premium everyday essentials designed for comfort, movement, and timeless streetwear style."
        );
        setInstagramUsername(content.instagramUsername || "@jittok");
        setInstagramUrl(content.instagramUrl || "https://www.instagram.com/jittok.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==");
        setWhatsappNumber(content.whatsappNumber || "919605300701");
      } catch (error) {
        console.error("LOAD FOOTER SETTINGS ERROR:", error);
      }
    }

    loadFooterSettings();
  }, []);

  const displayPhone = whatsappNumber
    ? `+${whatsappNumber.replace(/^\+/, "")}`
    : "+91 96053 00701";

  return (
    <footer
      style={{
        width: "100%",
        background: "#ffffff",
        color: "#111111",
        fontFamily: '"Outfit", sans-serif',
        padding: isPhone ? "64px 18px 28px" : "80px 54px 34px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPhone
              ? "1fr"
              : "1.4fr 1fr 1fr 1.2fr",
            gap: isPhone ? "38px" : "50px",
            paddingBottom: isPhone ? "44px" : "60px",
            borderBottom: "1px solid rgba(17,17,17,0.14)",
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                color: "#111111",
                textDecoration: "none",
                display: "inline-flex",
              }}
            >
              <img
                src="/jittok-logo.png"
                alt="JITTOK"
                style={{
                  width: isPhone ? "170px" : "235px",
                  height: isPhone ? "58px" : "120px",
                  objectFit: "contain",
                  objectPosition: "left center",
                  display: "block",
                }}
              />
            </Link>

            <p
              style={{
                marginTop: "24px",
                maxWidth: isPhone ? "100%" : "310px",
                color: "rgba(17,17,17,0.68)",
                fontSize: "14px",
                lineHeight: 1.75,
              }}
            >
              {brandStatement}
            </p>
          </div>

          <div
            style={{
              display: isPhone ? "grid" : "block",
              gridTemplateColumns: isPhone ? "1fr 1fr" : undefined,
              gap: isPhone ? "26px" : undefined,
            }}
          >
            <div>
              <h3 style={headingStyle}>Shop</h3>
              <FooterLink href="/collections">All Products</FooterLink>
              <FooterLink href="/#new-arrivals">New Arrivals</FooterLink>
              <FooterLink href="/#iconic-products">Iconic Products</FooterLink>
              <FooterLink href="/cart">Cart</FooterLink>
            </div>

            {isPhone ? (
              <div>
                <h3 style={headingStyle}>Support</h3>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/orders">Orders</FooterLink>
                <FooterLink href="/size-guide">Size Guide</FooterLink>
                <FooterLink href="/shipping">Shipping</FooterLink>
              </div>
            ) : null}
          </div>

          {!isPhone ? (
            <div>
              <h3 style={headingStyle}>Support</h3>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/orders">Orders</FooterLink>
              <FooterLink href="/size-guide">Size Guide</FooterLink>
              <FooterLink href="/shipping">Shipping</FooterLink>
            </div>
          ) : null}

          <div>
            <h3 style={headingStyle}>Stay Connected</h3>

            <p
              style={{
                margin: "0 0 20px",
                color: "rgba(17,17,17,0.66)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Get updates on new drops, offers, and styling edits.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid rgba(17,17,17,0.38)",
                paddingBottom: "12px",
                marginBottom: "24px",
              }}
            >
              <input
                type="email"
                placeholder="Email address"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#111111",
                  fontSize: "14px",
                  fontFamily: '"Outfit", sans-serif',
                  minWidth: 0,
                }}
              />

              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#111111",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>

            <ContactLink href={instagramUrl}>
              <FaInstagram size={15} /> {instagramUsername || "Instagram"}
            </ContactLink>

            <ContactLink href="jittokoofficial@gmail.com">
              <Mail size={15} /> jittokoofficial@gmail.com
            </ContactLink>

            <ContactLink href={`tel:+${whatsappNumber.replace(/^\+/, "")}`}>
              <Phone size={15} /> {displayPhone}
            </ContactLink>
          </div>
        </div>

        <div
          style={{
            padding: isPhone ? "24px 0 20px" : "30px 0 24px",
            borderBottom: "1px solid rgba(17,17,17,0.14)",
          }}
        >
          <Link
            href="/"
            aria-label="JITTOK Home"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <img
              src="/jittok-logo.png"
              alt="JITTOK"
              style={{
                width: isPhone ? "290px" : "400px",
                height: isPhone ? "200px" : "400px",
                maxWidth: "94vw",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </Link>
        </div>

        <div
          style={{
            paddingTop: "24px",
            display: "flex",
            flexDirection: isPhone ? "column" : "row",
            gap: isPhone ? "16px" : "0",
            justifyContent: "space-between",
            color: "rgba(17,17,17,0.52)",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: 0 }}>
            Â© {new Date().getFullYear()} JITTOK. All rights reserved.
          </p>

          <div
            style={{
              display: "flex",
              gap: "22px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/privacy" style={bottomLinkStyle}>
              Privacy Policy
            </Link>

            <Link href="/terms" style={bottomLinkStyle}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        color: "rgba(17,17,17,0.66)",
        textDecoration: "none",
        fontSize: "14px",
        marginBottom: "13px",
      }}
    >
      {children}
    </Link>
  );
}

function ContactLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        color: "rgba(17,17,17,0.74)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        marginBottom: "11px",
      }}
    >
      {children}
    </a>
  );
}

const headingStyle: React.CSSProperties = {
  margin: "0 0 22px",
  color: "#111111",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1.4px",
  textTransform: "uppercase",
};

const bottomLinkStyle: React.CSSProperties = {
  color: "rgba(17,17,17,0.52)",
  textDecoration: "none",
};
