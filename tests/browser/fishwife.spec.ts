import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  ["/", "Weekly Supply Planning Brief"],
  ["/demand", "Which demand signals deserve a change in the plan?"],
  [
    "/supply-commitments",
    "What is already committed - and what is beginning to move?",
  ],
  [
    "/allocation",
    "When supply cannot cover every channel, what should we protect?",
  ],
  [
    "/po-intervention",
    "When a PO slips, which recovery option is worth its cost?",
  ],
  ["/bundles", "The bundle is only as available as its tightest tin."],
  ["/scenario", "What would actually change the decision?"],
  ["/sop", "Between monthly S&OP cycles, which changes deserve intervention?"],
  ["/forecast-learning", "Not every spike deserves a new production plan."],
  [
    "/managed-intelligence",
    "A decision layer above the systems Fishwife already runs.",
  ],
  [
    "/assumptions",
    "What is public, what is illustrative, and what a live Fishwife planning cycle would use.",
  ],
];
for (const [route, title] of routes)
  test(`direct entry, accessibility and responsive layout: ${route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { level: 1, name: title, exact: true }),
    ).toBeVisible();
    await expect(page.locator('nav a[aria-current="page"]')).toHaveAttribute(
      "href",
      route,
    );
    await expect(page.getByTestId("illustrative-disclaimer")).toBeVisible();
    await page
      .getByTestId("illustrative-disclaimer")
      .locator("summary")
      .click();
    await expect(page.getByTestId("illustrative-disclaimer")).toContainText(
      "do not represent Fishwife internal data",
    );
    await expect(
      page.getByTestId("illustrative-disclaimer").getByRole("link"),
    ).toHaveAttribute("href", "/assumptions");
    await page
      .getByTestId("illustrative-disclaimer")
      .locator("summary")
      .click();
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(
      accessibility.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
        details: v.nodes.map((n) => n.failureSummary),
      })),
    ).toEqual([]);
    for (const width of [1280, 768, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
    }
    const mobileAccessibility = await new AxeBuilder({ page }).analyze();
    expect(
      mobileAccessibility.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
test("Becca brief hierarchy and all four accessible decision drawers", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "4 decisions need attention this week" }),
  ).toBeVisible();
  const cards = page.locator(".decision-card");
  await expect(cards).toHaveCount(4);
  const positions = await page.evaluate(() => ({
    card: document.querySelector(".decision-card")!.getBoundingClientRect().top,
    metrics: document.querySelector(".metric-strip")!.getBoundingClientRect()
      .top,
  }));
  expect(positions.card).toBeLessThan(positions.metrics);
  for (let i = 0; i < 4; i++) {
    const trigger = cards.nth(i).getByRole("button");
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const title of [
      "WHAT CHANGED",
      "WHY IT MATTERS",
      "IF THE PLAN STAYS UNCHANGED",
      "SCALESIGHT RECOMMENDATION",
      "DECISION FISHWIFE NEEDS TO MAKE",
    ])
      await expect(
        dialog.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
    await expect(dialog).toContainText("Reviewed by ScaleSight");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({
    path: "test-results/weekly-brief-laptop.png",
    fullPage: true,
  });
});
test("Channel empty state and SKU context update together; reset restores canonical view", async ({
  page,
}) => {
  await page.goto("/demand");
  await expect(
    page.getByRole("img", { name: /Spanish Lemon demand/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "DTC", exact: true }).click();
  await expect(page.locator(".empty-state")).toContainText(
    "No supplied observations for this context.",
  );
  await expect(page.locator(".metric-grid")).not.toContainText("5,600");
  await page.getByLabel("Product context").selectOption("TRT-ORIG");
  await page.getByRole("button", { name: "ALL", exact: true }).click();
  await expect(page.locator(".metric-grid")).toContainText("LOW");
  await page.getByRole("button", { name: "Reset to current plan" }).click();
  await expect(page.getByLabel("Product context")).toHaveValue("TUN-SL");
  await expect(
    page.getByRole("img", { name: /Spanish Lemon demand/ }),
  ).toBeVisible();
});
test("Canonical PO rows are read-only, with missing stage dates", async ({
  page,
}) => {
  await page.goto("/supply-commitments");
  const table = page.getByRole("region", { name: "Canonical purchase orders" });
  await expect(table.locator("tbody tr")).toHaveCount(7);
  await table.getByRole("button", { name: /SAL-FBJ/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("FW-1184");
  await expect(
    dialog.getByRole("heading", { name: "CURRENT COMMITMENT" }),
  ).toBeVisible();
  await expect(dialog.locator("input")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("region", { name: "Aggregate incoming records" }),
  ).toContainText("Soy Ginger");
});
test("Trout and bundle teaching toggles retain separated source contexts", async ({
  page,
}) => {
  await page.goto("/allocation");
  const toggle = page.getByRole("switch", {
    name: "Include discretionary bundle allocation",
  });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(page.getByRole("status")).toContainText(
    "No unallocated tins remain.",
  );
  await expect(page.locator(".allocation-bar")).toHaveAttribute(
    "aria-label",
    "Allocation totals 4,200 tins",
  );
  await page.goto("/bundles");
  const protection = page.getByRole("switch", {
    name: "Protect constrained-account inventory",
  });
  await expect(protection).toHaveAttribute("aria-checked", "true");
  await expect(page.locator(".bundle-capacity")).toContainText("400");
  await expect(page.locator(".bundle-capacity")).toContainText("800");
  await protection.click();
  await expect(page.locator(".bundle-capacity")).toContainText("Above 400");
  await expect(page.locator(".panel").first()).toContainText("quantity");
  await protection.click();
  await expect(page.locator(".bundle-capacity")).toContainText("800");
});
test("FBJ comparison changes costs and quantities without relabeling recommendation", async ({
  page,
}) => {
  await page.goto("/po-intervention");
  await page.getByRole("button", { name: /ACCEPT DELAY/ }).click();
  await expect(page.locator(".two-col>.panel")).toContainText("$0");
  await expect(page.locator(".two-col>.panel")).toContainText("6,200 tins");
  await page.getByRole("button", { name: /FULL EXPEDITE/ }).click();
  await expect(page.locator(".two-col>.panel")).toContainText("$8,400");
  await expect(page.locator(".two-col>.panel")).toContainText(
    "6,000 tins on early freight",
  );
  await expect(
    page.getByRole("button", { name: /SPLIT \+ REDUCE PROMO/ }),
  ).toContainText("SCALESIGHT-REVIEWED RECOMMENDATION");
  await expect(page.locator(".analyst-note")).toContainText("$2,800");
});
test("Four bounded scenario inputs validate, retain last valid state and reset all overrides", async ({
  page,
}) => {
  await page.goto("/scenario");
  await expect(page.locator(".scenario-controls input")).toHaveCount(4);
  await page.getByLabel("Demand change").fill("40");
  await expect(page.locator(".source-context").first()).toContainText("4,200");
  await page.getByLabel("Demand change").fill("41");
  await expect(page.locator(".input-error[role=alert]")).toContainText(
    "Last valid",
  );
  await expect(page.locator(".source-context").first()).toContainText("4,200");
  await page.getByLabel("Receipt delay").fill("1.5");
  await expect(page.getByLabel("Receipt delay")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByLabel("Protected demand").fill("-1");
  await page.getByLabel("Expedite premium").fill("Infinity");
  await page.getByRole("tab", { name: "Supplier slips" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Exact preset values are not supplied",
  );
  await page.getByRole("button", { name: "Reset to current plan" }).click();
  await expect(page.getByLabel("Demand change")).toHaveValue("0");
  await expect(page.getByLabel("Receipt delay")).toHaveValue("0");
  await expect(page.getByLabel("Protected demand")).toHaveValue("");
  await expect(page.getByLabel("Expedite premium")).toHaveValue("");
  await expect(page.locator(".input-error[role=alert]")).toHaveCount(0);
  await expect(
    page.getByRole("tab", { name: "Demand holds higher" }),
  ).toHaveAttribute("aria-selected", "true");
});
test("Managed-service narrative, supplied logos and nine-step cycle", async ({
  page,
}) => {
  await page.goto("/managed-intelligence");
  await expect(page.locator(".cycle-step")).toHaveCount(9);
  await expect(
    page.getByRole("img", { name: "Cin7", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "User-supplied Fishwife tuna variety gift box",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Not another system for Fishwife to operate.",
    }),
  ).toBeVisible();
  await expect(page.locator(".architecture")).toContainText(
    "Fishwife retains the decision.",
  );
  await page.screenshot({
    path: "test-results/managed-intelligence-laptop.png",
    fullPage: true,
  });
});
test("Mobile navigation contains focus and routes remain reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: /How the service works/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Bundles & Assembly" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The bundle is only as available as its tightest tin.",
  );
  await expect(dialog).not.toBeVisible();
});
