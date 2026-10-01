import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  ["/", "Weekly Planning Brief"],
  ["/size-translation", "Two sizing systems. One planning view."],
  ["/size-demand", "The commercial size curve is already moving."],
  ["/sku-planning", "SKU & Size Planning"],
  ["/fit-signal", "Strong sales do not always mean deeper demand."],
  ["/next-buy", "Where should the next inventory euro go?"],
  ["/scenario", "Scenario Planning"],
  [
    "/forecast-learning",
    "The first plan is an assumption. The next plan should learn.",
  ],
  ["/managed-intelligence", "The workspace is only one part of the service."],
  [
    "/assumptions",
    "What is real, what is assumed, and what a live workspace would use.",
  ],
];
for (const [route, title] of routes)
  test(`route, disclaimer, responsive and accessibility: ${route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("illustrative-disclaimer")).toBeVisible();
    await expect(page.getByTestId("illustrative-disclaimer")).toContainText(
      "synthetic assumptions",
    );
    await expect(page.locator('nav a[aria-current="page"]')).toHaveAttribute(
      "href",
      route,
    );
    await expect(page.locator("body")).not.toContainText(
      /Kelarune|Mango|\bNaN\b|\bInfinity\b|your data|your sales|connected to your ERP|Plum 90E/i,
    );
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(
      a11y.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    for (const [width, height] of [
      [1440, 900],
      [1280, 720],
      [768, 1024],
      [390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          { message: `${route} at ${width}` },
        )
        .toBe(true);
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `test-results/naturana-${route === "/" ? "brief" : route.slice(1)}-${width}.png`,
          fullPage: true,
        });
    }
    await page.reload();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
test("85 variants, all filters, pagination, source prices and accessible decision drawer", async ({
  page,
}) => {
  await page.goto("/sku-planning");
  const rows = page.locator(".variant-table tbody tr");
  await expect(rows).toHaveCount(20);
  await expect(rows.first()).toContainText("BUY DEEPER");
  await expect(page.locator(".pagination")).toContainText("1–20 of 85");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(rows).toHaveCount(5);
  await expect(
    page.getByRole("button", { name: "Next page", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page
    .getByLabel("Decision", { exact: true })
    .selectOption("INVESTIGATE");
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText("U-257-002-L");
  await page
    .getByRole("button", {
      name: "Review Wire-free Balconette Bra - Cherry L",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("7333468033635");
  await expect(dialog.getByTestId("storefront-price")).toHaveText("€79.00");
  await expect(dialog).toContainText("Fit signal review");
  await expect(dialog.locator(".drawer-metrics").nth(1)).toContainText("25");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Review Wire-free Balconette Bra - Cherry L",
      exact: true,
    }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Clear filters" }).click();
  for (const [label, value, expected] of [
    ["Product", "PL-BRA", 19],
    ["Colour", "Cherry", 14],
    ["Product type", "Bottom", 20],
    ["Size system", "ALPHA", 20],
    ["Size", "M", 4],
    ["Set", "CP", 14],
    ["Risk", "risk", 4],
  ] as const) {
    await page.getByLabel(label, { exact: true }).selectOption(value);
    await expect(rows).toHaveCount(expected);
    await page.getByRole("button", { name: "Clear filters" }).click();
  }
  await page.getByLabel("Product", { exact: true }).selectOption("DL-BRA");
  await page.getByLabel("Size", { exact: true }).selectOption("M");
  await expect(
    page.getByText("No variants match these filters."),
  ).toBeVisible();
  await page.goto("/sku-planning?variant=PL-BRA-80C");
  await expect(
    page.getByRole("dialog").getByTestId("storefront-price"),
  ).toHaveText("€59.90");
  await expect(page.getByRole("dialog")).toContainText("4055403909111");
  await page.getByRole("button", { name: "Close variant decision" }).click();
  await page.goto("/sku-planning?variant=DL-BRA-70B");
  await expect(page.getByRole("dialog")).not.toContainText(
    "ScaleSight Analysis",
  );
  await expect(
    page.getByRole("dialog").getByTestId("storefront-price"),
  ).toHaveText("€64.95");
});
test("canonical presets, shared state, custom suppression and atomic reset", async ({
  page,
}) => {
  await page.goto("/scenario");
  const output = page.locator(".scenario-output");
  await expect(output).toContainText("€47,500");
  await expect(output).toContainText("€2,500");
  await page.getByRole("button", { name: "Upside", exact: true }).click();
  await expect(output).toContainText("€57,500");
  await expect(output).toContainText("€7,500");
  await expect(
    page.getByRole("slider", { name: "Overall demand uplift", exact: true }),
  ).toHaveValue("15");
  await expect(
    page.getByRole("slider", { name: "M demand adjustment", exact: true }),
  ).toHaveValue("10");
  await page.getByRole("link", { name: "Next Buy", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Upside", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("main")).not.toContainText(
    "Recommended planning allocation under current assumptions.",
  );
  await page.getByLabel("OTB budget (€)").fill("65000");
  await expect(
    page.getByRole("heading", { name: "Custom: not calibrated in V1" }),
  ).toBeVisible();
  await expect(page.locator(".scenario-output")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Scenario Planning", exact: true })
    .click();
  await expect(
    page.getByRole("slider", { name: "Open-to-buy (€)", exact: true }),
  ).toHaveValue("65000");
  await expect(page.locator(".scenario-output")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Supplier Delay", exact: true })
    .click();
  await expect(output).toContainText("26");
  await expect(output).toContainText("€8,500");
  await expect(output).not.toContainText("€56,000");
  await expect(
    page.getByRole("slider", { name: "Lead-time change", exact: true }),
  ).toHaveValue("2");
  await page.getByRole("button", { name: "Fit Friction", exact: true }).click();
  await expect(output).toContainText("-12%");
  await expect(output).toContainText("+6%");
  await expect(
    page.getByRole("slider", {
      name: "L exchange-rate adjustment",
      exact: true,
    }),
  ).toHaveValue("5");
  await page.getByLabel("Promotion extension", { exact: true }).check();
  await expect(output).toHaveCount(0);
  await page
    .locator(".preset-controls")
    .getByRole("button", { name: "Reset to Base Plan" })
    .click();
  await expect(output).toContainText("€47,500");
  await expect(
    page.getByLabel("Promotion extension", { exact: true }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("slider", { name: "Open-to-buy (€)", exact: true }),
  ).toHaveValue("50000");
  await page.getByRole("link", { name: "Next Buy", exact: true }).click();
  await expect(
    page.getByLabel("Planning horizon", { exact: true }),
  ).toHaveValue("8");
  await expect(page.getByLabel("Reserve percentage")).toHaveValue("5");
  await expect(
    page.getByLabel("Fit-adjusted demand", { exact: true }),
  ).toBeChecked();
});
test("fit story, exact curves and only two detailed set risks", async ({
  page,
}) => {
  await page.goto("/fit-signal");
  for (const [index, retained, plan] of [
    [0, "25", "86 vs plan"],
    [1, "31", "119 vs plan"],
    [2, "37", "128 vs plan"],
  ] as const) {
    const card = page.locator(".fit-card").nth(index);
    await expect(card.locator(".retained-row dd")).toHaveText(retained);
    await expect(card).toContainText(plan);
  }
  await expect(page.locator(".exchange-story")).toContainText("4 of 6 · 67%");
  await page.goto("/size-demand");
  await expect(
    page.getByRole("cell", { name: "33%", exact: true }),
  ).toBeVisible();
  const toggle = page.getByRole("button", {
    name: "Gross launch mix",
    exact: true,
  });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.goto("/sku-planning#sets");
  await expect(page.locator(".set-card")).toHaveCount(2);
  await expect(page.locator(".set-card").first()).toContainText("2.0");
  await expect(page.locator(".set-card").first()).toContainText("1.8");
  await expect(page.locator(".set-card").last()).toContainText("2.2");
  await expect(page.locator(".set-card").last()).toContainText("1.7");
});
test("managed service, customisation, primary navigation and mobile keyboard", async ({
  page,
}) => {
  await page.goto("/managed-intelligence");
  await expect(page.locator(".service-hero")).toContainText(
    "Analysis maintained by ScaleSight. Decisions made with NATURANA.",
  );
  await expect(page.getByRole("tab")).toHaveCount(10);
  await page
    .getByRole("tab", { name: "04 ScaleSight Specialist Review" })
    .click();
  await expect(page.getByRole("tabpanel")).toContainText("Working capital");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toContainText(
    "What actually deserves management attention?",
  );
  await expect(
    page.getByRole("link", { name: "Email us", exact: true }),
  ).toHaveAttribute("href", /^mailto:arman@scalesight.org/);
  await page
    .getByRole("link", { name: "See what could be customised" })
    .click();
  await expect(page.locator("#customisation")).toContainText(
    "Built around how NATURANA actually plans",
  );
  await expect(page.locator("#customisation")).toContainText(
    "No live connection",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const nav = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(nav).toBeVisible();
  await expect(
    nav.getByRole("link", { name: "Managed Intelligence", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});
test("removed demo routes return 404", async ({ page }) => {
  for (const route of [
    "/inventory",
    "/revenue-forecast",
    "/demand-forecast",
    "/intelligence",
    "/forecast",
    "/customer-growth",
    "/partnership",
    "/advisor-brief",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
  }
});
