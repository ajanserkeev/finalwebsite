# C-004 Group Departure Schedule & Seat Quota Matrix
Product name: `departure-schedule-matrix` · Used in: S-003, S-006 · Status: done

## Anatomy

| # | Part | Content | Evidence |
|---|---|---|---|
| 1 | Month / Season Filter Bar | Horizontal pills (`All Dates`, `May 2027`, `Jun 2027`, `Jul 2027`, `Aug 2027`, `Sep 2027`) | [doc SRC-001] |
| 2 | Date & Duration Column | Start Date (e.g. `Mon, Jul 14, 2027`) -> End Date (`Sun, Jul 20, 2027`), Guide language flag (`EN`, `RU`) | [doc SRC-001] |
| 3 | Seat Quota & Guarantee Column | Exact seats remaining (`4 of 12 spots left`) + `"Guaranteed Departure"` badge when minimum group is met | [doc SRC-001] |
| 4 | Direct Price & Deposit Column | Total per person (`$700`) + Online Deposit to lock spot (`$140 deposit`) | [doc SRC-004] |
| 5 | Action Column | Public view (`S-003`): `"Select Date / Book"` button; Partner view (`S-006`): Quick `[-]` / `[+]` seat adjusters + `"Manifest (8 pax)"` button | [doc SRC-006] |

## Variants

| Variant | Difference | Evidence |
|---|---|---|
| Tourist Booking Table (`S-003`) | Shows remaining seats and opens Checkout (`S-005`) | [doc SRC-001] |
| Operator Quota Manager (`S-006`) | Shows booked vs. max capacity bar, instant `[-]`/`[+]` seat adjustment, and participant list export | [doc SRC-006] |

## States

| State | Visual change | Evidence |
|---|---|---|
| Default | Green status dot (`6+ spots available`) | [doc SRC-001] |
| Hover | Row highlight | [doc SRC-001] |
| Focus | Button focus ring | [doc SRC-005] |
| Pressed | Active row state | [doc SRC-005] |
| Selected | Highlighted border when date is chosen in sticky widget | [doc SRC-001] |
| Disabled | `Sold Out` (`seatsRemaining = 0`) or `Closed` (past `cutoffHours`): button disabled with "Sold Out" / "Closed" label | [doc SRC-006] |
| Loading | Shimmer rows during availability revalidation | [doc SRC-005] |
| Error | Inline banner if seat count changed during selection | [doc SRC-007] |

## Measurements and tokens

| Property | Value | Token | Evidence |
|---|---|---|---|
| Row height | `64px` | `--row-height-md` | [doc SRC-001] |
| Urgency badge (`<= 3 seats`) | `#D97706` (Amber warning) | `--color-warning` | [doc SRC-001] |

## Behavior
Enforces `R-004` (Guaranteed badge), `R-005` (Seat quota ceiling), and `R-006` (Booking cutoff lock).

## Keyboard and accessibility

| Role | Accessible name | Keys | Focus visible | Evidence |
|---|---|---|---|---|
| `table` | "Upcoming group departure dates and available seats" | `Tab`, `Enter`, `ArrowUp/Down` | Yes | [doc SRC-005] |

## Not tested
- None.

