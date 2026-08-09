import { test, expect } from "@playwright/test";

test.describe("Sub-route Navigation & Settings", () => {
  test.beforeEach(async ({ page }) => {
    // Register and sign in user
    await page.goto("/auth");
    const testEmail = `nav_test_${Date.now()}@applyaway.app`;

    await page.click("button:has-text('Sign Up')");
    await page.fill("input[id='name-input']", "Nav Tester");
    await page.fill("input[type='email']", testEmail);
    await page.fill("input[type='password']", "Pass123456!");
    await page.click("button[type='submit']");

    await expect(page.locator("text=Account created successfully!")).toBeVisible({ timeout: 5000 });

    await page.fill("input[type='email']", testEmail);
    await page.fill("input[type='password']", "Pass123456!");
    await page.click("button[type='submit']");

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 7000 });
  });

  test("should navigate to Calendar view", async ({ page }) => {
    await page.click("a:has-text('Calendar')");
    await expect(page).toHaveURL(/\/calendar/);

    const title = page.locator("h1");
    await expect(title).toContainText("Deadline Calendar");
  });

  test("should navigate to Reflection view", async ({ page }) => {
    await page.click("a:has-text('Reflection Journey')");
    await expect(page).toHaveURL(/\/reflection/);

    const title = page.locator("h1");
    await expect(title).toContainText("Monthly Reflection Journey");
  });

  test("should navigate to User Profile view", async ({ page }) => {
    await page.click("a:has-text('Profile & Timezone')");
    await expect(page).toHaveURL(/\/profile/);

    const title = page.locator("h1");
    await expect(title).toContainText("Account Profile");
  });
});
