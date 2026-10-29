import { ScriptNote } from "@/components/ui/ScriptNote";
import { Reveal } from "@/components/ui/Reveal";
import { OrbitScene } from "@/components/three/OrbitScene";

const steps = ["Ideas", "Build", "Test", "Deploy"];

export function Approach() {
  return (
    <section id="approach" className="px-6 py-24 md:px-24">
      <Reveal className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-5xl uppercase md:text-7xl">CODE DESIGN SOLVE REPEAT</h2>
          <ScriptNote className="mt-4" rotate={-2}>
            Better Systems, Happier People
          </ScriptNote>
          <ol className="mt-8 flex flex-wrap items-center gap-3 text-lg">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span>{s}</span>
                {i < steps.length - 1 && (
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div className="h-80 w-full">
          <OrbitScene />
        </div>
      </Reveal>
    </section>
  );
}
