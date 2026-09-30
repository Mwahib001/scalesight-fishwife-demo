# NATURANA V1 verification

Verified 1 October 2026 against the supplied PDF and Arman's explicit email overrides.

## Source integrity

The preserved PDF is byte-identical to the user-supplied `ScaleSight_NATURANA_Technical_Specification_Wahib_v1.pdf`. A fresh `pdftotext -layout` extraction matches the committed transcript.

`python3 scripts/extract-naturana.py` reports:

```text
Verified 85 rows across both source presentations and independent public identifiers.
{'REDUCE_NEXT_BUY': 9, 'HOLD': 49, 'REPLENISH': 11, 'BUY_DEEPER': 6, 'WATCH': 9, 'INVESTIGATE': 1}
```

Appendix B supplies the independent identifier fixture; Appendix C supplies the joined operating rows, checked against the original tables on pages 23–29. Running extraction and formatting produced no changes to the committed source fixtures.

## Automated results

Each command in `pnpm verify:naturana` was run successfully:

| Command | Result |
| --- | --- |
| `pnpm test` | 14 acceptance groups passed |
| `pnpm typecheck` | Passed; strict TypeScript |
| `pnpm lint` | Passed |
| `pnpm build` | Passed; all ten workspace routes statically prerendered |
| `pnpm test:e2e` | 15 passed (1.3 minutes) |
| `git diff --check` | Passed |

The acceptance groups cover the complete catalog and all operating fields, exact identifiers, action totals, retained demand and indices, source cover precision, all supplied OTB allocations/quantities, preset outputs, custom-output suppression and atomic reset, all three curves, two set risks, the single directional exchange story, storefront prices, optional analyst evidence, the FIT_SIGNAL override, runtime copy restrictions and exactly ten routes.

The production browser suite covers all ten routes and refreshes; the full disclaimer; no browser errors; automated accessibility scans on every page and the variant dialog; overflow checks at 1440×900, 1280×720, 768×1024 and 390×844; every variant filter; 20-row pagination; empty-filter results; source prices; keyboard dialog dismissal and focus restoration; preset selection; shared scenario inputs; custom-state suppression; reset; fit decomposition; chart controls; matching-set cards; managed workflow tabs; customisation; mobile navigation; and 404 responses for the eight removed routes.

Desktop and mobile screenshots are generated under ignored `test-results/`. The desktop brief and mobile fit-signal screenshots were also inspected visually. Browser tooling emitted only its environment warning about FORCE_COLOR overriding NO_COLOR; no application errors or failed checks occurred.

## Deliberate limits

These checks establish the supplied V1 behavior, not an unspecified production forecasting model. Custom scenario combinations, Downside, custom allocations, dated incoming projections and expanded exchange/set-risk models remain uncalibrated or absent as directed by the email. All dispositions and PDF conflicts are listed in `OPEN_QUESTIONS.md` and `DELIVERY_REPORT.md`.
