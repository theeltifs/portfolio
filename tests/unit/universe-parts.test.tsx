import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Orb, ORB_PARTICLES } from "@/components/sections/universe/Orb";
import { ProjectPanel } from "@/components/sections/universe/ProjectPanel";
import { getProject } from "@/content/projects";

describe("Orb", () => {
  it("live renders 12 particles inside an aria-hidden root", () => {
    const { container } = render(<Orb live />);
    const root = container.querySelector("[data-orb]")!;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("[data-particle]")).toHaveLength(12);
  });
  it("static renders no particles and has orb-static", () => {
    const { container } = render(<Orb accent="blue" />);
    expect(container.querySelectorAll("[data-particle]")).toHaveLength(0);
    const root = container.querySelector("[data-orb]") as HTMLElement;
    expect(root.classList.contains("orb-static")).toBe(true);
    expect(root.style.getPropertyValue("--orb")).toBe("var(--accent-blue)");
  });
  it("ORB_PARTICLES has 12 entries with finite numbers", () => {
    expect(ORB_PARTICLES).toHaveLength(12);
    for (const p of ORB_PARTICLES) {
      expect(Number.isFinite(p.angle)).toBe(true);
      expect(Number.isFinite(p.distance)).toBe(true);
    }
  });
});

describe("ProjectPanel", () => {
  const chartli = getProject("chartli")!;
  it("renders title, chips and exactly one case-study link", () => {
    const { container, getByRole, getByText } = render(
      <ProjectPanel project={chartli} headingId="h-chartli" />,
    );
    expect(getByRole("heading", { level: 3 }).id).toBe("h-chartli");
    expect(getByText("Chartli")).not.toBeNull();
    for (const s of chartli.stack) expect(getByText(s)).not.toBeNull();
    expect(container.querySelectorAll('a[href="/projects/chartli"]')).toHaveLength(1);
  });
  it("renders the gradient fallback when the project has no video", () => {
    const { container } = render(<ProjectPanel project={chartli} />);
    expect(container.querySelector("[data-fallback]")).not.toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });
});
