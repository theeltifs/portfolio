"use client";

import { useRef } from "react";
import { experience } from "@/content/experience";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-timeline-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 70%", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="experience" className="px-6 py-24 md:px-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-5xl uppercase md:text-7xl">Experience</h2>
        <ol data-timeline className="relative mt-12 space-y-12 pl-8">
          <span
            data-timeline-line
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-white/30"
          />
          {experience.map((r) => (
            <li key={r.company} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[37px] top-2 h-3 w-3 rounded-full bg-fg"
              />
              <h3 className="text-2xl">
                {r.title} <span className="text-muted">· {r.company}</span>
              </h3>
              <p className="text-sm text-muted">
                {r.start} – {r.end}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
