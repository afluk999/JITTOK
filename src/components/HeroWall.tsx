"use client";
import { useEffect, useState } from "react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { resolveHero, type HomePresentation } from "@/lib/homePresentation";
export default function HeroWall({ presentation, initialTime, preview = false }: { presentation: HomePresentation; initialTime: number; preview?: boolean }) {
  const [now, setNow] = useState(initialTime);
  useEffect(() => {
    if (preview) return;
    const interval = window.setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, [preview]);
  const hero = resolveHero(presentation, now);
  return <section className="home-hero" aria-label="JITTOK collection">
    <ResponsiveImage desktop={hero.desktop} mobile={hero.mobile} alt={hero.title || "JITTOK streetwear collection"} priority />
    <div className="home-hero-copy">
      {hero.title && <h1>{hero.title}</h1>}
    </div>
  </section>;
}
