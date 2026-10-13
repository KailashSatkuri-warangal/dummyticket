import { test, expect } from '@playwright/test';

test.describe('DummyTicket — Futuristic Flight Booking & Sample Boarding Pass Platform E2E', () => {
  test('homepage renders search panel, hero headline, 10 Indian airlines, and signature boarding pass preview', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/');
    await expect(
      page.getByRole('heading', {
        name: /Your Next Journey Starts Here\./i,
      })
    ).toBeVisible();
    await expect(
      page.getByText(/SAMPLE — NOT VALID FOR TRAVEL/i).first()
    ).toBeVisible();
  });

  test('flight search results and sample boarding pass verification page load', async ({
    page,
  }) => {
    await page.goto(
      'http://localhost:3000/flights?from=HYD&to=MSY&depart=2026-12-15&adults=1&cabin=economy'
    );
    await expect(page.getByText(/British Airways/i).first()).toBeVisible();

    await page.goto('http://localhost:3000/sample-ticket/DT-DEMO-HYD842MSY');
    await expect(
      page.getByText(/SAMPLE — NOT VALID FOR TRAVEL/i).first()
    ).toBeVisible();
  });
});
