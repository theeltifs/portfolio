import type { CSSProperties } from "react";
import type { AccentKey } from "@/content/types";

export const ORB_PARTICLES: readonly { angle: number; distance: number }[] = [
  { angle: 0, distance: 190 },
  { angle: 30, distance: 240 },
  { angle: 60, distance: 200 },
  { angle: 90, distance: 260 },
  { angle: 120, distance: 210 },
  { angle: 150, distance: 250 },
  { angle: 180, distance: 195 },
  { angle: 210, distance: 245 },
  { angle: 240, distance: 205 },
  { angle: 270, distance: 255 },
  { angle: 300, distance: 215 },
  { angle: 330, distance: 235 },
];

type OrbProps = { live?: boolean; accent?: AccentKey; className?: string };

export function Orb({ live = false, accent, className = "" }: OrbProps) {
  const style = accent
    ? ({ "--orb": `var(--accent-${accent})` } as CSSProperties)
    : undefined;
  return (
    <div
      data-orb
      aria-hidden="true"
      style={style}
      className={`orb ${live ? "" : "orb-static"} ${className}`}
    >
      <div className="orb-glow" />
      <div className="orb-core" />
      <div className="orb-ring" />
      <div className="orb-ring" />
      {live &&
        ORB_PARTICLES.map((_, i) => <span key={i} data-particle className="orb-particle" />)}
    </div>
  );
}
