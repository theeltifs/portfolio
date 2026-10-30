"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { projects } from "@/content/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { Orb } from "./Orb";
import { ProjectPanel } from "./ProjectPanel";
import { UniverseProgress } from "./UniverseProgress";
import { activeIndexFor, buildUniverseTimeline, segmentScrollTop } from "./universe-timeline";

const TRIGGER_ID = "project-universe";
const PARALLAX_PX = 12;
const COUNT = projects.length;


export function ProjectUniverse() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbWrapRef = useRef<HTMLDivElement>(null);
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
      const wrap = orbWrapRef.current;
      if (!section || !wrap) return;
      const orb = wrap.querySelector<HTMLElement>("[data-orb]")!;
      const particles = Array.from(wrap.querySelectorAll<HTMLElement>("[data-particle]"));
      const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-panel]"));

      const tl = buildUniverseTimeline({ orb, particles, panels }, COUNT);
      const st = ScrollTrigger.create({
        id: TRIGGER_ID,
        trigger: section,
        pin: true,
        start: "top top",
        end: () => "+=" + window.innerHeight * COUNT,
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

      const toX = gsap.quickTo(wrap, "x", { duration: 0.6, ease: "power3.out" });
      const toY = gsap.quickTo(wrap, "y", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        toX(Math.max(-1, Math.min(1, nx)) * PARALLAX_PX);
        toY(Math.max(-1, Math.min(1, ny)) * PARALLAX_PX);
      };
      section.addEventListener("pointermove", onMove);

      return () => {
        alive = false;
        section.removeEventListener("pointermove", onMove);
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
      <div className="orb-wash relative flex h-full flex-col px-6 py-10 md:px-24">
        <a
          href="#experience"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-10 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip projects
        </a>
        <h2 id="projects-heading" className="font-display text-4xl uppercase md:text-6xl">
          Featured Projects
        </h2>
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 md:grid-cols-2">
          <div ref={orbWrapRef} className="mx-auto w-full max-w-[13rem]">
            <Orb live />
          </div>
          <div className="grid">
            {projects.map((p, i) => (
              <div
                key={p.slug}
                data-panel={i}
                inert={i !== active}
                aria-hidden={i !== active ? "true" : undefined}
                className="col-start-1 row-start-1"
              >
                <GlassCard className="p-5">
                  <ProjectPanel project={p} headingId={`project-${p.slug}`} />
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <UniverseProgress projects={projects} activeIndex={active} onSelect={scrollToSegment} />
        </div>
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>
    </section>
  );
}
