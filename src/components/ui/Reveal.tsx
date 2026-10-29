"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type RevealProps = { children: ReactNode; delay?: number; className?: string };

// Content is visible in the server markup; the hidden start state is applied after mount.
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current, {
        opacity: 0,
        y: 32,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.trigger === ref.current && t.kill());
    },
    { scope: ref, dependencies: [reduced, delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
