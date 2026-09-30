Hi Wahib,

I’ve reviewed the final NATURANA technical specification. Please treat the PDF as the main source of truth for the build — especially the 85-variant dataset, public SKU/barcode mapping, page copy, recommendations, scenarios and managed-service positioning.

There are a few areas where the source intentionally does not provide enough information to derive something safely. Please handle them as follows:

1. Common alpha-size curves
The initial/gross/fit-adjusted size-mix percentages in the document are canonical illustrative planning curves. They do not directly aggregate from the four alpha-product SKU tables.

Please use the supplied percentages exactly as shown:
- Initial: XS 9 / S 18 / M 24 / L 25 / XL 13 / XXL 7 / 3XL 4
- Fit-adjusted: XS 7.5 / S 17.5 / M 33 / L 22 / XL 10.5 / XXL 6 / 3XL 3.5

Do not recalculate these from the 85-row operating dataset.

2. Incoming inventory dates
We have incoming quantities, but we have not supplied reliable per-SKU receipt dates.

Do not invent PO arrival dates.

Current Weeks of Cover and incoming quantities can be displayed exactly as specified. If a time-phased inventory chart requires an actual arrival date, keep that part simplified / illustrative rather than creating fake dates. We can add dated PO fixtures later if required.

3. Exchange ledger
The row-level ExIn / ExOut values are canonical demonstration inputs, but they are not intended to form a fully reconciled 85-SKU exchange transaction ledger.

The only explicit directional movement that should be presented as a real demo story is:

Cherry L → M
6 exchange-outs from L
4 of those 6 moving to M

Do not invent exchange destinations for the rest of the catalog and do not build a full Sankey / exchange-flow ledger from assumptions.

4. Scenario engine
The canonical scenario outputs in the document must be reproduced exactly:

Base:
18 actions / 2 set risks / €47,500 commitment / €2,500 reserve

Upside:
24 actions / 3 set risks / €57,500 requirement / €7,500 gap

Supplier Delay:
26 actions / 4 set risks / €8,500 incremental requirement

Fit Friction:
L fit-adjusted demand -12%
M retained demand +6%

For arbitrary slider combinations, the full coefficient model has not been specified. Please do not invent a sophisticated model to make every slider generate fake precision.

Use deterministic calculations where the relationship is explicitly defined. The supplied presets are the acceptance truth for V1. Flag anything beyond that where you need an additional calculation rule from me.

5. Matching-set risk
The two canonical set risks for V1 are:

Candy Pink M
Top cover 2.0 weeks
Bottom cover 1.8 weeks

Cherry M
Top cover 2.2 weeks
Bottom cover 1.7 weeks

The 62% set attach rate is a synthetic planning assumption.

The document does not fully define a production-grade threshold model around that attach rate, so please do not create extra set risks just from your own thresholds. The two supplied M risks are the canonical demo states.

6. Analyst override TypeScript field
The Cherry L analyst example uses:

overrideType: "FIT_SIGNAL"

but the Variant interface does not currently declare overrideType.

Please add:

overrideType?: string;

or equivalent to the recommendation / variant model so the analyst override can be represented properly.

7. Per-variant analyst detail
The final decision state is supplied for all 85 variants, but detailed expected-demand baselines, analyst notes, model recommendations and confidence are not populated for every single row.

Do not manufacture 85 different analyst stories.

Use the detailed analyst treatment for the explicitly specified spotlight decisions such as:
- Candy Pink M
- Cherry M
- Cherry L
- Plum 80C
- matching-set risks

For ordinary HOLD / WATCH rows, the metrics + final action are enough unless the document provides additional interpretation.

8. Product price
For the NATURANA-facing workspace, use the NATURANA storefront price as the primary displayed price.

Keep the Understatement price only as reference metadata where needed.

Do not combine the two or invent an averaged price.

9. Existing ScaleSight architecture
Please build this using the same ScaleSight workspace architecture / visual language we already use rather than creating a new product framework.

The important distinction throughout the UI is:

Workspace = planning environment
ScaleSight = team maintaining the analytical layer

The Managed Intelligence page is critical. The demo must make it clear that NATURANA is not being given another dashboard to operate.

The intended message is:

“Analysis maintained by ScaleSight. Decisions made with NATURANA.”

The workspace should also clearly feel configurable around NATURANA’s actual assortment, systems and planning rules — not like a fixed sizing software product.

Everything else in the PDF can be implemented as specified.

Before final delivery, please verify:
- exactly 8 products / 85 variants
- no Plum 90E
- exact public SKUs + barcodes
- action counts reconcile to 6 BUY DEEPER / 11 REPLENISH / 1 INVESTIGATE / 9 WATCH / 9 REDUCE / 49 HOLD
- all €50K OTB numbers reconcile
- Cherry L retained demand = 25
- Cherry M retained demand = 31
- Candy Pink M retained demand = 37
- scenario presets match the document
- illustrative-data disclaimer remains visible
- no implication that we have NATURANA internal data
- Managed Intelligence and customisation are prominent

Send me the first working version before polishing every edge case. I want to validate the decision flow and the way the managed service comes across first.

Thanks,
Arman