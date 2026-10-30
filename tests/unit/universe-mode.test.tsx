import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import {
  useUniverseMode,
  type UniverseMode,
} from "@/components/sections/universe/use-universe-mode";

function mockMatchMedia({
  reduced = false,
  narrow = false,
  coarse = false,
}: { reduced?: boolean; narrow?: boolean; coarse?: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion")
      ? reduced
      : query.includes("min-width")
        ? !narrow
        : query.includes("pointer: fine")
          ? !coarse
          : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("useUniverseMode", () => {
  it('returns "stacked-reduced" when reduced motion is preferred', () => {
    mockMatchMedia({ reduced: true });
    expect(renderHook(() => useUniverseMode()).result.current).toBe("stacked-reduced");
  });
  it('returns "stacked" when narrow', () => {
    mockMatchMedia({ narrow: true });
    expect(renderHook(() => useUniverseMode()).result.current).toBe("stacked");
  });
  it('returns "stacked" when pointer is coarse', () => {
    mockMatchMedia({ coarse: true });
    expect(renderHook(() => useUniverseMode()).result.current).toBe("stacked");
  });
  it('returns "universe" when wide, fine pointer, motion allowed', () => {
    mockMatchMedia({});
    expect(renderHook(() => useUniverseMode()).result.current).toBe("universe");
  });
  it('server snapshot is "stacked"', () => {
    mockMatchMedia({});
    function Show() {
      const m: UniverseMode = useUniverseMode();
      return <p>{m}</p>;
    }
    expect(renderToString(<Show />)).toContain("stacked");
  });
});
