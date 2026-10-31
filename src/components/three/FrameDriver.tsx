"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// With frameloop="demand", drive renders only while the canvas is on screen.
export function FrameDriver() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let visible = true;
    const loop = () => {
      if (visible) invalidate();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(gl.domElement);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [gl, invalidate]);

  return null;
}
