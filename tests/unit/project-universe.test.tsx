import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act, cleanup } from "@testing-library/react";

const { fakeTrigger, stub } = vi.hoisted(() => {
  const fakeTrigger = { start: 1000, end: 5000, kill: vi.fn() };
  const stub = {
    create: vi.fn(() => fakeTrigger),
    getById: vi.fn(() => fakeTrigger),
    refresh: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(() => []),
  };
  return { fakeTrigger, stub };
});

vi.mock("@/lib/motion/gsap", async () => {
  const actual = await vi.importActual<typeof import("@/lib/motion/gsap")>("@/lib/motion/gsap");
  return { ...actual, ScrollTrigger: stub };
});

import { ProjectUniverse } from "@/components/sections/universe/ProjectUniverse";

const scrollTo = vi.fn();

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
});

function panels(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-panel]"));
}
function config() {
  return (stub.create.mock.calls[0] as unknown as [Record<string, unknown>])[0] as {
    pin: boolean;
    scrub: number | boolean;
    anticipatePin: number;
    snap?: unknown;
    id: string;
    onUpdate: (self: { progress: number }) => void;
  };
}
function update(progress: number) {
  act(() => config().onUpdate({ progress }));
}

describe("ProjectUniverse", () => {
  it("creates one pinned trigger with pin, scrub, anticipatePin and no snap", () => {
    render(<ProjectUniverse />);
    expect(stub.create).toHaveBeenCalledTimes(1);
    const c = config();
    expect(c.id).toBe("project-universe");
    expect(c.pin).toBe(true);
    expect(c.scrub).toBeTruthy();
    expect(c.anticipatePin).toBe(1);
    expect(c.snap).toBeUndefined();
  });

  it("only the first panel is interactive initially", () => {
    const { container } = render(<ProjectUniverse />);
    const p = panels(container);
    expect(p).toHaveLength(4);
    expect(p[0].hasAttribute("inert")).toBe(false);
    expect(p[0].getAttribute("aria-hidden")).toBeNull();
    for (const el of p.slice(1)) {
      expect(el.hasAttribute("inert")).toBe(true);
      expect(el.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("onUpdate moves the active panel and announces it", () => {
    const { container, getByRole } = render(<ProjectUniverse />);
    update(0.8);
    const p = panels(container);
    expect(p[3].hasAttribute("inert")).toBe(false);
    expect(p[0].hasAttribute("inert")).toBe(true);
    expect(getByRole("status").textContent).toBe("Project 4 of 4: Content Moderation Platform");
  });

  it("onUpdate at progress 1 keeps the last panel active", () => {
    const { container } = render(<ProjectUniverse />);
    update(1);
    const p = panels(container);
    expect(p[3].hasAttribute("inert")).toBe(false);
    expect(p.filter((el) => !el.hasAttribute("inert"))).toHaveLength(1);
  });

  it("clicking a dot scrolls to its segment", () => {
    const { getByRole } = render(<ProjectUniverse />);
    fireEvent.click(getByRole("button", { name: "Go to Resolva" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 2000, behavior: "smooth" });
  });

  it("focusing a link inside an inactive panel scrolls to its segment", () => {
    const { container } = render(<ProjectUniverse />);
    const link = container.querySelector('a[href="/projects/bitcoin-prediction"]')!;
    fireEvent.focusIn(link);
    expect(scrollTo).toHaveBeenCalledWith({ top: 3000, behavior: "smooth" });
  });

  it("skip link targets #experience", () => {
    const { getByText } = render(<ProjectUniverse />);
    expect(getByText("Skip projects").getAttribute("href")).toBe("#experience");
  });

  it("unmount kills the trigger", () => {
    const { unmount } = render(<ProjectUniverse />);
    unmount();
    expect(fakeTrigger.kill).toHaveBeenCalled();
  });
});
