import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ProjectVideo } from "@/components/media/ProjectVideo";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

describe("ProjectVideo", () => {
  it("shows the gradient fallback without src", () => {
    const { container } = render(<ProjectVideo accent="green" title="T" />);
    expect(container.querySelector("[data-fallback]")).not.toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });

  it("shows the poster image when there is no video", () => {
    const { container } = render(<ProjectVideo poster="/media/projects/x.jpg" accent="green" title="T" />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("/media/projects/x.jpg");
    expect(container.querySelector("[data-fallback]")).toBeNull();
  });

  it("swaps to fallback when the video errors", () => {
    const { container } = render(<ProjectVideo src="/x.mp4" accent="blue" title="T" />);
    const video = container.querySelector("video")!;
    expect(video).not.toBeNull();
    fireEvent.error(video);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("[data-fallback]")).not.toBeNull();
  });
});

describe("FeaturedProjects", () => {
  it("links to the four case studies", () => {
    const { container } = render(<FeaturedProjects />);
    for (const slug of ["chartli", "resolva", "getaura", "asta"]) {
      expect(container.querySelector(`a[href="/projects/${slug}"]`)).not.toBeNull();
    }
  });
});

function mockWideFine() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("min-width") || query.includes("pointer: fine"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("FeaturedProjects modes", () => {
  it('renders the Featured Projects heading and id="projects"', () => {
    const { container, getByRole } = render(<FeaturedProjects />);
    expect(container.querySelector("section#projects")).not.toBeNull();
    expect(getByRole("heading", { level: 2, name: "Featured Projects" })).not.toBeNull();
  });

  it("has exactly one link per slug in stacked mode", () => {
    const { container } = render(<FeaturedProjects />);
    for (const slug of ["chartli", "resolva", "getaura", "asta"]) {
      expect(container.querySelectorAll(`a[href="/projects/${slug}"]`)).toHaveLength(1);
    }
  });

  it("renders Universe markup when the mode is universe", () => {
    mockWideFine();
    const { getByText } = render(<FeaturedProjects />);
    expect(getByText("Skip projects")).not.toBeNull();
  });
});
