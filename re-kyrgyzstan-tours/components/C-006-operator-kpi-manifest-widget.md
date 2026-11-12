# C-006 Operator Sales KPI & Participant Manifest Widget
Product name: `operator-kpi-manifest` · Used in: S-006, S-007 · Status: done

## Anatomy

| # | Part | Content | Evidence |
|---|---|---|---|
| 1 | Primary Sales Counter | **Tours Sold (`Bookings Count`)** with period comparison badge (e.g., `42 tours sold · +18% vs last month`) | [doc SRC-006] |
| 2 | Primary Signup Counter | **People Signed Up (`Total Participants / Pax`)** across all confirmed departures (e.g., `118 people signed up`) | [doc SRC-006] |
| 3 | Financial Split Card | Gross Tour Value (`$82,600`), Deposit Collected Online (`$16,520`), Platform Commission (`$12,390`), Net Balance Paid by Tourists to Operator (`$70,210`) | [doc SRC-006] |
| 4 | Departure Manifest Drawer / Export | Per-departure table of signed-up tourists: Full Name, Pax Count, Nationality, WhatsApp/Telegram contact, Paid Deposit, Balance Due on Day 1, Dietary/Gear notes, `"Export CSV / PDF for Guide"` button | [doc SRC-006] |

## Variants

| Variant | Difference | Evidence |
|---|---|---|
| Operator Scoped (`S-006`) | Strictly filtered to `organizer_id = currentOrganizer.id` (`R-012`) | [doc SRC-006] |
| Admin Marketplace Global (`S-007`) | Aggregated across all organizers with a dropdown to filter by any specific organizer | [doc SRC-006] |

## States

| State | Visual change | Evidence |
|---|---|---|
| Default | Live counters for selected date period | [doc SRC-006] |
| Hover | Tooltip showing exact formula for commission vs. balance due | [doc SRC-006] |
| Focus | Focus ring on period selector and export buttons | [doc SRC-006] |
| Pressed | Active button state | [doc SRC-006] |
| Selected | Selected departure row opens its participant manifest | [doc SRC-006] |
| Disabled | Export button disabled when `bookedSeats = 0` | [doc SRC-006] |
| Loading | Shimmer on KPI numbers | [doc SRC-006] |
| Error | Retry banner on connection loss | [doc SRC-006] |

## Measurements and tokens

| Property | Value | Token | Evidence |
|---|---|---|---|
| KPI number font size | `32px` bold (`700`) | `--font-kpi` | [doc SRC-006] |
| Card grid | 4 equal columns on desktop (`gap: 20px`) | `--grid-kpi` | [doc SRC-006] |

## Behavior
Directly fulfills the user's requirement that each Tour Operator / Partner has a dedicated page showing **how many tours were sold** and **how many people signed up**, plus actionable participant manifests per departure date.

## Keyboard and accessibility

| Role | Accessible name | Keys | Focus visible | Evidence |
|---|---|---|---|---|
| `region` | "Tour Operator Sales and Signup Metrics" | `Tab`, `Enter` | Yes | [doc SRC-006] |

## Not tested
- None.

