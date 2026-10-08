# User-supplied synthetic fixture v1.1

ScaleSight × Fishwife — Canonical Synthetic Fixture v1.1

All values below are approved SYNTHETIC DEMO INPUTS, not Fishwife actuals. Use them centrally across the workspace. Do not relabel them as public facts.

/demand — complete 13-week total demand history

Dates are week-start dates.

SKU	Jul 13	Jul 20	Jul 27	Aug 3	Aug 10	Aug 17	Aug 24	Aug 31	Sep 7	Sep 14	Sep 21	Sep 28	Oct 5
TUN-SL	4,200	4,300	4,350	4,350	5,900	6,400	5,200	4,800	5,100	5,250	5,450	5,700	5,600
TUN-SP	6,050	6,100	6,200	6,150	6,250	6,300	6,350	6,250	6,400	6,425	6,475	6,525	6,500
TUN-OO	5,300	5,250	5,200	5,225	5,150	5,100	5,075	5,050	5,000	4,950	5,000	4,975	5,000
TUN-SG	3,000	3,050	3,100	3,150	3,200	3,250	3,275	3,300	3,350	3,400	3,450	3,475	3,500
SAL-GL	3,250	3,300	3,325	3,350	3,375	3,400	3,450	3,475	3,500	3,525	3,550	3,575	3,600
SAL-FBJ	2,600	2,650	2,700	2,750	2,800	2,850	2,900	2,950	2,925	2,975	3,025	3,050	3,000
TRT-ORIG	1,900	1,900	1,850	1,800	1,750	1,700	1,650	1,600	1,550	1,500	1,600	1,650	1,700
SAR-PL	4,100	4,150	4,200	4,225	4,250	4,300	4,325	4,350	4,400	4,425	4,450	4,475	4,500
SAR-HP	2,400	2,450	2,500	2,525	2,550	2,600	2,625	2,675	2,700	2,750	2,775	2,825	2,800
MUS-BP	2,300	2,350	2,400	2,425	2,450	2,500	2,550	2,600	2,700	2,800	2,900	3,050	3,000
MUS-SPG	2,650	2,675	2,700	2,725	2,680	2,710	2,740	2,760	2,780	2,790	2,810	2,820	2,800
MAC-CHILI	2,850	2,875	2,900	2,925	2,950	2,975	3,000	3,025	3,050	3,075	3,100	3,125	3,100

For Spanish Lemon, the four newly supplied pre-event weeks average exactly 4,300, preserving the canonical pre-event baseline. The original Aug 10–Oct 5 observations remain unchanged.

/demand — canonical channel mix

Use these fixed synthetic demo shares to generate the six channel series.

SKU	DTC	Target	Whole Foods	Costco / Club	Amazon	Independent / Wholesale
TUN-SL	30%	40%	0%	0%	10%	20%
TUN-SP	15%	15%	20%	25%	5%	20%
TUN-OO	20%	25%	25%	0%	10%	20%
TUN-SG	45%	0%	0%	0%	20%	35%
SAL-GL	45%	0%	0%	0%	20%	35%
SAL-FBJ	20%	25%	0%	0%	15%	40%
TRT-ORIG	15%	25%	0%	30%	5%	25%
SAR-PL	15%	20%	20%	0%	10%	35%
SAR-HP	40%	0%	0%	0%	20%	40%
MUS-BP	40%	0%	0%	0%	20%	40%
MUS-SPG	40%	0%	0%	0%	20%	40%
MAC-CHILI	15%	20%	20%	0%	10%	35%

Generation rule:

channel units = round(total weekly SKU units × channel share)

Any rounding residual goes to that SKU’s largest modeled channel so that channel totals always equal the weekly SKU total.

Important: the shares are synthetic. Named retailer placement is informed by public assortment, but these percentages are not Fishwife actual sales mix.

Recommended confidence:

SKU	Confidence
TUN-SL	MODERATE — post-collaboration
TUN-SP	HIGH
TUN-OO	HIGH
TUN-SG	HIGH
SAL-GL	HIGH
SAL-FBJ	HIGH
TRT-ORIG	LOW — supply-constrained/censored
SAR-PL	HIGH
SAR-HP	HIGH
MUS-BP	MODERATE — recent acceleration
MUS-SPG	HIGH
MAC-CHILI	HIGH

For any modeled non-zero channel, inherit the SKU confidence. A 0%-modeled channel should show No modeled observations, not zero demand.

⸻

/po-intervention — lock the FBJ chronology

Use Smoked Salmon with Fly By Jing Chili Crisp.

Opening snapshot:

8 Oct 2026

Opening inventory:

8,800 tins

Forward demand:

3,000 tins/week

Incoming PO:

6,000 tins

Safety stock:

7,500 tins = 2.5 weeks

Planning periods:

* W1 = Oct 8–14
* W2 = Oct 15–21
* W3 = Oct 22–28
* W4 = Oct 29–Nov 4
* W5 = Nov 5–11
* W6 starts Nov 12

Receipt convention:

A receipt dated at the start of a period is available before that period’s demand.

Original PO arrival:

5 Nov 2026

Delayed / accept-delay arrival:

12 Nov 2026

Therefore delayed receipt occurs after five full 3,000-unit demand periods:

5 × 3,000 - 8,800 = 6,200 tins exposure

This preserves the PDF’s canonical 6,200.

Recovery options

Option	Receipt timing	Qty	Incremental cost	Exposure before final receipt
Accept delay	Nov 12	6,000	$0	6,200
Full expedite	Oct 29	6,000	$8,400	200
Split	Oct 29 / Nov 12	4,000 / 2,000	$5,600	2,200
Split + reduce promo	Oct 29 / Nov 12	4,000 / 2,000	$5,600	0

