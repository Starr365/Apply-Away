import { test, expect } from "@playwright/test";

test.describe("Apply Away Landing Page", () => {
  test("should render the landing page with proper elements", async ({ page }) => {
    // Navigate to root
    await page.goto("/");

    // Verify main headline contains "Never miss another"
    const heading = page.locator("h1");
    await expect(heading).toContainText("Never miss another");

    // Verify footer branding text is visible
    const footerText = page.locator("footer");
    await expect(footerText).toContainText("Apply Away");
  });

  test("should simulate AI extraction mock capture when clicking parse", async ({ page }) => {
    await page.goto("/");

    // Locate simulation button
    const parseBtn = page.locator("button:has-text('Parse link')");
    await expect(parseBtn).toBeVisible();

    // Click to simulate parse
    await parseBtn.click();

    // Verify output mock values appear
    const resultTitle = page.locator("text=Schwarzman Scholars Fellowship");
    await expect(resultTitle).toBeVisible({ timeout: 5000 });
  });

  test("should toggle expandable questions in FAQ accordion", async ({ page }) => {
    await page.goto("/");

    // Locate first FAQ toggle button
    const faqToggle = page.locator("button:has-text('What is Apply Away?')");
    await expect(faqToggle).toBeVisible();

    // Verify the inner details are collapsed/hidden initially
    const answer = page.locator("text=Apply Away is your personal opportunity management workspace");
    await expect(answer).not.toBeVisible();

    // Click to expand the item
    await faqToggle.click();

    // Verify details are now displayed
    await expect(answer).toBeVisible();
  });
});
