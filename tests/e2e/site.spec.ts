import { test, expect } from "@playwright/test";

const SLUGS = ["chartli", "resolva", "bitcoin-prediction", "content-moderation"];

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("server HTML has headline, project links and mailto", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("INTELLIGENT");
    for (const slug of SLUGS) {
      await expect(page.locator(`a[href="/projects/${slug}"]`)).toHaveCount(1);
    }
    await expect(
      page.locator('a[href="mailto:abdullahshafiqueofficiall@gmail.com"]').first(),
    ).toBeAttached();
  });
});

test("dot-nav scrolls #projects into view", async ({ page }) => {
  await page.goto("/");
  await page.locator('nav[aria-label="Sections"] a[href="#projects"]').click();
  await expect(page.locator("#projects")).toBeInViewport({ timeout: 5000 });
});

for (const slug of SLUGS) {
  test(`card opens case study: ${slug}`, async ({ page }) => {
    await page.goto("/");
    await page.locator(`a[href="/projects/${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}

test("reduced motion: no canvas and no lenis class", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(500);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
});

test("unknown project returns 404", async ({ page }) => {
  const res = await page.goto("/projects/does-not-exist");
  expect(res?.status()).toBe(404);
});

test("no horizontal overflow at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  expect(overflow).toBe(true);
});

test("page text has no phone number", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("body").innerText()).not.toContain("+92");
});
