"use client";

const INSTAGRAM_URL = "https://www.instagram.com/YOUR_USERNAME/";

const WHATSAPP_NUMBER = "91XXXXXXXXXX";

const WHATSAPP_MESSAGE =
  "Hi JITTOK, I would like to know more about your products.";

export default function FloatingSocialButtons() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <div className="floating-socials" aria-label="JITTOK social links">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-button instagram-button"
        aria-label="Open JITTOK on Instagram"
      >
        <InstagramIcon />

        <span className="social-tooltip">Instagram</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="social-button whatsapp-button"
        aria-label="Chat with JITTOK on WhatsApp"
      >
        <WhatsAppIcon />

        <span className="social-tooltip">WhatsApp</span>
      </a>

      <style jsx>{`
        .floating-socials {
          position: fixed;
          right: max(18px, env(safe-area-inset-right));
          bottom: max(22px, env(safe-area-inset-bottom));
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }

        .social-button {
          position: relative;
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          color: #111111;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(17, 17, 17, 0.13);
          border-radius: 15px;
          box-shadow:
            0 10px 30px rgba(17, 17, 17, 0.13),
            0 2px 8px rgba(17, 17, 17, 0.07);
          text-decoration: none;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          pointer-events: auto;
          transition:
            transform 220ms ease,
            color 220ms ease,
            background 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .social-button :global(svg) {
          width: 21px;
          height: 21px;
          flex-shrink: 0;
        }

        .social-button:hover {
          color: #ffffff;
          transform: translateY(-3px);
          border-color: transparent;
          box-shadow:
            0 14px 34px rgba(17, 17, 17, 0.19),
            0 4px 10px rgba(17, 17, 17, 0.09);
        }

        .instagram-button:hover {
          background: linear-gradient(
            135deg,
            #833ab4 0%,
            #fd1d1d 52%,
            #fcb045 100%
          );
        }

        .whatsapp-button:hover {
          background: #25d366;
        }

        .social-tooltip {
          position: absolute;
          top: 50%;
          right: calc(100% + 10px);
          display: flex;
          height: 30px;
          align-items: center;
          padding: 0 10px;
          color: #ffffff;
          background: #111111;
          border-radius: 7px;
          font-family: "Outfit", sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transform: translate(8px, -50%);
          transition:
            opacity 180ms ease,
            transform 180ms ease;
        }

        .social-tooltip::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 100%;
          border-width: 5px 0 5px 5px;
          border-style: solid;
          border-color: transparent transparent transparent #111111;
          transform: translateY(-50%);
        }

        .social-button:hover .social-tooltip {
          opacity: 1;
          transform: translate(0, -50%);
        }

        @media (max-width: 768px) {
          .floating-socials {
            right: max(12px, env(safe-area-inset-right));
            bottom: max(14px, env(safe-area-inset-bottom));
            flex-direction: row;
            gap: 8px;
          }

          .social-button {
            width: 43px;
            height: 43px;
            border-radius: 13px;
          }

          .social-button :global(svg) {
            width: 19px;
            height: 19px;
          }

          .social-tooltip {
            display: none;
          }
        }

        @media (max-width: 380px) {
          .social-button {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .social-button :global(svg) {
            width: 18px;
            height: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .social-button,
          .social-tooltip {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.9"
      />

      <circle
        cx="12"
        cy="12"
        r="4.1"
        stroke="currentColor"
        strokeWidth="1.9"
      />

      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.75a8.45 8.45 0 0 1-12.47 7.43L3.5 20.5l1.35-4.38A8.45 8.45 0 1 1 20.5 11.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8.2 7.65c.2-.47.42-.48.64-.49h.54c.17 0 .45.06.69.58.24.51.82 1.99.89 2.13.08.14.13.31.03.49-.1.18-.15.29-.3.45-.15.16-.31.35-.45.47-.15.14-.3.29-.13.57.17.28.75 1.23 1.61 1.99 1.1.98 2.03 1.28 2.31 1.42.28.14.45.12.62-.07.17-.2.72-.84.91-1.13.19-.29.39-.24.65-.14.27.09 1.69.79 1.98.94.29.14.48.21.55.33.07.12.07.69-.16 1.36-.23.67-1.36 1.28-1.87 1.36-.48.08-1.09.12-1.76-.09-.41-.13-.94-.3-1.62-.59-.28-.12-4.91-1.82-6.67-6.22-.5-1.25-.06-2.3.36-2.75.11-.12.17-.2.23-.31Z"
        fill="currentColor"
      />
    </svg>
  );
}