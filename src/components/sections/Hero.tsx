import { profile } from "@/content/profile";
import { Button } from "@/components/ui/Button";
import { ScriptNote } from "@/components/ui/ScriptNote";
import { StatBar } from "@/components/ui/StatBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { TechChip } from "@/components/ui/TechChip";
import { HeroIntro } from "@/components/media/HeroIntro";
import { HeroAvatar } from "@/components/media/HeroAvatar";
import { HeroScene } from "@/components/three/HeroScene";

const rail = ["Python", "FastAPI", "LangGraph", "Ollama", "React", "PostgreSQL"];

const snippet = `class MultiAgentSystem:
    def __init__(self, agents):
        self.graph = build_graph(agents)

    async def run(self, task):
        return await self.graph.ainvoke(task)`;

export function Hero() {
  return (
    <section id="home" className="relative isolate min-h-screen overflow-hidden px-6 pb-16 pt-28 md:px-24">
      <HeroIntro />
      <div data-hero-field className="absolute inset-0 -z-10">
        <HeroScene />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-lg text-muted">Hi, I&apos;m {profile.name}</p>
          <h1 className="mt-4 font-display text-6xl uppercase leading-[0.95] md:text-8xl">
            {profile.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-xl">{profile.role}</p>
          <p className="mt-4 max-w-md text-muted">{profile.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#projects" variant="solid" icon={<span aria-hidden="true">→</span>}>
              View My Work
            </Button>
            <Button href={profile.resumeHref} variant="outline" download>
              Download Resume
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            <ScriptNote rotate={-3}>From Ideas to Impact</ScriptNote>
            <ScriptNote rotate={2}>AI Systems, Products, Real People</ScriptNote>
          </div>
        </div>

        <div className="relative">
          <HeroAvatar />
          <GlassCard className="absolute -left-4 bottom-8 hidden w-72 p-4 md:block">
            <p className="mb-2 text-xs text-muted">Multi-Agent System</p>
            <pre className="overflow-hidden text-[11px] leading-relaxed text-fg/90">
              <code>{snippet}</code>
            </pre>
          </GlassCard>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap gap-2">
        {rail.map((t) => (
          <TechChip key={t}>{t}</TechChip>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-7xl">
        <StatBar stats={profile.stats} />
      </div>
    </section>
  );
}
