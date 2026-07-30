"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hero, type Season } from "@/content/copy";

const SEASONS = hero.seasons;

/**
 * Section 01 — the seasons.
 *
 * Two builds of the same argument, chosen by `prefers-reduced-motion`:
 *
 *  - Default: a pinned stage with one scroll-height per season behind it.
 *    Scroll drives the active weather state; the headline never moves,
 *    only the stressor/answer caption swaps beneath it.
 *  - Reduced: no pinning, no crossfade, no scroll hijack — the four states
 *    are simply laid out as a grid. Same copy, same art slots, read in
 *    one pass.
 *
 * Both are in the DOM; the unused one is `display:none` and so is absent
 * from the accessibility tree. Neither is load-bearing for comprehension.
 */
export function Hero() {
  return (
    <section aria-label="Strong for every season. Responsible for the next.">
      <div className="motion-reduce:hidden">
        <PinnedSequence />
      </div>
      <div className="hidden motion-reduce:block">
        <StaticSequence />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PinnedSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(Math.max(-track.getBoundingClientRect().top / scrollable, 0), 1);
      const next = Math.min(Math.floor(progress * SEASONS.length), SEASONS.length - 1);
      setActive((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /** Tick buttons jump to the middle of a season's band in the track. */
  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const scrollable = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: track.offsetTop + (scrollable / SEASONS.length) * (index + 0.5),
      behavior: "smooth",
    });
  }, []);

  return (
    <div ref={trackRef} className="h-[500dvh]">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        {/* ---- Art plane. Four states, crossfaded. ---- */}
        <div className="absolute inset-0" aria-hidden="true">
          {SEASONS.map((s, i) => (
            <div
              key={s.id}
              className="art-slot absolute inset-0 border-0 transition-opacity duration-[900ms] ease-out"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <SeasonTint season={s} />
              <PlaceholderStamp season={s} />
            </div>
          ))}
          {/* Scrim. Keeps the copy legible once real photography lands. */}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-paper/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-paper/85 via-transparent to-transparent" />
        </div>

        {/* ---- Copy plane ---- */}
        <div className="shell relative flex h-full flex-col justify-between gap-8 py-8 md:py-12">
          <p className="label-tag text-ink-muted">{hero.eyebrow}</p>

          {/* No max-width on this wrapper: a `ch` limit here would resolve
              against the 16px body size, not the display size, and choke the
              headline to one word per line. The lines are explicit anyway. */}
          <div className="rise-in">
            <Headline />
            <p className="prose-body mt-7 max-w-[46ch]">{hero.subhead}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            {/* All four captions stay in the DOM so assistive tech reads the
                full set, not whichever frame happens to be up. */}
            <div className="relative min-h-[8rem]">
              {SEASONS.map((s, i) => (
                <figure
                  key={s.id}
                  className="absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "none" : "translateY(0.75rem)",
                  }}
                >
                  <Caption season={s} />
                </figure>
              ))}
            </div>

            <SeasonTicks active={active} onSelect={goTo} />
          </div>

          <p className="label-tag flex items-center gap-3 text-ink-faint">
            <span className="h-px w-10 bg-rule-strong" aria-hidden="true" />
            {hero.scrollCue}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StaticSequence() {
  return (
    <div className="shell py-16">
      <p className="label-tag text-ink-muted">{hero.eyebrow}</p>
      <div className="mt-10">
        <Headline />
      </div>
      <p className="prose-body mt-7 max-w-[52ch]">{hero.subhead}</p>

      <ul className="mt-14 grid gap-10 sm:grid-cols-2">
        {SEASONS.map((s) => (
          <li key={s.id}>
            <figure>
              <div className="art-slot aspect-[4/3]">
                <SeasonTint season={s} />
                <PlaceholderStamp season={s} />
              </div>
              <div className="mt-5">
                <Caption season={s} />
              </div>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Headline() {
  return (
    <h1 className="display text-[length:var(--text-mega)]">
      {hero.headline.map((line, i) => (
        <span key={line} className="block">
          {i === 1 ? <span className="italic text-oxide">{line}</span> : line}
        </span>
      ))}
    </h1>
  );
}

function Caption({ season }: { season: Season }) {
  return (
    <figcaption>
      {/* textTint, not tint — the saturated ramp fails 4.5:1 at this size. */}
      <span className="label-tag block" style={{ color: season.textTint }}>
        {season.name}
      </span>
      <p className="display mt-3 text-[length:var(--text-title)] text-ink">
        <span className="block text-ink-muted">{season.stressor}</span>
        <span className="block">{season.answer}</span>
      </p>
    </figcaption>
  );
}

function SeasonTint({ season }: { season: Season }) {
  return (
    <div
      className="absolute inset-0 mix-blend-multiply"
      style={{ backgroundColor: season.tint, opacity: 0.16 }}
      aria-hidden="true"
    />
  );
}

function SeasonTicks({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Weather states">
      <ul className="flex gap-1.5 sm:gap-2">
        {SEASONS.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "true" : undefined}
                className="group block cursor-pointer pt-4 pb-1 text-left"
              >
                <span className="sr-only">Jump to </span>
                <span
                  className="block h-0.5 w-14 transition-colors duration-500 sm:w-20"
                  style={{ backgroundColor: isActive ? s.tint : "var(--color-rule-strong)" }}
                />
                <span
                  className="label-tag mt-2.5 block transition-colors duration-500 group-hover:text-ink"
                  style={{ color: isActive ? "var(--color-ink)" : "var(--color-ink-faint)" }}
                >
                  {s.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Marks the frame as unfinished art so nobody signs it off by accident. */
function PlaceholderStamp({ season }: { season: Season }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="max-w-sm border border-rule-strong bg-paper/80 px-6 py-5 text-center backdrop-blur-sm">
        <p className="label-tag text-oxide">Art to be supplied</p>
        <p className="display mt-3 text-2xl text-ink">{season.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{season.artNote}</p>
      </div>
    </div>
  );
}
