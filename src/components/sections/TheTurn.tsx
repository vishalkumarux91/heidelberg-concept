import { theTurn } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionHead";

/**
 * Section 02 — where the page stops being scenery and starts being an
 * argument. Deliberately typographic: no imagery competes with the claim.
 */
export function TheTurn() {
  return (
    <section id="why" aria-labelledby="turn-heading" className="border-t border-rule bg-paper-deep">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <SectionLabel index="02">{theTurn.label}</SectionLabel>

          <div>
            <h2
              id="turn-heading"
              className="display reveal max-w-[16ch] text-[length:var(--text-display)]"
            >
              {theTurn.headline}
            </h2>

            <div className="mt-12 max-w-[58ch] space-y-6">
              {theTurn.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="prose-body reveal">
                  {paragraph}
                </p>
              ))}
            </div>

            <ol className="mt-20 grid gap-px border border-rule bg-rule sm:grid-cols-3">
              {theTurn.demands.map((demand, i) => (
                <li key={demand.id} className="reveal bg-paper-deep p-7 md:p-9">
                  <p className="label-tag numerals text-oxide">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display mt-6 text-3xl md:text-4xl">{demand.title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {demand.body}
                  </p>
                </li>
              ))}
            </ol>

            <p className="display reveal mt-20 max-w-[24ch] text-[length:var(--text-title)] text-ink-muted">
              {theTurn.transition}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
