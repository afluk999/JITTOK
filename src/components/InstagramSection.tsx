"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { getHomeContent, SocialItem } from "@/lib/contentService";

function InstagramPost({
  post,
  index,
  isPhone,
}: {
  post: SocialItem;
  index: number;
  isPhone: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.a
      href={post.link || "https://www.instagram.com/"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={isPhone ? undefined : { y: -8 }}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "linear-gradient(180deg, #eee7dc 0%, #d8cec0 100%)",
        border: "1px solid rgba(255,255,255,0.78)",
        boxShadow: "0 22px 60px rgba(52,42,30,0.12)",
        textDecoration: "none",
        color: "#111",
      }}
    >
      {!loaded || error ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8d8579",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            zIndex: 1,
          }}
        >
          Instagram Post
        </div>
      ) : null}

      <motion.img
        src={post.image}
        alt={`Instagram post ${index + 1}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        whileHover={isPhone ? undefined : { scale: 1.06 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          opacity: loaded && !error ? 1 : 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.22) 100%)",
          opacity: 0.75,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: isPhone ? "10px" : "14px",
          right: isPhone ? "10px" : "14px",
          width: isPhone ? "30px" : "34px",
          height: isPhone ? "30px" : "34px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.42)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        <FaInstagram size={isPhone ? 15 : 17} />
      </div>

      <div
        style={{
          position: "absolute",
          left: isPhone ? "12px" : "18px",
          bottom: isPhone ? "12px" : "16px",
          zIndex: 3,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "9px",
          fontSize: isPhone ? "10px" : "11px",
          fontWeight: 800,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        <FaInstagram size={isPhone ? 12 : 14} />
        View Post
      </div>
    </motion.a>
  );
}

export default function InstagramSection() {
  const [posts, setPosts] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  const [instagramUsername, setInstagramUsername] = useState("@jittok");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/");

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
    async function loadInstagramPosts() {
      try {
        const content = await getHomeContent();

        setPosts(content.instagramPosts || []);
        setInstagramUsername(content.instagramUsername || "@jittok");
        setInstagramUrl(content.instagramUrl || "https://www.instagram.com/");
      } catch (error) {
        console.error("LOAD INSTAGRAM POSTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInstagramPosts();
  }, []);

  return (
    <section
      id="instagram"
      style={{
        width: "100%",
        minHeight: isPhone ? "auto" : "100vh",
        background:
          "linear-gradient(180deg, #eee6da 0%, #ffffff 45%, #ffffff 100%)",
        color: "#111",
        fontFamily: '"Outfit", sans-serif',
        padding: isPhone ? "78px 18px 82px" : "104px 54px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isPhone ? "1fr" : "360px 1fr",
          gap: isPhone ? "34px" : "60px",
          alignItems: "start",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: isPhone ? "relative" : "sticky",
            top: isPhone ? "auto" : "120px",
          }}
        >
          <p
            style={{
              margin: "0 0 18px",
              color: "#77736c",
              fontSize: isPhone ? "11px" : "12px",
              fontWeight: 800,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            07 / Instagram
          </p>

          <h2
            style={{
              margin: 0,
              fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
              fontSize: isPhone ? "64px" : "clamp(64px, 6vw, 100px)",
              lineHeight: 0.86,
              fontWeight: 400,
              letterSpacing: "-1px",
              textTransform: "uppercase",
            }}
          >
            Follow
            <br />
            The Fit
          </h2>

          <p
            style={{
              margin: isPhone ? "22px 0 26px" : "28px 0 34px",
              color: "#4b4741",
              fontSize: isPhone ? "14px" : "15px",
              lineHeight: 1.7,
              maxWidth: isPhone ? "100%" : "290px",
            }}
          >
            Daily styling, new drops, customer fits, and behind-the-scenes from
            the JITTOK world.
          </p>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              color: "#111",
              textDecoration: "none",
              paddingBottom: "10px",
              borderBottom: "1px solid rgba(17,17,17,0.72)",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {instagramUsername}
            <ArrowRight size={15} strokeWidth={1.8} />
          </a>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPhone
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(3, minmax(0, 1fr))",
            gap: isPhone ? "10px" : "16px",
          }}
        >
          {loading ? (
            <InstagramEmpty text="Loading posts..." isPhone={isPhone} />
          ) : posts.length === 0 ? (
            <InstagramEmpty
              text="Add Instagram posts from admin/content"
              isPhone={isPhone}
            />
          ) : (
            posts
              .slice(0, 6)
              .map((post, index) => (
                <InstagramPost
                  key={`${post.image}-${index}`}
                  post={post}
                  index={index}
                  isPhone={isPhone}
                />
              ))
          )}
        </div>
      </div>
    </section>
  );
}

function InstagramEmpty({
  text,
  isPhone,
}: {
  text: string;
  isPhone: boolean;
}) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        minHeight: isPhone ? "260px" : "420px",
        background: "linear-gradient(180deg, #eee7dc 0%, #d8cec0 100%)",
        border: "1px dashed rgba(17,17,17,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#77736c",
        fontSize: "12px",
        fontWeight: 900,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "30px",
      }}
    >
      {text}
    </div>
  );
}
