import { test, expect } from "./fixtures/test-fixtures";

test.describe("Messages", () => {
  test.beforeEach(async ({ conversationPage, page }) => {
    await conversationPage.goto();

    const firstConversation = page.getByTestId("conversation-item").first();
    if (await firstConversation.isVisible()) {
      await firstConversation.click();
      await page.waitForURL(/conversations\/.+/);
    }
  });

  test("displays message input", async ({ page }) => {
    await expect(page.getByTestId("message-input").first()).toBeVisible();
    await expect(page.getByTestId("send-button").first()).toBeVisible();
  });

  test("send button disabled when input empty", async ({ page }) => {
    await expect(page.getByTestId("send-button").first()).toBeDisabled();
  });

  test("sends text message", async ({ conversationPage, page }) => {
    const testMessage = `Test message ${Date.now()}`;

    await conversationPage.sendMessage(testMessage);
    await conversationPage.waitForMessage(testMessage);
  });
});
