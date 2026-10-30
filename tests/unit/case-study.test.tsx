import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

const notFound = vi.hoisted(() => vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
}));
vi.mock("next/navigation", () => ({ notFound }));

import Page, { generateStaticParams } from "@/app/projects/[slug]/page";

describe("case study page", () => {
  it("generates the four slugs", () => {
    expect(generateStaticParams().map((p) => p.slug).sort()).toEqual(
      ["asta", "chartli", "getaura", "resolva"],
    );
  });

  it("renders resolva with a next-project link", async () => {
    const ui = await Page({ params: Promise.resolve({ slug: "resolva" }) });
    const { container, getByRole } = render(ui);
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Resolva");
    expect(container.querySelector('a[href="/projects/getaura"]')).not.toBeNull();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(Page({ params: Promise.resolve({ slug: "does-not-exist" }) })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(notFound).toHaveBeenCalled();
  });
});
