"use client";

import { useMemo, useState } from "react";
import { presence } from "@/content/copy";
import { IndiaMap, STATE_COLOR } from "@/components/ui/IndiaMap";

const STATES = [...new Set(presence.plants.map((p) => p.state))];

/**
 * Section 05 — presence. Deep Green, an interactive India map with plant
 * markers colour-coded by state. Chips and state shapes both filter;
 * clicking a marker opens a plant detail popup. The list mirrors the
 * map for keyboard and screen-reader users.
 */
export function Presence() {
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo(
    () => (selected ? presence.plants.filter((p) => p.state === selected) : presence.plants),
    [selected],
  );

  return (
    <section id="where" aria-labelledby="presence-heading" className="bg-ink text-paper-deep">
      <div className="shell py-24 md:py-40">
        <div className="editorial">
          <div className="label-tag flex items-baseline gap-3 text-white/60 lg:sticky lg:top-16 lg:self-start">
            <span className="numerals text-oxide-light">05</span>
            <span className="h-px w-6 bg-white/25 lg:hidden" aria-hidden="true" />
            <span>{presence.label}</span>
          </div>

          <div>
            <h2
              id="presence-heading"
              className="display reveal max-w-[16ch] text-[length:var(--text-display)] text-white"
            >
              {presence.headline.map((line, i) => (
                <span key={line} className={`block ${i === 1 ? "text-paper-deep/70" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>

            <p className="prose-body reveal mt-10 max-w-[58ch] text-paper-deep/85!">
              {presence.body}
            </p>

            <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-14">
              <div>
                <p className="label-tag text-white/60">{presence.mapPrompt}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <FilterChip active={selected === null} onClick={() => setSelected(null)}>
                    {presence.allLabel}
                  </FilterChip>
                  {STATES.map((state) => (
                    <FilterChip
                      key={state}
                      active={selected === state}
                      swatch={STATE_COLOR[state]}
                      onClick={() => setSelected(selected === state ? null : state)}
                    >
                      {state}
                    </FilterChip>
                  ))}
                </div>

                <div className="mt-8">
                  <IndiaMap selected={selected} onSelect={setSelected} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4 border-b border-white/20 pb-3">
                  <h3 className="label-tag text-white" aria-live="polite">
                    {selected ?? presence.allLabel}
                  </h3>
                  <p className="numerals text-xs text-white/50">
                    {visible.length} {visible.length === 1 ? "location" : "locations"}
                  </p>
                </div>

                <ul className="divide-y divide-white/15">
                  {visible.map((plant) => (
                    <li key={plant.id} className="group py-6 transition-colors duration-200">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span
                          aria-hidden="true"
                          className="inline-block h-2.5 w-2.5 self-center rounded-full transition-transform duration-200 group-hover:scale-125"
                          style={{ background: STATE_COLOR[plant.state] }}
                        />
                        <h4 className="display text-2xl text-white">{plant.name}</h4>
                        <span className="text-sm text-paper-deep/70">{plant.state}</span>
                      </div>
                      <p className="label-tag mt-3 text-oxide-light">{plant.type}</p>
                      <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-paper-deep/80">
                        {plant.body}
                      </p>
                    </li>
                  ))}
                </ul>
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

function FilterChip({
  active,
  swatch,
  onClick,
  children,
}: {
  active: boolean;
  swatch?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`label-tag inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 transition-colors duration-200 ${
        active
          ? "border-white bg-white text-ink"
          : "border-white/35 text-paper-deep/80 hover:border-white hover:text-white"
      }`}
    >
      {swatch ? (
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: swatch }}
        />
      ) : null}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

function MobileLab() {
  return (
    <div className="reveal mt-24 border-t border-white/25 pt-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h3 className="display max-w-[18ch] text-[length:var(--text-title)] text-white">
            {presence.lab.heading}
          </h3>
          <p className="prose-body mt-6 max-w-[54ch] text-[1rem]! text-paper-deep/80!">
            {presence.lab.body}
          </p>
        </div>
        <a
          href="#enquiry"
          className="group inline-flex min-h-14 items-center gap-3 self-start rounded-[var(--radius-md)] bg-white px-7 py-4 text-base font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-paper-deep hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] lg:self-end"
        >
          {presence.lab.cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
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
    <div className="reveal mt-16 rounded-[var(--radius-md)] bg-ink-deep/70 p-8 transition-colors duration-300 hover:bg-ink-deep md:p-10">
      <h3 className="display text-2xl text-white md:text-3xl">{presence.dealer.heading}</h3>
      <p className="prose-body mt-4 max-w-[58ch] text-[1rem]! text-paper-deep/80!">
        {presence.dealer.body}
      </p>
    </div>
  );
}
