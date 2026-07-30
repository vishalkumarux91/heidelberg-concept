"use client";

import { useMemo, useState } from "react";
import { presence } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionHead";
import { OpenSlot } from "@/components/ui/OpenSlot";

const STATES = [...new Set(presence.plants.map((p) => p.state))];

/**
 * Section 05 — presence.
 *
 * The selection mechanic, filtering and marker placement are all live.
 * What is missing is only the base map: an India outline has deliberately
 * not been drawn or approximated here, because an inaccurate national
 * boundary on an India-facing site is a legal and reputational exposure,
 * not a design detail. The frame below is the real coordinate space, so
 * dropping in a licensed, boundary-accurate asset needs no repositioning.
 */
export function Presence() {
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo(
    () => (selected ? presence.plants.filter((p) => p.state === selected) : presence.plants),
    [selected],
  );

  return (
    <section id="where" aria-labelledby="presence-heading" className="border-t border-rule">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <SectionLabel index="05">{presence.label}</SectionLabel>

          <div>
            <h2
              id="presence-heading"
              className="display reveal max-w-[16ch] text-[length:var(--text-display)]"
            >
              {presence.headline.map((line, i) => (
                <span key={line} className="block">
                  {i === 1 ? <span className="italic text-oxide">{line}</span> : line}
                </span>
              ))}
            </h2>

            <p className="prose-body reveal mt-10 max-w-[58ch]">{presence.body}</p>

            <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
              <MapFrame selected={selected} onSelect={setSelected} />

              <div>
                <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
                  <h3 className="label-tag text-ink">
                    {selected ?? presence.allLabel}
                  </h3>
                  <p className="numerals text-xs text-ink-faint">
                    {visible.length} {visible.length === 1 ? "location" : "locations"}
                  </p>
                </div>

                <ul className="divide-y divide-rule">
                  {visible.map((plant) => (
                    <li key={plant.id} className="py-6">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="display text-2xl">{plant.name}</h4>
                        <span className="text-sm text-ink-muted">{plant.state}</span>
                      </div>
                      <p className="label-tag mt-3 text-oxide">{plant.type}</p>
                      <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                        {plant.body}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="open-item-anchor mt-6">
                  <OpenSlot item={presence.plantsOpen} />
                </div>
              </div>
            </div>

            <MobileLab />
            <DealerNote />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function MapFrame({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (state: string | null) => void;
}) {
  return (
    <div>
      <p className="label-tag text-ink-muted">{presence.mapPrompt}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <FilterChip active={selected === null} onClick={() => onSelect(null)}>
          {presence.allLabel}
        </FilterChip>
        {STATES.map((state) => (
          <FilterChip key={state} active={selected === state} onClick={() => onSelect(state)}>
            {state}
          </FilterChip>
        ))}
      </div>

      {/* Coordinate space for the real map. Markers are positioned as
          percentages of this frame, so the licensed outline drops straight in. */}
      <div className="art-slot open-item-anchor mt-6 aspect-[4/5]">
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="max-w-xs border border-rule-strong bg-paper/85 px-5 py-4 text-center backdrop-blur-sm">
            <p className="label-tag text-oxide">Base map to be supplied</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Boundary-accurate India outline, licensed or officially sourced. Not approximated
              here on purpose.
            </p>
          </div>
        </div>

        {presence.plants.map((plant) => {
          const isActive = selected === null || selected === plant.state;
          return (
            <span
              key={plant.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
              style={{
                left: `${plant.position.x}%`,
                top: `${plant.position.y}%`,
                opacity: isActive ? 1 : 0.25,
              }}
            >
              <span className="relative block h-3 w-3 rounded-full border-2 border-paper bg-oxide shadow-sm" />
              <span className="label-tag absolute left-5 top-0 whitespace-nowrap text-ink">
                {plant.name}
              </span>
            </span>
          );
        })}
      </div>

      <OpenSlot item={presence.mapOpen} />
      <OpenSlot item={presence.dealerDataOpen} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`label-tag cursor-pointer border px-3 py-2 transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule-strong text-ink-muted hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

function MobileLab() {
  return (
    <div className="reveal mt-24 border-t-2 border-ink pt-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h3 className="display max-w-[18ch] text-[length:var(--text-title)]">
            {presence.lab.heading}
          </h3>
          <p className="prose-body mt-6 max-w-[54ch] text-[1rem]!">{presence.lab.body}</p>
        </div>
        <a
          href="#enquiry"
          className="group inline-flex items-center gap-3 self-start border border-ink px-6 py-4 text-base transition-colors hover:bg-ink hover:text-paper lg:self-end"
        >
          {presence.lab.cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>
    </div>
  );
}

function DealerNote() {
  return (
    <div className="reveal mt-16 bg-paper-deep p-8 md:p-10">
      <h3 className="display text-3xl">{presence.dealer.heading}</h3>
      <p className="prose-body mt-4 max-w-[58ch] text-[1rem]!">{presence.dealer.body}</p>
    </div>
  );
}
