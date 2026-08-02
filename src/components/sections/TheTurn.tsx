import { Fragment } from "react";
import { theTurn } from "@/content/copy";

/**
 * Section 02 — the turn. Deep Green. One large statement, then the three
 * demands as a scroll-driven card *pile*: each poster card pins near the
 * top of the viewport and stays pinned while the next one slides up and
 * covers it, so the cards accumulate into a physical stack with a sliver
 * of every earlier card still showing above the front one. Native
 * `position: sticky` only — no scroll-jacking, no JS scroll listener.
 *
 * Two structural rules keep this working; both are load-bearing.
 *
 * 1. All three cards are direct children of ONE containing block (the
 *    `role="list"` wrapper). A sticky element is released as soon as its
 *    own containing block ends, so per-card wrappers would pop card 1
 *    off the top before card 2 ever arrived — no pile, just a relay.
 *    Sharing the block is what lets the earlier cards hold their place.
 *
 * 2. The scroll runway between cards is a real sibling spacer block, not
 *    `padding-bottom`. In this stack a padding-based runway silently
 *    breaks the sticky clamp — the card scrolls straight past its `top`
 *    and never pins (verified empirically; an explicit spacer always
 *    works). Do not "simplify" these spacers back into padding.
 *
 * Imagery is cropped from the hero masters, so the section quotes the
 * same world the weather sequence just built.
 */

/** Pile geometry: where the first card pins, and how far each later card
 *  sits below it. The gap is the visible sliver of each earlier card. */
const PIN_TOP = 88;
const PIN_STEP = 14;

export function TheTurn() {
  return (
    <section id="why" aria-labelledby="turn-heading" className="bg-ink text-paper-deep">
      <div className="shell py-24 md:py-40">
        <div className="editorial">
          <div className="label-tag flex items-baseline gap-3 text-white/60 lg:sticky lg:top-16 lg:self-start">
            <span className="numerals text-oxide-light">02</span>
            <span className="h-px w-6 bg-white/25 lg:hidden" aria-hidden="true" />
            <span>{theTurn.label}</span>
          </div>

          <div>
            <h2
              id="turn-heading"
              className="display reveal max-w-[16ch] text-[length:var(--text-display)] text-white"
            >
              {theTurn.headline}
            </h2>

            <div className="mt-12 max-w-[58ch] space-y-6">
              {theTurn.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="prose-body reveal text-paper-deep/85!">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* The pile. Spacers are aria-hidden, so the accessibility tree
                sees a clean list of three items. */}
            <div role="list" className="relative mt-24 md:mt-32">
              {theTurn.demands.map((demand, i, arr) => (
                <Fragment key={demand.id}>
                  <div
                    role="listitem"
                    className="sticky motion-reduce:static"
                    style={{ top: `${PIN_TOP + i * PIN_STEP}px`, zIndex: i + 1 }}
                  >
                    {/* The ring is what separates one card from the next
                        where they overlap — without it the pile reads as a
                        single image against dark artwork. */}
                    <article className="group reveal relative overflow-hidden rounded-[var(--radius-lg)] shadow-[0_-2px_0_0_rgba(255,255,255,0.14),0_40px_90px_-28px_rgba(0,0,0,0.75)] ring-1 ring-white/20">
                      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[21/9]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={demand.image}
                          alt={demand.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,20,10,0.88)_0%,rgba(0,20,10,0.42)_36%,transparent_64%)]" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 lg:p-12">
                        <p className="label-tag numerals text-oxide-light">
                          {String(i + 1).padStart(2, "0")}
                          <span className="text-white/40">
                            {" "}
                            / {String(arr.length).padStart(2, "0")}
                          </span>
                        </p>
                        <h3 className="display mt-4 text-3xl text-white md:text-4xl lg:text-5xl">
                          {demand.title}
                        </h3>
                        <p className="prose-body mt-4 max-w-[46ch] text-[1rem]! text-paper-deep/90! md:text-[1.0625rem]!">
                          {demand.body}
                        </p>
                      </div>
                    </article>
                  </div>

                  {/* Runway: how long this card holds the front of the pile
                      before the next one covers it. Collapsed under reduced
                      motion, where the cards simply read as a plain list. */}
                  {i < arr.length - 1 ? (
                    <div aria-hidden="true" className="h-[52vh] motion-reduce:hidden" />
                  ) : null}
                </Fragment>
              ))}

              {/* Lets the finished pile hold for a beat before it scrolls
                  away — without it the last card has no sticky range at all. */}
              <div aria-hidden="true" className="h-[34vh] motion-reduce:hidden" />
            </div>

            <p className="display reveal mt-20 max-w-[26ch] text-[length:var(--text-title)] text-white/70">
              {theTurn.transition}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
