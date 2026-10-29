import type { ReactNode } from "react";

export function TechChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted">
      {children}
    </span>
  );
}
