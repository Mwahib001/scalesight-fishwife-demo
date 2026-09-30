// PDF sections 17–26. Copy is kept separate from calculations.
export const pages = {
  brief: {
    eyebrow: "NATURANA × UNDERSTATEMENT",
    title: "Weekly Planning Brief",
    description:
      "What changed across the capsule, what deserves attention, and what may need to change in the next buy.",
  },
  translation: {
    eyebrow: "SIZE TRANSLATION INTELLIGENCE",
    title: "Two sizing systems. One planning view.",
    description:
      "Translate historical size demand into a common planning structure, then compare the assumption with what customers actually do after launch.",
  },
  demand: {
    eyebrow: "SIZE DEMAND",
    title: "The commercial size curve is already moving.",
    description:
      "Compare the translated planning assumption with gross launch demand and the demand customers actually retain after returns and size exchanges.",
  },
  sku: {
    eyebrow: "SIZE-TO-BUY PLANNING",
    title: "SKU & Size Planning",
    description:
      "See which variants need more depth, which should be held, and which signals need another week before inventory is committed.",
  },
  fit: {
    eyebrow: "FIT-ADJUSTED DEMAND",
    title: "Strong sales do not always mean deeper demand.",
    description:
      "Separate genuine commercial demand from size movement created by returns and exchanges.",
  },
  buy: {
    eyebrow: "NEXT BUY",
    title: "Where should the next inventory euro go?",
    description:
      "Allocate inventory toward the strongest retained demand while preserving set availability and keeping capacity for signals that are still developing.",
  },
  scenario: {
    eyebrow: "ILLUSTRATIVE PLANNING CONCEPT",
    title: "Scenario Planning",
    description:
      "Change the assumptions before committing inventory and see which decisions remain robust.",
  },
  learning: {
    eyebrow: "PLAN VS EARLY SIGNAL",
    title: "The first plan is an assumption. The next plan should learn.",
    description:
      "Compare the translated size curve with early retained demand and update the next planning cycle without pretending the original mapping was perfect.",
  },
  managed: {
    eyebrow: "MANAGED BY SCALESIGHT",
    title: "The workspace is only one part of the service.",
    description:
      "ScaleSight maintains the planning layer, reviews what changed, and brings your team the decisions, assumptions and trade-offs that deserve attention.",
  },
  assumptions: {
    eyebrow: "TRANSPARENT BY DESIGN",
    title:
      "What is real, what is assumed, and what a live workspace would use.",
    description: "",
  },
};
export const priorities = [
  {
    title: "Candy Pink · M",
    action: "BUY_DEEPER",
    id: "CP-BRA-M",
    change:
      "Fit-adjusted M demand is running materially above the initial translated size curve.",
    meaning:
      "Current cover is 2.0 weeks. The matching brief is tighter at 1.8 weeks, so the risk is across the set rather than the bralette alone.",
    recommendation:
      "Increase M depth across the next Candy Pink commitment and protect matching brief availability.",
    decision: "Approve additional M depth before the next buy is finalised.",
    cta: "Review Candy Pink M",
    href: "/sku-planning?variant=CP-BRA-M",
  },
  {
    title: "Cherry · L",
    action: "INVESTIGATE",
    id: "CH-BRA-L",
    change:
      "L has the strongest gross sales in the Cherry balconette, but 18% of those sales are exchanging out of the size.",
    meaning:
      "Four of six exchange-outs are moving to M. Gross sell-through is therefore overstating retained L demand.",
    recommendation:
      "Hold additional L commitment until the next review and shift attention to the stronger retained M signal.",
    decision: "Do not deepen L based on gross sell-through alone.",
    cta: "Review Fit Signal",
    href: "/fit-signal",
  },
  {
    title: "Plum · 80C",
    action: "BUY_DEEPER",
    id: "PL-BRA-80C",
    change:
      "80C is running ahead of the initial launch plan with only 2.2 weeks of current cover.",
    meaning:
      "The confirmed incoming quantity improves short-term availability but does not create enough depth for the current forward demand signal.",
    recommendation:
      "Add 80C depth to the next Plum buy and continue monitoring adjacent 75C and 85C demand.",
    decision: "Increase 80C purchasing allocation.",
    cta: "Open SKU Plan",
    href: "/sku-planning?variant=PL-BRA-80C",
  },
  {
    title: "Cherry Set · M",
    action: "SET_RISK",
    id: "CH-BRA-M",
    change:
      "The Cherry M balconette has 2.2 weeks of cover while the matching brief has only 1.7.",
    meaning:
      "Replenishing the top without protecting the matching bottom could constrain full-set availability.",
    recommendation:
      "Prioritise the brief alongside the top rather than planning each SKU independently.",
    decision: "Protect the M set in the next allocation.",
    cta: "Review Set Availability",
    href: "/sku-planning#sets",
  },
] as const;
export const changes = [
  "Candy Pink M fit-adjusted demand moved above translated plan.",
  "Cherry M is now the strongest retained alpha-size signal.",
  "Cherry L exchange pressure increased.",
  "Candy Pink M brief cover fell below 2 weeks.",
  "Plum 80C moved into BUY DEEPER.",
  "Dark Leo 95D remains materially above target cover.",
  "Two matching sets now require coordinated planning.",
];
export const setAnalysis =
  "M is commercially strong across both alpha-sized sets, but the matching briefs are tighter than the tops. Replenishing the top alone would not fully protect set availability.";
