import { test, expect } from "@playwright/test";
import { fixture } from "../../src/data/fishwife.v1";
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
    page.getByRole("img", { name: /Spanish Lemon Tuna demand/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "DTC", exact: true }).click();
  await expect(
    page.getByRole("img", { name: /Spanish Lemon Tuna demand/ }),
  ).toBeVisible();
  await expect(page.locator(".metric-grid")).toContainText("1,680");
  await page.getByRole("button", { name: "Whole Foods", exact: true }).click();
  await expect(page.getByLabel("Product context")).toHaveValue("TUN-SP");
  await expect(
    page.getByRole("img", { name: /Spicy Tuna demand/ }),
  ).toBeVisible();
  await page.getByLabel("Product context").selectOption("TUN-SL");
  await expect(page.locator(".empty-state")).toContainText(
    "No modeled observations.",
  );
  await expect(page.locator(".metric-grid")).not.toContainText("5,600");
  await page.getByLabel("Product context").selectOption("TRT-ORIG");
  await page.getByRole("button", { name: "ALL", exact: true }).click();
  await expect(page.locator(".metric-grid")).toContainText("LOW");
  await page.getByRole("button", { name: "Reset to current plan" }).click();
  await expect(page.getByLabel("Product context")).toHaveValue("TUN-SL");
  await expect(
    page.getByRole("img", { name: /Spanish Lemon Tuna demand/ }),
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
  await expect(page.locator(".source-context").first()).toContainText("5,040");
  await page.getByLabel("Demand change").fill("41");
  await expect(page.locator(".input-error[role=alert]")).toContainText(
    "Last valid",
  );
  await expect(page.locator(".source-context").first()).toContainText("5,040");
  await page.getByLabel("Receipt delay").fill("1.5");
  await expect(page.getByLabel("Receipt delay")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByLabel("Protected demand").fill("-1");
  await page.getByLabel("Expedite premium").fill("Infinity");
  await page.getByRole("tab", { name: "Supplier slips" }).click();
  await expect(page.getByLabel("Receipt delay")).toHaveValue("2");
  await expect(page.locator(".scenario-outputs")).toContainText("1,600");
  await page.getByRole("button", { name: "Reset to current plan" }).click();
  await expect(page.getByLabel("Demand change")).toHaveValue("0");
  await expect(page.getByLabel("Receipt delay")).toHaveValue("0");
  await expect(page.getByLabel("Protected demand")).toHaveValue("2500");
  await expect(page.getByLabel("Expedite premium")).toHaveValue("3600");
  await expect(page.locator(".input-error[role=alert]")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Current plan", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { selected: true })).toHaveCount(0);
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

test("Every sidebar destination works through client navigation", async ({
  page,
}) => {
  await page.goto("/");
  for (const [route, title] of routes) {
    await page.locator(`nav a[href="${route}"]`).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator('nav a[aria-current="page"]')).toHaveAttribute(
      "href",
      route,
    );
  }
});

test("All PO rows open; same-page analysis dismisses the drawer", async ({
  page,
}) => {
  await page.goto("/supply-commitments");
  const rows = page
    .getByRole("region", { name: "Canonical purchase orders" })
    .locator("tbody tr");
  for (let i = 0; i < 7; i++) {
    const id = await rows.nth(i).locator("td").nth(1).innerText();
    await rows.nth(i).locator("td").nth(1).click();
    await expect(page.getByRole("dialog")).toContainText(id);
    if ([1, 2, 4].includes(i)) {
      await expect(page.getByRole("dialog")).not.toContainText(
        "Needs Fishwife decision",
      );
      await expect(page.getByRole("dialog")).toContainText(
        "Monitoring next cycle",
      );
    }
    await page.getByRole("button", { name: "Close decision" }).click();
  }
  await rows.nth(5).getByRole("button").click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Explore the analysis" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("Mobile footer navigation and resize release the menu and scroll lock", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".sidebar")).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "How the service works" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    routes[9][1],
  );
  await expect(page.locator(".sidebar")).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator(".nav-backdrop")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator(".sidebar")).toBeVisible();
});

test("All 84 demand contexts chart modeled shares and preserve zero-share empty states", async ({
  page,
}) => {
  await page.goto("/demand");
  await page.getByText("View weekly observations and assumptions").click();
  await expect(
    page
      .getByRole("region", { name: "Weekly observations", exact: true })
      .locator("tbody tr"),
  ).toHaveCount(16);
  for (const model of fixture.modeledDemand) {
    const channels = page.locator(".channel-tabs button");
    for (let i = 0; i < 7; i++) {
      await channels.nth(i).click();
      await page.getByLabel("Product context").selectOption(model.sku);
      if (i === 0 || model.shares[i - 1] > 0) {
        await expect(page.locator(".planning-plot")).toBeVisible();
        await expect(
          page.locator(".metric-grid .metric").first(),
        ).not.toContainText("—");
        await expect(page.locator(".metric-grid")).toContainText(
          model.sku === "TRT-ORIG" && i === 4 ? "LOW" : model.confidence,
        );
      } else {
        await expect(page.locator(".empty-state")).toContainText(
          "No modeled observations.",
        );
        await expect(page.locator(".planning-plot")).toHaveCount(0);
      }
    }
  }
});

