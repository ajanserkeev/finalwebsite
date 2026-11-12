# Charter: Kyrgyzstan Tour Aggregator (Bolshaya Strana & Viator Study)
Date: 2026-11-12

| Item | Value |
|---|---|
| Goal | Reverse-engineer the marketplace mechanics of **Bolshaya Strana** (`bolshayastrana.com`) and **Viator** (`viator.com`) to design and build a **Kyrgyzstan Tour Bridge Aggregator** where tourists book directly at the organizer's official price (zero markup), see open organizer profiles & verified tourist reviews, and where Tour Operators/Partners have a dedicated portal (sales, signups, departure seat quotas) alongside a Platform Admin Panel. |
| Requested by | User (Founder / Product Owner) |
| Scope | 1. Public Tour Catalog & Kyrgyzstan-specific discovery filters (`F-001`, `F-002`)<br/>2. Tour Detail Page with Open Organizer Identity, Direct-Price Guarantee & Prepayment Split (`F-003`, `F-004`, `F-005`)<br/>3. Departure Date & Group Quota Matrix (`F-006`)<br/>4. Verified Tourist Reviews linked to completed bookings (`F-007`)<br/>5. Booking Checkout & Deposit/Escrow Split (`F-008`)<br/>6. Dedicated Tour Operator / Partner Portal — tours sold, participant signups, quota management, payouts (`F-009`, `F-010`, `F-011`)<br/>7. Platform Admin Panel — operator verification, tour moderation, commission/payout ledger, review moderation (`F-012`, `F-013`) |
| Out of scope | Flights/airline ticketing, hotel-only OTA booking, internal accounting ERP for operators |
| Clone target market | **Kyrgyzstan inbound & domestic adventure/cultural tourism** (Issyk-Kul, Song-Kul, Kel-Suu, Karakol, Altyn-Arashan, Ala-Archa, Osh/Pamir Highway). Target buyers: international tourists (English/Russian/European/GCC/Asian markets) and CIS/local travelers booking local Kyrgyz tour operators & mountain guides. |
| Priorities | P1: Open Organizer Profile, Direct-Price Parity ("Same price as organizer"), Verified Reviews, Tour Operator Dedicated Portal (tours sold & signups), Admin Panel.<br/>P2: Multi-day Group Departure Matrix (dates, seats left, guaranteed status), Prepayment/Deposit Booking Flow.<br/>P3: Multi-currency (KGS, USD, EUR, RUB) & Local/International Payment Gateways (Freedom Pay / Finik / Stripe). |
| Mode | Attended (initial study & architecture proposal) |
| Environment level | L4 Observe-Only |
| Write authorization | None ("just study for now these two website and propose the best solutions how we can start") |
| KB language | English (with Russian/Kyrgyz domain terms mapped in `glossary.md`) |
| Terms of service | Bolshaya Strana User Agreement (`https://bolshayastrana.com/agreement`) and Viator Terms of Use (`https://www.viator.com/support/termsAndConditions`) prohibit automated scraping, copying proprietary content/photos, or reverse-engineering proprietary software. This study records only high-level functional patterns, public documentation, and clean-room specifications (`[doc SRC-001]`, `[doc SRC-005]`). |
