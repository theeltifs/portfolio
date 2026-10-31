"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { hasWebGL } from "@/lib/webgl";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/** `minWidth` (px) turns the scene off below that viewport width; 0 keeps it on at every width. */
export function SceneGate({
  children,
  fallback,
  minWidth = 0,
}: {
  children: ReactNode;
  fallback: ReactNode;
  minWidth?: number;
}) {
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
  const [lost, setLost] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setCapable(hasWebGL() && window.innerWidth >= minWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [minWidth]);

  const enabled = capable && !reduced && !lost;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    // webglcontextlost does not bubble, so listen in the capture phase.
    const onLost = () => setLost(true);
    el.addEventListener("webglcontextlost", onLost, true);
    return () => el.removeEventListener("webglcontextlost", onLost, true);
  }, [enabled]);

  if (!enabled) return <>{fallback}</>;
  return (
    <div ref={ref} className="h-full w-full">
      {children}
    </div>
  );
}
