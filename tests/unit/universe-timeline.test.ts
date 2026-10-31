import { describe, it, expect } from "vitest";
import {
  SEGMENT,
  activeIndexFor,
  segmentScrollTop,
  buildUniverseTimeline,
} from "@/components/sections/universe/universe-timeline";


const COLORS = ["#1fb5b0", "#6a3df0", "#2f5d3f", "#6b1e2e"];

function makeTargets() {
  const el = () => document.createElement("div");
  return {
    stage: el(),
    orb: el(),
    particles: Array.from({ length: 12 }, el),
    panels: Array.from({ length: 4 }, el),
  };
}

describe("pure helpers", () => {
  it("activeIndexFor clamps to 0..count-1", () => {
    expect(activeIndexFor(0, 4)).toBe(0);
    expect(activeIndexFor(0.25, 4)).toBe(1);
    expect(activeIndexFor(0.999, 4)).toBe(3);
    expect(activeIndexFor(1, 4)).toBe(3);
    expect(activeIndexFor(-0.1, 4)).toBe(0);
    expect(activeIndexFor(1.2, 4)).toBe(3);
  });
  it("SEGMENT fractions sum to 1", () => {
    const sum = Object.values(SEGMENT).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
  it("segmentScrollTop maps an index to its scroll position", () => {
    expect(segmentScrollTop(1000, 5000, 2, 4)).toBe(3000);
  });
});

describe("buildUniverseTimeline", () => {
  it("is paused with one labelled unit per project", () => {
    const tl = buildUniverseTimeline(makeTargets(), COLORS);
    expect(tl.paused()).toBe(true);
    expect(tl.duration()).toBe(4);
    [0, 1, 2, 3].forEach((i) => expect(tl.labels[`project-${i}`]).toBe(i));
  });
  it("recolours the stage to the next project colour", () => {
    const t = makeTargets();
    const tl = buildUniverseTimeline(t, COLORS);
    tl.time(1.2);
    expect(t.stage.style.getPropertyValue("--orb")).not.toBe(COLORS[0]);
    tl.time(3.9);
    expect(t.stage.style.getPropertyValue("--orb")).toBe(COLORS[3]);
  });

  it("shows the active panel and hides the others mid-hold", () => {
    const t = makeTargets();
    const tl = buildUniverseTimeline(t, COLORS);
    tl.progress(0.375);
    expect(Number(t.panels[1].style.opacity)).toBeGreaterThan(0.95);
    expect(Number(t.panels[0].style.opacity)).toBe(0);
  });
  it("starts hidden and is reversible", () => {
    const t = makeTargets();
    const tl = buildUniverseTimeline(t, COLORS);
    tl.progress(0);
    const snapshot = () => ({
      panels: t.panels.map((p) => p.style.opacity),
      orb: t.stage.style.getPropertyValue("--orb"),
      scale: t.orb.style.transform,
    });
    const before = snapshot();
    before.panels.forEach((o) => expect(Number(o)).toBe(0));
    expect(before.orb).toBe(COLORS[0]);
    tl.progress(0.9);
    tl.progress(0.4);
    tl.progress(0);
    expect(snapshot()).toEqual(before);
  });
});
