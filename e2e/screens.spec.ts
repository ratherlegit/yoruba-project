import { test } from "@playwright/test";

for (const scheme of ["light", "dark"] as const) {
  test(`design screenshots in ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await page.screenshot({ path: `.screenshots/home-${scheme}.png`, fullPage: true });
    await page.goto("/grammar");
    await page.screenshot({ path: `.screenshots/grammar-${scheme}.png`, fullPage: true });
    await page.goto("/stats");
    await page.screenshot({ path: `.screenshots/stats-${scheme}.png`, fullPage: true });
    await page.goto("/lesson/getting-started/gs-1");
    await page.getByRole("button", { name: "Start practice" }).waitFor();
    await page.screenshot({ path: `.screenshots/primer-${scheme}.png`, fullPage: true });
    await page.getByRole("button", { name: "Start practice" }).click();
    await page.getByTestId("choice").first().click();
    await page.screenshot({ path: `.screenshots/activity-${scheme}.png`, fullPage: true });

    // Dev-only fixture: gs-1 has no word steps, so the stepper is shown here.
    await page.goto("/dev/breakdown");
    await page.getByRole("button", { name: "Next step" }).click();
    await page.waitForTimeout(300); // let the step rise animation finish
    await page.screenshot({ path: `.screenshots/breakdown-step-${scheme}.png`, fullPage: true });
    await page.getByRole("button", { name: "Show all" }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `.screenshots/breakdown-all-${scheme}.png`, fullPage: true });
  });
}
