import { projects } from "@/content/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { Orb } from "./Orb";
import { ProjectPanel } from "./ProjectPanel";

export function StackedProjects({ reduced }: { reduced: boolean }) {
  return (
    <ul className="mx-auto mt-10 grid max-w-6xl gap-8 md:grid-cols-2">
      {projects.map((p) => {
        const card = (
          <GlassCard accent={p.accent} className="p-4">
            <Orb accent={p.accent} className="mx-auto mb-4 h-20 w-20" />
            <ProjectPanel project={p} />
          </GlassCard>
        );
        return reduced ? (
          <li key={p.slug} className="fade-in-view">
            {card}
          </li>
        ) : (
          <li key={p.slug}>
            <Reveal>{card}</Reveal>
          </li>
        );
      })}
    </ul>
  );
}
