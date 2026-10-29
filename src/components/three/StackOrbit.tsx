"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { FrameDriver } from "./FrameDriver";

const NODES = 4; // Ideas → Build → Test → Deploy
const COLORS = ["#3ddc84", "#4c8dff", "#ff8a3d", "#a46bff"];

function Orbit() {
  const ring = useRef<Group>(null);
  useFrame((_s, delta) => {
    if (ring.current) ring.current.rotation.y += delta * 0.4;
  });
  return (
    <>
      <mesh>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      <group ref={ring}>
        {Array.from({ length: NODES }, (_, i) => {
          const a = (i / NODES) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 2, 0, Math.sin(a) * 2]}>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshBasicMaterial color={COLORS[i]} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function StackOrbit() {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 1.5, 5], fov: 50 }} aria-hidden="true">
      <FrameDriver />
      <Orbit />
    </Canvas>
  );
}
