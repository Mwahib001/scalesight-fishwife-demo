# NATURANA specification extraction

**Incomplete: the technical PDF has not been supplied or located. This is an extraction of the two supplied text attachments only, not a claim that the PDF has been read. Phase 0 is not complete.**

## Source precedence

Arman's email is preserved verbatim in `spec/ARMAN_CLARIFICATIONS.md`; the task attachment is in `spec/BUILD_PROMPT.md`. The PDF is the main source for the catalog, identifiers, page copy, recommendations and positioning. The email overrides it where explicitly stated. The user's latest instruction is to follow the email strictly and remove unrelated demo content while retaining the existing ScaleSight architecture.

## Page inventory and copy

The PDF's full page/section inventory and verbatim copy are unavailable. The attachments explicitly require decision views, a variant table, spotlight detail, matching-set risks, scenarios, Managed Intelligence, and visible configuration. These are requirements, not a verified list of PDF pages.

Required verbatim tagline:

> Analysis maintained by ScaleSight. Decisions made with NATURANA.

Workspace means the planning environment. ScaleSight means the team maintaining the analytical layer. Configuration must cover assortment, size curves, exchanges, set rules, OTB and scenarios. Specific systems/integrations remain configurable or to be confirmed. A persistent disclaimer must identify illustrative data and synthetic planning assumptions; copy must not imply access to NATURANA internal data.

## Catalog and decisions

- Exactly eight products and 85 variants. The 85 source rows, exact product identities, public SKU/barcode strings and prices are missing; no fixture has been fabricated.
- The prohibited Plum size is band 90 / cup E.
- Expected final action counts: BUY DEEPER 6; REPLENISH 11; INVESTIGATE 1; WATCH 9; REDUCE 9; HOLD 49. Total: 85. Per-row action assignments and action definitions await the PDF.
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

Gross curve: unavailable until PDF extraction. Do not infer it.

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

The supplied OTB is €50,000: 47,500 + 2,500 = 50,000; 57,500 − 50,000 = 7,500. Do not derive a total Supplier Delay commitment or other missing outputs. Further OTB figures in the PDF await extraction.

Use preset selection in V1. No arbitrary slider coefficient model is supplied. Scenario risk counts are supplied summary outputs; they do not authorize inventing named additional matching-set risks.

## Canonical matching-set risks

| Set | Top cover | Bottom cover |
| --- | --- | --- |
| Candy Pink M | 2.0 weeks | 1.8 weeks |
| Cherry M | 2.2 weeks | 1.7 weeks |

Exactly these two detailed set risks. The 62% attach rate is a synthetic planning assumption, not a rule for generating new risks.

## Outstanding extraction

The full 85-row transcription, independent public identifier mapping, storefront prices, gross curve, page copy, analyst spotlight details, recommendation definitions, any additional OTB breakdown and full managed-service content all require the PDF. See `OPEN_QUESTIONS.md`. No PDF/email conflicts can yet be verified.
