"use client";

import { useRef, type ReactNode } from "react";

// Tilts toward the pointer on fine-pointer devices only.
export function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = () => window.matchMedia("(pointer: fine)").matches;
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={ref}
      className="transition-transform duration-200 will-change-transform"
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || !fine() || reduced()) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
