import { profile } from "@/content/profile";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const { education, certifications } = profile;
  return (
    <section id="about" className="px-6 py-24 md:px-24">
      <Reveal className="mx-auto max-w-5xl">
        <h2 className="font-display text-5xl uppercase md:text-7xl">About</h2>
        <p className="mt-6 max-w-2xl text-lg text-muted">{profile.intro}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="text-sm uppercase tracking-widest text-muted">Education</h3>
            <p className="mt-3 text-xl">{education.degree}</p>
            <p className="text-muted">
              {education.school}, {education.years}
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="text-sm uppercase tracking-widest text-muted">Certifications</h3>
            <ul className="mt-3 space-y-2">
              {certifications.map((c) => (
                <li key={c.name}>
                  {c.name} <span className="text-muted">— {c.issuer}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </Reveal>
    </section>
  );
}
