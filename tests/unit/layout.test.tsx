import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("has the portfolio title", () => {
    expect(metadata.title).toBe("Abdullah Shafique — AI Engineer & Software Developer");
  });

  it("renders children with no light theme class", () => {
    const html = renderToStaticMarkup(
      <RootLayout params={Promise.resolve({})}>
        <p>hello</p>
      </RootLayout>,
    );
    expect(html).toContain("hello");
    expect(html).not.toMatch(/<html[^>]*class="[^"]*\blight\b/);
  });
});
