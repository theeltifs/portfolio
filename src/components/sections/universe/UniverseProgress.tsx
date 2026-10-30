import type { Project } from "@/content/types";

type Props = {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function UniverseProgress({ projects, activeIndex, onSelect }: Props) {
  return (
    <nav aria-label="Project progress" className="flex items-center gap-4">
      <div className="flex gap-2">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            aria-label={`Go to ${p.title}`}
            aria-current={i === activeIndex ? "step" : undefined}
            onClick={() => onSelect(i)}
            className={`h-3 w-3 rounded-full border border-fg/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ${
              i === activeIndex ? "bg-fg" : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-muted">
        <span className="font-semibold text-fg">
          {pad(activeIndex + 1)} / {pad(projects.length)}
        </span>{" "}
        {projects[activeIndex]?.title}
      </p>
    </nav>
  );
}
