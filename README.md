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
- `OPEN_QUESTIONS.md`: exact inputs needed from Arman for receipt chronology, costs, thresholds, protected demand, allocation priorities, channel observations and draft-copy approval.
- `ASSET_SOURCES.md`: official image sources, font licenses and optional brand assets to supply.
- `QA_REPORT.md`: acceptance results and visual review.

The supplied PDF remains unchanged under `docs/`. Public source context, synthetic operating inputs, derived metrics and ScaleSight interpretation remain distinct. Missing inputs display explicitly; the demo does not imply real Fishwife internal data or a deployed live integration.
