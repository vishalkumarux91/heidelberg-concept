"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { openItemsSummary } from "@/content/copy";
import {
  getAnnotations,
  getServerAnnotations,
  setAnnotations,
  subscribeAnnotations,
} from "@/lib/annotations";

/**
 * Concept-review affordance, not a production component.
 *
 * Flips `data-annotations` on <html>, which reveals every [VERIFY] and
 * [SUPPLY] slot in place (see globals.css). The point is that the client
 * sees what is unresolved *where it sits on the page*, rather than in a
 * separate list nobody cross-references. Delete this component and its two
 * CSS rules when the deck's open items are closed.
 */
export function ReviewBar() {
  const [expanded, setExpanded] = useState(false);
  const on = useSyncExternalStore(
    subscribeAnnotations,
    getAnnotations,
    getServerAnnotations,
  );

  // Sync the one external system this owns: the attribute the CSS reads.
  useEffect(() => {
    document.documentElement.dataset.annotations = on ? "on" : "off";
  }, [on]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 print:hidden">
      <div className="pointer-events-auto max-w-[calc(100vw-2rem)] border border-ink bg-ink text-paper shadow-lg">
        {expanded ? (
          <div className="max-h-[60dvh] overflow-y-auto border-b border-paper/20 p-5">
            <p className="label-tag text-paper/50">Open items, in priority order</p>
            <ol className="mt-4 space-y-2.5">
              {openItemsSummary.map((item, i) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-paper/85">
                  <span className="numerals shrink-0 text-oxide">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="flex items-stretch divide-x divide-paper/20">
          <button
            type="button"
            onClick={() => setAnnotations(!on)}
            aria-pressed={on}
            className="label-tag flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors hover:bg-paper/10"
          >
            <span
              aria-hidden="true"
              className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                on ? "bg-oxide" : "bg-paper/30"
              }`}
            />
            Show open items
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="label-tag cursor-pointer px-5 py-4 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            {expanded ? "Hide list" : `List (${openItemsSummary.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
