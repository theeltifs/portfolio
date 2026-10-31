import type { Stat } from "@/content/types";
import { GlassCard } from "./GlassCard";

export function StatBar({ stats }: { stats: Stat[] }) {
  return (
    <GlassCard className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="font-display text-4xl leading-none">{s.value}</div>
          <div className="mt-1 text-sm text-muted">{s.label}</div>
        </div>
      ))}
    </GlassCard>
  );
}
