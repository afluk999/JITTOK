"use client";

import { useEffect, useRef } from "react";

const collections = [
  {
    number: "01",
    name: "RINGER",
    description:
      "Sport-inspired essentials with a classic everyday attitude.",
    href: "/ringer",
    image: "/images/about/ringer.jpg",
  },
  {
    number: "02",
    name: "RAGLAN HALF",
    description:
      "A relaxed athletic silhouette built for everyday movement.",
    href: "/raglan-half",
    image: "/images/about/raglan-half.jpg",
  },
  {
    number: "03",
    name: "RAGLAN FULL",
    description:
      "Layered proportions with a stronger, more structured feel.",
    href: "/raglan-full",
    image: "/images/about/raglan-full.jpg",
  },
  {
    number: "04",
    name: "LOVELY",
    description:
      "A softer expression of JITTOK with personality at its core.",
    href: "/lovely",
    image: "/images/about/lovely.jpg",
  },
  {
    number: "05",
    name: "TERRY",
    description:
      "Comfort-led pieces focused on texture, weight and ease.",
    href: "/terry",
    image: "/images/about/terry.jpg",
  },
  {
    number: "06",
    name: "SIGNATURE",
    description:
      "Statement pieces built around bold graphics and premium silhouettes.",
    href: "/signature",
    image: "/images/about/signature.jpg",
  },
];

const philosophy = [
  {
    number: "01",
    title: "IDENTITY",
    text: "Clothing is personal. We design pieces that leave room for the person wearing them.",
  },
  {
    number: "02",
    title: "MOVEMENT",
    text: "JITTOK is made for real life — changing places, changing moods, and whatever comes next.",
  },
  {
    number: "03",
    title: "SIMPLICITY",
    text: "Strong design does not need to shout. The details should do the talking.",
  },
];

