import { test, expect } from "./fixtures/test-fixtures";

test.describe("Conversations", () => {
  test("displays conversation list", async ({ page }) => {
    await page.goto("/conversations");
    await expect(page.getByTestId("conversation-list").first()).toBeVisible();
  });

  test("opens new conversation dialog", async ({ conversationPage }) => {
    await conversationPage.goto();
    await conversationPage.openNewConversationDialog();
  });

  test("navigates to conversation detail", async ({ conversationPage, page }) => {
    await conversationPage.goto();

    const firstConversation = page.getByTestId("conversation-item").first();
    if (await firstConversation.isVisible()) {
      await firstConversation.click();
      await expect(page).toHaveURL(/conversations\/.+/);
    }
  });
});
