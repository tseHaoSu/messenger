import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("unauthenticated user redirects to sign-in", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/conversations");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("sign-in page renders Clerk component", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/sign-in");
    await expect(page.locator(".cl-signIn-root")).toBeVisible();
  });

  test("sign-up page renders Clerk component", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/sign-up");
    await expect(page.locator(".cl-signUp-root")).toBeVisible();
  });
});
