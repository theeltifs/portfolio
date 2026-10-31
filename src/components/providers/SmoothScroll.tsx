"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    const lenis = new Lenis({ autoRaf: false });
    root.classList.add("lenis");

    // The intro video is mandatory: no scrolling until it has finished.
    const sync = () => (root.dataset.intro === "on" ? lenis.stop() : lenis.start());
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    if (root.dataset.intro === "on") lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      root.classList.remove("lenis");
    };
  }, [reduced]);

  return <>{children}</>;
}
