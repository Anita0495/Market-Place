import { test, expect } from '@playwright/test';

test('SIGNUP-004: All required fields/selectors are present and functional on signup page', async ({ page }) => {
  await page.goto('http://139.84.135.32:3001/auth/signup');

  // Check presence
  await expect(page.locator('input[name="firstName"]')).toBeVisible();
  await expect(page.locator('input[name="lastName"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('input[name="phoneNumber"]')).toBeVisible();
  await expect(page.locator('select[name="countryCode"]')).toBeVisible();
  await expect(page.locator('input[name="agreeToTerms"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();

  // Check interaction
  await page.fill('input[name="firstName"]', 'TestFirst');
  await page.fill('input[name="lastName"]', 'TestLast');
  await page.fill('input[name="email"]', 'test.user+visible@skysecure.ai');
  await page.fill('input[name="password"]', 'Test@1234');
  await page.selectOption('select[name="countryCode"]', '+91');
  await page.fill('input[name="phoneNumber"]', '9999999999');
  await page.check('input[name="agreeToTerms"]');

  await expect(page.locator('input[name="firstName"]')).toHaveValue('TestFirst');
  await expect(page.locator('input[name="lastName"]')).toHaveValue('TestLast');
  await expect(page.locator('input[name="email"]')).toHaveValue('test.user+visible@skysecure.ai');
  await expect(page.locator('input[name="password"]')).toHaveValue('Test@1234');
  await expect(page.locator('input[name="phoneNumber"]')).toHaveValue('9999999999');
  await expect(page.locator('input[name="agreeToTerms"]')).toBeChecked();
}); 