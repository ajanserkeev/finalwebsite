# Hidden writes
Features: F-006, F-008, F-010 · Status: done

## Overview
Actions in the tour aggregator and partner portal that mutate server or browser state without a traditional "Save" button, or trigger background side-effects.

| Trigger | Where | What it writes | Scope | Evidence |
|---|---|---|---|---|
| Opening Checkout (`S-005`) and clicking "Proceed to Payment" | `S-005` | Atomically increments `TourDeparture.heldSeats` by `paxCount` for 15 minutes so another user cannot take those seats while the tourist completes 3D-Secure payment (`R-005`) | Global (`TourDeparture`) | [doc SRC-007] |
| Clicking `[-]` or `[+]` on Seat Quota in Partner Portal | `S-006` | Immediately patches `TourDeparture.maxSeats` and recomputes `seatsRemaining` on the live Tour Detail page (`S-003`) without a separate Save button | Global (`TourDeparture`) | [doc SRC-006] |
| Toggling "Guaranteed Departure" switch | `S-006` | Immediately sets `TourDeparture.isGuaranteed = true` and publishes the `"Guaranteed Departure"` badge on `S-002` and `S-003` | Global (`TourDeparture`) | [doc SRC-001] |
| Changing Currency (`USD` / `KGS` / `EUR` / `RUB`) | Header (`S-001`..`S-005`) | Persists `pref_currency` in `localStorage` and recalculates all displayed prices and deposit splits across tabs | Browser (`localStorage`) | [doc SRC-005] |

## Not tested
- Live WebSocket push on seat hold expiration (L4 Observe-Only).
