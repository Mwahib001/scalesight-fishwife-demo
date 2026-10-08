# Fishwife × ScaleSight

Supply Commitment Planning Workspace — a local, illustrative planning room prepared around Fishwife’s existing systems and team.

Next.js 16.3.4 App Router, React 19, TypeScript, pnpm. Uses official product photographs and the supplied Cin7 and ScaleSight logos. Editorial cream / ink theme with self-hosted Albert Sans and an open Petrona serif fallback.

## Run

```sh
pnpm dev
```

For a production preview, run `pnpm build` then `pnpm start`.

## Verify

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

`pnpm verify:fishwife` runs the complete sequence. Browser tests use the production build on port 3100 and the available Google Chrome executable. An override is supported through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Planning routes

`/`, `/demand`, `/supply-commitments`, `/allocation`, `/po-intervention`, `/bundles`, `/scenario`, `/sop`, `/forecast-learning`, `/managed-intelligence`, `/assumptions`.

Four decision cards precede supporting metrics. Read-only drawers explain reviewed recommendations. Comparisons and scenario assumptions live separately from the canonical data; reset clears exploratory overrides. No transaction, approval or integration controls are implemented.

## Source boundaries

- `src/data/fishwife.v1.ts`: one immutable, versioned fixture with classified source records and separate scenario contexts.
- `src/engine/fishwife.ts`: shared pure selectors, denominator guards, full-precision calculations and bounded-input validation.
- `docs/SYNTHETIC_FIXTURE_V1_1.md`: user-supplied histories, channel shares, economics, dated recovery options and Gold Label scenario presets.
- `OPEN_QUESTIONS.md`: resolved gaps, explicit custom-scenario conventions and remaining inputs outside the three completed calculation pages.
- `ASSET_SOURCES.md`: official image sources, font licenses and optional brand assets to supply.
- `QA_REPORT.md`: acceptance results and visual review.

The supplied PDF remains unchanged under `docs/`. Public source context, synthetic operating inputs, derived metrics and ScaleSight interpretation remain distinct. Missing inputs display explicitly; the demo does not imply real Fishwife internal data or a deployed live integration.

## Working calculations

- Demand: 13 historical weeks for all 12 SKUs, all modeled nonzero channels, exact integer channel reconciliation and three distinct forward planning periods.
- FBJ recovery: option-specific inventory, receipts, safety reserve, unmet demand, protected units and incremental cost. Exposure is 6,200 / 200 / 2,200 / 0 tins across the four options.
- Gold Label scenarios: editable assumptions, three supplied presets, HOLD, SPLIT, EXPEDITE, WATCH / HOLD and INVESTIGATE responses, stockout and safety-breach timing, exposure and incremental recovery cash. Reset returns to the reviewed current plan.
- Mussel proposed receipt schedules and synthetic unit costs/MOQs are available alongside preserved original commitments.

All v1.1 inputs are labeled illustrative. A channel with a supplied 0% share intentionally has no modeled graph. Exact discretionary trout displacement and bundle release quantities remain unsupplied and are not fabricated.
