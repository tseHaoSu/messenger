import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

setup.describe.configure({ mode: "serial" });

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

setup("global setup", async () => {
  await clerkSetup();
});

setup("authenticate", async ({ page }) => {
  // Check if we have existing auth state
  if (fs.existsSync(authFile)) {
    // Try to use existing auth state
    await page.context().addCookies(JSON.parse(fs.readFileSync(authFile, "utf-8")).cookies);
    await page.goto("/conversations");

    // Check if already authenticated (wait longer for page load)
    const isAuthenticated = await page
      .getByTestId("conversation-list").first()
      .isVisible({ timeout: 10000 })
      .catch(() => false);

    if (isAuthenticated) {
      // Auth state is still valid, save it again to refresh
      await page.context().storageState({ path: authFile });
      return;
    }
  }

  // Need to authenticate - go to sign-in page
  await page.goto("/sign-in");

  // Wait a bit for potential redirect
  await page.waitForTimeout(2000);

  // Check if we got redirected (already authenticated)
  if (!page.url().includes("/sign-in")) {
    await page.goto("/conversations");
    await expect(page.getByTestId("conversation-list").first()).toBeVisible({ timeout: 10000 });
    await page.context().storageState({ path: authFile });
    return;
  }

  await expect(page.locator(".cl-signIn-root")).toBeVisible({ timeout: 10000 });

  // Fill email
  await page.getByLabel("Email address").fill(process.env.E2E_CLERK_USER_USERNAME!);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  // Fill password
  const passwordInput = page.locator('input[name="password"]');
  await expect(passwordInput).toBeVisible({ timeout: 5000 });
  await passwordInput.fill(process.env.E2E_CLERK_USER_PASSWORD!);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  // Handle Client Trust device verification (factor-two)
  // For +clerk_test emails, use code 424242
  const otpPage = page.locator("text=Check your email");
  if (await otpPage.isVisible({ timeout: 3000 }).catch(() => false)) {
    const otpInput = page.getByRole("textbox", { name: "Enter verification code" });
    await expect(otpInput).toBeVisible({ timeout: 5000 });
    await otpInput.click();
    await otpInput.pressSequentially("424242", { delay: 100 });

    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }

  // Wait for redirect after sign-in
  await page.waitForURL((url) => !url.pathname.includes("sign-in"), { timeout: 15000 });

  // Navigate to conversations to ensure authenticated state
  await page.goto("/conversations");
  await expect(page.getByTestId("conversation-list").first()).toBeVisible({ timeout: 10000 });

  await page.context().storageState({ path: authFile });
});
