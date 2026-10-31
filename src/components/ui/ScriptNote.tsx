import type { ReactNode } from "react";

export function ScriptNote({
  children,
  rotate = -4,
  className = "",
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block font-script text-2xl text-fg/90 ${className}`}
    >
      {children}
    </span>
  );
}
