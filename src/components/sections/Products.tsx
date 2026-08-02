"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { products, type Product } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionHead";

/**
 * Section 04 — the range. White, and that is mandated, not aesthetic:
 * product bag imagery may only sit on white or pale backgrounds, never
 * dark or photographic ones (brand guide, packed products). It also
 * gives the page its breath of light between two Deep Green sections.
 *
 * Native scroll-snap does the carousel work: touch, trackpad and
 * keyboard all scroll the region without JS. Arrow buttons are an
 * enhancement on top.
 *
 * The bag renders are AI-generated placeholders for the concept — swap
 * /public/products/bag-<id>.jpg for supplied, unmodified photography.
 * Every card keeps an empty claim slot: cement is BIS-standardised, so
 * "premium" means nothing without the attribute behind it.
 */
export function Products() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setBounds({
      start: el.scrollLeft <= 4,
      end: max <= 4 || el.scrollLeft >= max - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({
      left: step * direction,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  return (
    <section id="range" aria-labelledby="products-heading" className="bg-paper">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <SectionLabel index="04">{products.label}</SectionLabel>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <h2
                  id="products-heading"
                  className="display reveal max-w-[14ch] text-[length:var(--text-display)] text-ink"
                >
                  {products.headline}
                </h2>
                <p className="prose-body reveal mt-7 max-w-[46ch]">{products.subhead}</p>
              </div>

              <div className="flex gap-2">
                <ArrowButton direction="prev" disabled={bounds.start} onClick={() => nudge(-1)} />
                <ArrowButton direction="next" disabled={bounds.end} onClick={() => nudge(1)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breaks the shell deliberately: the range runs off the right edge to
          signal there is more than fits. The scroll region is a div wrapping
          the ul — role="region" on a <ul> would orphan every <li> from the
          accessibility tree. */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Mycem product range, scrollable"
        className="snap-x snap-mandatory overflow-x-auto scroll-px-[var(--gutter)] [scrollbar-width:thin]"
      >
        <ul className="flex gap-6 px-[var(--gutter)] pb-24 md:pb-32">
          {products.items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </ul>
      </div>

      <div className="shell border-t border-rule py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="text-lg text-ink-soft">{products.footer.question}</p>
          <a
            href="#enquiry"
            className="group inline-flex min-h-11 items-center gap-3 text-lg font-semibold text-ink underline decoration-oxide-light decoration-2 underline-offset-[6px] transition-colors hover:text-oxide"
          >
            {products.footer.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imgOk, setImgOk] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // A pre-hydration load error never reaches onError; re-check on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setImgOk(false);
  }, []);

  return (
    <li className="w-[80vw] max-w-[24rem] shrink-0 snap-start sm:w-[22rem]">
      <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_rgba(0,47,26,0.3)]">
        {/* Bag on a pale ground — white or Sandy Grey only, unmodified. */}
        <div className="relative aspect-[3/4] overflow-hidden border-b border-rule bg-paper-sunk">
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={`/products/bag-${product.id}.jpg`}
              alt={`${product.name} cement bag — placeholder render`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div>
                <p className="label-tag text-ink-muted">Bag shot to be supplied</p>
                <p className="display mt-3 text-2xl text-ink">{product.name}</p>
              </div>
            </div>
          )}
          <span className="label-tag numerals absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1.5 text-ink-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="display text-2xl text-ink">{product.name}</h3>
          <p className="mt-2 text-base font-semibold text-ink-soft">{product.role}</p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{product.body}</p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
            {product.tags.map((tag) => (
              <li
                key={tag}
                className="label-tag rounded-full border border-rule-strong px-3 py-2 text-ink-soft transition-colors duration-200 group-hover:border-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous product" : "Next product"}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-rule-strong text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-rule-strong disabled:hover:bg-transparent disabled:hover:text-ink"
    >
      <span aria-hidden="true" className="text-lg">
        {direction === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}
