"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const MAX_MS = 4500;
const FADE_MS = 600;

const HELLO = "Hello";
const TYPE_MS = 130;

/** Types HELLO letter by letter; untyped letters stay invisible so the width never shifts. */
function HelloTyped() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((c) => Math.min(c + 1, HELLO.length)), TYPE_MS);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <span data-hello-typed>{HELLO.slice(0, n)}</span>
      <span className="opacity-0">{HELLO.slice(n)}</span>
    </>
  );
}

/** Full-screen look-down clip shown for a few seconds on load, then fades away to the page. */
export function HeroIntro() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");
  const [helloOn, setHelloOn] = useState(false);

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const timer = setTimeout(() => setPhase("fade"), MAX_MS);
    return () => clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (phase === "done") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "fade") return;
    const timer = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "done" || reduced) return null;

  return (
    <div
      data-hero-intro
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative">
        {helloOn && (
          <div
            data-hero-hello
            className="pointer-events-none absolute inset-x-0 bottom-full mb-[1.5vh] flex justify-center"
          >
            <span
              className="hello-in-out font-display leading-none text-fg"
              style={{
                fontSize: "clamp(3rem, min(9vw, 12vh), 8rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 2px 24px rgb(0 0 0 / 0.35)",
              }}
            >
              <HelloTyped />
            </span>
          </div>
        )}
        <video
          ref={(v) => {
            // Autoplay can start before hydration, so `playing` fires with no handler attached.
            if (v && !v.paused && v.currentTime > 0) setHelloOn(true);
          }}
          src="/media/look-down.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          onPlaying={() => setHelloOn(true)}
          onEnded={() => setPhase("fade")}
          className="block h-auto max-h-[68vh] max-w-full object-contain"
        />
      </div>
    </div>
  );
}
