"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { presence, type Plant } from "@/content/copy";

/**
 * Interactive India map.
 *
 * The boundary asset is /public/map/india.svg (amCharts free map pack —
 * verify boundary depiction is acceptable for an India-facing site
 * before production; disputed-territory rendering is a legal question,
 * not a design one). It is fetched once and inlined so state paths can
 * carry hover and click behaviour.
 *
 * Plant markers are buttons positioned as percentages of the map's
 * bounding box, colour-coded by state; clicking one opens a detail
 * popup. States that host plants are filled, filterable, and hoverable;
 * everything else stays quiet.
 */

/** Marker + state fill colour per state — a tint ramp of the accent. */
export const STATE_COLOR: Record<string, string> = {
  "Madhya Pradesh": "#5cb947",
  "Uttar Pradesh": "#9ed57c",
  Karnataka: "#d3ecc2",
};

const PLANT_STATES = Object.keys(STATE_COLOR);

export function IndiaMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (state: string | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(0.95);
  const [popup, setPopup] = useState<Plant | null>(null);

  // Fetch and inline the SVG once.
  useEffect(() => {
    let cancelled = false;
    fetch("/map/india.svg")
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        host.innerHTML = text;
        const svg = host.querySelector("svg");
        if (!svg) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("india-svg");
        const bb = (svg as unknown as SVGGraphicsElement).getBBox();
        svg.setAttribute("viewBox", `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        setAspect(bb.width / bb.height);

        svg.querySelectorAll("path").forEach((p) => {
          const title = p.getAttribute("title") ?? "";
          p.classList.add("india-state");
          if (PLANT_STATES.includes(title)) {
            p.classList.add("india-state-active");
            p.dataset.state = title;
            p.style.setProperty("--state-fill", STATE_COLOR[title]);
          }
        });
      })
      .catch(() => {
        // Missing asset → the section still works through the chips + list.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reflect filter selection onto the inlined paths.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.querySelectorAll<SVGPathElement>(".india-state-active").forEach((p) => {
      p.classList.toggle("is-muted", selected !== null && p.dataset.state !== selected);
    });
  }, [selected]);

  // Delegate clicks on plant states to the filter.
  const onHostClick = useCallback(
    (e: React.MouseEvent) => {
      const path = (e.target as Element).closest?.(".india-state-active");
      const state = path instanceof SVGPathElement ? path.dataset.state : undefined;
      if (state) onSelect(selected === state ? null : state);
    },
    [selected, onSelect],
  );

  // Close the popup on Escape.
  useEffect(() => {
    if (!popup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopup(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popup]);

  return (
    <div className="relative" style={{ aspectRatio: String(aspect) }}>
      {/* Inlined SVG lives here; clicks are delegated. */}
      <div ref={hostRef} onClick={onHostClick} className="absolute inset-0" />

      {/* Plant markers. */}
      {presence.plants.map((plant) => {
        const dimmed = selected !== null && selected !== plant.state;
        const open = popup?.id === plant.id;
        return (
          <button
            key={plant.id}
            type="button"
            onClick={() => setPopup(open ? null : plant)}
            aria-label={`${plant.name}, ${plant.state} — ${plant.type}`}
            aria-expanded={open}
            className="group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center transition-opacity duration-300"
            style={{
              left: `${plant.position.x}%`,
              top: `${plant.position.y}%`,
              opacity: dimmed ? 0.35 : 1,
            }}
          >
            {/* Idle pulse ring, pauses on hover so the target feels pinned. */}
            <span
              aria-hidden="true"
              className="absolute h-3.5 w-3.5 rounded-full opacity-60 [animation:map-pulse_2.6s_ease-out_infinite] group-hover:[animation-play-state:paused] motion-reduce:hidden"
              style={{ background: STATE_COLOR[plant.state] }}
            />
            <span
              className="relative block h-3.5 w-3.5 rounded-full border-2 border-white transition-transform duration-200 group-hover:scale-125"
              style={{ background: STATE_COLOR[plant.state] }}
            />
          </button>
        );
      })}

      {/* Detail popup, anchored to its marker. */}
      {popup ? (
        <div
          role="group"
          aria-label={`${popup.name} details`}
          className="rise-in absolute z-10 w-64 -translate-x-1/2 rounded-[var(--radius-md)] border border-white/20 bg-ink-deep/95 p-5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm"
          style={{
            left: `${clamp(popup.position.x, 18, 82)}%`,
            top: `${popup.position.y}%`,
            transform: `translate(-50%, ${popup.position.y > 55 ? "calc(-100% - 1.75rem)" : "1.75rem"})`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="display text-xl text-white">{popup.name}</h4>
              <p className="mt-1 flex items-center gap-2 text-xs text-paper-deep/70">
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: STATE_COLOR[popup.state] }}
                />
                {popup.state}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPopup(null)}
              aria-label="Close details"
              className="-mr-1 -mt-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full text-paper-deep/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <p className="label-tag mt-3 text-oxide-light">{popup.type}</p>
          <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-paper-deep/85">{popup.body}</p>
        </div>
      ) : null}
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
