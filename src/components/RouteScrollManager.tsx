"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const frame = window.requestAnimationFrame(() => {
      if (window.location.hash) {
        const id = decodeURIComponent(
          window.location.hash.slice(1),
        );

        const target = document.getElementById(id);

        if (target) {
          target.scrollIntoView({
            behavior: "auto",
            block: "start",
          });

          return;
        }
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}