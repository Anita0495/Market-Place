import { test, expect } from '@playwright/test';

// Assumed selectors for login page
const loginSelectors = {
  email: 'input[name="email"]',
  password: 'input[name="password"]',
  submit: 'button[type="submit"]',
};

// Test user (should exist in the system)
const testUser = {
  email: 'existing.user@skysecure.ai',
  password: 'Test@1234',
  name: 'Existing', // Expected name on homepage
};

test.describe('Login Flow', () => {
  test('TS54.1: Ensure homepage shows user\'s name after successful login', async ({ page }) => {
    // Go to login page
    await page.goto('http://139.84.135.32:3001/auth/login');
    // Fill login form
    await page.fill(loginSelectors.email, testUser.email);
    await page.fill(loginSelectors.password, testUser.password);
    await page.click(loginSelectors.submit);
    // Wait for navigation to homepage
    await page.waitForURL('http://139.84.135.32:3001/');
    // Check for personalized greeting
    await expect(page.locator(`text=Welcome, ${testUser.name}`)).toBeVisible();
  });
}); 