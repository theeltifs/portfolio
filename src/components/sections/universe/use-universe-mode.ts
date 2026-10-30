"use client";

import { useSyncExternalStore } from "react";

export type UniverseMode = "universe" | "stacked" | "stacked-reduced";

const REDUCED = "(prefers-reduced-motion: reduce)";
const WIDE = "(min-width: 768px)";
const FINE = "(pointer: fine)";

function subscribe(onChange: () => void) {
  const mqls = [REDUCED, WIDE, FINE].map((q) => window.matchMedia(q));
  mqls.forEach((m) => m.addEventListener("change", onChange));
  return () => mqls.forEach((m) => m.removeEventListener("change", onChange));
}

function getSnapshot(): UniverseMode {
  if (window.matchMedia(REDUCED).matches) return "stacked-reduced";
  if (window.matchMedia(WIDE).matches && window.matchMedia(FINE).matches) {
    return "universe";
  }
  return "stacked";
}

export function useUniverseMode(): UniverseMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => "stacked");
}
