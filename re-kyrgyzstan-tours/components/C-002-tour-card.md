# C-002 Tour Card (with Open Organizer & Direct Price)
Product name: `tour-card` · Used in: S-001, S-002, S-004 · Status: done

## Anatomy

| # | Part | Content | Evidence |
|---|---|---|---|
| 1 | Media Header & Badges | Aspect-ratio `16:10` image slider, top-left badges: `"Guaranteed Departure"`, `"0% Markup — Direct Price"`, top-right Wishlist heart | [doc SRC-001] |
| 2 | Open Organizer Row | Clickable Organizer Avatar + Brand Name + Verified checkmark + `★ 4.9 (84)` rating link leading directly to `S-004` | [doc SRC-001] |
| 3 | Tour Title & Route Summary | 2-line title + route stops (`Bishkek • Song-Kul • Karakol • Issyk-Kul`) | [doc SRC-002] |
| 4 | Spec Pills | Duration (`7 days`), Max Group (`12 pax`), Difficulty (`2/5 Easy-Mod`), Comfort (`Yurt & Guesthouse`) | [doc SRC-001] |
| 5 | Upcoming Dates Strip | Next 2–3 departure date pills with remaining seats (`Jul 14 (3 spots left)`, `Jul 28 (Guaranteed)`) | [doc SRC-001] |
| 6 | Price & Deposit Footer | Total Direct Price (`$700 / person`) + sublabel `"Reserve online for $140 (20% deposit)"` + `"View Tour"` button | [doc SRC-004] |

## Variants

| Variant | Difference | Evidence |
|---|---|---|
| Grid Card (`S-001`, `S-002`) | Vertical card layout (3 per row on desktop) | [doc SRC-001] |
| Horizontal List Card (`S-002` desktop list view) | Left photo, center itinerary & organizer info, right price & departure dates column | [doc SRC-001] |

## States

| State | Visual change | Evidence |
|---|---|---|
| Default | Clean white surface with `1px` neutral border | [doc SRC-001] |
| Hover | Elevated shadow (`--shadow-hover`) and subtle image zoom | [doc SRC-005] |
| Focus | Focus ring around primary link | [doc SRC-005] |
| Pressed | Active card border | [doc SRC-005] |
| Selected | N/A | [doc SRC-001] |
| Disabled | "Season Ended — Dates for next season coming soon" badge | [doc SRC-001] |
| Loading | Skeleton placeholder card | [doc SRC-005] |
| Error | Fallback placeholder image if CDN photo fails | [doc SRC-005] |

## Measurements and tokens

| Property | Value | Token | Evidence |
|---|---|---|---|
| Card border radius | `16px` | `--radius-lg` | [doc SRC-001] |
| Card gap | `24px` | `--space-lg` | [doc SRC-001] |

## Behavior
Clicking the Organizer row navigates to `/organizers/:slug` (`S-004`), while clicking the card title, image, or CTA navigates to `/tours/:slug` (`S-003`).

## Keyboard and accessibility

| Role | Accessible name | Keys | Focus visible | Evidence |
|---|---|---|---|---|
| `article` | Tour title + Organizer name + Price | `Tab`, `Enter` | Yes | [doc SRC-005] |

## Not tested
- Live hover transition timings (documented from public specification).

