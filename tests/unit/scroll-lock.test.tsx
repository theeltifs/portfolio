import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";

const lenis = vi.hoisted(() => ({ stop: vi.fn(), start: vi.fn() }));
vi.mock("lenis", () => ({
  default: class {
    on() {}
    raf() {}
    destroy() {}
    stop = lenis.stop;
    start = lenis.start;
  },
}));

import { SmoothScroll } from "@/components/providers/SmoothScroll";

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  delete document.documentElement.dataset.intro;
});

const tick = () => act(async () => void (await new Promise((r) => setTimeout(r, 0))));

describe("SmoothScroll during the intro", () => {
  it("stops Lenis when the intro is already up on mount", () => {
    document.documentElement.dataset.intro = "on";
    render(<SmoothScroll><p>x</p></SmoothScroll>);
    expect(lenis.stop).toHaveBeenCalled();
  });

  it("stops Lenis when the intro starts and restarts it when it ends", async () => {
    render(<SmoothScroll><p>x</p></SmoothScroll>);
    expect(lenis.stop).not.toHaveBeenCalled();
    document.documentElement.dataset.intro = "on";
    await tick();
    expect(lenis.stop).toHaveBeenCalledTimes(1);
    delete document.documentElement.dataset.intro;
    await tick();
    expect(lenis.start).toHaveBeenCalledTimes(1);
  });
});
