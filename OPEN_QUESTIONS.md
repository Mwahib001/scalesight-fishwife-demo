# Source status after synthetic fixture v1.1

The user supplied and authorized [Canonical Synthetic Fixture v1.1](docs/SYNTHETIC_FIXTURE_V1_1.md) on 8 October 2026. Its figures are synthetic demo inputs, not public facts or Fishwife actuals. It supplements the original PDF without altering original SKU positions or PO IDs.

## Resolved for the three interactive pages

| Page            | Supplied and implemented                                                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Demand          | All 12 thirteen-week histories, six channel shares per SKU, integer rounding with residual assigned to the largest share, and confidence classifications. Zero-share channels deliberately display “No modeled observations.”                                            |
| PO Intervention | Receipt-before-demand convention; 29 Oct early receipt and 12 Nov standard/delayed receipt; 1,900 protected tins/week; 2,400-tin promotional reduction. Four outcomes calculate to 6,200 / 200 / 2,200 / 0 exposed tins and $0 / $8,400 / $5,600 / $5,600 recovery cost. |
| Scenario        | Gold Label opening position, receipt, costs/MOQ, protected demand, split/full recovery quantities and premiums, decision thresholds, and three exact presets. Risk, cash, response and charts recalculate from valid inputs.                                             |
| Supply context  | Basil Pesto: 8,000 on 22 Oct, 4,000 on 12 Nov. Sweet Pepper: 4,000 on 26 Nov, 8,000 on 17 Dec. Original PO records remain separate from proposed recovery schedules.                                                                                                     |

The supplement also supplies landed costs and MOQs for all 12 SKUs and confirms that allocation and bundle examples use separate snapshots.

## Explicit implementation conventions for custom scenarios

- Recovery arrives one period before the standard receipt, capped at the original 5 Nov receipt date. This reproduces both supplied recovery presets and extends them to custom delays.
- An otherwise qualifying split above the $4,000 premium threshold returns INVESTIGATE; the supplied EXPEDITE rule takes precedence when its exposure criteria apply.
- Demand-change overrides scale the retailer pull-forward shape. Beyond its six supplied weeks, demand returns to the scaled baseline.
- Pre-receipt risk metrics stop before the standard receipt; the final chart point shows the opening receipt without consuming an additional demand period. Unmet demand is tracked separately from nonnegative physical stock.
- Cash is incremental recovery premium. Existing PO value is shown separately and is not charged again.
- Tied largest channel shares use the first channel in the supplied channel order for rounding residuals.

These extensions are documented demo conventions, not additional supplied Fishwife policies.

## Still unspecified outside those three pages

- **Allocation/bundles:** discretionary trout quantity, displacement priority and amount released when account protection is turned off. The supplement confirms separate snapshots but does not supply these quantities; toggle outcomes remain qualitative.
- **Supply stages:** production, ready and transit dates; additional PO IDs for aggregate incoming records. No IDs or stage dates are invented.
- **Review copy:** previous-review snapshot and approval of the seven draft weekly observations.
- **Execution cutoffs:** exact supplier, freight and cannery cutoff timestamps.
- **Optional brand assets:** licensed Recoleta webfont and authorized Fishwife wordmark. The existing open serif fallback and supplied logos remain in use.

These gaps do not prevent the completed demand, FBJ recovery or Gold Label scenario calculations. The demo does not execute transactions or connect to live Fishwife systems.
