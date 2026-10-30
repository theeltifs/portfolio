import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StackedProjects } from "@/components/sections/universe/StackedProjects";

const SLUGS = ["chartli", "resolva", "getaura", "asta"];

describe("StackedProjects", () => {
  it("renders four cards with one link per slug", () => {
    const { container } = render(<StackedProjects reduced={false} />);
    expect(container.querySelectorAll("li")).toHaveLength(4);
    for (const s of SLUGS) {
      expect(container.querySelectorAll(`a[href="/projects/${s}"]`)).toHaveLength(1);
    }
  });
  it("uses static orbs only, no particles", () => {
    const { container } = render(<StackedProjects reduced={false} />);
    expect(container.querySelectorAll("[data-orb].orb-static")).toHaveLength(4);
    expect(container.querySelectorAll("[data-particle]")).toHaveLength(0);
  });
  it("reduced mode applies fade-in-view to each li", () => {
    const { container } = render(<StackedProjects reduced />);
    const lis = container.querySelectorAll("li");
    lis.forEach((li) => expect(li.classList.contains("fade-in-view")).toBe(true));
  });
  it("non-reduced mode does not apply fade-in-view", () => {
    const { container } = render(<StackedProjects reduced={false} />);
    expect(container.querySelectorAll(".fade-in-view")).toHaveLength(0);
  });
});
