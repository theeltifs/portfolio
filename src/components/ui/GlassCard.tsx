import type { ReactNode } from "react";
import type { AccentKey } from "@/content/types";

export function GlassCard({
  accent,
  className = "",
  children,
}: {
  accent?: AccentKey;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-accent={accent}
      className={`glass-card rounded-2xl border border-fg/10 bg-glass backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
