import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, renderHook, cleanup } from "@testing-library/react";

vi.mock("lenis", () => ({
  default: class {
    on() {}
    raf() {}
    destroy() {}
  },
}));

function mockMatchMedia(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  cleanup();
  document.documentElement.className = "";
});

describe("reduced motion", () => {
  it("useReducedMotion is true when the user prefers reduced motion", async () => {
    mockMatchMedia(true);
    const { useReducedMotion } = await import("@/lib/motion/use-reduced-motion");
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("SmoothScroll does not add lenis class when reduced", async () => {
    mockMatchMedia(true);
    const { SmoothScroll } = await import("@/components/providers/SmoothScroll");
    render(<SmoothScroll><p>x</p></SmoothScroll>);
    expect(document.documentElement.classList.contains("lenis")).toBe(false);
  });

  it("Reveal renders children visible when reduced", async () => {
    mockMatchMedia(true);
    const { Reveal } = await import("@/components/ui/Reveal");
    const { getByText } = render(<Reveal><p>visible</p></Reveal>);
    const wrapper = getByText("visible").parentElement!;
    expect(wrapper.style.opacity).not.toBe("0");
  });
});

describe("motion allowed", () => {
  it("SmoothScroll adds lenis class", async () => {
    mockMatchMedia(false);
    const { SmoothScroll } = await import("@/components/providers/SmoothScroll");
    render(<SmoothScroll><p>x</p></SmoothScroll>);
    expect(document.documentElement.classList.contains("lenis")).toBe(true);
  });
});
