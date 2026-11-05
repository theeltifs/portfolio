import type { Project } from "@/content/types";
import { TechChip } from "@/components/ui/TechChip";
import { Button } from "@/components/ui/Button";
import { ProjectVideo } from "@/components/media/ProjectVideo";

export function ProjectPanel({
  project: p,
  headingId,
  layout = "stacked",
}: {
  project: Project;
  headingId?: string;
  layout?: "stacked" | "featured";
}) {
  const featured = layout === "featured";
  return (
    <div className={featured ? "grid gap-5 md:grid-cols-[1fr_1fr] md:items-center md:gap-7" : ""}>
      <ProjectVideo src={p.video} poster={p.poster} accent="green" title={p.title} />
      <div className={featured ? "min-w-0" : ""}>
        <h3 id={headingId} className={`${featured ? "mt-4 md:mt-0 text-2xl md:text-3xl" : "mt-4 text-3xl md:text-4xl"} font-display uppercase`}>
          {p.title}
        </h3>
        <p className="text-sm text-muted">{p.subtitle}</p>
        <p className={`mt-2 ${featured ? "text-sm leading-relaxed" : ""}`}>{p.pitch}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <TechChip key={s}>{s}</TechChip>
          ))}
        </div>
        <div className="mt-5">
          <Button href={`/projects/${p.slug}`} variant="outline">
            View case study
          </Button>
        </div>
      </div>
    </div>
  );
}
