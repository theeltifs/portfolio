import type { ReactNode } from "react";

export function TechChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-fg/15 bg-fg/5 px-3 py-1 text-xs text-muted">
      {children}
    </span>
  );
}
