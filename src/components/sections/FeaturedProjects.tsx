"use client";

import { ProjectUniverse } from "./universe/ProjectUniverse";
import { StackedProjects } from "./universe/StackedProjects";
import { useUniverseMode } from "./universe/use-universe-mode";

export function FeaturedProjects() {
  const mode = useUniverseMode();
  if (mode === "universe") return <ProjectUniverse />;
  return (
    <section id="projects" aria-labelledby="projects-heading" className="px-6 py-24 md:px-24">
      <h2 id="projects-heading" className="mx-auto max-w-6xl font-display text-5xl uppercase md:text-7xl">
        Featured Projects
      </h2>
      <StackedProjects reduced={mode === "stacked-reduced"} />
    </section>
  );
}
