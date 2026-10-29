import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const font = (name: string) => () => ({ variable: `--font-${name}`, className: name });

vi.mock("next/font/google", () => ({
  Geist: font("geist"),
  Geist_Mono: font("geist-mono"),
  Anton: font("anton"),
  Inter: font("inter"),
  Caveat: font("caveat"),
}));

// jsdom has no matchMedia; ScrollTrigger touches it on import.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
    onchange: null,
  })) as unknown as typeof window.matchMedia;
}
