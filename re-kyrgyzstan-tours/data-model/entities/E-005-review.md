# E-005 Review (Verified Tourist Review)
Product term: Verified Review (`Проверенный отзыв туриста`) · Parent: E-004 · Status: done

## Fields

| Field | Type | Required | Default | Constraints or enum | Source |
|---|---|---|---|---|---|
| `id` | `uuid` | yes | generated | Primary key | [doc SRC-006] |
| `bookingId` | `uuid` | yes | — | Unique foreign key -> `E-004` (`Booking.id`, must be `completed`, `R-007`) | [doc SRC-006] |
| `tourId` | `uuid` | yes | — | Foreign key -> `E-002` (`Tour.id`) | [doc SRC-005] |
| `organizerId` | `uuid` | yes | — | Foreign key -> `E-001` (`Organizer.id`) | [doc SRC-001] |
| `authorName` | `string` | yes | — | Tourist display name from `Booking.leadTravelerName` | [doc SRC-005] |
| `authorCountry` | `string` | no | `null` | Tourist country | [doc SRC-005] |
| `tripDate` | `iso-date` | yes | — | `TourDeparture.startDate` of the completed trip | [doc SRC-005] |
| `ratingOverall` | `integer` | yes | — | `1`–`5` stars | [doc SRC-005] |
| `ratingGuide` | `integer` | yes | — | `1`–`5` stars | [doc SRC-001] |
| `ratingAccommodation` | `integer` | yes | — | `1`–`5` stars | [doc SRC-001] |
| `ratingTransport` | `integer` | yes | — | `1`–`5` stars | [doc SRC-001] |
| `comment` | `string` | yes | — | Written feedback (`min 20 chars`) | [doc SRC-005] |
| `photos` | `url[]` | no | `[]` | Uploaded tourist trip photos | [doc SRC-005] |
| `isVerifiedBooker` | `boolean` | yes | `true` | Always `true` via `R-007` booking token gate | [doc SRC-006] |
| `organizerReply` | `string` | no | `null` | Official reply posted by Organizer in `S-006` | [doc SRC-006] |
| `repliedAt` | `iso-date` | no | `null` | Timestamp of organizer reply | [doc SRC-006] |

## Relations

| Relation | Target | Cardinality | On delete | Source |
|---|---|---|---|---|
| `booking` | E-004 (`Booking`) | `1:1` | Restrict | [doc SRC-006] |
| `tour` | E-002 (`Tour`) | `N:1` | Restrict | [doc SRC-005] |
| `organizer` | E-001 (`Organizer`) | `N:1` | Restrict | [doc SRC-001] |

## Lifecycle

State transitions: `submitted` -> `published` (updates `Tour.ratingAvg` & `Organizer.ratingAvg`) -> `replied` (when Organizer posts `organizerReply`).

## System fields

| Field | Set when | Source |
|---|---|---|
| `createdAt` | Review submitted via signed token | [doc SRC-006] |

## Rules
- R-007, R-008

## Not tested
- None.

