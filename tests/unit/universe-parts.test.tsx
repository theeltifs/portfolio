import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { UniverseProgress } from "@/components/sections/universe/UniverseProgress";
import { Orb, ORB_PARTICLES } from "@/components/sections/universe/Orb";
import { ProjectPanel } from "@/components/sections/universe/ProjectPanel";
import { getProject, projects } from "@/content/projects";

describe("Orb", () => {
  it("live renders 12 particles inside an aria-hidden root", () => {
    const { container } = render(<Orb live />);
    const root = container.querySelector("[data-orb]")!;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("[data-particle]")).toHaveLength(12);
  });
  it("static orb takes an explicit colour", () => {
    const { container } = render(<Orb color="#123456" />);
    expect((container.querySelector("[data-orb]") as HTMLElement).style.getPropertyValue("--orb")).toBe("#123456");
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
    const { container } = render(<ProjectPanel project={{ ...chartli, poster: undefined }} />);
    expect(container.querySelector("[data-fallback]")).not.toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });
});

describe("UniverseProgress", () => {
  const list = projects;
  it("renders named buttons, counter and aria-current", () => {
    const { getByRole, getByText } = render(
      <UniverseProgress projects={list} activeIndex={1} onSelect={() => {}} />,
    );
    expect(getByRole("navigation", { name: "Project progress" })).not.toBeNull();
    expect(getByRole("button", { name: "Go to Chartli" })).not.toBeNull();
    expect(getByRole("button", { name: "Go to Resolva" }).getAttribute("aria-current")).toBe("step");
    expect(getByRole("button", { name: "Go to Chartli" }).getAttribute("aria-current")).toBeNull();
    expect(getByText("02 / 04")).not.toBeNull();
  });
  it("calls onSelect with the clicked index", () => {
    const onSelect = vi.fn();
    const { getByRole } = render(
      <UniverseProgress projects={list} activeIndex={0} onSelect={onSelect} />,
    );
    fireEvent.click(getByRole("button", { name: "Go to Getaura" }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
