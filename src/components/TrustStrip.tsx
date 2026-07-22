import {
  BadgeCheck,
  MessageCircleMore,
  PackageCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

const WHATSAPP_NUMBER = "919605300701";

type TrustItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
};

const trustItems: TrustItem[] = [
  {
    title: "Quality Checked",
    description: "Every JITTOK piece is reviewed before dispatch.",
    icon: BadgeCheck,
  },
  {
    title: "Shipping Across India",
    description: "Orders are prepared carefully for nationwide delivery.",
    icon: Truck,
  },
  {
    title: "WhatsApp Support",
    description: "Get quick help with products, sizes and your order.",
    icon: MessageCircleMore,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    title: "Careful Packaging",
    description: "Your order is packed securely before it leaves us.",
    icon: PackageCheck,
  },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Why shop with JITTOK"
      style={{
        width: "100%",
        background: "#111111",
        color: "#ffffff",
        fontFamily: '"Outfit", sans-serif',
        padding: "0 22px",
      }}
    >
      <div
        style={{
          width: "min(1380px, 100%)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          borderLeft: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {trustItems.map((item) => {
          const Icon = item.icon;

          const content = (
            <>
              <span
                aria-hidden="true"
                style={{
                  width: "42px",
                  height: "42px",
                  flex: "0 0 auto",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} strokeWidth={1.7} />
              </span>

              <span style={{ minWidth: 0 }}>
                <strong
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </strong>

                <span
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.62)",
                    fontSize: "12px",
                    lineHeight: 1.55,
                  }}
                >
                  {item.description}
                </span>
              </span>
            </>
          );

          const sharedStyle = {
            minHeight: "152px",
            padding: "30px 26px",
            borderRight: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#ffffff",
            textDecoration: "none",
          } as const;

          return item.href ? (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title}: ${item.description}`}
              style={sharedStyle}
            >
              {content}
            </a>
          ) : (
            <div key={item.title} style={sharedStyle}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}