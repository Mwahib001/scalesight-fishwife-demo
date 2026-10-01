import { test, expect } from "@playwright/test";

const widgetScript = "https://assets.calendly.com/assets/external/widget.js";
const bookingUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/kazmiarmanmehdi/30min";

for (const path of ["/managed-intelligence", "/assumptions"]) {
  test(`booking opens in-page and reopens after close: ${path}`, async ({
    page,
  }) => {
    let scriptRequests = 0;
    // Isolate the integration from live availability; never submit a booking.
    await page.route(widgetScript, async (route) => {
      scriptRequests++;
      await route.fulfill({
        contentType: "application/javascript",
        body: `window.Calendly = { initInlineWidget({ url, parentElement }) {
          const frame = document.createElement('iframe');
          frame.title = 'Calendly scheduling';
          frame.dataset.bookingUrl = url;
          frame.srcdoc = '<p>Select a time</p>';
          parentElement.appendChild(frame);
        } };`,
      });
    });
    await page.goto(path);
    const book = page.getByRole("button", { name: "Book a call", exact: true });
    await expect(
      page.getByRole("link", { name: "Email us", exact: true }),
    ).toHaveAttribute(
      "href",
      "mailto:arman@scalesight.org?subject=NATURANA%20Planning%20Pilot",
    );
    await expect(book).toBeVisible();
    expect(scriptRequests).toBe(0);
    for (let attempt = 0; attempt < 2; attempt++) {
      await book.click();
      const dialog = page.getByRole("dialog", {
        name: "Book a call",
        exact: true,
      });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("iframe")).toHaveAttribute(
        "data-booking-url",
        bookingUrl,
      );
      const bounds = await dialog.boundingBox();
      expect(bounds).not.toBeNull();
      expect(
        Math.abs(
          bounds!.x + bounds!.width / 2 - page.viewportSize()!.width / 2,
        ),
      ).toBeLessThan(2);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      expect(page.context().pages()).toHaveLength(1);
      await expect
        .poll(() => page.evaluate(() => document.body.style.overflow))
        .toBe("hidden");
      if (attempt === 0) await page.keyboard.press("Escape");
      else await page.getByRole("button", { name: "Close booking" }).click();
      await expect(dialog).toHaveCount(0);
      await expect(book).toBeFocused();
      await expect
        .poll(() => page.evaluate(() => document.body.style.overflow))
        .not.toBe("hidden");
    }
    expect(scriptRequests).toBe(1);
    await page.setViewportSize({ width: 390, height: 844 });
    await book.click();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.getByRole("button", { name: "Close booking" }).click();
  });
}

test("failed Calendly script keeps an email fallback and close control", async ({
  page,
}) => {
  await page.route(widgetScript, (route) => route.abort());
  await page.goto("/managed-intelligence");
  await page.getByRole("button", { name: "Book a call", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Book a call", exact: true });
  await expect(dialog.getByRole("alert")).toContainText(
    "Calendly could not load",
  );
  await expect(dialog.getByRole("link", { name: "email us" })).toHaveAttribute(
    "href",
    /^mailto:/,
  );
  await page.getByRole("button", { name: "Close booking" }).click();
  await expect(dialog).toHaveCount(0);
});
