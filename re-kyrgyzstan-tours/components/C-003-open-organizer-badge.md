# C-003 Open Organizer Identity & Trust Card
Product name: `organizer-trust-card` · Used in: S-001, S-003, S-004 · Status: done

## Anatomy

| # | Part | Content | Evidence |
|---|---|---|---|
| 1 | Organizer Avatar & Verification Badge | Official operator logo/photo + green shield `"Verified Kyrgyz Tour Operator"` | [doc SRC-001] |
| 2 | Identity & Legal Status | Brand Name, Legal Entity Name (`ОсОО / ИП`), Base City (`Bishkek` / `Karakol`), Years on platform | [doc SRC-003] |
| 3 | Trust Metrics Row | Aggregate Rating (`★ 4.92`), Verified Reviews Count (`128 reviews`), Completed Tours / Tourists Hosted (`640+ travelers`) | [doc SRC-001] |
| 4 | Direct-Price Guarantee Seal | Tooltip badge: `"Official Direct Price — Contractually identical to booking directly with [Organizer Name]"` | [doc SRC-004] |
| 5 | Profile Action Link | `"See all X tours & 128 reviews of this organizer →"` (`S-004`) | [doc SRC-001] |

## Variants

| Variant | Difference | Evidence |
|---|---|---|
| Compact Inline (`S-003` right sidebar) | Embedded inside the sticky booking widget on Tour Detail page | [doc SRC-001] |
| Full Hero Banner (`S-004`) | Expanded header with cover photo, guide team avatars, and legal registration details | [doc SRC-001] |

## States

| State | Visual change | Evidence |
|---|---|---|
| Default | Visible verified shield and clickable profile link | [doc SRC-001] |
| Hover | Highlights organizer name link | [doc SRC-001] |
| Focus | 2px focus ring | [doc SRC-005] |
| Pressed | Standard link active state | [doc SRC-005] |
| Selected | N/A | [doc SRC-001] |
| Disabled | Unverified/pending operators never appear publicly (`R-013`) | [doc SRC-003] |
| Loading | Skeleton avatar and text lines | [doc SRC-005] |
| Error | N/A | [doc SRC-001] |

## Measurements and tokens

| Property | Value | Token | Evidence |
|---|---|---|---|
| Avatar size | `56px × 56px` | `--avatar-md` | [doc SRC-001] |
| Badge color | `#0D9488` (Emerald/Teal trust accent) | `--color-trust` | [doc SRC-001] |

## Behavior
Solves `B-001` (Viator hiding the operator) by making the local tour organizer's identity, reputation, and direct-price guarantee a first-class trust element before booking.

## Keyboard and accessibility

| Role | Accessible name | Keys | Focus visible | Evidence |
|---|---|---|---|---|
| `region` | "Tour Organizer Information" | `Tab`, `Enter` | Yes | [doc SRC-005] |

## Not tested
- None.

