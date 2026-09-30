# NATURANA architecture notes

Status: repository inspection complete; implementation awaits the technical PDF and its extraction. The application has not yet been converted.

## Existing workspace

- Next.js 16.3.4 App Router, React 19, strict TypeScript, pnpm. Routes are in `src/app`; `src/app/layout.tsx` provides metadata and `AppShell`.
- `src/components/AppShell.tsx` owns the desktop sidebar, mobile navigation, primary links, header, footer, and shared planning provider. Retain its layout, focus handling, and responsive behavior.
- `src/app/globals.css` supplies the existing ScaleSight colors, typography, panel/table styles and breakpoints. Inter and ScaleSight logos are local assets. Tailwind 4, Lucide and Recharts are already installed. No new design system is needed.
- `src/context/PlanningContext.tsx` uses React Context and a reducer to preserve selections across routes. Its current state and computed plan are specific to Kelarune.
- Current data is imported locally from `src/data/kelarune.ts`, `dataset.ts`, and `reviewedPlan.ts`. Forecast, inventory, scenario and recommendation engines synthesize Kelarune outputs. Those outputs are not sources for NATURANA.
- `MetricCard`, heading/panel/table styles, navigation patterns and chart primitives are reusable. `ui.tsx` also contains Kelarune selectors and a hardcoded planning date; separate these dependencies when adapting shared components.
- Currency formatting currently uses USD; NATURANA requires EUR. Do not carry forward hardcoded review timestamps or purchase-order dates.

## Existing route inventory (not the missing PDF's page inventory)

| Route | Current purpose |
| --- | --- |
| `/` | Weekly Planning Brief |
| `/revenue-forecast` | Revenue Forecast |
| `/demand-forecast` | Demand Forecast |
| `/inventory` | Inventory Health |
| `/sku-planning` | SKU Planning |
| `/scenario` | Scenario Planning |
| `/intelligence` | Intelligence Center |
| `/managed-intelligence` | Managed Intelligence |
| `/assumptions` | Planning Assumptions |

Legacy routes also exist at `/forecast`, `/customer-growth`, `/partnership`, and `/advisor-brief`. Final retained routes and removals must be mapped against the PDF, not assumed from the old demo.

## Integration approach

1. Preserve the App Router, ScaleSight shell, tokens and React state architecture. Replace the Kelarune demo content with NATURANA; the user requests only the specified workspace.
2. Transcribe all eight products, 85 variants, exact public identifiers, prices and final actions into typed fixtures under `src/data/`. Keep a separately transcribed source mapping for identifier assertions, with PDF page references. Never generate rows to satisfy totals.
3. Model final actions as supplied decisions. Add `overrideType?: string` to the NATURANA variant/recommendation model. Detailed analyst fields are optional and populated only where the PDF supplies them.
4. Replace arbitrary scenario calculations with the four canonical presets. Reuse Context only for actual cross-page state. Do not reuse Kelarune coefficients, synthetic histories, automatic action thresholds, or dated incoming-order projections.
5. Keep Managed Intelligence in primary navigation and expose NATURANA configuration prominently. Render a persistent illustrative-data disclaimer in the shell. Use the email's exact managed-service tagline.
6. Remove obsolete Kelarune components, fixtures, engines, pages, tests and demo documentation after the PDF establishes the replacement scope. Preserve shared infrastructure and assets used by the NATURANA workspace.

## Validation setup

- `pnpm test`: TypeScript compilation through `tsconfig.tests.json`, then Node assertions in `tests/planning.test.ts`. Existing assertions are Kelarune-specific and must be replaced with NATURANA source acceptance checks.
- `pnpm typecheck`: `tsc --noEmit`, with strict mode already enabled.
- `pnpm lint`: ESLint 9 and Next core-web-vitals/TypeScript rules.
- `pnpm build`: fixture tests followed by `next build --webpack`.
- `pnpm test:e2e`: Playwright against the production server on port 3100; current suites cover routes, responsive layouts, interactions and accessibility. Adapt them to the supplied NATURANA screens and decision flow.
- Add `verify:naturana` for canonical data, action counts, identifiers, OTB, presets, curves, exchange restrictions, copy, visible disclaimer, configuration and navigation checks. Missing source fixtures must fail validation, never silently pass.

Read the installed Next.js guides `01-app/01-getting-started/03-layouts-and-pages.md` and `05-server-and-client-components.md` before implementation, as required by `AGENTS.md`. Pages/layouts remain server components by default; interactive state belongs in client components.
