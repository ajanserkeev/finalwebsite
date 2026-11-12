# Endpoints

IDs in paths are `:id`. Shapes and types only; no real values.

| Method | Template | Triggered by | Request shape | Response shape | Evidence |
|---|---|---|---|---|---|
| `GET` | `/api/tours` | Catalog search & filter (`S-001`, `S-002`) | `{region?, activity?, difficulty?, comfort?, month?, guaranteed?, sort?, page?}` | `{items: TourCard[], total: number, facets: FacetCounts}` | [doc SRC-001] |
| `GET` | `/api/tours/:slug` | Tour Detail load (`S-003`) | `{currency?: string}` | `{tour: Tour, organizer: Organizer, departures: TourDeparture[], reviews: Review[]}` | [doc SRC-001] |
| `GET` | `/api/organizers/:slug` | Public Organizer Profile (`S-004`) | `{reviewTourId?: string, page?: number}` | `{organizer: Organizer, tours: TourCard[], reviews: Review[]}` | [doc SRC-001] |
| `POST` | `/api/bookings` | Checkout submit (`S-005`) | `{departureId: uuid, paxCount: number, leadTravelerName: string, leadEmail: email, leadPhone: string, participants: array, paymentGateway: enum}` | `{booking: Booking, holdExpiresAt: iso-date, paymentRedirectUrl: url}` | [doc SRC-007] |
| `POST` | `/api/webhooks/payment` | Freedom Pay / Finik / Stripe payment callback | `{bookingId: uuid, gatewayRef: string, status: string, signature: string}` | `{ok: boolean, bookingStatus: 'confirmed'}` | [doc SRC-008] |
| `POST` | `/api/reviews` | Post-trip verified review submission (`FL-003`) | `{token: string, ratingOverall: 1..5, ratingGuide: 1..5, ratingAccommodation: 1..5, ratingTransport: 1..5, comment: string, photos: url[]}` | `{review: Review, tourRatingAvg: number, organizerRatingAvg: number}` | [doc SRC-006] |
| `GET` | `/api/partner/dashboard` | Partner Portal load (`S-006`) | `{period?: 'month' \| 'season' \| 'all'}` | `{toursSoldCount: number, peopleSignedUpCount: number, grossVolumeUsd: number, balanceToCollectUsd: number, upcomingDepartures: TourDeparture[], recentBookings: Booking[]}` | [doc SRC-006] |
| `PATCH` | `/api/partner/departures/:id` | Operator quick seat quota adjustment (`S-006`) | `{maxSeats?: number, isGuaranteed?: boolean, priceUsd?: number, cutoffHours?: number}` | `{departure: TourDeparture}` | [doc SRC-006] |
| `GET` | `/api/partner/departures/:id/manifest` | Operator downloads participant list (`S-006`) | `{format?: 'json' \| 'csv' \| 'pdf'}` | `{departure: TourDeparture, participants: Booking[], totalPax: number, totalBalanceDueUsd: number}` | [doc SRC-006] |
| `POST` | `/api/partner/reviews/:id/reply` | Operator replies to tourist review (`S-006`) | `{organizerReply: string}` | `{review: Review}` | [doc SRC-006] |
| `POST` | `/api/admin/organizers/:id/verify` | Admin verifies operator KYC (`S-007`) | `{isVerified: boolean, commissionPercent: number, verificationStatus: enum}` | `{organizer: Organizer}` | [doc SRC-003] |
| `POST` | `/api/admin/tours/:id/approve` | Admin approves tour & direct-price parity (`S-007`) | `{status: 'published' \| 'draft', adminNotes?: string}` | `{tour: Tour}` | [doc SRC-003] |
| `POST` | `/api/admin/bookings/:id/refund` | Admin issues free-cancellation deposit refund (`S-007`) | `{reason: string}` | `{booking: Booking, refundedAmountUsd: number, restoredSeats: number}` | [doc SRC-004] |
