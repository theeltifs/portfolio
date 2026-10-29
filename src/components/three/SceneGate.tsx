"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { hasWebGL } from "@/lib/webgl";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const MIN_WIDTH = 768;

export function SceneGate({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
  const [lost, setLost] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setCapable(hasWebGL() && window.innerWidth >= MIN_WIDTH);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
