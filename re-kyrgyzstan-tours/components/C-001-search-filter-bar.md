# C-001 Multi-Faceted Tour Filter & Search Bar
Product name: `tour-search-filter` · Used in: S-001, S-002 · Status: done

## Anatomy

| # | Part | Content | Evidence |
|---|---|---|---|
| 1 | Region / Destination Selector | Multi-select dropdown of Kyrgyzstan regions (Issyk-Kul, Song-Kul, Kel-Suu, Karakol, Ala-Archa, Sary-Chelek, Osh/Pamir) | [doc SRC-002] |
| 2 | Date / Month Picker | Season & month pills (`May`–`Oct`, `Winter`) or specific start-date range calendar | [doc SRC-001] |
| 3 | Activity & Comfort Facets | Checkboxes for Tour Type, Difficulty Level (`1`–`5`), and Comfort Level (`Tent`, `Yurt Camp`, `Guesthouse`, `Hotel`) | [doc SRC-001] |
| 4 | Trust Toggles | Quick switches for "Guaranteed Departures Only" and "Free Cancellation" | [doc SRC-004] |

## Variants

| Variant | Difference | Evidence |
|---|---|---|
| Hero Horizontal Bar (`S-001`) | 4 inline segments with primary "Find Tours" CTA button | [doc SRC-001] |
| Sticky Vertical Sidebar (`S-002`) | Collapsible accordion sections with live matching tour counts per facet | [doc SRC-001] |

## States

| State | Visual change | Evidence |
|---|---|---|
| Default | Unfiltered counts shown in muted badge | [doc SRC-001] |
| Hover | Subtle border highlight on filter pills | [doc SRC-005] |
| Focus | 2px primary brand focus ring | [doc SRC-005] |
| Pressed | Active scale transform | [doc SRC-005] |
| Selected | Filled emerald/teal chip + removable `×` chip in active filters bar | [doc SRC-001] |
| Disabled | Facet options with `0` matching tours grayed out | [doc SRC-001] |
| Loading | Shimmer on "Show X Tours" counter button | [doc SRC-005] |
| Error | Fallback to full unfiltered list with toast notice | [doc SRC-005] |

## Measurements and tokens

| Property | Value | Token | Evidence |
|---|---|---|---|
| Border radius | `12px` | `--radius-card` | [doc SRC-001] |
| Padding | `16px 20px` | `--space-md` | [doc SRC-001] |

## Behavior
Updates URL query string parameters (`?region=...&difficulty=...&guaranteed=1`) on every change and triggers debounced catalog refetch.

## Keyboard and accessibility

| Role | Accessible name | Keys | Focus visible | Evidence |
|---|---|---|---|---|
| `search` | "Filter Kyrgyzstan tours" | `Tab`, `Space`, `Enter`, `Escape` | Yes | [doc SRC-005] |

## Not tested
- Live DOM event listeners on `bolshayastrana.com` filter sidebar (documented from public specification).

