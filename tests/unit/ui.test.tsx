import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatBar } from "@/components/ui/StatBar";
import { ScriptNote } from "@/components/ui/ScriptNote";
import { TechChip } from "@/components/ui/TechChip";

describe("ui primitives", () => {
  it("Button renders a link with an accessible name", () => {
    render(<Button href="/x" variant="solid">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/x");
  });

  it("StatBar renders each stat's value and label", () => {
    render(<StatBar stats={[{ value: "4", label: "Projects Shipped" }, { value: "3", label: "Roles" }]} />);
    expect(screen.getByText("Projects Shipped")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Roles")).toBeInTheDocument();
  });

  it("ScriptNote is hidden from assistive tech", () => {
    const { container } = render(<ScriptNote>note</ScriptNote>);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("GlassCard exposes its accent", () => {
    const { container } = render(<GlassCard accent="green">c</GlassCard>);
    expect(container.firstElementChild).toHaveAttribute("data-accent", "green");
  });

  it("TechChip renders its text", () => {
    render(<TechChip>Python</TechChip>);
    expect(screen.getByText("Python")).toBeInTheDocument();
  });
});
