"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { getHomeContent } from "@/lib/contentService";
import type { CSSProperties, ReactNode } from "react";

export default function ContactPage() {
  const [isPhone, setIsPhone] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState("910000000000");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/");
  const [instagramUsername, setInstagramUsername] = useState("@jittok");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function checkPhone() {
      const phoneUserAgent =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const smallScreen = window.innerWidth <= 768;
      const touchLikeDevice =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsPhone(smallScreen && (phoneUserAgent || touchLikeDevice));
    }

    checkPhone();
    window.addEventListener("resize", checkPhone);

    return () => window.removeEventListener("resize", checkPhone);
  }, []);

  useEffect(() => {
    async function loadContactSettings() {
      try {
        const content = await getHomeContent();

        setWhatsappNumber(content.whatsappNumber || "910000000000");
        setInstagramUrl(content.instagramUrl || "https://www.instagram.com/");
        setInstagramUsername(content.instagramUsername || "@jittok");
      } catch (error) {
        console.error("LOAD CONTACT SETTINGS ERROR:", error);
      }
    }

    loadContactSettings();
  }, []);

  const cleanWhatsappNumber = whatsappNumber.replace(/^\+/, "");
  const displayPhone = `+${cleanWhatsappNumber}`;

  function handleSendMessage() {
    const whatsappMessage = `Hi JITTOK, I want to contact you.

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Message:
${message || "I want to know more about your products."}`;

    const url = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f6f2eb",
          padding: isPhone ? "96px 16px 64px" : "150px 54px 90px",
          fontFamily: '"Outfit", sans-serif',
          color: "#111",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
          }}
        >
          <section
            style={{
              marginBottom: isPhone ? "34px" : "54px",
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "1fr auto",
              gap: isPhone ? "18px" : "40px",
              alignItems: "end",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  color: "#77736c",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                Contact JITTOK
              </p>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: isPhone ? "70px" : "clamp(78px, 8vw, 128px)",
                  lineHeight: 0.84,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Get in Touch
              </h1>
            </div>

            <p
              style={{
                margin: isPhone ? "0" : "0 0 10px",
                maxWidth: isPhone ? "100%" : "360px",
                color: "#4d4943",
                fontSize: isPhone ? "13px" : "14px",
                lineHeight: 1.65,
              }}
            >
              Have a question about products, size, orders, or drops? Reach out
              and we’ll help you.
            </p>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : "0.9fr 1.1fr",
              gap: isPhone ? "22px" : "34px",
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "#111",
                color: "#f6f2eb",
                padding: isPhone ? "30px 24px" : "42px",
                minHeight: isPhone ? "auto" : "520px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 30px",
                  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
                  fontSize: isPhone ? "48px" : "58px",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
              >
                Contact Details
              </h2>

              <ContactItem icon={<Phone size={18} />} title="Phone">
                {displayPhone}
              </ContactItem>

              <ContactItem icon={<Mail size={18} />} title="Email">
                hello@jittok.com
              </ContactItem>

              <ContactItem icon={<MapPin size={18} />} title="Location">
                Kerala, India
              </ContactItem>

              <div
                style={{
                  marginTop: "42px",
                  paddingTop: "28px",
                  borderTop: "1px solid rgba(246,242,235,0.16)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  Social
                </p>

                <div style={{ display: "flex", gap: "14px" }}>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialStyle}
                    aria-label={instagramUsername}
                  >
                    <FaInstagram size={18} />
                  </a>

                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialStyle}
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp size={18} />
                  </a>
                </div>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage();
              }}
              style={{
                background: "#f2eee7",
                border: "1px solid #e5ded4",
                padding: isPhone ? "28px 20px" : "42px",
                minHeight: isPhone ? "auto" : "520px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isPhone ? "1fr" : "1fr 1fr",
                  gap: isPhone ? "14px" : "18px",
                  marginBottom: "18px",
                }}
              >
                <Input
                  label="First Name"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={setFirstName}
                />

                <Input
                  label="Last Name"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={setLastName}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={setEmail}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <Input
                  label="Phone"
                  placeholder="+91 00000 00000"
                  value={phone}
                  onChange={setPhone}
                />
              </div>

              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Message
              </label>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
                style={{
                  width: "100%",
                  minHeight: isPhone ? "130px" : "150px",
                  border: "1px solid #d8d0c4",
                  background: "#f6f2eb",
                  outline: "none",
                  padding: "16px",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "14px",
                  color: "#111",
                  resize: "vertical",
                  marginBottom: "24px",
                }}
              />

              <button
                type="submit"
                style={{
                  width: isPhone ? "100%" : "auto",
                  height: "56px",
                  padding: "0 28px",
                  border: "none",
                  background: "#111",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "14px",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Send on WhatsApp <Send size={16} />
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ContactItem({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px",
        color: "rgba(246,242,235,0.72)",
      }}
    >
      <div style={{ marginTop: "2px" }}>{icon}</div>

      <div>
        <p
          style={{
            margin: "0 0 6px",
            color: "#f6f2eb",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </p>

        <p style={{ margin: 0, fontSize: "14px" }}>{children}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "52px",
          border: "1px solid #d8d0c4",
          background: "#f6f2eb",
          outline: "none",
          padding: "0 16px",
          fontFamily: '"Outfit", sans-serif',
          fontSize: "14px",
          color: "#111",
        }}
      />
    </>
  );
}

const socialStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid rgba(246,242,235,0.22)",
  color: "#f6f2eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};