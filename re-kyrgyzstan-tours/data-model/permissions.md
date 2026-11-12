# Permissions

| Action | Tourist (Public / Booker) | Tour Operator / Partner (`S-006`) | Platform Admin (`S-007`) | Evidence |
|---|---|---|---|---|
| Browse catalog, departure quotas & direct prices (`S-001`..`S-003`) | Yes | Yes | Yes | [doc SRC-001] |
| View Open Organizer Profile & all verified reviews (`S-004`) | Yes | Yes | Yes | [doc SRC-001] |
| Book departure seats & pay online deposit (`S-005`) | Yes | No | No | [doc SRC-004] |
| Submit Verified Review (`C-005`) | Only with a `completed` `Booking` token (`R-007`) | No | No | [doc SRC-006] |
| View Operator KPI Dashboard: **Tours Sold** & **People Signed Up** (`S-006`) | No | Own `organizerId` only (`R-012`) | All organizers (`S-007`) | [doc SRC-006] |
| Create/Edit Tours & Adjust Departure Seat Quotas (`S-006`) | No | Own `organizerId` only (`R-011`, `R-012`) | All tours (`S-007`) | [doc SRC-006] |
| View & Export Departure Participant Manifest (Names, WhatsApp, Balance Due) | No | Own confirmed bookings only (`R-012`) | All bookings (`S-007`) | [doc SRC-006] |
| Post Official Organizer Reply to a Tourist Review (`C-005`) | No | Own reviews only (`S-006`) | Can moderate any review (`S-007`) | [doc SRC-006] |
| Verify Organizer KYC, set Commission % & approve Direct-Price Parity (`S-007`) | No | No | Yes (`R-002`, `R-013`) | [doc SRC-003] |
| Trigger Deposit Refunds & Reconcile Operator Payouts (`S-007`) | Request cancellation only (`R-010`) | View statements only (`S-006`) | Yes (`S-007`) | [doc SRC-004] |
