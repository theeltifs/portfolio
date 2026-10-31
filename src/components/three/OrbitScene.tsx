"use client";

import dynamic from "next/dynamic";
import { SceneGate } from "./SceneGate";

const StackOrbit = dynamic(() => import("./StackOrbit"), { ssr: false });

export function OrbitScene() {
  return (
    <SceneGate
      minWidth={768}
      fallback={
        <div
          aria-hidden="true"
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, rgb(164 107 255 / 0.2), transparent 65%)" }}
        />
      }
    >
      <StackOrbit />
    </SceneGate>
  );
}
