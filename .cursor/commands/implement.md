# Command: /implement

Implement a migration step or feature for the RFE Payload CMS migration.

## Inputs
- **What to implement** (e.g., "works collection", "site config global", "seed for team members")

## Pre-flight checks

1. **Branch safety**
   - Verify you are NOT on `main` or `master`
   - If on main: `git checkout -b migrate/<feature>` first
   - Never push to main/master

2. **Search existing content FIRST**
   - Read the current data source for this feature
   - Read the TypeScript types
   - Read the rendering component
   - Understand what the frontend actually needs

3. **Check dependencies**
   - Does media collection exist? (needed for upload fields)
   - Does the database have the latest migrations?
   - Is Docker Compose running? (Postgres + MinIO)

## Implementation order

For each migration step, implement in this order:

1. **Schema** — Payload collection, global, or block definition
2. **Seed** — deterministic seed script importing from existing data
3. **Frontend update** — replace hardcoded data with Payload Local API fetch
4. **Cleanup** — remove old hardcoded data (only if safe)
5. **Verify** — `pnpm build`, check admin, check frontend

## Quality gates

Before considering it done:
- [ ] `pnpm build` passes
- [ ] Seed runs without errors
- [ ] Seed is idempotent (second run doesn't duplicate)
- [ ] Admin panel shows the content correctly
- [ ] Frontend renders the same (or better) as before
- [ ] Mobile (375px) and desktop (1440px) look correct
- [ ] On a feature branch, not main

## Rules
- Smallest safe diff — one feature per implementation
- Seed is mandatory, not optional
- Import data from existing TS files for seeds
- Use Payload Local API for data access
- Localize content fields that may need translation
- Keep cinematic CSS effects intact