const timeline = [
  {
    number: "01",
    title: "THE IDEA",
    text: "JITTOK begins with a simple idea: make clothing that feels personal.",
  },
  {
    number: "02",
    title: "THE FIRST DROP",
    text: "The first pieces take shape — built around attitude, comfort and everyday wear.",
  },
  {
    number: "03",
    title: "THE COLLECTIONS",
    text: "Different silhouettes become different expressions of the same JITTOK mindset.",
  },
  {
    number: "04",
    title: "NOW",
    text: "Building the next chapter, one piece at a time.",
  },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const reveals = page.querySelectorAll(".j-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("j-visible");
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    reveals.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <main ref={pageRef} className="jittok-about">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="j-hero">
          <div className="j-hero-top">
            <span>JITTOK / ABOUT</span>
            <span>THE BRAND</span>
          </div>

          <div className="j-hero-title">
            <span className="j-title-line">WEAR</span>

            <span className="j-title-line j-title-indent">
              YOUR
            </span>

            <span className="j-title-line">
              WORLD<span className="j-red-dot">.</span>
            </span>
          </div>

          <div className="j-hero-bottom">
            <span>CLOTHING WITHOUT THE NOISE.</span>

            <a href="#jittok-story">
              SCROLL TO EXPLORE
              <span className="j-scroll-arrow">↓</span>
            </a>
          </div>
        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section
          id="jittok-story"
          className="j-section j-intro j-reveal"
        >
          <div className="j-eyebrow">
            <span>01</span>
            <span>WHY JITTOK</span>
          </div>

          <div className="j-intro-grid">
            <h2>
              JITTOK IS BUILT
              <br />
              FOR PEOPLE WHO
              <br />
              <em>DEFINE THEIR OWN STYLE.</em>
            </h2>

            <div className="j-intro-copy">
              <p>
                JITTOK is an independent streetwear label built around
                expression, movement and everyday individuality.
              </p>

              <p>
                We make pieces that are designed to be worn, reworked
                and made your own. No uniform. No unnecessary noise.
                Just clothes with room for personality.
              </p>

              <div className="j-small-mark">
                J / I / T / T / O / K
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PHILOSOPHY
        ===================================================== */}

        <section className="j-section j-philosophy j-reveal">

          <div className="j-section-heading">
            <div className="j-eyebrow">
              <span>02</span>
              <span>THE PHILOSOPHY</span>
            </div>

            <h2>
              THE
              <br />
              JITTOK
              <br />
              WAY<span className="j-red-dot">.</span>
            </h2>
          </div>

          <div className="j-philosophy-list">
            {philosophy.map((item) => (
              <div
                className="j-philosophy-row"
                key={item.number}
              >
                <span className="j-number">{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <span className="j-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            FULL IMAGE
        ===================================================== */}

        <section className="j-image-break j-reveal">

          <div className="j-image-container">
            <img
              src="/images/about/editorial-01.jpg"
              alt="JITTOK editorial campaign"
            />

            <div className="j-image-caption">
              <span>JITTOK / 001</span>
              <span>BUILT FOR EVERYDAY EXPRESSION</span>
            </div>
          </div>

        </section>

        {/* =====================================================
            COLLECTIONS
        ===================================================== */}

        <section className="j-section j-collections j-reveal">

          <div className="j-collection-heading">

            <div className="j-eyebrow">
              <span>03</span>
              <span>THE COLLECTIONS</span>
            </div>

            <div>
              <h2>
                DIFFERENT
                <br />
                <em>EXPRESSIONS.</em>
              </h2>

              <p>
                One JITTOK mindset. Different silhouettes,
                moods and ways to wear them.
              </p>
            </div>

          </div>

          <div className="j-collection-grid">

            {collections.map((collection) => (
              <a
                key={collection.name}
                href={collection.href}
                className="j-collection-card"
              >
                <div className="j-collection-image">

                  <img
                    src={collection.image}
                    alt={`${collection.name} collection`}
                  />

                  <span className="j-collection-number">
                    {collection.number}
                  </span>

                  <span className="j-collection-view">
                    VIEW
                    <span>↗</span>
                  </span>

                </div>

                <div className="j-collection-info">

                  <div>
                    <h3>{collection.name}</h3>

                    <p>{collection.description}</p>
                  </div>

                  <span className="j-arrow">↗</span>

                </div>
              </a>
            ))}

          </div>
        </section>

        {/* =====================================================
            CRAFT
        ===================================================== */}

        <section className="j-section j-craft j-reveal">

          <div className="j-eyebrow">
            <span>04</span>
            <span>CRAFT</span>
          </div>

          <div className="j-craft-grid">

            <h2>
              MADE TO
              <br />
              BE WORN.
              <br />
              <em>MADE TO LAST.</em>
            </h2>

            <div className="j-craft-right">

              <p className="j-craft-lead">
                We care about the feeling of a piece as much
                as the way it looks. Proportion, fabric, weight
                and print all matter.
              </p>

              <div className="j-specs">

                <div>
                  <span>APPROACH</span>
                  <strong>COMFORT / FORM / DETAIL</strong>
                </div>

                <div>
                  <span>FIT</span>
                  <strong>RELAXED / OVERSIZED</strong>
                </div>

                <div>
                  <span>DETAIL</span>
                  <strong>BUILT WITH INTENTION</strong>
                </div>

                <div>
                  <span>PHILOSOPHY</span>
                  <strong>LESS NOISE. MORE CHARACTER.</strong>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            COMMUNITY
        ===================================================== */}

        <section className="j-section j-community j-reveal">

          <div className="j-community-head">

            <div className="j-eyebrow">
              <span>05</span>
              <span>THE PEOPLE</span>
            </div>

            <h2>
              JITTOK IS NOT
              <br />
              <em>JUST THE CLOTHES.</em>
            </h2>

          </div>

          <div className="j-community-grid">

            <div className="j-community-image j-community-large">
              <img
                src="/images/about/community-01.jpg"
                alt="JITTOK community"
              />
              <span>01</span>
            </div>

            <div className="j-community-copy">

              <p>
                It is the people who wear them, style them
                differently, take them somewhere new,
                and make them theirs.
              </p>

              <span className="j-community-mark">
                J / K / T / K
              </span>

            </div>

            <div className="j-community-image">
              <img
                src="/images/about/community-02.jpg"
                alt="JITTOK streetwear"
              />
              <span>02</span>
            </div>

          </div>

        </section>

        {/* =====================================================
            STORY / TIMELINE
        ===================================================== */}

        <section className="j-section j-story j-reveal">

          <div className="j-eyebrow">
            <span>06</span>
            <span>THE STORY</span>
          </div>

          <div className="j-timeline">

            {timeline.map((item) => (
              <div
                className="j-timeline-row"
                key={item.number}
              >

                <span>{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </div>
            ))}

          </div>

        </section>

        {/* =====================================================
            MANIFESTO
        ===================================================== */}

        <section className="j-manifesto">

          <div className="j-manifesto-small">
            THE JITTOK MANIFESTO
          </div>

          <h2>
            WEAR IT
            <br />
            <em>YOUR WAY.</em>
          </h2>

          <div className="j-manifesto-lines">

            <span>NO RULES.</span>
            <span>NO UNIFORM.</span>
            <span>NO NEED TO FIT IN.</span>

          </div>

          <strong>JUST JITTOK.</strong>

        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="j-section j-final j-reveal">

          <div className="j-eyebrow">
            <span>07</span>
            <span>YOUR NEXT PIECE</span>
          </div>

          <h2>
            READY TO FIND
            <br />
            <em>YOUR PIECE?</em>
          </h2>

          <div className="j-final-buttons">

            <a
              href="/collections"
              className="j-button j-button-black"
            >
              EXPLORE COLLECTIONS
              <span>↗</span>
            </a>

            <a
              href="/shop"
              className="j-button j-button-white"
            >
              SHOP ALL
              <span>↗</span>
            </a>

          </div>

        </section>

      </main>

      {/* =========================================================
          ALL CSS IS HERE — NO EXTERNAL CSS FILE REQUIRED
      ========================================================= */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .jittok-about {
          --paper: #f3f0e9;
          --white: #ffffff;
          --black: #101010;
          --muted: #77736c;
          --line: #d7d3cb;
          --red: #a92b25;

          background: var(--paper);
          color: var(--black);
          width: 100%;
          overflow: hidden;
        }

        .jittok-about img {
          max-width: 100%;
        }

        .jittok-about a {
          color: inherit;
          text-decoration: none;
        }

        /* =========================================
           REVEAL
        ========================================= */

        .j-reveal {
          opacity: 0;
          transform: translateY(45px);
          transition:
            opacity .8s ease,
            transform .9s cubic-bezier(.2,.7,.2,1);
        }

        .j-reveal.j-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* =========================================
           SHARED
        ========================================= */

        .j-section {
          padding:
            clamp(90px, 10vw, 170px)
            clamp(20px, 5vw, 80px);
        }

        .j-eyebrow {
          display: flex;
          gap: 20px;
          font-size: 10px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .j-red-dot {
          color: var(--red);
        }

        /* =========================================
           HERO
        ========================================= */

        .j-hero {
          min-height: calc(100svh - 70px);
          padding:
            28px
            clamp(20px, 5vw, 80px)
            35px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          border-bottom: 1px solid var(--line);
        }

        .j-hero-top,
        .j-hero-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .j-hero-title {
          display: flex;
          flex-direction: column;

          font-size:
            clamp(
              80px,
              15vw,
              250px
            );

          line-height: .75;
          font-weight: 900;
          letter-spacing: -.07em;
          text-transform: uppercase;
        }

        .j-title-line {
          animation:
            jTitleIn
            .9s
            cubic-bezier(.2,.7,.2,1)
            both;
        }

        .j-title-line:nth-child(2) {
          animation-delay: .08s;
        }

        .j-title-line:nth-child(3) {
          animation-delay: .16s;
        }

        .j-title-indent {
          margin-left: clamp(8vw, 16vw, 22vw);
        }

        .j-hero-bottom a {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .j-scroll-arrow {
          font-size: 18px;
        }

        /* =========================================
           INTRO
        ========================================= */

        .j-intro {
          border-bottom: 1px solid var(--line);
        }

        .j-intro-grid {
          margin-top: 80px;

          display: grid;

          grid-template-columns:
            minmax(0, 1.6fr)
            minmax(280px, .7fr);

          gap: 8vw;
          align-items: end;
        }

        .j-intro h2 {
          margin: 0;

          font-size:
            clamp(
              52px,
              7vw,
              118px
            );

          line-height: .88;
          letter-spacing: -.055em;
          font-weight: 900;
        }

        .j-intro h2 em,
        .j-craft h2 em,
        .j-community h2 em,
        .j-final h2 em {
          font-style: normal;
          color: var(--muted);
        }

        .j-intro-copy {
          max-width: 440px;

          font-size: 16px;
          line-height: 1.55;
        }

        .j-intro-copy p + p {
          margin-top: 22px;
        }

        .j-small-mark {
          margin-top: 60px;

          font-size: 10px;
          letter-spacing: .35em;
          color: var(--muted);
        }

        /* =========================================
           PHILOSOPHY
        ========================================= */

        .j-philosophy {
          background: var(--white);
        }

        .j-section-heading {
          display: grid;

          grid-template-columns:
            .35fr
            1fr;

          gap: 30px;
        }

        .j-section-heading h2 {
          margin: 0;

          font-size:
            clamp(
              64px,
              10vw,
              160px
            );

          line-height: .82;
          letter-spacing: -.065em;
          font-weight: 900;
        }

        .j-philosophy-list {
          margin-top: 100px;

          border-top: 1px solid var(--line);
        }

        .j-philosophy-row {
          min-height: 180px;

          display: grid;

          grid-template-columns:
            70px
            1fr
            1.2fr
            40px;

          gap: 30px;

          align-items: center;

          border-bottom: 1px solid var(--line);
        }

        .j-number {
          font-size: 11px;
          font-weight: 800;
        }

        .j-philosophy-row h3 {
          margin: 0;

          font-size:
            clamp(
              32px,
              4vw,
              64px
            );

          line-height: .9;
          letter-spacing: -.045em;
        }

        .j-philosophy-row p {
          max-width: 440px;
          margin: 0;

          color: #55524d;

          line-height: 1.5;
        }

        .j-arrow {
          font-size: 24px;

          transition:
            transform .3s ease;
        }

        .j-philosophy-row:hover .j-arrow,
        .j-collection-card:hover .j-arrow {
          transform:
            translate(5px, -5px);
        }

        /* =========================================
           IMAGE BREAK
        ========================================= */

        .j-image-break {
          padding: 0;

          background: var(--black);
        }

        .j-image-container {
          height:
            min(
              88vh,
              900px
            );

          position: relative;
          overflow: hidden;
        }

        .j-image-container img {
          width: 100%;
          height: 100%;

          object-fit: cover;
          display: block;

          transition:
            transform 1.3s
            cubic-bezier(.2,.7,.2,1);
        }

        .j-image-container:hover img {
          transform: scale(1.025);
        }

        .j-image-caption {
          position: absolute;

          left: 25px;
          right: 25px;
          bottom: 22px;

          display: flex;
          justify-content: space-between;

          color: white;

          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        /* =========================================
           COLLECTIONS
        ========================================= */

        .j-collections {
          background: var(--paper);
        }

        .j-collection-heading {
          display: grid;

          grid-template-columns:
            .35fr
            1fr;

          gap: 30px;
        }

        .j-collection-heading h2 {
          margin: 0;

          font-size:
            clamp(
              60px,
              9vw,
              145px
            );

          line-height: .82;
          letter-spacing: -.065em;
          font-weight: 900;
        }

        .j-collection-heading h2 em {
          color: var(--muted);
          font-style: normal;
        }

        .j-collection-heading p {
          max-width: 430px;

          margin:
            35px
            0
            0;

          color: var(--muted);

          line-height: 1.5;
        }

        .j-collection-grid {
          margin-top: 100px;

          display: grid;

          grid-template-columns:
            repeat(12, 1fr);

          gap: 18px;
        }

        .j-collection-card {
          grid-column: span 4;
        }

        .j-collection-card:nth-child(2),
        .j-collection-card:nth-child(5) {
          margin-top: 100px;
        }

        .j-collection-image {
          position: relative;

          aspect-ratio: 4 / 5;

          overflow: hidden;

          background: #e6e2da;
        }

        .j-collection-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
          display: block;

          transition:
            transform .7s
            cubic-bezier(.2,.7,.2,1);
        }

        .j-collection-card:hover
        .j-collection-image img {
          transform: scale(1.035);
        }

        .j-collection-number {
          position: absolute;

          top: 14px;
          left: 14px;

          padding: 7px 9px;

          background: white;

          font-size: 9px;
          font-weight: 800;
        }

        .j-collection-view {
          position: absolute;

          right: 14px;
          bottom: 14px;

          display: flex;
          align-items: center;
          gap: 8px;

          padding: 9px 12px;

          background: white;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: .08em;

          opacity: 0;
          transform: translateY(8px);

          transition:
            opacity .3s ease,
            transform .3s ease;
        }

        .j-collection-card:hover
        .j-collection-view {
          opacity: 1;
          transform: translateY(0);
        }

        .j-collection-info {
          padding-top: 16px;

          display: flex;
          justify-content: space-between;

          gap: 20px;

          border-top: 1px solid var(--black);
        }

        .j-collection-info h3 {
          margin: 0 0 8px;

          font-size: 24px;
          letter-spacing: -.035em;
        }

        .j-collection-info p {
          max-width: 270px;

          margin: 0;

          color: var(--muted);

          font-size: 12px;
          line-height: 1.45;
        }

        /* =========================================
           CRAFT
        ========================================= */

        .j-craft {
          background: var(--white);
        }

        .j-craft-grid {
          margin-top: 90px;

          display: grid;

          grid-template-columns:
            1.15fr
            .85fr;

          gap: 10vw;
        }

        .j-craft h2 {
          margin: 0;

          font-size:
            clamp(
              60px,
              8vw,
              125px
            );

          line-height: .82;
          letter-spacing: -.06em;
          font-weight: 900;
        }

        .j-craft-right {
          padding-top: 10px;
        }

        .j-craft-lead {
          max-width: 530px;

          margin: 0;

          font-size:
            clamp(
              19px,
              2vw,
              28px
            );

          line-height: 1.3;
        }

        .j-specs {
          margin-top: 90px;

          border-top: 1px solid var(--line);
        }

        .j-specs div {
          padding: 18px 0;

          display: flex;
          justify-content: space-between;

          gap: 20px;

          border-bottom: 1px solid var(--line);

          font-size: 10px;
          letter-spacing: .08em;
        }

        .j-specs span {
          color: var(--muted);
        }

        .j-specs strong {
          font-size: 10px;
          text-align: right;
        }

        /* =========================================
           COMMUNITY
        ========================================= */

        .j-community {
          background: var(--black);
          color: white;
        }

        .j-community-head {
          display: flex;

          justify-content: space-between;

          gap: 40px;
        }

        .j-community-head .j-eyebrow {
          color: #aaa;
        }

        .j-community-head h2 {
          margin: 0;

          text-align: right;

          font-size:
            clamp(
              55px,
              7vw,
              110px
            );

          line-height: .85;
          letter-spacing: -.06em;
          font-weight: 900;
        }

        .j-community-head h2 em {
          color: #777;
          font-style: normal;
        }

        .j-community-grid {
          margin-top: 100px;

          display: grid;

          grid-template-columns:
            1.5fr
            .65fr
            .85fr;

          gap: 18px;

          align-items: end;
        }

        .j-community-image {
          position: relative;

          aspect-ratio: 4 / 5;

          overflow: hidden;

          background: #202020;
        }

        .j-community-image img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .j-community-image span {
          position: absolute;

          top: 14px;
          left: 14px;

          font-size: 10px;
          font-weight: 700;
        }

        .j-community-copy {
          padding-bottom: 8px;
        }

        .j-community-copy p {
          margin: 0 0 60px;

          font-size:
            clamp(
              19px,
              2vw,
              28px
            );

          line-height: 1.25;
        }

        .j-community-mark {
          font-size: 10px;
          letter-spacing: .25em;
          color: #888;
        }

        /* =========================================
           STORY
        ========================================= */

        .j-story {
          background: var(--paper);
        }

        .j-timeline {
          margin-top: 90px;

          border-top: 1px solid var(--line);
        }

        .j-timeline-row {
          display: grid;

          grid-template-columns:
            70px
            1fr
            1.2fr;

          gap: 30px;

          padding: 38px 0;

          border-bottom: 1px solid var(--line);

          align-items: start;
        }

        .j-timeline-row > span {
          font-size: 10px;
          font-weight: 800;
        }

        .j-timeline-row h3 {
          margin: 0;

          font-size:
            clamp(
              25px,
              3vw,
              48px
            );

          letter-spacing: -.04em;
        }

        .j-timeline-row p {
          margin: 0;

          max-width: 430px;

          color: var(--muted);

          line-height: 1.5;
        }

        /* =========================================
           MANIFESTO
        ========================================= */

        .j-manifesto {
          min-height: 100svh;

          padding: 80px 25px;

          background: var(--red);

          color: white;

          display: flex;

          flex-direction: column;

          justify-content: center;

          align-items: center;

          text-align: center;
        }

        .j-manifesto-small {
          font-size: 10px;
          letter-spacing: .16em;
          font-weight: 800;
        }

        .j-manifesto h2 {
          margin: 55px 0;

          font-size:
            clamp(
              82px,
              16vw,
              250px
            );

          line-height: .75;
          letter-spacing: -.075em;
          font-weight: 900;
          text-transform: uppercase;
        }

        .j-manifesto h2 em {
          color: #f1c8c4;
          font-style: normal;
        }

        .j-manifesto-lines {
          display: flex;

          flex-wrap: wrap;

          justify-content: center;

          gap: 12px 28px;

          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        .j-manifesto strong {
          margin-top: 50px;

          font-size: 12px;
          letter-spacing: .2em;
        }

        /* =========================================
           FINAL CTA
        ========================================= */

        .j-final {
          min-height: 80vh;

          background: var(--white);

          display: flex;

          flex-direction: column;

          justify-content: space-between;
        }

        .j-final h2 {
          margin: 80px 0 0;

          font-size:
            clamp(
              60px,
              9vw,
              145px
            );

          line-height: .82;
          letter-spacing: -.065em;
          font-weight: 900;
        }

        .j-final-buttons {
          display: flex;

          gap: 12px;

          margin-top: 80px;
        }

        .j-button {
          min-height: 56px;

          min-width: 250px;

          padding: 0 24px;

          display: inline-flex;

          align-items: center;

          justify-content: space-between;

          gap: 40px;

          border: 1px solid var(--black);

          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;

          transition:
            transform .25s ease,
            background .25s ease,
            color .25s ease;
        }

        .j-button:hover {
          transform: translateY(-3px);
        }

        .j-button span {
          font-size: 17px;
        }

        .j-button-black {
          background: var(--black);
          color: white !important;
        }

        .j-button-white {
          background: white;
        }

        /* =========================================
           ANIMATION
        ========================================= */

        @keyframes jTitleIn {

          from {
            opacity: 0;
            transform: translateY(45px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 900px) {

          .j-intro-grid,
          .j-craft-grid {
            grid-template-columns: 1fr;
          }

          .j-section-heading,
          .j-collection-heading {
            grid-template-columns: 1fr;
          }

          .j-philosophy-row {
            grid-template-columns:
              45px
              1fr;

            gap: 15px;

            padding: 30px 0;
          }

          .j-philosophy-row p {
            grid-column: 2;
          }

          .j-philosophy-row .j-arrow {
            display: none;
          }

          .j-collection-card {
            grid-column: span 6;
          }

          .j-collection-card:nth-child(2),
          .j-collection-card:nth-child(5) {
            margin-top: 50px;
          }

          .j-community-head {
            display: block;
          }

          .j-community-head h2 {
            margin-top: 45px;
            text-align: left;
          }

          .j-community-grid {
            grid-template-columns: 1fr 1fr;
          }

          .j-community-large {
            grid-column: 1 / -1;
          }

          .j-community-copy {
            grid-column: 1;
          }

          .j-timeline-row {
            grid-template-columns:
              45px
              1fr;
          }

          .j-timeline-row p {
            grid-column: 2;
          }

        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {

          .j-hero {
            min-height: 78svh;
            padding-top: 20px;
          }

          .j-hero-top,
          .j-hero-bottom {
            font-size: 8px;
          }

          .j-hero-title {
            font-size:
              clamp(
                62px,
                20vw,
                110px
              );
          }

          .j-title-indent {
            margin-left: 12vw;
          }

          .j-section {
            padding:
              80px
              18px;
          }

          .j-intro-grid {
            margin-top: 55px;
          }

          .j-intro h2,
          .j-section-heading h2,
          .j-collection-heading h2,
          .j-craft h2,
          .j-community-head h2,
          .j-final h2 {
            font-size:
              clamp(
                48px,
                14vw,
                80px
              );
          }

          .j-intro-copy {
            font-size: 14px;
          }

          .j-philosophy-list,
          .j-collection-grid,
          .j-timeline {
            margin-top: 60px;
          }

          .j-image-container {
            height: 70svh;
          }

          .j-image-caption {
            left: 16px;
            right: 16px;
            bottom: 15px;

            font-size: 8px;
          }

          .j-collection-card,
          .j-collection-card:nth-child(2),
          .j-collection-card:nth-child(5) {
            grid-column: span 12;
            margin-top: 0;
          }

          .j-collection-card + .j-collection-card {
            margin-top: 50px;
          }

          .j-craft-right {
            padding-top: 20px;
          }

          .j-specs {
            margin-top: 60px;
          }

          .j-specs div {
            display: block;
          }

          .j-specs strong {
            display: block;

            margin-top: 7px;

            text-align: left;
          }

          .j-community-grid {
            grid-template-columns: 1fr;
          }

          .j-community-large,
          .j-community-copy {
            grid-column: auto;
          }

          .j-community-copy {
            padding: 25px 0;
          }

          .j-community-copy p {
            margin-bottom: 30px;
            font-size: 20px;
          }

          .j-manifesto {
            min-height: 78svh;
          }

          .j-manifesto h2 {
            font-size:
              clamp(
                68px,
                20vw,
                110px
              );

            margin: 45px 0;
          }

          .j-manifesto-lines {
            font-size: 8px;
            gap: 10px 14px;
          }

          .j-final {
            min-height: 70svh;
          }

          .j-final h2 {
            margin-top: 50px;
          }

          .j-final-buttons {
            flex-direction: column;
            margin-top: 50px;
          }

          .j-button {
            width: 100%;
          }

        }

        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {

          html {
            scroll-behavior: auto;
          }

          .jittok-about *,
          .jittok-about *::before,
          .jittok-about *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

          .j-reveal {
            opacity: 1;
            transform: none;
          }

        }

      `}</style>
    </>
  );
}