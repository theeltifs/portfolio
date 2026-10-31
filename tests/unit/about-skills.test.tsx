import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { skills } from "@/content/skills";

describe("About", () => {
  it("shows education and certification issuers", () => {
    const { container } = render(<About />);
    const t = container.textContent ?? "";
    expect(t).toContain("Government College University");
    expect(t).toContain("Accenture");
    expect(t).toContain("BCG X");
  });
});

describe("Skills", () => {
  it("renders every group label and item", () => {
    const { container } = render(<Skills />);
    const t = container.textContent ?? "";
    for (const label of ["Languages", "AI/ML", "ML Frameworks", "Data", "Backend/Tools"]) {
      expect(t).toContain(label);
    }
    for (const g of skills) for (const item of g.items) expect(t).toContain(item);
    expect(t).toContain("TensorFlow");
    expect(t).toContain("Docker");
  });
});
