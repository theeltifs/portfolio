import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { ProjectVideo } from "@/components/media/ProjectVideo";
import { TechChip } from "@/components/ui/TechChip";
import { Button } from "@/components/ui/Button";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Abdullah Shafique`, description: project.pitch };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link href="/" className="text-sm text-muted underline underline-offset-4">
        ← Back home
      </Link>
      <h1 className="mt-6 font-display text-6xl uppercase md:text-8xl">{project.title}</h1>
      <p className="mt-2 text-muted">
        {project.subtitle}
        {project.origin === "orzeh" && " · Orzeh Technologies work"}
      </p>
      <div className="mt-8">
        <ProjectVideo src={project.video} poster={project.poster} accent={project.accent} title={project.title} />
      </div>
      <p className="mt-8 text-xl">{project.pitch}</p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-muted">
        {project.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <TechChip key={s}>{s}</TechChip>
        ))}
      </div>
      {(project.links.github || project.links.live) && (
        <div className="mt-8 flex gap-3">
          {project.links.github && (
            <Button href={project.links.github} variant="outline" target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          )}
          {project.links.live && (
            <Button href={project.links.live} variant="outline" target="_blank" rel="noopener noreferrer">
              Live
            </Button>
          )}
        </div>
      )}
      <nav className="mt-16 border-t border-fg/10 pt-8">
        <Link href={`/projects/${next.slug}`} className="text-xl underline underline-offset-4">
          Next project: {next.title} →
        </Link>
      </nav>
    </main>
  );
}
