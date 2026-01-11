import { test as base, expect, type Page } from "@playwright/test";

class ConversationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/conversations");
    await this.page.waitForSelector('[data-testid="conversation-list"]');
  }

  async openNewConversationDialog() {
    await this.page.getByRole("button").filter({ has: this.page.locator("svg.lucide-plus") }).click();
    await expect(this.page.getByText("New Conversation")).toBeVisible();
  }

  async selectUser(userName: string) {
    await this.page.getByText(userName).click();
  }

  async createConversation() {
    await this.page.getByRole("button", { name: /start conversation/i }).click();
  }

  async clickFirstConversation() {
    await this.page.getByTestId("conversation-item").first().click();
  }

  async sendMessage(text: string) {
    await this.page.getByTestId("message-input").first().fill(text);
    await this.page.getByTestId("send-button").first().click();
  }

  async waitForMessage(text: string) {
    await expect(this.page.getByText(text).first()).toBeVisible({ timeout: 10000 });
  }

  async deleteFirstConversation() {
    const item = this.page.getByTestId("conversation-item").first();
    await item.hover();
    await item.getByRole("button").click();
  }
}

interface TestFixtures {
  conversationPage: ConversationPage;
}

export const test = base.extend<TestFixtures>({
  conversationPage: async ({ page }, use) => {
    await use(new ConversationPage(page));
  },
});

export { expect } from "@playwright/test";
