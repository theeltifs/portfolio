import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ProjectVideo } from "@/components/media/ProjectVideo";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

describe("ProjectVideo", () => {
  it("shows the gradient fallback without src", () => {
    const { container } = render(<ProjectVideo accent="green" title="T" />);
    expect(container.querySelector("[data-fallback]")).not.toBeNull();
    expect(container.querySelector("video")).toBeNull();
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
    for (const slug of ["chartli", "resolva", "bitcoin-prediction", "content-moderation"]) {
      expect(container.querySelector(`a[href="/projects/${slug}"]`)).not.toBeNull();
    }
  });
});
