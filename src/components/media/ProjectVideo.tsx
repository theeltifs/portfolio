"use client";

import { useEffect, useRef, useState } from "react";
import type { AccentKey } from "@/content/types";

type Props = { src?: string; poster?: string; accent: AccentKey; title: string };

export function ProjectVideo({ src, poster, accent, title }: Props) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [src, failed]);

  if (!src || failed) {
    return (
      <div
        data-fallback
        role="img"
        aria-label={`${title} preview`}
        className="aspect-video w-full rounded-xl"
        style={{
          background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent-${accent}) 55%, transparent), transparent 70%), #e8ebf2`,
        }}
      />
    );
  }

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={`${title} demo`}
      onError={() => setFailed(true)}
      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
      className="aspect-video w-full rounded-xl object-cover"
    />
  );
}
