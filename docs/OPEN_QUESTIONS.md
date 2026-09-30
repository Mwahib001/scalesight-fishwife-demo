# NATURANA open questions

## Source received

**Q1 — Resolved.** The user supplied `ScaleSight_NATURANA_Technical_Specification_Wahib_v1.pdf`. All 130 pages are reviewed and the PDF is preserved in `docs/spec/`. The independently presented public identifiers and all 85 operating rows match.

## Known V1 boundaries already resolved by the email

These do not require approval to implement the supplied V1 behavior.

**Q2 — Arbitrary scenario combinations lack coefficients.** Default: select the four explicit presets; no interpolated outputs or unrestricted sliders. A future custom model needs a calculation rule from Arman.

**Q3 — Incoming inventory lacks reliable receipt dates.** Default: display exact supplied incoming quantities and current cover. No dated arrivals or fabricated time-phased inventory forecasts. Add dated fixtures only when supplied.

**Q4 — Exchange destinations are incomplete.** Default: show only the supplied Cherry L → M story (six out, four to M). Do not allocate the other two or reconcile the catalog into a transaction ledger.

**Q5 — Set-risk thresholds are undefined.** Default: the two canonical M risks only; label 62% as synthetic. Upside/Delay risk counts remain preset summaries, not invented additional catalog risks.

**Q6 — Ordinary variants lack analyst detail.** Default: metrics and supplied final action only. Populate spotlight detail only from the PDF, with optional analyst fields elsewhere.

**Q7 — Specific systems and integration setup are unconfirmed.** Default: configuration surfaces identify configurable/to-be-confirmed systems; no claims of an active connection or internal NATURANA data.

## PDF/email conflicts and implementation decisions

**Q8 — Override contract (PDF pp. 84–85, 94).** The PDF omits `overrideType` and says not to silently alter its contract. The email explicitly requires adding `overrideType?: string`; implement it and use FIT_SIGNAL for Cherry L. The email also permits ordinary rows without analyst details, so confidence/model/analyst-reason fields are optional instead of fabricated.

**Q9 — Derived fields versus canonical fixtures (PDF pp. 85, 93–94).** Preserve source cover display values and canonical curves/set risks/preset summaries per email. Retained demand, indices, allocation totals and other fully specified relationships are computed centrally. No catalog aggregation replaces the supplied curves.

**Q10 — Unspecified outputs and Next Buy controls (PDF pp. 58–64, 94).** Downside, promotion effects, custom budgets/reserves/coverage, and arbitrary slider combinations have no supplied allocation or demand model. Default: four exact presets; custom edits show “Custom: not calibrated in V1” and suppress calculated scenario/allocation outputs. Base allocation remains clearly labeled as a reference, never repriced to pretend calibration. No total commitment for Supplier Delay or invented eight-week scenario forecast.

**Q11 — Incorrect cross-references (PDF pp. 47, 59, 65).** “Cohort table from Section 10” refers in context to Section 13 / Appendix F; “allocation table from Section 12” refers to Section 15 / Appendix G. Use the actual supplied learning and allocation tables.

**Q12 — Existing commercial CTA.** The PDF specifies “Discuss a NATURANA Planning Pilot” but no destination. Retain the existing `mailto:arman@scalesight.org` destination with the PDF label. The app does not send messages.

These documented defaults allow V1 to proceed. Only future custom modeling, dated inventory, expanded exchange mapping and calibrated set thresholds need new source rules.
