import { test, expect } from "@playwright/test";

test.describe("Add Expense", () => {
  test.beforeEach(async ({ page }) => {
    // Mock vehicles API
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

    await page.goto("/add-expense");
  });

  test("should display add expense form", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Add Expense" })
    ).toBeVisible();
    await expect(page.getByLabel("Date")).toBeVisible();
    await expect(page.getByLabel("Vehicle")).toBeVisible();
    await expect(page.getByLabel("Category")).toBeVisible();
    await expect(page.getByLabel("Amount")).toBeVisible();
    await expect(page.getByLabel("Note")).toBeVisible();
  });

  test("should submit valid expense", async ({ page }) => {
    // Mock successful expense creation
    await page.route("**/expenses**", async (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          ...body,
          createdAt: "2024-04-10T00:00:00.000Z",
          updatedAt: "2024-04-10T00:00:00.000Z",
        }),
      });
    });

    await page.getByLabel("Date").fill("2024-04-10");
    await page.getByLabel("Vehicle").selectOption("1");
    await page.getByLabel("Category").selectOption("FUEL");
    await page.getByLabel("Amount").fill("50.00");
    await page.getByLabel("Note").fill("Test expense");
    await page.getByRole("button", { name: "Save Expense" }).click();

    // Should redirect to expenses list
    await expect(page).toHaveURL("/expenses");
  });

  test("should show validation errors for invalid input", async ({ page }) => {
    await page.getByRole("button", { name: "Save Expense" }).click();

    // Check for validation error messages
    await expect(page.getByText("Date is required")).toBeVisible();
    await expect(page.getByText("Vehicle is required")).toBeVisible();
    await expect(page.getByText("Category is required")).toBeVisible();
    await expect(page.getByText("Amount is required")).toBeVisible();
  });

  test("should show error for invalid amount", async ({ page }) => {
    // Mock validation error response
    await page.route("**/expenses**", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          statusCode: 400,
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: {
            amount: ["Amount must be positive"],
          },
          timestamp: "2024-04-10T00:00:00.000Z",
          path: "/expenses",
        }),
      });
    });

    await page.getByLabel("Date").fill("2024-04-10");
    await page.getByLabel("Vehicle").selectOption("1");
    await page.getByLabel("Category").selectOption("FUEL");
    await page.getByLabel("Amount").fill("-50.00");
    await page.getByLabel("Note").fill("Test expense");
    await page.getByRole("button", { name: "Save Expense" }).click();

    await expect(page.getByText("Amount must be positive")).toBeVisible();
  });
});
