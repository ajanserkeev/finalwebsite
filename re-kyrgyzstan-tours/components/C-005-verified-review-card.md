# C-005 Verified Tourist Review Card
Product name: `verified-review-card` · Used in: S-003, S-004, S-006, S-007 · Status: done

## Anatomy

| # | Part | Content | Evidence |
|---|---|---|---|
| 1 | Reviewer Header | Tourist Name, Country flag, Avatar initials, Star Rating (`1`–`5`), Review Date | [doc SRC-005] |
| 2 | Verified Booking Badge | Green verification pill: `"✓ Verified Booking · Completed [Tour Name] ([Departure Month Year]) with [Organizer Name]"` | [doc SRC-006] |
| 3 | Sub-Ratings & Review Text | Category scores (Guide, Itinerary, Accommodation, Transport, Value) + full text review | [doc SRC-001] |
| 4 | Tourist Photo Thumbnails | Clickable real photos uploaded by the tourist from the trip | [doc SRC-005] |
| 5 | Official Organizer Reply Block | Indented response box with Organizer Logo, Name, Reply Date, and message (editable by Operator in `S-006`) | [doc SRC-006] |

## Variants

| Variant | Difference | Evidence |
|---|---|---|
| Public Display (`S-003`, `S-004`) | Read-only verified review + organizer reply | [doc SRC-005] |
| Partner Reply View (`S-006`) | Adds `"Reply to Tourist"` textarea button if not yet replied | [doc SRC-006] |
| Admin Moderation View (`S-007`) | Shows underlying `Booking.id` link and `"Approve / Flag"` controls | [doc SRC-006] |

## States

| State | Visual change | Evidence |
|---|---|---|
| Default | Published verified review | [doc SRC-005] |
| Hover | Photo thumbnail zoom | [doc SRC-005] |
| Focus | Focus ring on photo lightbox buttons | [doc SRC-005] |
| Pressed | N/A | [doc SRC-005] |
| Selected | N/A | [doc SRC-005] |
| Disabled | Unverified users cannot see or open a "Write Review" form unless they hold a `completed` booking token (`R-007`) | [doc SRC-006] |
| Loading | Skeleton review card | [doc SRC-005] |
| Error | Validation message if review reply is empty | [doc SRC-006] |

## Measurements and tokens

| Property | Value | Token | Evidence |
|---|---|---|---|
| Verified badge color | `#059669` | `--color-verified` | [doc SRC-006] |
| Photo thumbnail size | `80px × 80px` rounded `8px` | `--thumb-md` | [doc SRC-005] |

## Behavior
Guarantees 100% authenticity: every review is cryptographically/relationally tied to a real `Booking` record (`Booking.status = completed`), displaying both the tour taken and the organizer who operated it.

## Keyboard and accessibility

| Role | Accessible name | Keys | Focus visible | Evidence |
|---|---|---|---|---|
| `article` | "Verified review by [Author Name]" | `Tab`, `Enter` | Yes | [doc SRC-005] |

## Not tested
- None.

