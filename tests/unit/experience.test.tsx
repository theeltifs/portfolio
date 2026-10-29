import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Experience } from "@/components/sections/Experience";
import { experience } from "@/content/experience";

describe("Experience", () => {
  it("renders three roles in order with date ranges and first bullets", () => {
    const { container } = render(<Experience />);
    const text = container.textContent ?? "";
    const dates = ["Mar 2026 – Aug 2026", "Jul 2025 – Feb 2026", "Apr 2024 – Jun 2024"];
    const positions = dates.map((d) => text.indexOf(d));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    for (const role of experience) expect(text).toContain(role.bullets[0]);
  });
});
