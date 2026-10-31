import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/motion/use-reduced-motion", () => ({ useReducedMotion: () => true }));

import { Approach } from "@/components/sections/Approach";

describe("Approach", () => {
  it("lists the four steps as text with no canvas under reduced motion", () => {
    const { container } = render(<Approach />);
    for (const step of ["Ideas", "Build", "Test", "Deploy"]) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
    expect(container.querySelector("canvas")).toBeNull();
    expect(container).toHaveTextContent("CODE DESIGN SOLVE REPEAT");
  });
});
