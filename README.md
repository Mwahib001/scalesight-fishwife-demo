# ScaleSight × NATURANA — Size-to-Buy Planning

An illustrative NATURANA × Understatement capsule workspace: eight products, 85 public variants, three size systems and four matching sets. Built within the existing ScaleSight Next.js App Router, React Context and visual language.

**Analysis maintained by ScaleSight. Decisions made with NATURANA.**

Public catalog information is taken from the supplied PDF. All operating inputs and recommendations are synthetic. There are no runtime data connections, scraping, generated histories, fabricated receipt dates or order submissions.

## Run and verify

```bash
pnpm install
pnpm dev
pnpm verify:naturana
```

`verify:naturana` runs fixture acceptance tests, strict typechecking, lint, a production build and Playwright browser checks. Browser checks start the production app at port 3100. They use installed Chrome or Playwright Chromium; `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can override the executable. `pnpm build` includes fixture tests. No environment variables are needed for the application.

## Routes and demo flow

1. `/` — four priorities, 18 immediate interventions, managed-service and customisation links.
2. `/size-translation` — three commercial sizing structures, complete synthetic translation matrices and six learning cohorts.
3. `/size-demand` — exact initial, gross and fit-adjusted curves; M 24% → 33%, L 25% → 22%.
4. `/fit-signal` — Cherry L 25 retained versus Cherry M 31, Candy Pink M 37; the supplied 6-out / 4-to-M story; human override.
5. `/sku-planning` — all 85 variants, eight filters, urgency sorting, 20-row pagination and accessible decision drawer. Direct links accept `?variant=CH-BRA-L`.
6. `/next-buy` — the exact €47,500 product allocation and €2,500 reserve, with matching-set planning.
7. `/scenario` — Base, Upside, Supplier Delay and Fit Friction presets. Shared custom inputs are explicitly uncalibrated and produce no invented outputs; reset is atomic.
8. `/forecast-learning` — six before/after cohort comparisons and Moderate confidence.
9. `/managed-intelligence` — ten-step operating cycle, specialist review, ownership and NATURANA planning pilot.
10. `/assumptions` — public/synthetic/derived/analyst classifications, prices, planning assumptions and prominent customisation.

## Data and scope

- `docs/spec/NATURANA_technical_spec.pdf` is the supplied 130-page source; `ARMAN_CLARIFICATIONS.md` overrides it where specified.
- `scripts/extract-naturana.py` reproduces offline source transcription from the preserved text, comparing Appendix C with the original operating tables and independent Appendix B identifiers.
- `src/data/naturana.rows.ts` preserves all 85 operating rows. `naturana.ts` holds typed product metadata, canonical curves, sets and presets; `naturana.copy.ts` holds page copy.
- `src/engine/naturana.ts` calculates only defined relationships, preserves source cover display precision and owns shared scenario state transitions.
- Exact source copy and page references are preserved in `docs/spec/PAGE_COPY.md` and `docs/SPEC_EXTRACTION.md`.
- No arbitrary allocation/scenario model, Downside preset, receipt-date projection, complete exchange ledger, additional set thresholds or ordinary-row analyst narratives are supplied. These remain absent or explicitly uncalibrated; see `docs/OPEN_QUESTIONS.md`.
- The pilot CTA retains the existing email destination, `arman@scalesight.org`. It opens the visitor’s email application; this workspace sends no messages.

The previous Kelarune fixtures, forecasting engines, unrelated pages, legacy redirects and old demo evidence have been removed. Source documents are retained for traceability.
