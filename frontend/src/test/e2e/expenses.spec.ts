import { test, expect } from "@playwright/test";

test.describe("Expenses", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route("**/expenses**", async (route) => {
      const url = route.request().url();
      if (url.includes("page=1") || !url.includes("page=")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            expenses: [
              {
                id: 1,
                date: "2024-04-10",
                category: "FUEL",
                amount: 50.0,
                note: "Test expense",
                vehicleId: 1,
                createdAt: "2024-04-10T00:00:00.000Z",
                updatedAt: "2024-04-10T00:00:00.000Z",
              },
            ],
            total: 1,
            totalPages: 1,
          }),
        });
      }
    });

    await page.route("**/vehicles**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            licensePlate: "ABC123",
            make: "Toyota",
            model: "Camry",
            year: 2020,
            vin: "1HGCM82633A123456",
            notes: "Test vehicle",
            createdAt: "2024-04-10T00:00:00.000Z",
            updatedAt: "2024-04-10T00:00:00.000Z",
          },
        ]),
      });
    });

    await page.goto("/");
  });

  test("should display expenses list", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Expense Tracker" })
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Test expense")).toBeVisible();
    await expect(page.getByText("$50.00")).toBeVisible();
  });

  test("should filter expenses by category", async ({ page }) => {
    await page.getByLabel("Category").selectOption("FUEL");
    await expect(page.url()).toContain("category=FUEL");
    await expect(page.getByText("Test expense")).toBeVisible();
  });

  test("should filter expenses by vehicle", async ({ page }) => {
    await page.getByLabel("Vehicle").selectOption("1");
    await expect(page.url()).toContain("vehicleId=1");
    await expect(page.getByText("Test expense")).toBeVisible();
  });

  test("should search expenses", async ({ page }) => {
    await page.getByLabel("Search").fill("test");
    await expect(page.url()).toContain("search=test");
  });

  test("should navigate to add expense page", async ({ page }) => {
    await page.getByRole("link", { name: "Add Expense" }).click();
    await expect(page).toHaveURL("/add-expense");
  });
});
