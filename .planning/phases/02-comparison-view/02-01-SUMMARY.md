---
phase: 02-comparison-view
plan: 01
subsystem: ui
tags: [react, next.js, comparison, side-by-side, suspense, hooks]

# Dependency graph
requires:
  - phase: 01-one-click-re-analyze
    provides: useMarketplaceListing, useConditionAssessment hooks, ListingCard, neobrutalist design system
provides:
  - /compare page with Suspense boundary
  - ComparisonColumn component for full listing analysis display
  - ColumnSkeleton loading placeholder
  - Dual async data pipeline pattern (two independent hook pipelines)
  - listingUtils.ts with parsePriceToNumber and computeMarketValue
affects: [02-comparison-view, 03-verdict]

# Tech tracking
tech-stack:
  added: []
  patterns: [dual-hook-pipeline, comparison-column-layout, shared-listing-utilities]

key-files:
  created:
    - src/app/compare/page.tsx
    - src/app/compare/CompareClient.tsx
    - src/app/compare/components/ComparisonColumn.tsx
    - src/app/compare/components/ColumnSkeleton.tsx
    - src/app/compare/utils/listingUtils.ts
    - tests/frontend/ComparisonColumn.test.tsx
    - tests/frontend/CompareClient.test.tsx
  modified: []

key-decisions:
  - "Duplicated parsePriceToNumber and computeMarketValue into compare/utils/listingUtils.ts since DashboardClient does not export them (TODO to consolidate)"
  - "Used data-testid for side identification (comparison-column-left/right) rather than role-based selection for reliable test targeting"
  - "Error card with Retry button (reloads page) for failed column loads rather than inline retry hooks"

patterns-established:
  - "Dual hook pipeline: call useMarketplaceListing + useConditionAssessment twice independently for parallel data fetching"
  - "ComparisonColumn as reusable side-agnostic column with side prop for test identification"
  - "Condition color coding function: getConditionColor(score) returns bg class for green/yellow/orange/red thresholds"

requirements-completed: [COMP-01, DSGN-01, DSGN-02]

# Metrics
duration: 4min
completed: 2026-03-06
---

# Phase 2 Plan 1: Compare Page Summary

**Side-by-side /compare page with dual async data pipelines, ComparisonColumn rendering full listing analysis, and ColumnSkeleton loading state**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-06T05:39:13Z
- **Completed:** 2026-03-06T05:43:14Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files created:** 7

## Accomplishments
- /compare page renders two listing analyses side-by-side with independent data pipelines
- ComparisonColumn displays image, title, price, condition badge with progress bar, stats grid (offer/market value/accuracy), reasons list, and negotiation tip
- ColumnSkeleton matches column layout with animate-pulse placeholders during async loading
- Breadcrumb navigation ("Back to Analysis") with correct dashboard URL
- Same-listing edge case handled with user-facing warning message
- Error state with retry button for failed column loads
- Responsive layout: 2-column on md+ breakpoint, stacked on mobile
- All neobrutalist design tokens from consts.ts used consistently
- 21 tests covering rendering, color coding, missing data, and client behavior

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Failing tests** - `92b93fc` (test)
2. **Task 1 (GREEN): Implementation** - `41a2a77` (feat)

## Files Created/Modified
- `src/app/compare/page.tsx` - Suspense-wrapped compare page entry point
- `src/app/compare/CompareClient.tsx` - Dual async data pipeline with useMarketplaceListing and useConditionAssessment called twice
- `src/app/compare/components/ComparisonColumn.tsx` - Single listing analysis column reusable for left and right sides
- `src/app/compare/components/ColumnSkeleton.tsx` - Loading placeholder skeleton matching column layout
- `src/app/compare/utils/listingUtils.ts` - Shared parsePriceToNumber and computeMarketValue utilities
- `tests/frontend/ComparisonColumn.test.tsx` - 15 tests for rendering, color coding, missing data
- `tests/frontend/CompareClient.test.tsx` - 6 tests for dual columns, skeleton, breadcrumb, errors

## Decisions Made
- Duplicated parsePriceToNumber and computeMarketValue into a shared utility file since DashboardClient does not export them. Added TODO to consolidate later.
- Used data-testid attributes for side identification rather than relying on content-based queries, ensuring reliable test targeting.
- Error card uses page reload for retry rather than hook-level retry, keeping the implementation simple and leveraging browser cache for the working column.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- /compare page is live and functional, ready for Plan 02 (entry flows: COMPARE button on ListingCard, compare bar on dashboard)
- ComparisonColumn is reusable and ready for diff highlighting additions in Plan 03
- listingUtils.ts provides shared utilities for any component needing price/market value computation

## Self-Check: PASSED

All 7 created files verified on disk. Both task commits (92b93fc, 41a2a77) verified in git history. 75/75 frontend tests passing with zero regressions.

---
*Phase: 02-comparison-view*
*Completed: 2026-03-06*
