import type { OpenItem } from "@/content/copy";

const KIND = {
  verify: { code: "VERIFY", gloss: "Stale source — re-confirm" },
  supply: { code: "SUPPLY", gloss: "Client to provide" },
} as const;

/**
 * Renders an unresolved slot from the copy deck in place.
 *
 * Hidden unless annotation mode is on (see `[data-annotations]` in
 * globals.css), so the page reads clean for a normal viewer and reads as
 * a work-in-progress for whoever has to close the gaps.
 */
export function OpenSlot({
  item,
  tone = "light",
  className = "",
}: {
  item: OpenItem;
  /** `dark` swaps to the light oxide ramp for the ink-backed sections. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const { code, gloss } = KIND[item.kind];
  const body = tone === "dark" ? "text-oxide-light" : "text-oxide-deep";
  const chip =
    tone === "dark"
      ? "border-oxide-light/50 bg-oxide-light/10 text-oxide-light"
      // oxide-deep, not oxide: the chip's own 8% wash darkens the backdrop
      // enough that plain oxide lands at 4.22:1 on paper-deep.
      : "border-oxide/45 bg-oxide/8 text-oxide-deep";

  return (
    <p
      className={`open-item mt-3 flex flex-wrap items-start gap-x-2.5 gap-y-1 text-[0.8125rem] leading-relaxed ${body} ${className}`}
    >
      <span className={`label-tag mt-0.5 shrink-0 border px-1.5 py-1 ${chip}`}>{code}</span>
      <span className="min-w-0 flex-1">
        <span className="sr-only">{gloss}: </span>
        {item.note}
      </span>
    </p>
  );
}

/**
 * The em-dash stand-in for a figure the client owes. Deliberately not a
 * number — a plausible-looking placeholder is how estimates end up
 * shipping as facts.
 */
export function MissingFigure({ label }: { label: string }) {
  return (
    <span className="text-ink-faint">
      {/* Real text rather than aria-label: aria-label is prohibited on a
          span with no role, and screen readers ignore it there anyway. */}
      <span className="sr-only">{label}: figure not yet supplied</span>
      <span aria-hidden="true">——</span>
    </span>
  );
}
