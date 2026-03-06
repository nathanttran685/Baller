---
phase: 02-comparison-view
plan: 02
subsystem: ui
tags: [react, next.js, compare, sticky-bar, neobrutalist, tdd]

# Dependency graph
requires:
  - phase: 01-one-click-re-analyze
    provides: ListingCard dual-button row, SimilarListings ballerUrl wiring
provides:
  - COMPARE button (pink) on ListingCard for quick side-by-side navigation
  - CompareBar sticky bottom bar for flexible pick-two comparison
  - CompareSelection type and state management in DashboardClient
  - compareUrl computation in SimilarListings
affects: [03-verdict-engine]

# Tech tracking
tech-stack:
  added: []
  patterns: [three-button hover expand/collapse, sticky compare bar with z-index layering, compare selection state management]

key-files:
  created:
    - src/app/dashboard/(components)/CompareBar.tsx
    - tests/frontend/CompareBar.test.tsx
  modified:
    - src/app/dashboard/(components)/ListingCard.tsx
    - src/app/dashboard/(components)/SimilarListings.tsx
    - src/app/dashboard/DashboardClient.tsx
    - tests/frontend/ListingCard.test.tsx
    - tests/frontend/SimilarListings.test.tsx

key-decisions:
  - "CompareSelection interface exported from SimilarListings.tsx for single source of truth"
  - "Compare button uses bg-[#FF69B4] pink to differentiate from blue (view) and orange (baller)"
  - "CompareBar z-40 sits below sign-in modal z-50 for correct layering"
  - "Disabled compare button uses span (not Link) to prevent navigation"

patterns-established:
  - "Three-button flex expand/collapse: flex-1 default, flex-[3] hovered, flex-[0_0_2.5rem] collapsed"
  - "Compare selection state lifted to DashboardClient with toggle/remove/clear handlers"
  - "Add to Compare overlay on card image area with Plus/Check icon toggle"

requirements-completed: [COMP-02, COMP-03]

# Metrics
duration: 5min
completed: 2026-03-06
---

# Phase 02 Plan 02: Compare Entry Flows Summary

**Three-button ListingCard (blue/orange/pink) with COMPARE navigation + sticky CompareBar for flexible pick-two comparison**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-06T05:39:15Z
- **Completed:** 2026-03-06T05:44:25Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- ListingCard extended with third COMPARE button (pink) using same flex expand/collapse pattern
- CompareBar sticky bottom component with selection chips, helper text, and disabled/active compare button
- DashboardClient manages compare selection state with toggle/remove/clear handlers
- Current listing and similar listings both selectable for comparison via CompareBar
- Full TDD: 42 component tests passing, 75 total frontend suite green

## Task Commits

Each task was committed atomically:

1. **Task 1: Add COMPARE button to ListingCard and compareUrl wiring in SimilarListings**
   - `84e552a` (test: failing tests for COMPARE button and compareUrl)
   - `b181884` (feat: COMPARE button implementation + SimilarListings compareUrl)
2. **Task 2: Create CompareBar and wire compare selection state in DashboardClient**
   - `6bfda00` (test: failing tests for CompareBar component)
   - `566984a` (feat: CompareBar + DashboardClient compare state wiring)

## Files Created/Modified
- `src/app/dashboard/(components)/CompareBar.tsx` - Sticky bottom bar showing selected listing chips with compare navigation
- `src/app/dashboard/(components)/ListingCard.tsx` - Added third COMPARE button (pink), Add to Compare toggle overlay on image
- `src/app/dashboard/(components)/SimilarListings.tsx` - CompareSelection interface, compareUrl computation, onToggleCompare wiring
- `src/app/dashboard/DashboardClient.tsx` - Compare selection state, handlers, CompareBar rendering, current listing Add to Compare button
- `tests/frontend/ListingCard.test.tsx` - 10 new tests for COMPARE button and toggle overlay
- `tests/frontend/SimilarListings.test.tsx` - 3 new tests for compareUrl wiring
- `tests/frontend/CompareBar.test.tsx` - 13 new tests for CompareBar component

## Decisions Made
- CompareSelection interface exported from SimilarListings.tsx to keep the type near its primary consumer
- COMPARE button uses pink (#FF69B4) for visual differentiation in the three-button row
- CompareBar z-40 ensures it sits below the sign-in modal (z-50) for correct layering
- Disabled compare button rendered as `<span>` instead of `<Link>` to prevent navigation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed VIEW LISTING button collapse logic for three-button mode**
- **Found during:** Task 1 (ListingCard implementation)
- **Issue:** Original collapse logic used `hovered === 'baller'` to hide VIEW LISTING, which only worked for 2-button mode. With 3 buttons, hovering COMPARE also needs to collapse VIEW LISTING.
- **Fix:** Changed collapse condition from `hovered === 'baller'` to `hovered !== null && hovered !== 'view'` for all buttons, making collapse work correctly regardless of button count.
- **Files modified:** src/app/dashboard/(components)/ListingCard.tsx
- **Verification:** All hover expand/collapse tests pass for 1, 2, and 3 button modes
- **Committed in:** b181884 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Essential for correct three-button hover behavior. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Compare entry flows complete: both quick COMPARE button and flexible CompareBar work
- /compare page (02-01) already receives left/right URL params from both entry flows
- Phase 02 comparison view is feature-complete pending any additional plans
- Ready for Phase 03 (Verdict Engine) which builds on the comparison infrastructure

## Self-Check: PASSED

All 7 files verified present. All 4 commit hashes verified in git log.

---
*Phase: 02-comparison-view*
*Completed: 2026-03-06*