export const learningAnalysis =
  "The original translation provided a reasonable planning baseline. Early customer behaviour is now giving NATURANA a stronger commercial signal about where the size curve should move. ScaleSight would continue updating this view as additional sell-through, exchange and inventory data arrives.";
export const earlyAnalysis =
  "Early behaviour suggests that some demand originally expected to sit in L is being retained in M. The change is meaningful enough to alter the next-buy assumption, but the launch window remains short, so confidence remains Moderate rather than High.";
export const translationAnalysis =
  "The translation is useful as a starting assumption, but early demand is already showing that the commercial size curve is not behaving exactly as expected. The biggest shift is toward M across the alpha-sized assortment. That change is large enough to affect buying decisions.";
export const fitConclusion =
  "L remains commercially relevant, but the current gross-sales signal is not enough evidence to deepen the next buy. M shows the cleaner retained-demand signal across both alpha-sized tops.";
export const cherryAnalysis =
  "Cherry L has the strongest gross launch sales in the style, but six customers have exchanged out of the size and four moved into M. The retained demand signal is therefore materially weaker than gross sell-through suggests.";
export const cherryDecision =
  "Hold additional L commitment for one review cycle. Do not reduce existing availability, but do not use gross sales alone to justify a deeper next buy.";
export const customizationCopy =
  "This concept has been configured around one specific issue in the NATURANA × Understatement collaboration: translating mixed sizing demand into the next inventory decision. A live ScaleSight workspace would not be limited to this structure. It would be configured around NATURANA’s actual product hierarchy, sales channels, purchase orders, supplier lead times, inventory locations, returns, seasonal collections, buying calendars and management decisions. Measures, modules and planning rules can be added, removed or reshaped around the way your team already works.";
export const workflow = [
  [
    "Data Refresh",
    "Sales · Inventory · Returns · Exchanges · Purchase orders · Commercial events · Business assumptions",
  ],
  [
    "Validate",
    "SKU mappings · Missing data · Size relationships · Outliers · Stockout distortion",
  ],
  [
    "Refresh Planning Model",
    "Demand · Size curve · Inventory cover · Set availability · Scenario assumptions",
  ],
  [
    "ScaleSight Specialist Review",
    "Exceptions · Fit signals · Forecast movement · Supply exposure · Working capital · Commercial context",
  ],
  ["Prioritise", "What actually deserves management attention?"],
  [
    "Recommend",
    "BUY DEEPER · REPLENISH · HOLD · WATCH · INVESTIGATE · REDUCE NEXT BUY",
  ],
  [
    "Weekly Planning Brief",
    "What changed · Why it matters · What ScaleSight recommends · What decision is required",
  ],
  ["NATURANA Review", ""],
  ["Management Decision", ""],
  ["Monitor Outcome", ""],
];
