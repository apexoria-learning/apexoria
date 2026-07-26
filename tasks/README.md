# Apexoria — Task Backlog

Persistent, cross-session backlog for work that didn't fit into an active sprint. Everything here traces back to the **SEO Audit dated 2026-07-26** (P1–P29 pending items + R1–R15 recommendations), sorted into a 2×2 effort × impact matrix and grouped by quadrant.

Sprint 1 (Q1 — Easy & High Impact) is being executed on branch `seo/sprint-1-quick-wins` and is **not** tracked here — this backlog covers the remaining three quadrants.

## Layout

```
tasks/
  README.md                                  ← you are here
  q2-polish/                                 ← Easy & Low Impact — cleanup polish
    01-cleanup-batch.md
  q3-growth/                                 ← Tough & High Impact — ranking ceiling
    01-perf-lcp-and-images.md
    02-custom-404-page.md
    03-privacy-and-terms-pages.md
    04-per-course-landing-pages.md
    05-blog-launch.md
    06-success-stories-pages.md
    07-geo-landing-pages.md
  q4-defer/                                  ← Tough & Low Impact — defer unless triggered
    01-deferred-schema.md
    02-consent-mode-v2.md
    03-gated-brochures.md
```

## Conventions

- **One folder per quadrant.** Numeric prefix (`01-`, `02-`, …) = recommended execution order within the quadrant.
- **One project per file**, not one micro-item per file. A "project" = something a single owner can pick up, execute, and close in one PR (or one clearly-bounded PR chain).
- **Every file follows the template below.** Update fields in-file; never rename or move a task once created — supersede it with a new entry that references the old one.

## Status vocabulary

| Value | Meaning |
|-------|---------|
| `Not started` | No work done yet |
| `In progress` | Owner is actively working — name filled in `Owner` field |
| `Blocked` | Cannot proceed without an external prerequisite (product decision, asset, credential, another task done) — always cite the blocker |
| `Done` | Merged to `main` and deployed. Keep the file for history; don't delete |

## Task file template

```markdown
# <Task title>

**Quadrant:** Q<n> (<Easy & Low Impact | Tough & High Impact | Tough & Low Impact>)
**Priority within quadrant:** <n>
**Status:** Not started
**Owner (proposed):** <Frontend | Deployment | Orchestrator | QA | Design Auditor>
**Impact:** <High | Medium | Low>
**Effort:** <Small | Medium | Large>
**Source audit item(s):** <P/R codes from the 2026-07-26 SEO audit>

## Why

<1–3 sentences on the SEO / business rationale, pulled from the audit>

## Scope

- <bullet list of concrete deliverables>

## Out of scope

- <what this task explicitly does NOT cover — cite forward references to other task files where applicable>

## Files likely touched

- [path](../../path) — <what changes>

## Dependencies

- <task-file or user-action prerequisites; empty if none>

## Acceptance criteria

1. <concrete, verifiable outcome — cite tool/URL where possible>
2. …

## User input needed

- <items the user must provide before or during execution>

## Notes / references

- <links to audit sections, GOTCHAS entries, external docs>
```

## Picking up a task

1. Read [.github/AGENTS.md](../.github/AGENTS.md) and [.github/GOTCHAS.md](../.github/GOTCHAS.md) first.
2. Open the task file, check `Dependencies` — resolve any blockers before starting.
3. Set `Status: In progress` and put your agent name in `Owner`.
4. Route through the Orchestrator on any risky/off-convention step (per AGENTS.md team communication contract).
5. On merge, set `Status: Done` and leave a one-line summary in `Notes` with the PR URL.

## Cross-references

- [`.github/AGENTS.md`](../.github/AGENTS.md) — team contract (non-negotiable rules)
- [`.github/GOTCHAS.md`](../.github/GOTCHAS.md) — living project facts (overrides AGENTS.md when they conflict)
- [`memory/PRD.md`](../memory/PRD.md) — product spec & backlog (source of truth for scope decisions)
- [`design_guidelines.json`](../design_guidelines.json) — Design Auditor gate for anything visual
- [`test_result.md`](../test_result.md) — QA / testing_agent protocol
