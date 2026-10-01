# NATURANA V1 delivery report

## Implemented scope

The application now contains the ten PDF routes, using the existing ScaleSight shell, typography, tokens, panels, React Context and Next.js App Router. The Kelarune catalog, generated sales, dated purchase orders, forecast/scenario engines, unrelated routes, legacy redirects, old test suites and obsolete demo/reference assets have been removed.

The workspace includes all eight products and 85 variants with exact source identifiers and NATURANA storefront prices; full synthetic translation matrices; the three canonical size curves; four executive priorities; three fit decompositions and the Cherry L analyst override; all variant filters, urgency sorting, pagination and modal decisions; the two canonical matching-set risks; the €50,000 allocation; four scenario presets; six learning cohorts; ten managed-service stages; and prominent customisation. The full illustrative disclaimer stays visible while scrolling. The commercial CTA retains the existing email destination.

## Source and calculation boundaries

All operating data is illustrative. Public identifiers and every operating field have been compared between the source tables and appendices. No runtime network data is used. Only defined relationships are calculated: retained demand, fit-adjusted demand, exchange-out rate, commercial indices, cover calculation, action totals and allocation reconciliation. Display cover and the three common curves preserve source values.

Custom scenario and allocation controls display “Custom: not calibrated in V1” and suppress outputs. They do not simulate an unspecified model. Supplier Delay shows only its €8,500 incremental requirement, not an invented total. Scenario risk counts are canonical summaries and do not create extra detailed set risks. Base catalog actions remain the reviewed source decisions when a scenario is selected, explicitly labeled in the workspace banner.

## Open-question disposition (all items)

1. **Missing PDF:** resolved; all 130 pages reviewed and preserved.
2. **Custom scenario coefficients:** absent; use exact presets or uncalibrated custom state.
3. **Receipt dates:** absent; show supplied incoming quantities and current cover. No dated projections or date-dependent reorder gap.
4. **Exchange ledger:** incomplete; show only Cherry L → M, six out/four to M. No other destinations.
5. **Set-risk thresholds:** unspecified; preserve the two exact M risks and synthetic 62% attach assumption.
6. **Ordinary-row analyst evidence:** unspecified; metrics and supplied final actions only. No invented confidence or narratives.
7. **Systems/integrations:** unconfirmed; show configurable future sources, with no live-connection claims.
8. **Override contract conflict:** follow the email; add optional `overrideType`, set Cherry L to `FIT_SIGNAL`, and make absent analyst fields optional.
9. **Derived fields versus canonical illustrations:** calculate fully defined relationships while preserving source cover, curves, risk states and preset summaries.
10. **Downside/custom/Next Buy output rules:** unavailable; no fake projected demand, custom allocation, promotion effect or additional preset. Product allocations appear only for Base.
11. **PDF cross-reference errors:** cohort references use Section 13 / Appendix F; allocation references use Section 15 / Appendix G.
12. **Pilot CTA destination:** superseded by the user's later request. Both commercial endpoints now offer “Email us” at the existing mailto address and “Book a call” in an embedded Calendly dialog. `NEXT_PUBLIC_CALENDLY_URL` configures the scheduling URL, defaulting to the supplied `https://calendly.com/kazmiarmanmehdi/30min`. Planning fixtures stay local; Calendly loads only after the booking button is clicked.

No requested page is omitted. The missing mechanics above are the limits explicitly identified in the PDF/email; a live calibrated version needs additional rules and inputs.

## Verification

Validation is recorded in `docs/VERIFICATION.md`: 14 data acceptance groups and 15 production browser tests passed, together with strict typechecking, lint and the production build. Run `pnpm verify:naturana` to repeat the complete suite.