test("Every recovery comparison updates its chart, exposure, quantities and cost", async ({
  page,
}) => {
  await page.goto("/po-intervention");
  const cards = page.locator(".option-card");
  for (const [i, cost, early, standard] of [
    [0, "$0", "0", "6,000"],
    [1, "$8,400", "6,000", "0"],
    [2, "$5,600", "4,000", "2,000"],
    [3, "$5,600", "4,000", "2,000"],
  ] as const) {
    await cards.nth(i).click();
    await expect(cards.nth(i)).toHaveAttribute("aria-pressed", "true");
    const panel = page.locator(".two-col>.panel");
    await expect(panel).toContainText(cost);
    await expect(
      panel.getByRole("img", { name: /FBJ recovery inventory/ }),
    ).toBeVisible();
    await expect(
      panel.locator(".metric").filter({ hasText: "Service exposure" }),
    ).toContainText(["6,200", "200", "2,200", "0"][i]);
    await expect(
      panel.locator(".metric").filter({ hasText: "Service units protected" }),
    ).toContainText(["0", "6,000", "4,000", "6,200"][i]);
    await expect(panel).toContainText(
      `${early} tins on early freight · ${standard} on standard freight`,
    );
  }
});

test("Scenario presets, all controls, premium threshold and keyboard tabs calculate live", async ({
  page,
}) => {
  await page.goto("/scenario");
  const response = page.getByTestId("scenario-response");
  await expect(response.locator(".badge")).toHaveText("HOLD");
  await page.getByRole("tab", { name: "Demand holds higher" }).click();
  await expect(page.getByLabel("Demand change")).toHaveValue("25");
  await expect(page.locator(".scenario-outputs")).toContainText("Week 2");
  await expect(response.locator(".badge")).toHaveText("SPLIT");
  await expect(page.locator(".scenario-outputs")).toContainText("$3,600");
  await page.getByLabel("Expedite premium").fill("4001");
  await expect(response.locator(".badge")).toHaveText("INVESTIGATE");
  await page.getByLabel("Expedite premium").fill("2400");
  await expect(page.locator(".scenario-outputs")).toContainText("$2,400");
  await page.getByLabel("Protected demand").fill("1900");
  await expect(response.locator(".badge")).toHaveText("HOLD");
  await page.getByRole("tab", { name: "Supplier slips" }).click();
  await expect(page.getByLabel("Receipt delay")).toHaveValue("2");
  await expect(page.locator(".scenario-outputs")).toContainText("Week 6");
  await expect(page.locator(".scenario-outputs")).toContainText("1,600");
  await page.getByRole("tab").nth(1).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab").last()).toBeFocused();
  await expect(response.locator(".badge")).toHaveText("WATCH / HOLD");
  await expect(page.locator(".scenario-outputs")).toContainText("Week 3");
  await expect(page.locator(".scenario-outputs")).toContainText("$0");
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab").first()).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByLabel("Receipt delay").fill("6");
  await expect(response.locator(".badge")).toHaveText("EXPEDITE");
  await page.getByRole("button", { name: "Reset to current plan" }).click();
  await expect(response.locator(".badge")).toHaveText("HOLD");
});

test("Disclosure navigation closes the persistent disclosure", async ({
  page,
}) => {
  await page.goto("/");
  const disclosure = page.getByTestId("illustrative-disclaimer");
  await disclosure.locator("summary").click();
  await disclosure.getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    routes[10][1],
  );
  await expect(disclosure).not.toHaveAttribute("open");
});

test("Every weekly decision follows through to its analysis and releases the drawer", async ({
  page,
}) => {
  for (let i = 0; i < 4; i++) {
    await page.goto("/");
    await page.locator(".decision-card").nth(i).getByRole("button").click();
    const link = page
      .getByRole("dialog")
      .getByRole("link", { name: "Explore the analysis" });
    const target = await link.getAttribute("href");
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
});

test("Internal links, source anchors and loaded brand assets resolve across all routes", async ({
  page,
}) => {
  const paths = new Set(routes.map(([route]) => route));
  const targets = new Set<string>();
  for (const [route] of routes) {
    await page.goto(route);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")!));
    for (const link of links) {
      expect(paths.has(link.split("#")[0])).toBe(true);
      if (link.includes("#")) targets.add(link);
    }
    await page.locator(".page-footer").scrollIntoViewIfNeeded();
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(
        await img.evaluate((n) => (n as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
    }
  }
  for (const target of targets) {
    await page.goto(target);
    await expect(page.locator(`[id="${target.split("#")[1]}"]`)).toHaveCount(1);
  }
});

test("Supply timeline status labels fit their cells at laptop widths", async ({
  page,
}) => {
  await page.goto("/supply-commitments");
  for (const width of [1440, 1280, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const badge of await page.locator(".timeline .badge").all()) {
      expect(
        await badge.evaluate((el) => {
          const cell = el.parentElement!.getBoundingClientRect();
          const label = el.getBoundingClientRect();
          return label.right <= cell.right + 1 && label.left >= cell.left;
        }),
      ).toBe(true);
    }
  }
});
