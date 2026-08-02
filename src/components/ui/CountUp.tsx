"use client";

import { useEffect, useRef } from "react";

function format(
  v: number,
  { decimals = 0, plain = false }: { decimals?: number; plain?: boolean },
) {
  if (plain) return v.toFixed(decimals);
  return v.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counts a numeral up from zero the first time it scrolls into view.
 * Once per element, ease-out, tabular figures so nothing jitters.
 * Server-renders the final value, so no-JS and reduced-motion readers
 * simply see the number.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  plain = false,
  duration = 1400,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  plain?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = prefix + format(value * eased, { decimals, plain }) + suffix;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, prefix, suffix, plain, duration]);

  return (
    <span ref={ref} className="numerals">
      {prefix + format(value, { decimals, plain }) + suffix}
    </span>
  );
}
