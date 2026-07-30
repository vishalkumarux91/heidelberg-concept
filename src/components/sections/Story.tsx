import { story } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionHead";
import { MissingFigure, OpenSlot } from "@/components/ui/OpenSlot";

/**
 * Section 03 — heritage as proof, not as headline.
 *
 * Measured register throughout: this is where institutional and technical
 * readers land, and where overclaiming does the most damage. The stat band
 * shows the two figures the client still owes as visible gaps rather than
 * quietly dropping the rows.
 */
export function Story() {
  return (
    <section id="who" aria-labelledby="story-heading" className="border-t border-rule">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <SectionLabel index="03">{story.label}</SectionLabel>

          <div>
            <h2
              id="story-heading"
              className="display reveal max-w-[20ch] text-[length:var(--text-display)]"
            >
              {story.headline.map((line, i) => (
                <span key={line} className="block">
                  {i === 1 ? <span className="italic text-oxide">{line}</span> : line}
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
      <ul className="grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {story.stats.map((stat) => (
          <li
            key={stat.label}
            className="reveal open-item-anchor flex flex-col justify-between bg-paper px-6 py-8"
          >
            <div>
              <p className="display numerals text-5xl leading-none md:text-6xl">
                {stat.figure ?? <MissingFigure label={stat.label} />}
              </p>
              <p className="mt-4 max-w-[24ch] text-[0.9375rem] leading-snug text-ink-soft">
                {stat.label}
              </p>
            </div>
            <p className="label-tag mt-6 text-ink-faint">{stat.status}</p>
            {stat.open ? <OpenSlot item={stat.open} /> : null}
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
        <span className="italic text-oxide">Green intent.</span>
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
              <li key={award.title} className="reveal py-5">
                <p className="text-[0.9375rem] font-medium leading-snug text-ink">{award.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{award.detail}</p>
              </li>
            ))}
          </ul>

          {/* Three quantified claims are withheld rather than estimated.
              Shown as named gaps so the omission is a decision, not an oversight. */}
          <div className="open-item-anchor mt-8 border border-dashed border-rule-strong bg-paper-deep/60 p-5">
            <p className="label-tag text-ink-muted">Held back pending data</p>
            <ul className="mt-4 space-y-2.5">
              {s.pending.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-rule-strong" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-ink-faint">{s.pendingNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
