# Production barriers: Kyrgyzstan Tour Aggregator (Bolshaya Strana & Viator Study)

Clone target market: see `00-charter.md` (Kyrgyzstan inbound & domestic adventure/cultural tourism).
Not legal advice. A legal reading without a source is `[inf]` with a question for counsel in `questions.md`.

## Summary

Launch blockers first. One row per barrier; details below.

| Barrier | Category | Severity | Market weight | Blocks | Lead time |
|---|---|---|---|---|---|
| BR-001 | Regulation and licensing / Payment acquiring | blocks launch | required to sell | F-005, F-008, F-013 | 2–4 weeks |
| BR-002 | Legal / Agency contract & tax structure | blocks launch | required to sell | F-003, F-004, F-012 | 1–2 weeks |
| BR-003 | Permissioned integration | adds lead time | high conversion lift | F-008, F-011 | 1–3 weeks |
| BR-004 | Moat / Operational sync | moat | high retention | F-006, F-010 | Ongoing |

### BR-001 Cross-Border & Local Online Payment Acquiring in Kyrgyzstan (Visa/Mastercard + Elkart/MBANK)
- Category: regulation and licensing
- Blocks: F-005, F-008, F-013
- Gatekeeper: National Bank of the Kyrgyz Republic (NBKR) licensed acquirers (**Freedom Pay KG**, **Finik**, **Optima Bank**, **Eldik Bank**) and international Stripe (if foreign LLC)
- Severity: blocks launch
- Market weight: required to sell
- What it takes: Registered Kyrgyz legal entity (`ИП` or `ОсОО`), corporate bank account, merchant compliance review (Public Offer, Privacy Policy, Refund Policy on site), 3D-Secure integration for foreign Visa/Mastercard cards and local MBANK/Elkart QR (`Q-003`)
- Lead time and cost: 2–4 weeks merchant onboarding; 2.2%–3.5% acquiring fee per deposit transaction [doc SRC-008]
- Mitigation: Collect **only the 15–20% reservation deposit online** (Bolshaya Strana model, `Q-001`) so acquiring fees only apply to the 20% deposit (i.e., ~0.5% effective fee on total tour price), and support Finik / Freedom Pay payment links for instant launch while full embedded checkout is approved.
- Evidence: [doc SRC-008]

### BR-002 Agency Contract, Direct-Price Covenant & Liability Shield in the Kyrgyz Republic
- Category: regulation and licensing
- Blocks: F-003, F-004, F-012
- Gatekeeper: Kyrgyz Republic Civil Code / Tax Service (GNS KR) / Department of Tourism under the Ministry of Economy and Commerce KR
- Severity: blocks launch
- Market weight: required to sell
- What it takes: Standard Agency Agreement (`Агентский договор`) with local Tour Operators so the platform is taxed only on its **agency commission (15–20%)** rather than 100% of the tour's Gross Merchandise Value, plus a contractual **Direct-Price Parity Clause** prohibiting the operator from listing lower prices on their own website/Instagram, and a liability boundary clarifying that the Tour Organizer is the direct executor responsible for on-the-ground safety (`Q-004`) [inf Q-004]
- Lead time and cost: 1–2 weeks legal drafting with a local Kyrgyz lawyer [doc SRC-003], [doc SRC-008]
- Mitigation: Draft standard click-wrap Partner Agency Agreement inside `S-006` during operator onboarding and verify operator legal status (`ИП`/`ОсОО`) in `S-007`.
- Evidence: [doc SRC-003], [doc SRC-008]

### BR-003 Automated WhatsApp, Telegram & Email Booking Notifications
- Category: permissioned integration
- Blocks: F-008, F-011
- Gatekeeper: Meta (WhatsApp Business Platform API), Telegram Bot API, Postmark/Resend (Transactional Email)
- Severity: adds lead time
- Market weight: high conversion lift (in Kyrgyzstan, 95% of tour operators and guides coordinate on WhatsApp and Telegram)
- What it takes: Meta Business verification & approved WhatsApp templates for booking alerts, or a Telegram Bot (`@KyrgyzToursPartnerBot`) that operators connect in 1 click from `S-006`
- Lead time and cost: Telegram Bot + Email: 1 day (free); WhatsApp Business API: 1–3 weeks verification [doc SRC-008]
- Mitigation: Launch Day 1 with **Telegram Bot instant alerts + Email notifications** for operators and tourists (zero gatekeeper delay), and add official WhatsApp Business templates in Month 1.
- Evidence: [doc SRC-008]

### BR-004 Multi-Channel Seat Quota Synchronization & Initial Supply Cold-Start
- Category: moat
- Blocks: F-006, F-010
- Gatekeeper: Local Kyrgyz tour operators' daily habits (selling seats simultaneously on Instagram, WhatsApp, and aggregators)
- Severity: moat
- Market weight: required to retain trust
- What it takes: Frictionless 1-click seat quota adjustment (`[-]` / `[+]`) on mobile (`S-006` / Telegram bot) so operators update remaining spots when they sell offline, plus seeding the first 15–25 verified Kyrgyz operators and initial verified reviews
- Lead time and cost: 2–4 weeks partner outreach before peak May–October season [doc SRC-001], [doc SRC-006]
- Mitigation: Provide a **"Request Verified Review" tool** (`SRC-006`) for operators' recent verifiable cohorts during onboarding, and allow operators to update seat counts directly from a mobile-friendly Partner Portal (`S-006`).
- Evidence: [doc SRC-001], [doc SRC-006]
