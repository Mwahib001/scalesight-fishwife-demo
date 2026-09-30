# TASK: Build the NATURANA demo workspace (V1) inside the existing ScaleSight workspace architecture

## 0. Context and goal
Arman (ScaleSight) has a lead, NATURANA (lingerie/apparel brand). We are building a demo planning workspace that shows a sizing / inventory decision flow plus a managed-service story. This is a SALES DEMO on ILLUSTRATIVE DATA, not a production system.

Arman wants a FIRST WORKING VERSION before edge-case polish. He wants to validate two things:
1. the decision flow
2. how the managed service comes across
Prioritise a working vertical slice over pixel polish.

## 1. Sources of truth (in priority order)
1. `docs/spec/NATURANA_technical_spec.pdf`: MAIN SOURCE OF TRUTH for the build. It covers the 85-variant dataset, public SKU/barcode mapping, page copy, recommendations, scenarios, and managed-service positioning.
2. `docs/spec/ARMAN_CLARIFICATIONS.md`: Arman's email. It overrides or clarifies the PDF ONLY where it explicitly says so (sections 5-9 below restate it).
3. The existing ScaleSight repo: architecture, components, design tokens, visual language. Reuse them. Do NOT create a new product framework, design system, or state library.

If the PDF and the email conflict, follow the email and log the conflict in `docs/OPEN_QUESTIONS.md`.
If something is not specified anywhere, DO NOT INVENT IT. Log it in `docs/OPEN_QUESTIONS.md` with a proposed default and continue.

## 2. Phase 0: read and extract BEFORE writing UI code
Do all of this first and commit it:
1. Inspect the repo: framework, routing, layout shell, component library, theming, data-loading patterns, test setup, lint/type config. Write a short `docs/ARCHITECTURE_NOTES.md` on how the NATURANA workspace will plug in (routes, nav, data location, shared components reused).
2. Fully read the PDF. Produce `docs/SPEC_EXTRACTION.md` containing:
   - a page/section inventory (every page or screen the PDF specifies, with its copy)
   - the full 85-variant dataset transcribed into structured fixtures (see §4)
   - the public SKU and barcode mapping
   - the recommendation logic and final-action definitions
   - scenario definitions
   - managed-service positioning copy
   - a list of ambiguities or missing items
3. Create `docs/OPEN_QUESTIONS.md` as a living log of anything needing a calculation rule or decision from Arman.

Do not skip this phase. Transcription errors in the dataset are the biggest risk in this project.

## 3. Product/positioning requirements (critical)
- Distinction used throughout the UI:
  - **Workspace = the planning environment**
  - **ScaleSight = the team maintaining the analytical layer**
  Make this visible in labels, badges, empty states, and page copy.
- **Managed Intelligence page is CRITICAL and must be prominent** (primary navigation, not buried). The demo must make it clear that NATURANA is NOT being given another dashboard to operate. Core message, to appear prominently verbatim:
  > **"Analysis maintained by ScaleSight. Decisions made with NATURANA."**
  Take the rest of the page content and structure from the PDF's managed-service positioning.
- The workspace must feel **configurable around NATURANA's actual assortment, systems and planning rules**, not like a fixed sizing software product. Surface this via a visible configuration/"how this is set up for NATURANA" area (assortment, size curves, exchange handling, set rules, OTB, scenarios), following the PDF.
  - Do NOT claim specific integrations or system connections that the PDF does not state. If systems are shown, label them as configurable/to be confirmed.
- **Illustrative-data disclaimer must remain visible** on the workspace (persistent, not dismissible into invisibility).
- **No implication that we have NATURANA internal data.** Copy must not say "your data", "connected to your ERP", or "your sales". Use language such as "illustrative", "built from public storefront information", "synthetic planning assumptions". Audit every string for this.

