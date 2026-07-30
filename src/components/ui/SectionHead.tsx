import type { ReactNode } from "react";

/**
 * Section label sits in the left margin on wide screens, marginalia-style,
 * and stacks above the headline when the editorial grid collapses.
 */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="label-tag flex items-baseline gap-3 text-ink-muted lg:sticky lg:top-16 lg:self-start">
      <span className="numerals text-oxide">{index}</span>
      <span className="h-px w-6 bg-rule-strong lg:hidden" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-rule ${className}`} />;
}
