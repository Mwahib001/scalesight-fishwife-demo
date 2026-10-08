# Source inputs needed from Arman

The demo implements the supplied canonical inputs. The following interactions explicitly show missing inputs. Resolve these before presenting exact calculated scenarios. Source: technical specification, Implementation Questions (page 83).

| Question | Blocked interaction | Exact confirmation needed |
| --- | --- | --- |
| Q2 | Reconcile allocation and bundle examples | Confirm a separate bundle inventory snapshot with 400 free trout tins, or specify changed reservations. Allocation reserves all 4,200 tins; these contexts are currently separate. |
| Q3 | FBJ exact trajectories, receipt markers, protected units and remaining exposure | Receipt-before-demand convention; early 4,000 receipt date; full 6,000 expedite date; standard 2,000 date; updated full-receipt date. Confirm elapsed weeks versus week buckets. The canonical 6,200 is service exposure, excluding safety reserve. |
| Q4 | Mussel receipt / displacement trajectories | Date for early 8,000 Basil Pesto; date for remaining 4,000; date for displaced 8,000 Sweet Pepper. No transfer of finished goods between flavors is assumed. |
| Q5 | Scenario outputs, preset values and recommendation thresholds | Landed cost per SKU, MOQ, recovery-cost threshold, protected-demand baseline, FBJ DTC promo reduction, allocation displacement priority and discretionary bundle quantity, amount of trout released in the bundle toggle, exact values for all three scenario presets and retailer pull-forward observations. |
| Q6 | Supply-stage dates and aggregate incoming detail | Production, ready and transit dates for seven POs; confirm Gold Label incoming detail. TUN-SG, SAR-HP and MAC-CHILI stay aggregate records without invented PO IDs. |
| Q7 | Channel chart, confidence and history gaps | Approved SKU × channel weekly observations for six channels; remaining dated Spanish Lemon observations in the 13-week view. No equal channel splits are assumed. |
| Q8 | Action vocabulary | Preserve page labels REVIEW BUY, INTERVENE, PROTECT COMPONENT; internal enums normalize to BUY, SPLIT, REALLOCATE. No execution is attached. |
| Q9 | Weekly change copy and watch example | Approve the seven fixture-supported draft observations; provide previous-review snapshot to substantiate temporal changes. Approve a separate one-week pull-forward fixture for the WATCH example; currently the supplied 17 Aug collaboration spike is used without an invented SKU history. |
| Q9 assets | Exact brand typography | Supply a licensed Recoleta webfont and authorized Fishwife wordmark if required. Live theme inspection confirms Recoleta and Albert Sans. The local demo uses an open Petrona serif fallback and Albert Sans. Theme colors are sampled/interpretive, not official brand hex standards. |
| Q10 | Exact intervention deadlines and supply-gap timing | Supplier cutoff, freight cutoff and cannery lock dates; readiness information; agreed receipt convention for safety breach / stockout dates. |

Q1 passes: baseline 41,400, current 45,100, aggregate +8.9%.

Cin7 logo supplied in `public/logos/cin7logo.png`. Product variety-box image supplied in `public/brand/productimage.webp`; it is used as a variety pack, not mislabeled as a single SKU. Additional product photographs are downloaded from the official Fishwife storefront with their source recorded in `ASSET_SOURCES.md`.
