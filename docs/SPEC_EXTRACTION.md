# NATURANA specification extraction

**All 130 pages reviewed.** Source: `spec/NATURANA_technical_spec.pdf` (v1, September 2026). The layout-preserving transcript is `spec/NATURANA_technical_spec.txt`. The email overrides the PDF only where explicitly clarified.

## Source precedence

Arman's email is preserved verbatim in `spec/ARMAN_CLARIFICATIONS.md`; the task attachment is in `spec/BUILD_PROMPT.md`. The PDF is the main source for the catalog, identifiers, page copy, recommendations and positioning. The email overrides it where explicitly stated. The user's latest instruction is to follow the email strictly and remove unrelated demo content while retaining the existing ScaleSight architecture.

## Page inventory and copy

Full verbatim headings, subheadings, section copy and CTAs for every screen are in [PAGE_COPY.md](spec/PAGE_COPY.md), extracted with PDF page references.

| Route | H1 | PDF pages |
| --- | --- | --- |
| `/` | Weekly Planning Brief | 42–45 |
| `/size-translation` | Two sizing systems. One planning view. | 46–47 |
| `/size-demand` | The commercial size curve is already moving. | 48–49 |
| `/sku-planning` | SKU & Size Planning | 50–53 |
| `/fit-signal` | Strong sales do not always mean deeper demand. | 54–57 |
| `/next-buy` | Where should the next inventory euro go? | 58–59 |
| `/scenario` | Scenario Planning | 60–64 |
| `/forecast-learning` | The first plan is an assumption. The next plan should learn. | 65–66 |
| `/managed-intelligence` | The workspace is only one part of the service. | 67–71 |
| `/assumptions` | What is real, what is assumed, and what a live workspace would use. | 72–75 |

Navigation/header: pp. 40–41. Commercial endpoint: p. 92. The SKU page starts with 20 rows sorted by urgency, eight filters, pagination and an accessible decision drawer. Matching-set cards belong within these screens; no additional module or route is required.

Required verbatim tagline:

> Analysis maintained by ScaleSight. Decisions made with NATURANA.

Workspace means the planning environment. ScaleSight means the team maintaining the analytical layer. Configuration must cover assortment, size curves, exchanges, set rules, OTB and scenarios. Specific systems/integrations remain configurable or to be confirmed. A persistent disclaimer must identify illustrative data and synthetic planning assumptions; copy must not imply access to NATURANA internal data.

## Catalog and decisions

- Exactly eight products and 85 variants. Full typed operating transcription: `src/data/naturana.rows.ts` (Appendix C, pp. 103–108), checked against all fields in pp. 23–29. Independent public mapping: `tests/fixtures/naturana-public.json` from Appendix B, pp. 98–102. Independent operating test fixture: `tests/fixtures/naturana-operating.json`. `scripts/extract-naturana.py` reproduces this offline transcription and asserts both source presentations agree. Product metadata/prices: pp. 5 and 97; synthetic costs/lead times/targets: p. 21.
- The prohibited Plum size is band 90 / cup E.
- Expected final action counts: BUY DEEPER 6; REPLENISH 11; INVESTIGATE 1; WATCH 9; REDUCE 9; HOLD 49. Total: 85. All per-row actions are transcribed, and the counts reconcile exactly.
- Primary price: NATURANA storefront price. Understatement price may be reference metadata only. No blended price.
- Add `overrideType?: string`; Cherry L uses `FIT_SIGNAL`.
- Detailed analyst treatment is restricted to supplied spotlight decisions: Candy Pink M, Cherry M, Cherry L, Plum 80C, and the matching-set risks. Do not fill in absent narratives, confidence or expected-demand baselines for ordinary rows.
- Retained demand: Cherry L = 25; Cherry M = 31; Candy Pink M = 37.

## Canonical alpha curves

These are illustrative planning curves, not aggregates of catalog rows.

| Curve | XS | S | M | L | XL | XXL | 3XL | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Initial | 9 | 18 | 24 | 25 | 13 | 7 | 4 | 100 |
| Fit-adjusted | 7.5 | 17.5 | 33 | 22 | 10.5 | 6 | 3.5 | 100 |

Gross curve (pp. 33, 112): XS 7 / S 17 / M 31 / L 26 / XL 10 / XXL 6 / 3XL 3; total 100.

## Inventory and exchanges

Display supplied cover and incoming quantities exactly. No reliable per-SKU receipt dates exist; do not invent arrival dates. A dated PO structure may be introduced later when source fixtures exist.

Row-level ExIn/ExOut are canonical demonstration inputs, not a reconciled ledger. The only allowed directional exchange story is Cherry L → M: six exchange-outs from L, four moving to M. The other two destinations are unspecified. Do not infer any other direction or create a Sankey ledger.

