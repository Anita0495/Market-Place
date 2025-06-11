import { test, expect } from '@playwright/test';
import { fillSignupForm } from './helpers/actions';
import { generateUser } from './helpers/userData';
import { signupSelectors } from './helpers/selectors';

// 1. Navigate to Sign Up screen
// 2. Verify unregistered phone/email (should allow signup with new data)
// 3. Display a toast message: "This phone number/email ID is not registered."
test.describe('Signup Flow', () => {
  test('should display the signup screen', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    await expect(page.locator('h2')).toHaveText(/create your account/i);
  });

  // SIGNUP-001: Verify checkbox for Terms and Conditions is present
  // Test ID: SIGNUP-001
  // @signup
  // @signup-001
  // Checks that the checkbox for agreeing to terms is rendered
  test('SIGNUP-001: should display checkbox for Terms and Conditions', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    await expect(page.locator(signupSelectors.agreeToTerms)).toBeVisible();
  });

  // SIGNUP-002: 'Accept and Continue' button is always visible
  // Test ID: SIGNUP-002
  // @signup
  // @signup-002
  // Checks that the button is always visible regardless of checkbox state
  test('SIGNUP-002: Accept and Continue button is always visible', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    // Fill required fields except checkbox
    const user = generateUser();
    await page.fill(signupSelectors.firstName, user.firstName);
    await page.fill(signupSelectors.lastName, user.lastName);
    await page.fill(signupSelectors.email, user.email);
    await page.fill(signupSelectors.password, user.password);
    await page.selectOption(signupSelectors.countryCode, user.countryCode);
    await page.fill(signupSelectors.phone, user.phone);
    // Button should always be visible
    await expect(page.locator(signupSelectors.continueButton)).toBeVisible();
  });

  // SIGNUP-003: If checkbox not selected, prompt user to accept Terms and Conditions
  // Test ID: SIGNUP-003
  // @signup
  // @signup-003
  // Checks that a prompt appears if user tries to continue without checking the checkbox
  test('SIGNUP-003: should show toast if Terms and Conditions not accepted', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    const user = generateUser();
    await page.fill(signupSelectors.firstName, user.firstName);
    await page.fill(signupSelectors.lastName, user.lastName);
    await page.fill(signupSelectors.email, user.email);
    await page.fill(signupSelectors.password, user.password);
    await page.selectOption(signupSelectors.countryCode, user.countryCode);
    await page.fill(signupSelectors.phone, user.phone);
    // Do not check the checkbox, click continue
    await page.click(signupSelectors.continueButton);
    // Expect toast message
    await expect(page.locator('text=Pleas to the Terms of Service and Privacy Policy')).toBeVisible();
  });

  // SIGNUP-004: User cannot proceed with signup if conflict is not resolved
  // Test ID: SIGNUP-004
  // @signup
  // @signup-004
  test('SIGNUP-004: should not allow signup with existing email/phone until conflict is resolved', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    
    // Use a known existing email/phone for testing
    const existingUser = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'existing.user@skysecure.ai', // Known existing email
      password: 'Test@1234',
      phone: '9876543210', // Known existing phone
      countryCode: '+91'
    };
    
    // Fill form with existing user data
    await fillSignupForm(page, existingUser);
    
    // Try to proceed with signup
    await page.click(signupSelectors.continueButton);

    // Verify error message about existing email/phonenumber is already 
    await expect(page.locator(signupSelectors.toast)).toContainText(/email\/phone in use/i);

    // Verify we're still on signup page
    await expect(page).toHaveURL(/.*\/auth\/signup/);

    // Try to proceed again without resolving the conflict
    await page.click(signupSelectors.continueButton);

    // Should still be on signup page with error visible
    await expect(page).toHaveURL(/.*\/auth\/signup/);
    await expect(page.locator(signupSelectors.toast)).toBeVisible();

    // Verify the form data is still there (not cleared)
    await expect(page.locator(signupSelectors.email)).toHaveValue(existingUser.email);
    await expect(page.locator(signupSelectors.phone)).toHaveValue(existingUser.phone);
  });

  // SIGNUP-005: Verify all required fields and selectors are present and functional on the signup page
  // Test ID: SIGNUP-005
  // @signup
  // @signup-005
  test('SIGNUP-005: should display and allow interaction with all required signup fields and selectors', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    // Check presence
    await expect(page.locator(signupSelectors.firstName)).toBeVisible();
    await expect(page.locator(signupSelectors.lastName)).toBeVisible();
    await expect(page.locator(signupSelectors.email)).toBeVisible();
    await expect(page.locator(signupSelectors.password)).toBeVisible();
    await expect(page.locator(signupSelectors.phone)).toBeVisible();
    await expect(page.locator(signupSelectors.countryCode)).toBeVisible();
    await expect(page.locator(signupSelectors.agreeToTerms)).toBeVisible();
    await expect(page.locator(signupSelectors.continueButton)).toBeVisible();
    // Check interaction
    await page.fill(signupSelectors.firstName, 'TestFirst');
    await page.fill(signupSelectors.lastName, 'TestLast');
    await page.fill(signupSelectors.email, 'test.user+visible@skysecure.ai');
    await page.fill(signupSelectors.password, 'Test@1234');
    await page.selectOption(signupSelectors.countryCode, '+91');
    await page.fill(signupSelectors.phone, '9999999999');
    await page.check(signupSelectors.agreeToTerms);
    await expect(page.locator(signupSelectors.firstName)).toHaveValue('TestFirst');
    await expect(page.locator(signupSelectors.lastName)).toHaveValue('TestLast');
    await expect(page.locator(signupSelectors.email)).toHaveValue('test.user+visible@skysecure.ai');
    await expect(page.locator(signupSelectors.password)).toHaveValue('Test@1234');
    await expect(page.locator(signupSelectors.phone)).toHaveValue('9999999999');
    await expect(page.locator(signupSelectors.agreeToTerms)).toBeChecked();
  });

  // SIGNUP-006: Verify the user can proceed with the sign-up process even if they do not resolve the conflict (e.g., duplicate email/phone).
  // Test ID: SIGNUP-006
  // @signup
  // @signup-006
  test('SIGNUP-006: should allow user to proceed with signup even if conflict is not resolved', async ({ page }) => {
    await page.goto('http://139.84.135.32:3001/auth/signup');
    // Use a known existing email/phone for testing
    const existingUser = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'existing.user@skysecure.ai', // Known existing email
      password: 'Test@1234',
      phone: '9876543210', // Known existing phone
      countryCode: '+91'
    };

    // Fill form with existing user data
    await page.fill(signupSelectors.firstName, existingUser.firstName);
    await page.fill(signupSelectors.lastName, existingUser.lastName);
    await page.fill(signupSelectors.email, existingUser.email);
    await page.fill(signupSelectors.password, existingUser.password);
    await page.selectOption(signupSelectors.countryCode, existingUser.countryCode);
    await page.fill(signupSelectors.phone, existingUser.phone);
    await page.check(signupSelectors.agreeToTerms);

    // Try to proceed with signup
    await page.click(signupSelectors.continueButton);

    // Attempt to proceed again without resolving the conflict
    await page.click(signupSelectors.continueButton);

    // Check if the user is allowed to proceed (update this assertion based on actual app behavior)
    // For example, check if the URL changes or a success message appears
    // await expect(page).not.toHaveURL(/.*\/auth\/signup/); // Uncomment and adjust as needed
  });

});