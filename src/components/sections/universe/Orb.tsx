import type { CSSProperties } from "react";
import type { AccentKey } from "@/content/types";

export const ORB_PARTICLES: readonly { angle: number; distance: number }[] = [
  { angle: 0, distance: 95 },
  { angle: 30, distance: 120 },
  { angle: 60, distance: 100 },
  { angle: 90, distance: 130 },
  { angle: 120, distance: 105 },
  { angle: 150, distance: 125 },
  { angle: 180, distance: 98 },
  { angle: 210, distance: 122 },
  { angle: 240, distance: 102 },
  { angle: 270, distance: 128 },
  { angle: 300, distance: 108 },
  { angle: 330, distance: 118 },
];

type OrbProps = { live?: boolean; accent?: AccentKey; color?: string; className?: string };

export function Orb({ live = false, accent, color, className = "" }: OrbProps) {
  const style = color
    ? ({ "--orb": color } as CSSProperties)
    : accent
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
