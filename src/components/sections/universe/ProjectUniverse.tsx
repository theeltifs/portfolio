"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { projects } from "@/content/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectPanel } from "./ProjectPanel";
import { activeIndexFor, buildUniverseTimeline, segmentScrollTop } from "./universe-timeline";

const TRIGGER_ID = "project-universe";
const COUNT = projects.length;


export function ProjectUniverse() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const activeRef = useRef(0);

  const scrollToSegment = (index: number) => {
    const st = ScrollTrigger.getById(TRIGGER_ID);
    if (!st) return;
    window.scrollTo({ top: segmentScrollTop(st.start, st.end, index, COUNT), behavior: "smooth" });
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-panel]"));

      const tl = buildUniverseTimeline({ panels });
      const st = ScrollTrigger.create({
        id: TRIGGER_ID,
        trigger: section,
        pin: true,
        start: "top top",
        end: () => "+=" + window.innerHeight * COUNT * 1.4,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          const next = activeIndexFor(self.progress, COUNT);
          if (next === activeRef.current) return;
          activeRef.current = next;
          setActive(next);
          setAnnouncement(`Project ${next + 1} of ${COUNT}: ${projects[next].title}`);
        },
      });

      let alive = true;
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      return () => {
        alive = false;
        st.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  const onFocusIn = (e: React.FocusEvent) => {
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-panel]");
    if (!panel) return;
    const index = Number(panel.dataset.panel);
    if (index !== activeRef.current) scrollToSegment(index);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      onFocus={onFocusIn}
      className="relative h-svh overflow-hidden"
    >
      <div className="relative flex h-full flex-col px-6 py-10 md:px-24">
        <a
          href="#experience"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-10 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip projects
        </a>
        <h2 id="projects-heading" className="font-display text-4xl uppercase md:text-6xl">
          Featured Projects
        </h2>
        <div className="mx-auto grid w-full max-w-6xl flex-1 place-items-center overflow-visible">
          {projects.map((p, i) => (
            <div
              key={p.slug}
              data-panel={i}
              inert={i !== active}
              aria-hidden={i !== active ? "true" : undefined}
              className="col-start-1 row-start-1 w-full max-w-5xl"
            >
              <GlassCard className="p-4 md:p-5">
                <ProjectPanel project={p} headingId={`project-${p.slug}`} layout="featured" />
              </GlassCard>
            </div>
          ))}
        </div>
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>
    </section>
  );
}
