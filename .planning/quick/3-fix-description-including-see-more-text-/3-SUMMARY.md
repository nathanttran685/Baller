---
phase: quick-3
plan: "01"
subsystem: parseHtml
tags: [bug-fix, dom-fallback, description, location, regex, tdd]
dependency_graph:
  requires: []
  provides: [extractDescriptionFromText-fixed, extractLocationFromText-fixed, dom-fallback-location-stripped]
  affects: [marketplace-listing-api, similar-listings-search]
tech_stack:
  added: []
  patterns: [TDD red-green, named exports for unit testing]
key_files:
  created:
    - src/app/api/marketplace-listing/parseHtml.test.ts
  modified:
    - src/app/api/marketplace-listing/parseHtml.ts
    - jest.config.ts
decisions:
  - "Added node Jest project to jest.config.ts to cover src/**/*.test.ts files (blocking issue, Rule 3)"
  - "Lowered 'Read more' test input length to >10 chars to resolve plan contradiction (spec said 9-char 'Nice item' should return, but min-length check is 10)"
  - "Used [a-z]\\s+ lookback for Condition pattern to distinguish city from condition-adjective words (e.g., 'Good Federal Way' -> 'Federal Way')"
metrics:
  duration: 6min
  completed: "2026-03-11"
  tasks_completed: 2
  files_changed: 3
---

# Quick Task 3: Fix Description Including See More Text — Summary

**One-liner:** Fixed DOM fallback description stop-words (See/Read more) and location City-ST extraction with targeted regex patterns, plus wired stripMeetupPreference to DOM fallback location.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 (RED) | Add failing tests for extractDescriptionFromText and extractLocationFromText | f34eae1 | parseHtml.test.ts (created), parseHtml.ts (exports), jest.config.ts (node project) |
| 2 (GREEN) | Fix extractDescriptionFromText, extractLocationFromText, DOM fallback wiring | 5dccc2d | parseHtml.ts, parseHtml.test.ts |

## What Was Fixed

### Fix 1 — extractDescriptionFromText stop-words

Added `See more`, `See less`, `Read more`, `Show more` to the description regex stop-word alternation. Previously, description would bleed into button text and location/seller text that follows.

Added a safety-net post-processing trim that removes any trailing button text the regex boundary might have missed due to whitespace.

### Fix 2 — extractLocationFromText new patterns

Added two new patterns (higher priority, checked first):

1. `/See\s+more\s+([A-Z][A-Za-z\s.'-]+,\s*[A-Z]{2})\b/` — captures `City, ST` immediately after "See more" (most common Facebook DOM layout observed in the wild)

2. `/(?:Condition|Description)\s+.*?[a-z]\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Za-z.'-]+)*,\s*[A-Z]{2})\s+(?:Seller|Message|Save|Listed)\b/` — captures `City, ST` between section markers by requiring the character before the city name to be lowercase. This cleanly separates condition adjectives ("Good", "Fair") from city names because condition values always end in a lowercase letter followed by a space.

### Fix 3 — DOM fallback location wiring

Wrapped `extractLocationFromText(plainTextContent)` in `extractListingFromDomFallback` with `stripMeetupPreference()`, matching the behavior of the JSON path (`getListingLocation()` already applies this).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added node Jest project to jest.config.ts**
- **Found during:** Task 1
- **Issue:** jest.config.ts only had a `frontend` project matching `tests/frontend/**`. The plan's verify command targets `src/app/api/marketplace-listing/parseHtml.test.ts` which wasn't covered by any project.
- **Fix:** Added a `node` test environment project with `testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}']`
- **Files modified:** jest.config.ts
- **Commit:** f34eae1

**2. [Rule 1 - Bug] Updated "Read more" test input to resolve spec contradiction**
- **Found during:** Task 2 GREEN phase
- **Issue:** Plan specified `input "Description Nice item Read more Location Seattle" returns "Nice item"` but "Nice item" is 9 characters, below the 10-char minimum the same spec requires for short-description rejection.
- **Fix:** Changed test input to `"Description Nice listing item Read more Location Seattle"` returning `"Nice listing item"` (17 chars), preserving the intent of testing the stop-word behavior.
- **Files modified:** parseHtml.test.ts
- **Commit:** 5dccc2d

## Verification

- All 10 tests pass: `npx jest --config jest.config.ts src/app/api/marketplace-listing/parseHtml.test.ts`
- No TypeScript errors: `npx tsc --noEmit`
- "See more" confirmed in description stop-word regex (line 649 of parseHtml.ts)

## Self-Check: PASSED

- `src/app/api/marketplace-listing/parseHtml.test.ts` — FOUND
- `src/app/api/marketplace-listing/parseHtml.ts` — FOUND (modified)
- `jest.config.ts` — FOUND (modified)
- commit f34eae1 — FOUND
- commit 5dccc2d — FOUND
