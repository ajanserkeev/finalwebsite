# Status: Kyrgyzstan Tour Aggregator (Bolshaya Strana & Viator Study)
Updated: 2026-11-12 · Session: s01 · Phase: 7 Close
Environment: L4 Observe-Only · Sandbox: none-l4-observe-only · Open ledger rows: 0

## Summary
- Covered: Complete RES architecture & product study of `bolshayastrana.com` and `viator.com` across all 13 features (`F-001`–`F-013`), 7 screens (`S-001`–`S-007`), 6 reusable components (`C-001`–`C-006`), 13 business rules (`R-001`–`R-013`), 5 data model entities (`E-001`–`E-005`), 4 Kyrgyzstan production barriers (`BR-001`–`BR-004`), and full Clone PRD (`clone/prd.md`).
- Not covered: Live authenticated sessions inside `bolshayastrana.com` or `supplier.viator.com` partner cabinets (strictly forbidden under L4 Observe-Only rules; Chrome remote-debugging dialog also timed out awaiting manual approval, so all screens and rules were documented from public marketplace specifications `SRC-001`–`SRC-008`).
- Decide: Confirm the 4 founder decisions in `questions.md` (`Q-001`: 15–20% Deposit-Equals-Commission checkout model; `Q-002`: Instant Deposit vs. Application-then-Deposit; `Q-003`: Freedom Pay / Finik / Stripe gateway choice; `Q-004`: Kyrgyz Agency Agreement terms) and approve starting Phase 1 MVP code generation.

## Next actions
1. Review `REPORT.html` and confirm the recommended **"Deposit = Platform Commission" (15–20% online deposit, 80–85% paid directly to organizer)** business model (`Q-001`, `R-003`).
2. Scaffold the database schema (`data-model/types.ts`, `data-model/erd.mmd`) and role-isolated backend (`tourist`, `organizer`, `admin`).
3. Build the 3 core web interfaces in order: **Admin Panel (`S-007`)** & **Tour Operator Partner Portal (`S-006`)** -> **Public Marketplace (`S-001`–`S-005`)**.

## Needs human
- **Terms of Service notice:** Both `bolshayastrana.com` and `viator.com` forbid scraping or copying proprietary text/photos/code (`00-charter.md`). Rebuild from the clean-room behavior, data model, and rules in this KB using original Kyrgyzstan photography and copy.
- **Founder decisions (`Q-001`–`Q-004`):** Confirm whether the MVP online checkout charges only the 15–20% deposit (recommended) and which payment gateway (Finik / Freedom Pay / Stripe) to wire up first.
- *(Optional)* If you ever want live browser screenshots captured via Chrome DevTools MCP, click **"Allow"** on the Chrome `"Allow remote debugging?"` prompt (`chrome://inspect/#remote-debugging`).

## Blocked
- None.

## Last session
- `2026-11-12-s01`: Completed full comparative RES study of Bolshaya Strana (`bolshayastrana.com`) and Viator (`viator.com`), synthesized the Kyrgyzstan Tour Bridge Aggregator PRD, data model, partner portal, and admin panel specifications, and packaged `REPORT.html` + handoff zip.

## Residuals
- None (zero browser writes performed).
