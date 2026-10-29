import Link from "next/link";
import { projects } from "@/content/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { TechChip } from "@/components/ui/TechChip";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVideo } from "@/components/media/ProjectVideo";
import { TiltCard } from "./TiltCard";

export function FeaturedProjects() {
  return (
    <section id="projects" className="px-6 py-24 md:px-24">
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="font-display text-5xl uppercase md:text-7xl">Featured Projects</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {projects.map((p) => (
            <TiltCard key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
              >
                <GlassCard accent={p.accent} className="p-4">
                  <ProjectVideo src={p.video} poster={p.poster} accent={p.accent} title={p.title} />
                  <h3 className="mt-4 font-display text-3xl uppercase">{p.title}</h3>
                  <p className="text-sm text-muted">{p.subtitle}</p>
                  <p className="mt-2">{p.pitch}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <TechChip key={s}>{s}</TechChip>
                    ))}
                  </div>
                </GlassCard>
              </Link>
            </TiltCard>
          ))}
        </div>
        <p className="mt-10">
          <Link href="#projects" className="underline underline-offset-4">
            View All Projects
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
