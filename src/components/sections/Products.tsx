"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { products, type Product } from "@/content/copy";
import { OpenSlot } from "@/components/ui/OpenSlot";

/**
 * Section 04 — the range.
 *
 * Native scroll-snap does the work: touch, trackpad and keyboard all
 * scroll the region without JS. The arrow buttons are an enhancement on
 * top, and the region carries `tabIndex` so it stays reachable by keyboard
 * when it overflows.
 *
 * Every card has an empty claim slot. Cement is BIS-standardised, so
 * "premium" means nothing without the attribute behind it — the slots stay
 * visibly empty until the technical team fills them.
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
    <section id="range" aria-labelledby="products-heading" className="border-t border-rule bg-ink text-paper">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <div className="label-tag flex items-baseline gap-3 text-paper/75 lg:sticky lg:top-16 lg:self-start">
            <span className="numerals text-oxide-light">04</span>
            <span className="h-px w-6 bg-paper/25 lg:hidden" aria-hidden="true" />
            <span>{products.label}</span>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <h2
                  id="products-heading"
                  className="display max-w-[14ch] text-[length:var(--text-display)]"
                >
                  {products.headline}
                </h2>
                <p className="prose-body mt-7 max-w-[46ch] text-paper/80!">{products.subhead}</p>
              </div>

              <div className="flex gap-2">
                <ArrowButton
                  direction="prev"
                  disabled={bounds.start}
                  onClick={() => nudge(-1)}
                />
                <ArrowButton direction="next" disabled={bounds.end} onClick={() => nudge(1)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breaks the shell deliberately: the range runs off the right edge to
          signal there is more than fits.

          The scroll region is a div wrapping the ul, not the ul itself —
          role="region" on a <ul> overrides its implicit list role and orphans
          every <li> from the accessibility tree.

          scroll-px matters here too: without it the snapport starts at the
          padding box and mandatory snapping yanks the first card flush to the
          viewport edge, eating the gutter. */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label="Mycem product range, scrollable"
        className="snap-x snap-mandatory overflow-x-auto scroll-px-[var(--gutter)] [scrollbar-width:thin]"
      >
        <ul className="flex gap-6 px-[var(--gutter)] pb-24 md:pb-36">
          {products.items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </ul>
      </div>

      <div className="shell border-t border-paper/15 py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="text-lg text-paper/80">{products.footer.question}</p>
          <a
            href="#enquiry"
            className="group inline-flex items-center gap-3 text-lg text-paper underline decoration-oxide decoration-2 underline-offset-[6px] transition-colors hover:text-oxide-light"
          >
            {products.footer.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
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
  return (
    <li className="w-[80vw] max-w-[24rem] shrink-0 snap-start sm:w-[22rem]">
      <article className="flex h-full flex-col border border-paper/20 bg-paper/[0.04]">
        {/* Bag shot. Portrait, roughly the proportion of a 50kg sack. */}
        <div className="art-slot aspect-[3/4] border-0 border-b border-paper/20 bg-paper/8 [background-image:repeating-linear-gradient(-45deg,transparent_0_11px,rgba(242,239,232,0.09)_11px_12px)]">
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="label-tag text-oxide-light">Bag shot to be supplied</p>
              <p className="display mt-3 text-2xl text-paper">{product.name}</p>
            </div>
          </div>
          <span className="label-tag numerals absolute left-4 top-4 text-paper/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="display text-3xl text-paper">{product.name}</h3>
          <p className="mt-2 text-base text-oxide-light">{product.role}</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-paper/80">{product.body}</p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <li
                key={tag}
                className="label-tag border border-paper/30 px-2.5 py-1.5 text-paper/80"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="open-item-anchor mt-auto pt-6">
            <div className="border-t border-dashed border-paper/25 pt-4">
              <p className="label-tag text-paper/70">Technical claim</p>
              <p className="mt-2 text-sm text-paper/70">Awaiting attribute and test basis</p>
              <OpenSlot item={product.claim} tone="dark" />
            </div>
          </div>
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
      className="grid h-12 w-12 place-items-center border border-paper/40 text-paper transition-colors hover:border-oxide-light hover:bg-oxide-light hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-paper/40 disabled:hover:bg-transparent disabled:hover:text-paper"
    >
      <span aria-hidden="true" className="text-lg">
        {direction === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}
