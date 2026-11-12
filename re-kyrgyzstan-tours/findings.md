# Findings

## Problems

| ID | Finding | Severity | Where | Evidence |
|---|---|---|---|---|
| B-001 | **Opaque Operator Identity on Viator until post-booking:** Viator minimizes the local tour operator's brand in search results and often buries the operator name at the bottom of the listing so travelers can't google them. For a transparent Kyrgyzstan "bridge aggregator", hiding the organizer hurts trust and violates the founder's core value proposition. | high | Viator Search & Tour Detail (`S-002`, `S-003`) | [doc SRC-005] |
| B-002 | **High 20%–25% Commission + $29/listing Fee on Viator causes operator price inflation:** Because Viator charges 20–25% commission and a $29 listing fee, Kyrgyz local operators routinely raise their Viator prices by 25–30% above their direct website/Instagram price, breaking price parity. | high | Viator Supplier Portal (`S-006`) | [doc SRC-006] |
| B-003 | **Stale Seat Quotas & Double-Bookings on Bolshaya Strana:** Because local mountain operators sell the same group departure on Instagram, WhatsApp, and multiple aggregators, seat counts on Bolshaya Strana can lag behind reality, leading to frustration when a tourist books a "available" date that is actually full. | medium | Bolshaya Strana Departure Table (`S-003`) | [doc SRC-001] |
| B-004 | **Refund Friction in Multi-Party Chains:** On Bolshaya Strana, negative reviews most frequently cite delays when requesting a deposit refund during weather/force-majeure cancellations because the platform and organizer must reconcile who holds the funds. | medium | Bolshaya Strana Checkout & Refunds (`FL-001`) | [doc SRC-001] |
| B-005 | **Inaccurate Comfort Expectations in Rural Kyrgyzstan (Yurts/Guesthouses):** Traveler complaints on mountain tours often stem from mismatches between tourist expectations of bathrooms/heating/road transfers and actual conditions at Song-Kul or Kel-Suu. | medium | Bolshaya Strana Tour Detail (`S-003`) | [doc SRC-002] |

## Strengths

- **Bolshaya Strana's "Direct Price from Organizer (No Markup)" Badge (`SRC-001`, `SRC-004`):** Explicitly showing the organizer's name, photo, and a "Same Price as Direct" guarantee converts comparison shoppers who would otherwise leave the site to search Instagram.
- **Bolshaya Strana's Group Departure Matrix (`SRC-001`):** For multi-day tours in Kyrgyzstan (3 to 10 days), showing a clean table of fixed group start/end dates, exact seats left ("4 of 12 spots left"), and a "Guaranteed Departure" badge is far superior to Viator's generic date-picker.
- **Bolshaya Strana's 15–25% Deposit Model (`SRC-002`, `SRC-004`):** Tourists are hesitant to pay $1,200 upfront to an unfamiliar website for a 7-day Tien Shan tour, but gladly pay a 15–20% reservation deposit online and pay the remaining 80–85% upon meeting the organizer in Bishkek.
- **Viator's Automated Post-Trip Verified Review Engine & "Free Cancellation" Cutoff Clarity (`SRC-005`, `SRC-006`):** Clear, automated countdown cutoffs (e.g., "Free cancellation until 15 days before start") and verified-booker photo reviews build massive international trust.
