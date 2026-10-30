"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import type { Group } from "three";
import { FrameDriver } from "./FrameDriver";

// Deterministic pseudo-random so render stays pure.
function buildPositions(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 12;
    out[i * 3 + 1] = (rand() - 0.5) * 8;
    out[i * 3 + 2] = (rand() - 0.5) * 6;
  }
  return out;
}

function Field() {
  const group = useRef<Group>(null);
  const positions = useMemo(() => buildPositions(window.innerWidth < 768 ? 400 : 900), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / 1000;
    g.rotation.y += delta * 0.04;
    g.rotation.x += (state.pointer.y * 0.25 + scroll - g.rotation.x) * 0.05;
    g.position.x += (state.pointer.x * 0.4 - g.position.x) * 0.05;
  });

  return (
    <group ref={group}>
      <Points positions={positions} stride={3}>
        <PointMaterial transparent color="#3b64d8" size={0.03} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

export default function HeroField() {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 60 }} aria-hidden="true">
      <FrameDriver />
      <Field />
    </Canvas>
  );
}
