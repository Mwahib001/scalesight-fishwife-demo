# Fishwife implementation QA

Technical specification §41–42, reviewed against the final local demo. Planning date: 8 October 2026.

## Data and calculation acceptance

15 unit acceptance groups verify all 12 canonical SKU operating rows, all seven exact PO identifiers / quantities / original dates / statuses, seven one-tin BOM components, immutable source records, source metadata, context separation, bounded inputs and missing-data behavior.

| Acceptance value                     | Result                                                    |
| ------------------------------------ | --------------------------------------------------------- |
| Spanish Lemon WOC                    | 15,400 / 5,600 = 2.75 → 2.8                               |
| Spanish Lemon variance               | 30.232558% → 30.2%                                        |
| Recent four-week mean                | (5,250 + 5,450 + 5,700 + 5,600) / 4 = 5,500               |
| Persistence uplift                   | 27.906977% → 27.9%; ratio stored separately               |
| Trout allocation / demand gap        | 4,200 conserved / 2,600 unmet                             |
| Starter Pack capacity / assembly gap | 400 / 800, in a separate inventory context                |
| Baseline / current weekly demand     | 41,400 / 45,100; +8.9%                                    |
| Mussel capacity resequence           | 8,000 tins; $2,100 USD incremental; no net added capacity |
| FBJ option costs                     | $0 / +$8,400 / +$5,600 / +$5,600                          |
| FBJ cost difference                  | $2,800 lower incremental cost; explicitly DERIVED         |

Projection tests distinguish negative book inventory, nonnegative physical stock and unmet demand. No allocation is subtracted twice. Unknown denominators, receipt conventions, costs and dates return null rather than zero or infinity. Recommendations remain the supplied reviewed states.

## Browser acceptance

The 29-test Playwright suite covers:

- All eleven routes through direct entry with exact H1s and active navigation.
- Full disclaimer disclosure and Assumptions & Data links.
- Desktop and mobile axe accessibility checks, with no excluded rules.
- Responsive widths 1440, 1280, 768 and 390 pixels; horizontal tables scroll within their own containers.
- All four five-section decision drawers, Escape, native dialog focus containment and trigger focus restoration.
- SKU/channel updates, observation gaps and reset to Spanish Lemon / ALL.
- Seven read-only PO records, a read-only commitment drawer and aggregate incoming records without invented PO IDs.
- Allocation and bundle toggles, source-dependent displacement states and conserved contexts.
- Four supplied FBJ comparison cards, selected costs / quantities and a fixed reviewed recommendation.
- Four scenario fields, invalid-input rejection, retained last valid state, tab selection and complete reset.
- The official Cin7 logo, supplied variety-box image, nine-step managed cycle and Fishwife decision ownership.
- Every sidebar route through client navigation and every weekly decision’s analysis link.
- All seven PO row targets, same-route drawer dismissal and accurate monitoring labels on confirmed POs.
- All 84 SKU/channel combinations, all four recovery option costs/quantities, all scenario inputs and keyboard tabs.
- Internal route links, source-gap anchors and successful loading of product/brand images.
- Mobile menu focus containment, footer navigation, closed-menu visibility and resize cleanup.
- Persistent disclosure cleanup and supply timeline status containment at five viewport widths.

Laptop visual inspection covered the brief, demand, allocation, supply, PO comparison, bundle, scenario and Managed Intelligence screens. Screenshot artifacts are generated in `test-results/`. Observed landmark, contrast and text-layout issues were corrected before the final run.

## 30-second Becca review

| Window        | Evidence                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 0–5 seconds   | Fishwife × ScaleSight masthead, Weekly Supply Planning Brief, prepared issue date, reviewed cue and next review date                |
| 5–15 seconds  | Four recognizable product priorities and action badges before the supporting metric strip                                           |
| 15–30 seconds | Each Review decision button opens the five required sections, the ScaleSight recommendation, Fishwife’s decision and a reviewed cue |

This is a structural / visual review, not a claim of a completed user study with Becca.

## Intentional source-dependent states

Exact FBJ trajectories / receipt markers, mussel dates, allocation displacement, unprotected bundle capacity, channel splits, scenario thresholds, landed costs and preset values remain explicitly missing. `OPEN_QUESTIONS.md` identifies the exact confirmations required. Seven weekly observations are flagged for Arman’s copy approval; the WATCH example uses supplied collaboration history and flags the optional retailer pull-forward fixture.

The old demo’s operating content, routes, data, metadata and test fixtures are removed. Text search finds zero legacy brand references in application source, tests, assets, package metadata or README. The supplied source PDF is retained unchanged, including its historical benchmark references.

## Verification

Typecheck, lint, all 15 unit groups and the production build pass. The production build pre-renders all eleven planning routes. The complete 28-test browser run passed, including desktop and mobile accessibility with zero axe violations. A subsequent visual correction added the 29th regression test for supply status wrapping; the rebuilt supply-route accessibility/responsive check and new containment check passed. `git diff --check` passes.

## Follow-up audit: UI, flow and data

The audit found and corrected same-route drawer dismissal, mobile footer navigation and resize scroll locks, keyboard access to a closed mobile sidebar, disclosure persistence, non-clickable PO row cells and incorrect decision-needed labels on monitoring records. It also added aggregate variance to every SKU context, labels for every missing chart actual, visible feedback for all scenario assumptions and wrapping for long supply-status badges that previously crossed a panel boundary.

The shared projection now detects depletion and safety breaches before a late receipt restores closing inventory. Negative projection quantities are rejected; invalid confidence-history counts produce LOW confidence. Canonical fixture data was not changed.

Functional acceptance passes for the supplied demo scope. This is **not a fully calibrated operational planning model**: the PDF’s §41 release condition still requires the source confirmations listed in `OPEN_QUESTIONS.md`. Exact trajectories, channel histories, scenario thresholds and displacement quantities remain visibly unavailable. No live execution or approval action was added.
