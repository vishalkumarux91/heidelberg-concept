"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global motion plumbing. Renders nothing.
 *
 * - Lenis drives window scroll; GSAP's ticker drives Lenis so the two
 *   never fight (the classic bug in this stack is double-RAF).
 * - ScrollTrigger listens to Lenis for updates.
 * - `.reveal` elements get a one-shot IntersectionObserver rise:
 *   `html[data-motion="on"]` arms the hidden state (so no-JS readers
 *   see everything), `.is-in` releases it. Never re-triggers.
 * - Under prefers-reduced-motion the whole file is a no-op: no Lenis,
 *   no hidden content — smooth scroll is itself a motion effect.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    document.documentElement.dataset.motion = "on";

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Stagger siblings that reveal together: index within parent.
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const byParent = new Map<HTMLElement | null, number>();
    for (const el of targets) {
      const parent = el.parentElement;
      const i = byParent.get(parent) ?? 0;
      el.style.setProperty("--reveal-i", String(i));
      byParent.set(parent, i + 1);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      delete document.documentElement.dataset.motion;
      io.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
