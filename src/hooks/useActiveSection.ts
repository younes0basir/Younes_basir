import { useEffect, useState } from "react";
import { SECTION_IDS } from "../lib/site.ts";

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );

    if (nodes.length === 0) {
      return;
    }

    const ratios = new Map<string, number>();

    const pickActive = () => {
      let next: string | null = null;
      let best = 0;

      for (const [id, ratio] of ratios) {
        if (ratio > best) {
          best = ratio;
          next = id;
        }
      }

      setActiveId(next);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        pickActive();
      },
      {
        rootMargin: "-22% 0px -48% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8],
      },
    );

    for (const node of nodes) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, []);

  return activeId;
}
