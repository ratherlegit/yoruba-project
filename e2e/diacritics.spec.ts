import { test } from "@playwright/test";

for (const scheme of ["light", "dark"] as const) {
  test(`diacritics render in ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await page.screenshot({ path: `.screenshots/diacritics-${scheme}.png`, fullPage: true });
  });
}
