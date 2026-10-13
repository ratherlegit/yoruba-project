import { test } from "@playwright/test";

for (const scheme of ["light", "dark"] as const) {
  test(`design screenshots in ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await page.screenshot({ path: `.screenshots/home-${scheme}.png`, fullPage: true });
    await page.goto("/lesson/getting-started/gs-1");
    // Lessons whose words have no steps (e.g. gs-1, which only teaches spelling) show no stepper.
    const showAll = page.getByRole("button", { name: "Show all" }).first();
    if (await showAll.count()) await showAll.click();
    await page.screenshot({ path: `.screenshots/primer-${scheme}.png`, fullPage: true });
    await page.getByRole("button", { name: "Start practice" }).click();
    await page.getByTestId("choice").first().click();
    await page.screenshot({ path: `.screenshots/activity-${scheme}.png`, fullPage: true });
  });
}
