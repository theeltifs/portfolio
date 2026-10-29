import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Nav } from "@/components/layout/Nav";

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;
});

describe("Nav", () => {
  it("renders five section links", () => {
    render(<Nav />);
    const expected = ["#home", "#about", "#projects", "#experience", "#contact"];
    for (const href of expected) {
      expect(document.querySelector(`nav a[href="${href}"]`)).not.toBeNull();
    }
  });

  it("Let's Talk is a mailto link", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Let's Talk" })).toHaveAttribute(
      "href",
      "mailto:abdullahshafiqueofficiall@gmail.com",
    );
  });

  it("hamburger toggles aria-expanded", () => {
    render(<Nav />);
    const btn = screen.getByRole("button", { name: /menu/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
