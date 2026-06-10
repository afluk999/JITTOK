import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JITTOK",
  description: "Modern Essentials. Built for Everyday.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#f5f1eb" }}>
        {children}
      </body>
    </html>
  );
}