## 4. Data requirements
- Exactly **8 products / 85 variants**. Encode as a typed fixture (e.g. `naturana.variants.ts` or the repo's equivalent).
- **No Plum 90E** anywhere. Add a test that fails if it appears.
- **Exact public SKUs and barcodes** as mapped in the PDF. Do not normalise, pad, or reformat them. Add a test comparing them against a fixture transcribed straight from the PDF.
- **Price:** use the **NATURANA storefront price** as the primary displayed price. Store the Understatement price ONLY as reference metadata (e.g. `referencePrice` / `understatementPrice`) where needed. NEVER combine them or invent an averaged price.
- Final decision state is supplied for all 85 variants. Action counts must reconcile EXACTLY:
  **6 BUY DEEPER / 11 REPLENISH / 1 INVESTIGATE / 9 WATCH / 9 REDUCE / 49 HOLD** (total 85).
- Type change: the Variant / recommendation model must include `overrideType?: string;`. The Cherry L analyst example uses `overrideType: "FIT_SIGNAL"`.

## 5. Canonical numbers: use exactly, do not recompute

### 5.1 Common alpha-size curves (illustrative planning curves)
Use exactly as shown. **Do NOT recalculate from the 85-row dataset**. They do not aggregate from the four alpha-product SKU tables.
- Initial: XS 9 / S 18 / M 24 / L 25 / XL 13 / XXL 7 / 3XL 4
- Fit-adjusted: XS 7.5 / S 17.5 / M 33 / L 22 / XL 10.5 / XXL 6 / 3XL 3.5
(Each sums to 100. Add a test. Also follow the PDF for the "gross" curve.)

### 5.2 Incoming inventory
- Weeks of Cover and incoming quantities: display exactly as specified.
- There are NO reliable per-SKU receipt dates. **Do NOT invent PO arrival dates.**
- If a time-phased inventory chart is needed, keep it simplified/illustrative and label it as such (no fabricated dates). Structure the code so dated PO fixtures can be added later.

### 5.3 Exchange ledger
- Row-level ExIn / ExOut are canonical demo inputs, but NOT a reconciled 85-SKU transaction ledger.
- The ONLY explicit directional movement to present as a real demo story: **Cherry L → M: 6 exchange-outs from L, 4 of those 6 moving to M.**
- Do NOT invent destinations for the other 2, or for any other SKU. Do NOT build a full Sankey/exchange-flow ledger.

### 5.4 Scenario engine
Reproduce exactly:
- **Base:** 18 actions / 2 set risks / €47,500 commitment / €2,500 reserve
- **Upside:** 24 actions / 3 set risks / €57,500 requirement / €7,500 gap
- **Supplier Delay:** 26 actions / 4 set risks / €8,500 incremental requirement
- **Fit Friction:** L fit-adjusted demand −12%; M retained demand +6%

Rules:
- The presets are the ACCEPTANCE TRUTH for V1. Implement them as explicit preset data, not by fitting a model.
- Use deterministic calculation only where the relationship is explicitly defined in the PDF (e.g. €50K OTB = commitment + reserve; 47,500 + 2,500 = 50,000; requirement 57,500 − 50,000 = 7,500 gap).
- For arbitrary slider combinations, the coefficient model is NOT specified. **Do NOT invent a sophisticated model or fake precision.** Choose a safe UI behaviour: sliders snap to / select presets, or a custom state clearly labelled "Custom: not calibrated in V1", showing no invented outputs. Log the missing rule in `OPEN_QUESTIONS.md`.
- Do not invent totals not given (e.g. do not compute a Supplier Delay total commitment; only the €8,500 incremental).

### 5.5 Matching-set risk
Exactly two canonical set risks for V1:
- **Candy Pink M:** top cover 2.0 weeks / bottom cover 1.8 weeks
- **Cherry M:** top cover 2.2 weeks / bottom cover 1.7 weeks
- The 62% set attach rate is a SYNTHETIC planning assumption; label it that way.
- Do NOT create additional set risks from your own thresholds. Do not build a threshold model around the attach rate.

### 5.6 Retained demand (must be exact)
- Cherry L retained demand = **25**
- Cherry M retained demand = **31**
- Candy Pink M retained demand = **37**

### 5.7 Per-variant analyst detail
- Detailed analyst treatment (expected-demand baseline, notes, model recommendation, confidence, override) ONLY for spotlight decisions: **Candy Pink M, Cherry M, Cherry L, Plum 80C, and the matching-set risks**.
- Ordinary HOLD/WATCH rows: metrics + final action only, unless the PDF gives extra interpretation. **Do NOT manufacture 85 analyst stories.** Do not use placeholder lorem or generated rationale text.

## 6. Implementation guidance
- TypeScript strict. Data in typed fixtures; derived counts (actions, OTB) computed from fixtures where defined, then asserted against the canonical numbers.
- No network calls, no real NATURANA data, no scraping at runtime. Images only if provided in the repo or PDF.
- Follow the repo's existing routing, nav, layout, tokens and components. Add NATURANA as a workspace/config in that structure where possible.
- Pages/screens: implement every page in the PDF's inventory. Suggested build order:
  1. Data layer + validation tests
  2. Decision flow (core action views, variant table, spotlight detail incl. Cherry L override, set risk)
  3. Scenarios (presets)
  4. Managed Intelligence + configuration/customisation surfaces + disclaimer
  5. Remaining pages, then polish
- Keep it demo-friendly: fast load, deterministic, no empty states left unhandled.

## 7. Verification (must be automated and run before delivery)
Create a `verify:naturana` script (or a test suite) that fails on any mismatch, covering:
- [ ] exactly 8 products and 85 variants
- [ ] no "Plum 90E" anywhere (data and copy)
- [ ] SKUs and barcodes exactly match the PDF-transcribed fixture
- [ ] action counts = 6 BUY DEEPER / 11 REPLENISH / 1 INVESTIGATE / 9 WATCH / 9 REDUCE / 49 HOLD
- [ ] all €50K OTB numbers reconcile (incl. 47,500 + 2,500 = 50,000; 57,500 − 50,000 = 7,500; and every other OTB figure the PDF shows)
- [ ] Cherry L retained = 25; Cherry M = 31; Candy Pink M = 37
- [ ] scenario presets match the PDF (Base, Upside, Supplier Delay, Fit Friction)
- [ ] size curves match exactly and each sums to 100
- [ ] only two set risks exist, with the exact cover values
- [ ] Cherry L→M story = 6 out / 4 to M, and no other exchange destinations are rendered
- [ ] price shown is the NATURANA storefront price; no averaged/combined price
- [ ] `overrideType?: string` exists and the Cherry L override uses "FIT_SIGNAL"
- [ ] illustrative-data disclaimer is rendered
- [ ] no copy implies NATURANA internal data (grep for banned phrases; list them in the test)
- [ ] Managed Intelligence is in primary nav and contains the verbatim tagline
- [ ] configuration/customisation surface is present and prominent
- [ ] typecheck, lint, and build pass

## 8. Deliverables
1. Working NATURANA workspace in the repo (first working version).
2. `docs/SPEC_EXTRACTION.md`, `docs/ARCHITECTURE_NOTES.md`, `docs/OPEN_QUESTIONS.md`.
3. Verification script/tests, with output showing all checks passing.
4. A concise final report: what's built, what's stubbed/illustrative, every item in OPEN_QUESTIONS, and anything in the PDF you could not implement or that conflicted with the email.

## 9. Non-negotiable rules
- Never invent data, dates, destinations, thresholds, coefficients, prices, or analyst narratives.
- When unsure: log it, use the safest minimal implementation, keep moving.
- Do not refactor unrelated parts of the repo.
- Work in small commits with clear messages.