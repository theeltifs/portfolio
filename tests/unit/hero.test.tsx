import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

describe("Hero", () => {
  it("headline contains the three words", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    for (const w of ["BUILDING", "INTELLIGENT", "SOLUTIONS"]) expect(h1).toHaveTextContent(w);
  });

  it("has both CTAs with the expected hrefs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /View My Work/ })).toHaveAttribute("href", "#projects");
    const resume = screen.getByRole("link", { name: /Download Resume/ });
    expect(resume).toHaveAttribute("href", "/Abdullah-Shafique-Resume.pdf");
    expect(resume).toHaveAttribute("download");
  });

  it("shows the exact stats", () => {
    const { container } = render(<Hero />);
    const text = container.textContent ?? "";
    for (const s of ["Projects Shipped", "Roles", "Backend Test Coverage", "CSAT", "89%", "95%+"]) {
      expect(text).toContain(s);
    }
    expect(text).not.toMatch(/5\+ projects|2\+ years/i);
  });

  it("portrait has alt text", () => {
    render(<Hero />);
    expect(screen.getByRole("img", { name: /Abdullah/ }).getAttribute("alt")).toBeTruthy();
  });
});
