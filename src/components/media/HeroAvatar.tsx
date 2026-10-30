"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type Clip = "idle" | "up" | "right";

const SRC: Record<Clip, string> = {
  idle: "/media/idle.mp4",
  up: "/media/look-up.mp4",
  right: "/media/look-right.mp4",
};
const CLIPS = Object.keys(SRC) as Clip[];

/** Loops the idle clip and glances up/right when the pointer moves that way. */
export function HeroAvatar() {
  const reduced = useReducedMotion();
  const [clip, setClip] = useState<Clip>("idle");
  const refs = useRef<Partial<Record<Clip, HTMLVideoElement | null>>>({});
  const wrap = useRef<HTMLDivElement>(null);

  const active = reduced ? "idle" : clip;

  useEffect(() => {
    for (const c of CLIPS) {
      const v = refs.current[c];
      if (!v) continue;
      if (c === active) {
        if (c !== "idle") v.currentTime = 0;
        v.play()?.catch(() => {}); // jsdom returns undefined
      } else {
        v.pause();
      }
    }
  }, [active]);

  const settle = useCallback(() => setClip("idle"), []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      setClip((cur) => {
        if (cur !== "idle") return cur;
        if (dy < -r.height * 0.6) return "up";
        if (dx > r.width * 0.9) return "right";
        return cur;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div
      ref={wrap}
      role="img"
      aria-label="Portrait of Abdullah Shafique"
      className="relative mx-auto w-fit max-w-full"
    >
      {CLIPS.map((c) => (
        <video
          key={c}
          ref={(el) => {
            refs.current[c] = el;
          }}
          src={SRC[c]}
          poster={c === "idle" ? "/media/hero.svg" : undefined}
          muted
          playsInline
          loop={c === "idle"}
          autoPlay={c === active}
          preload={c === "idle" ? "auto" : "metadata"}
          onEnded={c === "idle" ? undefined : settle}
          aria-hidden="true"
          className={`${c === "idle" ? "relative" : "absolute inset-0"} block h-auto max-h-[68vh] w-full max-w-full object-contain transition-opacity duration-300 ${c === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
