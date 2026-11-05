import { gsap } from "@/lib/motion/gsap";

export const SEGMENT = { approach: 0.08, fadeIn: 0.16, hold: 0.58, fadeOut: 0.18 } as const;

export type TimelineTargets = {
  panels: HTMLElement[];
};

export function activeIndexFor(progress: number, count: number): number {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

export function segmentScrollTop(start: number, end: number, index: number, count: number): number {
  return start + ((end - start) * index) / count;
}

const FADE_IN_AT = SEGMENT.approach;
const PANEL_TRAVEL = (panel: HTMLElement) => window.innerWidth / 2 + panel.offsetWidth / 2 + 32;

export function buildUniverseTimeline({ panels }: TimelineTargets): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  const noRender = { immediateRender: false } as const;

  tl.set(panels, { opacity: 0 }, 0);

  for (let i = 0; i < panels.length; i++) {
    const t0 = i;
    tl.addLabel(`project-${i}`, t0);
    tl.fromTo(
      panels[i],
      { x: () => PANEL_TRAVEL(panels[i]) },
      { x: () => -PANEL_TRAVEL(panels[i]), duration: 1, ease: "none", ...noRender },
      t0,
    );
    tl.fromTo(
      panels[i],
      { opacity: 0 },
      { opacity: 1, duration: SEGMENT.fadeIn, ease: "power2.out", ...noRender },
      t0 + FADE_IN_AT,
    );
    tl.to(panels[i], { opacity: 1, duration: SEGMENT.hold }, t0 + FADE_IN_AT + SEGMENT.fadeIn);
    tl.to(
      panels[i],
      { opacity: 0, duration: SEGMENT.fadeOut, ease: "power2.in" },
      t0 + 1 - SEGMENT.fadeOut,
    );
  }

  // Render once end-to-end so the time-0 initial state is applied before any scrub.
  tl.progress(1).progress(0);
  return tl;
}
