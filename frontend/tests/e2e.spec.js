import { test, expect } from '@playwright/test';

test.describe('Ocean View Resort E2E Testing', () => {

  test('should load the home page and display correct title', async ({ page }) => {
    // Navigate to the frontend
    await page.goto('/');

    // Validate the page loaded successfully
    await expect(page).toHaveTitle(/Ocean View Resort/i);

    // Verify critical UI elements are visible
    const heroHeader = page.locator('h1', { hasText: 'Experience Luxury Between Sea and Sky' });
    await expect(heroHeader).toBeVisible();
  });

  test('should navigate to the booking page', async ({ page }) => {
    await page.goto('/');

    // Click on the "Book Room" navigation link
    await page.click('text=Book Room');

    // Verify URL changed to booking route
    await expect(page).toHaveURL(/.*\/book/);

    // Verify page content (Assuming Reservations page has a specific title or form)
    await expect(page.locator('h2', { hasText: /Reservation/i })).toBeVisible();
  });

  test('should verify check availability button is present', async ({ page }) => {
    await page.goto('/');

    // Verify the availability button exists on home page
    const checkBtn = page.locator('button', { hasText: 'Check Availability' });
    await expect(checkBtn).toBeVisible();
  });

});
