import { describe, it, expect } from "vitest";
import { profile } from "@/content/profile";
import { projects, getProject } from "@/content/projects";
import { experience } from "@/content/experience";
import { skills } from "@/content/skills";

const ACCENTS = ["green", "blue", "orange", "violet"];

describe("content", () => {
  it("has four unique, well-formed projects", () => {
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(4);
    for (const p of projects) {
      expect(p.stack.length).toBeGreaterThan(0);
      expect(ACCENTS).toContain(p.accent);
    }
  });

  it("states the exact hero stats", () => {
    expect(profile.stats.map((s) => s.value + " " + s.label)).toEqual([
      "4 Projects Shipped",
      "3 Roles",
      "89% Backend Test Coverage",
      "95%+ CSAT",
    ]);
  });

  it("contains no phone number", () => {
    const all = JSON.stringify({ profile, projects, experience, skills });
    expect(all).not.toContain("+92");
    expect(all).not.toContain("0305");
  });

  it("labels Content Moderation as Orzeh work", () => {
    expect(getProject("content-moderation")?.origin).toBe("orzeh");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProject("nope")).toBeUndefined();
  });

  it("orders experience Amazon, Orzeh, Evaxone", () => {
    expect(experience.map((r) => r.company)).toEqual([
      "Amazon",
      "Orzeh Technologies",
      "Evaxone",
    ]);
  });
});
