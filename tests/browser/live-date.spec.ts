import { expect, test } from "@playwright/test";

test.use({ timezoneId: "Asia/Karachi" });

test("dates follow local midnight, the Monday review cycle, and year rollover", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-12-27T23:59:57+05:00") });
  await page.clock.pauseAt(new Date("2026-12-27T23:59:58+05:00"));
  await page.goto("/");

  await expect(page.locator(".refresh time")).toHaveText("27 Dec 2026");
  await expect(page.locator(".issue-line time").first()).toHaveText(
    "21 Dec 2026",
  );
  await expect(page.locator(".brief-meta time").last()).toHaveText(
    "28 Dec 2026",
  );

  await page.clock.runFor(3_000);
  await expect(page.locator(".refresh time")).toHaveText("28 Dec 2026");
  await expect(page.locator(".issue-line time").first()).toHaveText(
    "28 Dec 2026",
  );
  await expect(page.locator(".brief-meta time").last()).toHaveText(
    "4 Jan 2027",
  );

  await page.clock.setSystemTime(new Date("2027-01-01T12:00:00+05:00"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.locator(".refresh time")).toHaveText("1 Jan 2027");
  await expect(page.locator(".issue-line time").last()).toHaveText(
    "1 JAN 2027",
  );
  await expect(page.locator(".refresh time")).toHaveAttribute(
    "datetime",
    "2027-01-01",
  );
});
