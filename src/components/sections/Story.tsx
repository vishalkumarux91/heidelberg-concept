import { story } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionHead";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Section 03 — heritage as proof, not as headline. Sandy Grey.
 *
 * The stat band counts up on reveal; the dealer and homes figures are
 * illustrative concept numbers (see copy.ts) pending confirmed data.
 * Proof points carry imagery cropped from the hero masters so the
 * section stays in the same visual world.
 */
export function Story() {
  return (
    <section id="who" aria-labelledby="story-heading" className="bg-paper-deep">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <SectionLabel index="03">{story.label}</SectionLabel>

          <div>
            <h2
              id="story-heading"
              className="display reveal max-w-[20ch] text-[length:var(--text-display)]"
            >
              {story.headline.map((line, i) => (
                <span key={line} className={`block ${i === 1 ? "text-ink-muted" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>

            {/* Multi-column rather than a two-cell grid: three paragraphs in
                a grid leaves a hole in the second cell, columns balance. */}
            <div className="mt-12 max-w-[76ch] md:columns-2 md:gap-12">
              {story.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="prose-body mb-6 break-inside-avoid text-[1rem]! last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <StatBand />
            <Sustainability />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function StatBand() {
  return (
    <div className="mt-20">
      <ul className="grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {story.stats.map((stat) => (
          <li
            key={stat.label}
            className="reveal group relative isolate flex flex-col justify-between bg-paper px-6 py-8"
          >
            {/* `isolate` + the wash's negative z-index keep it above the
                card's own background but behind the figures. */}
            <span aria-hidden="true" className="stat-wash opacity-0 group-hover:opacity-100" />

            <div>
              <p className="display numerals text-5xl leading-none text-ink transition-colors duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:text-ink-deep md:text-6xl">
                <CountUp
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  plain={stat.plain}
                />
              </p>
              <p className="mt-4 max-w-[24ch] text-[0.9375rem] leading-snug text-ink-soft">
                {stat.label}
              </p>
            </div>
            <p className="label-tag mt-6 text-ink-faint">{stat.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Sustainability() {
  const { sustainability: s } = story;

  return (
    <div className="mt-24 border-t-2 border-ink pt-12">
      <h3 className="display text-[length:var(--text-title)]">
        <span className="text-ink-muted">Grey material. </span>
        <span className="text-ink">Green intent.</span>
      </h3>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-6">
          {s.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="prose-body reveal text-[1rem]!">
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
            <h4 className="label-tag text-ink">{s.proofHeading}</h4>
            <p className="text-xs text-ink-faint">{s.proofNote}</p>
          </div>

          <ul className="divide-y divide-rule">
            {s.awarded.map((award) => (
              <li key={award.title}>
                <div className="reveal group -mx-3 flex items-center gap-5 rounded-[var(--radius-sm)] px-3 py-5 transition-colors duration-200 hover:bg-paper">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={award.image}
                      alt={award.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className="text-[0.9375rem] font-medium leading-snug text-ink">
                      {award.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{award.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
