import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
	protected page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Navigate to a specific path
	 */
	async goto(path: string): Promise<void> {
		await this.page.goto(path);
	}

	/**
	 * Wait for page to be loaded (no network activity)
	 */
	async waitForPageLoad(): Promise<void> {
		await this.page.waitForLoadState('networkidle');
	}

	/**
	 * Wait for an element to be visible
	 */
	async waitForElement(selector: string): Promise<Locator> {
		const element = this.page.locator(selector);
		await element.waitFor({ state: 'visible' });
		return element;
	}

	/**
	 * Wait for an element to be hidden
	 */
	async waitForElementToBeHidden(selector: string): Promise<void> {
		const element = this.page.locator(selector);
		await element.waitFor({ state: 'hidden' });
	}

	/**
	 * Fill a form field
	 */
	async fillField(selector: string, value: string): Promise<void> {
		await this.page.locator(selector).fill(value);
	}

	/**
	 * Click an element
	 */
	async clickElement(selector: string): Promise<void> {
		await this.page.locator(selector).click();
	}

	/**
	 * Get text content of an element
	 */
	async getElementText(selector: string): Promise<string> {
		return await this.page.locator(selector).textContent() || '';
	}

	/**
	 * Check if an element is visible
	 */
	async isElementVisible(selector: string): Promise<boolean> {
		try {
			await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Check if an element contains specific text
	 */
	async elementContainsText(selector: string, text: string): Promise<boolean> {
		const element = this.page.locator(selector);
		await expect(element).toContainText(text);
		return true;
	}

	/**
	 * Wait for URL to contain specific path
	 */
	async waitForUrl(urlPart: string): Promise<void> {
		await this.page.waitForURL(`**/${urlPart}**`);
	}

	/**
	 * Get current URL
	 */
	getCurrentUrl(): string {
		return this.page.url();
	}

	/**
	 * Reload the current page
	 */
	async reload(): Promise<void> {
		await this.page.reload();
	}

	/**
	 * Take a screenshot
	 */
	async takeScreenshot(name?: string): Promise<Buffer> {
		return await this.page.screenshot({ fullPage: true, path: name });
	}

	/**
	 * Check for error messages on the page
	 */
	async getErrorMessage(): Promise<string | null> {
		const errorSelectors = [
			'[data-testid="error-message"]',
			'.error-message',
			'.alert-error',
			'.text-red-500',
			'[role="alert"]'
		];

		for (const selector of errorSelectors) {
			if (await this.isElementVisible(selector)) {
				return await this.getElementText(selector);
			}
		}

		return null;
	}

	/**
	 * Check for success messages on the page
	 */
	async getSuccessMessage(): Promise<string | null> {
		const successSelectors = [
			'[data-testid="success-message"]',
			'.success-message',
			'.alert-success',
			'.text-green-500'
		];

		for (const selector of successSelectors) {
			if (await this.isElementVisible(selector)) {
				return await this.getElementText(selector);
			}
		}

		return null;
	}

	/**
	 * Wait for form submission to complete
	 */
	async waitForFormSubmission(): Promise<void> {
		// Wait for any loading indicators to disappear
		const loadingSelectors = [
			'[data-testid="loading"]',
			'.loading',
			'.spinner',
			'button[disabled]'
		];

		for (const selector of loadingSelectors) {
			try {
				await this.page.locator(selector).waitFor({ state: 'hidden', timeout: 10000 });
			} catch {
				// Continue if element doesn't exist
			}
		}

		// Wait for network to be idle
		await this.waitForPageLoad();
	}

	/**
	 * Assert that we're on the correct page
	 */
	async assertOnPage(expectedPath: string): Promise<void> {
		await expect(this.page).toHaveURL(new RegExp(expectedPath));
	}

	/**
	 * Assert that an element is visible
	 */
	async assertElementVisible(selector: string): Promise<void> {
		await expect(this.page.locator(selector)).toBeVisible();
	}

	/**
	 * Assert that an element contains text
	 */
	async assertElementContainsText(selector: string, text: string): Promise<void> {
		await expect(this.page.locator(selector)).toContainText(text);
	}

	/**
	 * Get page title
	 */
	async getPageTitle(): Promise<string> {
		return await this.page.title();
	}
} 