## Scenario presets and OTB

| Preset | Supplied outputs |
| --- | --- |
| Base | 18 actions; 2 set risks; €47,500 commitment; €2,500 reserve |
| Upside | 24 actions; 3 set risks; €57,500 requirement; €7,500 gap |
| Supplier Delay | 26 actions; 4 set risks; €8,500 incremental requirement |
| Fit Friction | L fit-adjusted demand −12%; M retained demand +6% |

The supplied OTB is €50,000: 47,500 + 2,500 = 50,000; 57,500 − 50,000 = 7,500. Do not derive a total Supplier Delay commitment or other missing outputs. Product allocations/quantities (pp. 38–39, 115–116): Candy Pink top €11,500 / 500; Candy Pink bottom €5,000 / 500; Cherry top €9,500 / 380; Cherry bottom €4,500 / 450; Plum top €7,500 / 300; Plum bottom €3,000 / 300; Dark Leo top €5,000 / 200; Dark Leo bottom €1,500 / 150. Each quantity × synthetic unit cost equals its allocation; allocations sum to €47,500. Reserve is 5%. This is a planning budget, not a literal PO.

Use preset selection in V1. No arbitrary slider coefficient model is supplied. Scenario risk counts are supplied summary outputs; they do not authorize inventing named additional matching-set risks.

## Canonical matching-set risks

| Set | Top cover | Bottom cover |
| --- | --- | --- |
| Candy Pink M | 2.0 weeks | 1.8 weeks |
| Cherry M | 2.2 weeks | 1.7 weeks |

Exactly these two detailed set risks. The 62% attach rate is a synthetic planning assumption, not a rule for generating new risks.

## Recommendation definitions and permitted calculations

PDF pp. 76–81, 122–125 define BUY DEEPER (retained demand >115% of expectation, cover <4 weeks, confidence not low); REPLENISH (under target, demand at/above expectation, incoming insufficient); INVESTIGATE (strong gross demand, exchange-outs at least 15%, conflicting retained signal); WATCH (limited confidence or insufficient variance); REDUCE NEXT BUY (cover at least 10, demand no higher than plan, no overriding business context); HOLD (within acceptable range). Preserve supplied final actions because necessary evidence/thresholds are absent for most rows.

Central calculations: retained = gross − returns − ExOut + ExIn; V1 fit-adjusted demand = retained; exchange-out rate = ExOut / gross; commercial index = retained / supplied initial expectation × 100. Spotlight expectations: Cherry L 29, Cherry M 26, Candy Pink M 29; rounded indices 86, 119, 128. Cover = onHand / forecast, with supplied display precision retained. Lead-time demand = forecast × lead time; safety stock = forecast × safety weeks. Dated reorder gaps and inventory projections cannot be calculated without receipt dates. Set thresholds are not defined.

Cherry L model BUY_DEEPER → analyst INVESTIGATE, overrideType FIT_SIGNAL; exact stored reason: “Elevated L→M exchanges materially weaken retained L demand.” Other model recommendations/confidence are not manufactured.

## Timeline, translation and managed service

Launch 18 Sep 2026; planning week 28 Sep; actuals through 29 Sep; refresh 30 Sep 06:00 CEST; observation window 18–29 Sep; default horizon 8 weeks, alternatives 4/13; next review Monday 5 Oct. These are illustrative cycle dates, not invented PO dates.

All twelve bra-cohort and seven bottom translations are on pp. 15–16 / 109–110. Six learning comparisons are on pp. 35 / 114. They remain explicitly synthetic planning translations, never official customer guidance.

Managed service follows ten stages: Data Refresh → Validate → Refresh Planning Model → ScaleSight Specialist Review → Prioritise → Recommend → Weekly Planning Brief → NATURANA Review → Management Decision → Monitor Outcome. ScaleSight maintains the analytical layer and reviews assumptions/exceptions/scenarios; NATURANA owns purchases, suppliers, assortment and final commercial trade-offs. Use the unnamed planning specialist, exact tagline, “Your team does not need to monitor another dashboard every day…” copy, and the NATURANA Planning Pilot endpoint from p. 92. Customisation covers assortment, operating model, decision rules and planning cadence. Exact long copy is preserved in PAGE_COPY.md.

## Ambiguities and conflicts

See OPEN_QUESTIONS.md for missing custom/downside mechanics, dates, exchange ledger, set-risk thresholds, ordinary analyst detail, confirmed systems, and incorrect internal section cross-references. The email explicitly resolves the overrideType omission and instructs preservation of canonical display cover/curves/presets. No source data is missing now.
