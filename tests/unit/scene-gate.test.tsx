import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";

const state = { webgl: true, reduced: false };
vi.mock("@/lib/webgl", () => ({ hasWebGL: () => state.webgl }));
vi.mock("@/lib/motion/use-reduced-motion", () => ({ useReducedMotion: () => state.reduced }));

import { SceneGate } from "@/components/three/SceneGate";

function setup() {
  return render(
    <SceneGate fallback={<div data-testid="fallback" />}>
      <canvas data-testid="canvas" />
    </SceneGate>,
  );
}

beforeEach(() => {
  cleanup();
  state.webgl = true;
  state.reduced = false;
  Object.defineProperty(window, "innerWidth", { value: 1280, configurable: true });
});

describe("SceneGate", () => {
  it("renders children when everything is supported", () => {
    setup();
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
    expect(screen.queryByTestId("fallback")).toBeNull();
  });

  it("falls back without WebGL", () => {
    state.webgl = false;
    setup();
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("falls back under reduced motion", () => {
    state.reduced = true;
    setup();
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("keeps the scene on narrow viewports by default", () => {
    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
    setup();
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("falls back below an explicit minWidth", () => {
    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
    render(
      <SceneGate minWidth={768} fallback={<div data-testid="fallback" />}>
        <canvas data-testid="canvas" />
      </SceneGate>,
    );
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
  });

  it("swaps to fallback on webglcontextlost", () => {
    setup();
    act(() => {
      fireEvent(screen.getByTestId("canvas"), new Event("webglcontextlost"));
    });
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(document.querySelector("canvas")).toBeNull();
  });
});
