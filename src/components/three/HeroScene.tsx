"use client";

import dynamic from "next/dynamic";
import { SceneGate } from "./SceneGate";

const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full"
      style={{
        backgroundImage:
          "radial-gradient(circle at 70% 40%, rgb(76 141 255 / 0.18), transparent 60%), radial-gradient(rgb(255 255 255 / 0.18) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 28px 28px",
      }}
    />
  );
}

export function HeroScene() {
  return (
    <SceneGate fallback={<HeroFallback />}>
      <HeroField />
    </SceneGate>
  );
}
