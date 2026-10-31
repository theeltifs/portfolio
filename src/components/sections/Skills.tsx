import { skills } from "@/content/skills";
import { GlassCard } from "@/components/ui/GlassCard";
import { TechChip } from "@/components/ui/TechChip";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:px-24">
      <Reveal className="mx-auto max-w-5xl">
        <h2 className="font-display text-5xl uppercase md:text-7xl">Skills</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {skills.map((g) => (
            <GlassCard key={g.label} className="p-6">
              <h3 id={`skills-${g.label}`} className="text-sm uppercase tracking-widest text-muted">
                {g.label}
              </h3>
              <ul aria-labelledby={`skills-${g.label}`} className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <TechChip>{item}</TechChip>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
