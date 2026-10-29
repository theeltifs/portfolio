import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/content/profile", async (orig) => {
  const mod = await orig<typeof import("@/content/profile")>();
  return { profile: { ...mod.profile, linkedin: "", github: "https://github.com/x" } };
});

import { Contact } from "@/components/sections/Contact";

describe("Contact", () => {
  it("links the email with mailto", () => {
    render(<Contact />);
    expect(screen.getByRole("link", { name: /abdullahshafiqueofficiall@gmail\.com/ })).toHaveAttribute(
      "href",
      "mailto:abdullahshafiqueofficiall@gmail.com",
    );
  });

  it("omits LinkedIn when the URL is empty but shows GitHub when set", () => {
    render(<Contact />);
    expect(screen.queryByRole("link", { name: /LinkedIn/ })).toBeNull();
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/x");
  });

  it("has no phone number or tel link", () => {
    const { container } = render(<Contact />);
    expect(container.innerHTML).not.toMatch(/\+92|tel:/);
  });
});
