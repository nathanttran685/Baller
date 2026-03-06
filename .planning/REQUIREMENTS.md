# Requirements: Baller — Comparison UX Update

**Defined:** 2026-03-05
**Core Value:** Users can quickly compare multiple Facebook Marketplace listings to confidently decide which one to buy and what to offer.

## v1 Requirements

Requirements for this branch. Each maps to roadmap phases.

### Re-Analyze

- [x] **REANA-01**: User can click "Run in Baller" on a similar listing card to navigate to a fresh analysis of that listing
- [x] **REANA-02**: User sees a loading/transition state when navigating to re-analyze a listing

### Comparison View

- [x] **COMP-01**: User can open a side-by-side comparison page showing two listing analyses
- [x] **COMP-02**: User can compare the current listing against a similar listing
- [x] **COMP-03**: User can compare any two listings flexibly (not limited to current + similar)
- [x] **COMP-04**: Comparison page visually highlights differences between listings (price, condition, features)

### Pros/Cons

- [ ] **PROS-01**: Comparison view shows auto-generated pros/cons for each listing covering price & suggested offer, condition, and features/specs
- [ ] **PROS-02**: Comparison view shows a "better deal" verdict with reasoning

### Design

- [x] **DSGN-01**: All new UI components follow the existing neobrutalist design system (thick borders, hard shadows, bold colors)
- [x] **DSGN-02**: New components use the frontend-design skill to meet or exceed current implementation quality

## v2 Requirements

### Comparison Enhancements

- **COMP-05**: User can share a comparison via URL
- **COMP-06**: User can compare more than two listings (up to 4)
- **COMP-07**: Comparison persists across sessions

### Navigation

- **NAV-01**: "Run in Baller" opens in new tab instead of replacing current view
- **NAV-02**: Browser back button returns to previous analysis after re-analyze

## Out of Scope

| Feature | Reason |
|---------|--------|
| Price tracking/alerts | Different product category (Swoopa's domain) |
| Cross-platform search | Fundamentally changes architecture |
| Auto-analyze all similar listings | Scraper concurrency limits, API cost |
| Mobile-specific responsive redesign | Separate effort |
| Location/distance comparison | Insufficient reliable location data from scraper |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REANA-01 | Phase 1 | Complete |
| REANA-02 | Phase 1 | Complete |
| COMP-01 | Phase 2 | Complete |
| COMP-02 | Phase 2 | Complete |
| COMP-03 | Phase 2 | Complete |
| COMP-04 | Phase 2 | Complete |
| PROS-01 | Phase 3 | Pending |
| PROS-02 | Phase 3 | Pending |
| DSGN-01 | Phase 2 | Complete |
| DSGN-02 | Phase 2 | Complete |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after roadmap creation*