Protected-demand baseline:

1,900 tins/week

Discretionary / promotional DTC portion within the 3,000 weekly demand:

1,100 tins/week

For the Split + reduce promo option, remove 2,400 tins total of low-priority DTC promotional demand:

* W3: -200
* W4: -1,100
* W5: -1,100

Adjusted five-week demand becomes:

15,000 - 2,400 = 12,600

Available before Nov 12 under split:

8,800 + 4,000 = 12,800

Result:

0 service exposure, 200 tins remaining before the final 2,000 arrives.

Service units protected versus Accept Delay:

* Full expedite: 6,000
* Split only: 4,000
* Split + reduce promo: 6,200

This makes the page fully calculable.

⸻

Synthetic landed cost + MOQ table

These values are strictly illustrative. Public search does not reveal Fishwife’s actual landed costs or MOQs; Fishwife’s job description only confirms that planners work with both. 

SKU	Synthetic landed cost / tin	Synthetic MOQ
TUN-SL	$3.40	18,000
TUN-SP	$3.30	18,000
TUN-OO	$3.20	18,000
TUN-SG	$3.60	15,000
SAL-GL	$4.80	9,000
SAL-FBJ	$5.40	6,000
TRT-ORIG	$4.50	12,000
SAR-PL	$3.10	15,000
SAR-HP	$3.20	12,000
MUS-BP	$3.60	12,000
MUS-SPG	$3.50	12,000
MAC-CHILI	$3.70	10,000

⸻

/scenario — one important correction

I recommend making the default scenario SKU Gold Label Smoked Salmon (SAL-GL), not FBJ Salmon.

Reason: FBJ’s reviewed base action is already SPLIT / INTERVENE, while the scenario page copy is designed to demonstrate HOLD → SPLIT. Gold Label’s canonical action is HOLD, so this makes the interaction mathematically coherent without changing the overall concept.

Base scenario:

OH: 20,000
Demand: 3,600/week
Incoming: 9,000
Receipt: Nov 5
Landed cost: $4.80/tin
MOQ: 9,000
Safety stock: 9,000 = 2.5 weeks
Protected demand: 2,500/week
Current reviewed action: HOLD

Recovery options for scenarios:

Split: 5,000 early + 4,000 standard
Split premium: $3,600
Full expedite: 9,000 early
Full-expedite premium: $6,300

Demo decision threshold:

Recommend SPLIT when either:
projected inventory before receipt falls below one week of protected demand (2,500 tins), or a stockout occurs before receipt,
and the split premium is ≤ $4,000.

Escalate to EXPEDITE if projected exposure exceeds 4,000 tins or the split scenario still leaves protected-demand exposure.

This is a demo rule, not a claimed Fishwife planning policy.

Preset 1 — Demand holds higher

Demand change:

+25%

Demand:

4,500/week

Receipt delay:

0 weeks — Nov 5

Protected demand:

2,500/week

Before receipt after four weeks:

20,000 - 18,000 = 2,000

Projected stockout before receipt:

None

Safety stock recalculates to:

11,250

Safety breach:

Week 2

Exposed units:

0

But 2,000 pre-receipt inventory is below the 2,500 protected-demand threshold.

Reviewed response:

SPLIT

Move:

5,000 to Oct 29
4,000 stays Nov 5

Incremental cash:

+$3,600 recovery premium

⸻

Preset 2 — Supplier slips

Demand change:

0%

Demand:

3,600/week

Receipt delay:

+2 weeks

Receipt becomes:

19 Nov

Six weeks demand before receipt:

21,600

Opening inventory:

20,000

Exposure:

1,600

Safety breach:

Week 4

Stockout:

Week 6

Reviewed response:

SPLIT

Move:

5,000 to Nov 5
4,000 stays Nov 19

Incremental cash:

+$3,600

This avoids the projected stockout.

⸻

Preset 3 — Retailer pulls demand forward

Keep the six-week total broadly unchanged but front-load the first four weeks.

Use:

Week	Demand
W1	5,000
W2	4,600
W3	3,000
W4	1,800
W5	3,600
W6	3,600

First four weeks total:

14,400 — exactly the same as 4 × the base 3,600.

Receipt:

Nov 5

Projected inventory:

W1: 15,000
W2: 10,400
W3: 7,400
W4: 5,600

Stockout:

None

Safety breach:

Week 3

Exposed units:

0

Incremental cash:

$0

Reviewed response:

WATCH / HOLD

Analyst interpretation:

Demand has moved forward in time, but total requirement has not increased. Do not add production solely because the first retailer weeks look stronger; monitor the next reorder cycle.

This is actually a very good ScaleSight scenario because it proves we do not always recommend intervention.

For /scenario, promo reduction is not applicable because that belongs to the FBJ /po-intervention recovery case. This separation makes the architecture much cleaner.

⸻

Two extra PDF gaps I would resolve now

For Rainbow Trout, keep /allocation and /bundles as two separately labelled illustrative snapshots. The PDF itself identifies that 4,200 fully allocated tins and 400 free bundle tins cannot come from the exact same reservation state. Do not subtract both from one pool. ScaleSight_Fishwife_Technical_Specification_Wahib_v1.pdf

For mussel resequencing, lock the dates as:

Basil Pesto: move 8,000 from Nov 12 → Oct 22, remaining 4,000 stays Nov 12.
Sweet Pepper + Garlic: 4,000 stays Nov 26; 8,000 moves to Dec 17.

That implements the existing “move 8,000 forward three weeks / push equivalent capacity later” logic without implying tins move between flavors.

⸻

