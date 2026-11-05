import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProjectPanel } from "@/components/sections/universe/ProjectPanel";
import { getProject } from "@/content/projects";

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
