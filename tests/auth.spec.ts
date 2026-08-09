import { test, expect } from "@playwright/test";

test.describe("Authentication Flow & UI", () => {
  test("should render the redesigned auth page with brand elements and high-contrast tabs", async ({ page }) => {
    await page.goto("/auth");

    // Check main title headline
    const headline = page.locator("h1");
    await expect(headline).toContainText("Manage all opportunities from one central vault");

    // Check high contrast tab buttons
    const signInTab = page.locator("button:has-text('Sign In')").first();
    const signUpTab = page.locator("button:has-text('Sign Up')").first();

    await expect(signInTab).toBeVisible();
    await expect(signUpTab).toBeVisible();

    // Check Google OAuth button presence
    const googleBtn = page.locator("button:has-text('Continue with Google Account')");
    await expect(googleBtn).toBeVisible();
  });

  test("should reject sign-in for unregistered email address", async ({ page }) => {
    await page.goto("/auth");

    // Fill in non-existent email credentials
    await page.fill("input[type='email']", "unregistered_test_user_99@applyaway.app");
    await page.fill("input[type='password']", "password123");

    // Submit sign in
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();

    // Verify error banner appears instructing user to sign up first
    const errorBanner = page.locator("text=No account found with this email or invalid password. Please sign up first.");
    await expect(errorBanner).toBeVisible({ timeout: 7000 });
  });

  test("should allow user sign-up, trigger welcome alert, and automatically switch to sign-in tab", async ({ page }) => {
    await page.goto("/auth");

    // Switch to Sign Up tab
    const signUpTab = page.locator("button:has-text('Sign Up')").first();
    await signUpTab.click();

    const testEmail = `newuser_${Date.now()}@applyaway.app`;

    // Fill in sign up form
    await page.fill("input[id='name-input']", "Test Automation User");
    await page.fill("input[type='email']", testEmail);
    await page.fill("input[type='password']", "SecurePassword123!");

    // Submit sign up
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();

    // Verify success banner appears and indicates email sent
    const successBanner = page.locator("text=Account created successfully!");
    await expect(successBanner).toBeVisible({ timeout: 7000 });

    // Verify system automatically switches to sign-in tab view
    const cardTitle = page.locator("h2:has-text('Sign In to Vault')");
    await expect(cardTitle).toBeVisible();
  });
});
