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
