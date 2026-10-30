import { gsap } from "@/lib/motion/gsap";
import { ORB_PARTICLES } from "./Orb";

export const SEGMENT = { expand: 0.2, burst: 0.1, reveal: 0.2, hold: 0.3, collapse: 0.2 } as const;

export type TimelineTargets = {
  stage: HTMLElement;
  orb: HTMLElement;
  particles: HTMLElement[];
  panels: HTMLElement[];
};

export function activeIndexFor(progress: number, count: number): number {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

export function segmentScrollTop(start: number, end: number, index: number, count: number): number {
  return start + ((end - start) * index) / count;
}

const PANEL_SHIFT = 24;
const RECOLOUR_AT = SEGMENT.expand + SEGMENT.burst + SEGMENT.reveal + SEGMENT.hold; // 0.8
const RECOLOUR_LEN = 0.3;

export function buildUniverseTimeline(
  { stage, orb, particles, panels }: TimelineTargets,
  colors: string[],
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  const noRender = { immediateRender: false } as const;

  tl.set(stage, { "--orb": colors[0] }, 0);
  tl.set(orb, { scale: 1 }, 0);
  tl.set(particles, { x: 0, y: 0, opacity: 0 }, 0);
  tl.set(panels, { opacity: 0, y: PANEL_SHIFT }, 0);

  for (let i = 0; i < colors.length; i++) {
    const t0 = i;
    const burstAt = t0 + SEGMENT.expand;
    const revealAt = burstAt + SEGMENT.burst;
    const collapseAt = revealAt + SEGMENT.reveal + SEGMENT.hold;
    tl.addLabel(`project-${i}`, t0);

    tl.fromTo(orb, { scale: 1 }, { scale: 1.3, duration: SEGMENT.expand, ...noRender }, t0);
    tl.fromTo(orb, { scale: 1.3 }, { scale: 1.1, duration: SEGMENT.burst, ...noRender }, burstAt);
    particles.forEach((el, k) => {
      const { angle, distance } = ORB_PARTICLES[k % ORB_PARTICLES.length];
      const rad = (angle * Math.PI) / 180;
      tl.fromTo(
        el,
        { x: 0, y: 0, opacity: 1 },
        {
          x: Math.cos(rad) * distance,
          y: Math.sin(rad) * distance,
          opacity: 0,
          duration: SEGMENT.burst,
          ...noRender,
        },
        burstAt,
      );
    });
    tl.fromTo(
      panels[i],
      { opacity: 0, y: PANEL_SHIFT },
      { opacity: 1, y: 0, duration: SEGMENT.reveal, ...noRender },
      revealAt,
    );
    tl.fromTo(
      panels[i],
      { opacity: 1, y: 0 },
      { opacity: 0, y: PANEL_SHIFT, duration: SEGMENT.collapse, ...noRender },
      collapseAt,
    );
    tl.fromTo(orb, { scale: 1.1 }, { scale: 1, duration: SEGMENT.collapse, ...noRender }, collapseAt);

    if (i < colors.length - 1) {
      tl.fromTo(
        stage,
        { "--orb": colors[i] },
        { "--orb": colors[i + 1], duration: RECOLOUR_LEN, ...noRender },
        t0 + RECOLOUR_AT,
      );
    }

  }

  // Render once end-to-end so the time-0 initial state is applied before any scrub.
  tl.progress(1).progress(0);
  return tl;
}
