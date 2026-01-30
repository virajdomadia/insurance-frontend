import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Unified Social Insurance Platform/i);
    await expect(page.getByRole('heading', { name: /NGO Insurance Platform/i })).toBeVisible();
});

test('admin login flow', async ({ page }) => {
    await page.goto('/login');
    // Using simple selectors based on placeholder or type is robust enough for smoke test
    await page.locator('input[type="email"]').fill('admin@insurance.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/admin/dashboard', { timeout: 10000 });
});

test('citizen login flow', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('citizen@example.com');
    await page.locator('input[type="password"]').fill('citizen123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/citizen/dashboard', { timeout: 10000 });
    await expect(page.getByText(/Welcome/i)).toBeVisible();
});
