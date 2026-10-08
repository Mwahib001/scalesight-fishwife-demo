# Fishwife implementation QA — synthetic fixture v1.1

Reviewed against the original PDF and the user-supplied synthetic supplement on 8 October 2026. All v1.1 histories, channel shares, costs, quantities and policies are illustrative demo inputs, not Fishwife actuals.

## Completed interactive calculations

### Demand and forecast learning

All 12 SKUs have the supplied 13-week history from 13 July through 5 October. Six channel series are generated from the exact supplied shares. Each weekly channel sum reconciles to the SKU total after assigning rounding residuals to the largest modeled channel (first in supplied order for ties). All nonzero channels inherit the supplied SKU confidence; zero-share channels explicitly show “No modeled observations,” not zero actual demand. Three forward weeks are visibly distinct planning assumptions.

Spanish Lemon preserves the original nine observations, 4,300 pre-event baseline, 5,600 current signal, 5,500 recent four-week mean, 30.2% current variance and 27.9% persistence uplift. Event annotation is confined to Spanish Lemon.

### FBJ PO intervention

Receipt convention: period-start receipts are available before demand. Charts show physical inventory, receipt markers, safety reserve and unmet demand, with an accessible numeric table. All options use the same W1–W5 exposure window, ending before the delayed 12 November receipt.

| Option               | Exposure · tins | Units protected vs delay | Incremental recovery |
| -------------------- | --------------: | -----------------------: | -------------------: |
| Accept delay         |           6,200 |                        0 |                   $0 |
| Full expedite        |             200 |                    6,000 |               $8,400 |
| Split                |           2,200 |                    4,000 |               $5,600 |
| Split + reduce promo |               0 |                    6,200 |               $5,600 |

The recommended option removes 2,400 promotional tins and leaves 200 physical tins before the final receipt. It reaches zero closing stock in W3 without unmet demand; zero exposure is not a claim that safety stock is maintained. Existing PO value is $32,400 and is not charged again as incremental recovery cash. Selection changes the analysis while preserving the reviewed recommendation.

### Gold Label scenarios

The page starts in the reviewed current HOLD plan. Each of the three tabs loads its exact supplied preset. Valid edits recalculate demand, safety reserve, pre-receipt stockout/safety breach, exposure, response and incremental cash. Invalid inputs retain the last valid results; reset clears overrides and restores the current plan.

| Case                  | Stockout before receipt | Safety breach | Exposure | Response     | Incremental recovery |
| --------------------- | ----------------------- | ------------- | -------: | ------------ | -------------------: |
| Current plan          | None                    | W4            |        0 | HOLD         |                   $0 |
| Demand +25%           | None                    | W2            |        0 | SPLIT        |               $3,600 |
| Supplier +2 weeks     | W6                      | W4            |    1,600 | SPLIT        |               $3,600 |
| Retailer pull-forward | None                    | W3            |        0 | WATCH / HOLD |                   $0 |

Demand +25% leaves 2,000 pre-receipt tins, below the 2,500 protected-demand threshold. Supplier delay recovery removes the 1,600-tin exposure. Pull-forward preserves the supplied six-week total. Threshold boundary tests cover $4,000/$4,001 and 2,000/2,001 protected tins. Extreme demand/delay returns EXPEDITE with remaining exposure still visible; the UI never promises an infeasible recovery eliminates all risk.

Custom-delay recovery timing, over-threshold INVESTIGATE behavior, scaling the pull-forward shape and pre-receipt reporting boundaries are explicitly disclosed demo conventions. See `OPEN_QUESTIONS.md`.

## Canonical data and source boundaries

Original 12 SKU operating rows, seven PO IDs/quantities/original dates/statuses, seven one-tin bundle components, four reviewed weekly decisions and totals (41,400 baseline / 45,100 current, +8.9%) remain intact. Costs/MOQs and proposed mussel schedules are sourced to v1.1. Allocation reserves 4,200 tins with 2,600 unmet; the separate bundle snapshot supports 400 packs with an 800-pack gap.

Mussel schedules show 8,000 Basil Pesto on 22 October and 4,000 on 12 November; Sweet Pepper retains 4,000 on 26 November and moves 8,000 to 17 December. These are proposed schedules, not fabricated PO records or transfers between flavors.

The supplement still does not provide discretionary trout displacement/release quantities, all production/ready/transit stage dates, previous-review history or exact execution cutoffs. Those remain visibly unspecified outside the three completed calculation pages. No live integration, approval or transaction execution is implied.

## Verification coverage

19 unit acceptance groups cover source integrity, immutable inputs, exact canonical calculations, channel conservation, all FBJ outcomes, every supplied scenario preset, threshold boundaries, long-delay recovery, validation, costs/MOQs and receipt schedules. The projection distinguishes book inventory, physical inventory and unmet demand; a late receipt cannot hide an earlier stockout or safety breach.

29 Playwright tests cover:

- All eleven routes through direct entry, exact headings, active navigation and client navigation.
- Desktop and mobile axe accessibility with no excluded rules; widths 1440, 1280, 768 and 390; supply label containment also at 1024.
- All four weekly decision drawers, all seven PO row targets, Escape/focus restoration, analysis-link navigation and scroll-lock cleanup.
- All 84 SKU/channel contexts, modeled charts, zero-share empty states and demand reset.
- All four FBJ options with changing chart paths, exposure, costs and quantities.
- All scenario presets and controls, keyboard tabs, invalid-input retention, threshold responses and reset.
- Allocation/bundle toggles, separate inventory contexts and explicit unsupplied outcomes.
- Internal links, source anchors, loaded images, Cin7 logo and nine-step managed-service narrative.
- Mobile footer navigation, focus containment, resize cleanup and persistent disclosure cleanup.

Visual inspection of the updated demand, PO intervention and supplier-delay scenario confirms readable charts, receipt markers, metrics and comparison explanations. Browser testing identified and corrected SVG title hydration errors; titles now render as single stable text strings. Risk and response receipt markers are distinguished in the scenario chart.

Final verification: `pnpm verify:fishwife` passes — 19 unit acceptance groups, TypeScript, ESLint, production build and all 29 browser tests (2.3 minutes). All eleven routes pass desktop/mobile accessibility with zero axe violations and no browser console or hydration errors. A separate exact comparison verified all 12 history rows, 12 channel-share rows and 12 economics rows against the saved user supplement. `git diff --check` passes.
