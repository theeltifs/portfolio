import type { Project } from "@/content/types";
import { TechChip } from "@/components/ui/TechChip";
import { Button } from "@/components/ui/Button";
import { ProjectVideo } from "@/components/media/ProjectVideo";

export function ProjectPanel({ project: p, headingId }: { project: Project; headingId?: string }) {
  return (
    <div>
      <ProjectVideo src={p.video} poster={p.poster} accent="green" title={p.title} />
      <h3 id={headingId} className="mt-4 font-display text-3xl uppercase md:text-4xl">
        {p.title}
      </h3>
      <p className="text-sm text-muted">{p.subtitle}</p>
      <p className="mt-2">{p.pitch}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <TechChip key={s}>{s}</TechChip>
        ))}
      </div>
      <div className="mt-6">
        <Button href={`/projects/${p.slug}`} variant="outline">
          View case study
        </Button>
      </div>
    </div>
  );
}
