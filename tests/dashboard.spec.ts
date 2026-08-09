import { test, expect } from "@playwright/test";

test.describe("Dashboard & Vault Management", () => {
  test.beforeEach(async ({ page }) => {
    // Register and sign in a test user before each test run
    await page.goto("/auth");
    const testEmail = `dashboard_test_${Date.now()}@applyaway.app`;

    // Sign up
    await page.click("button:has-text('Sign Up')");
    await page.fill("input[id='name-input']", "Dashboard Tester");
    await page.fill("input[type='email']", testEmail);
    await page.fill("input[type='password']", "Pass123456!");
    await page.click("button[type='submit']");

    // Wait for success banner and switch to sign in
    await expect(page.locator("text=Account created successfully!")).toBeVisible({ timeout: 5000 });

    // Sign in
    await page.fill("input[type='email']", testEmail);
    await page.fill("input[type='password']", "Pass123456!");
    await page.click("button[type='submit']");

    // Should navigate to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 7000 });
  });

  test("should render metric cards and page header controls on dashboard", async ({ page }) => {
    // Header check
    const headerTitle = page.locator("h1");
    await expect(headerTitle).toContainText("Opportunity Vault");

    // Metric cards check
    await expect(page.locator("text=Total Vault")).toBeVisible();
    await expect(page.locator("text=In Progress")).toBeVisible();
    await expect(page.locator("text=Submitted")).toBeVisible();
    await expect(page.locator("text=Due Soon")).toBeVisible();
  });

  test("should open and close the Create Opportunity modal", async ({ page }) => {
    const addBtn = page.locator("button:has-text('Add Opportunity')");
    await addBtn.click();

    // Verify modal title appears
    const modalTitle = page.locator("h3:has-text('Add Opportunity')");
    await expect(modalTitle).toBeVisible();

    // Close modal
    const cancelBtn = page.locator("button:has-text('Cancel')");
    await cancelBtn.click();
    await expect(modalTitle).not.toBeVisible();
  });

  test("should open the AI Quick Capture modal", async ({ page }) => {
    const aiBtn = page.locator("button:has-text('AI Quick Capture')");
    await aiBtn.click();

    // Verify modal title appears
    const modalTitle = page.locator("h3:has-text('AI Quick Capture')");
    await expect(modalTitle).toBeVisible();

    // Verify input method tabs exist
    await expect(page.locator("button:has-text('Website URL')")).toBeVisible();
    await expect(page.locator("button:has-text('Copied Message / Text')")).toBeVisible();
  });
});
