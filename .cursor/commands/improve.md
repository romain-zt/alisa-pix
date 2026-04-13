# Command: /improve

Improve existing code adjacent to the migration — clean up safely.

## Inputs
- **What to improve** (e.g., "clean up content.ts", "simplify Header props", "remove unused Google Sheets loader")

## Pre-flight checks

1. **Is the improvement adjacent to a migration step?**
   - Only improve code that you are already modifying for migration
   - Do not refactor unrelated files

2. **Is it safe?**
   - Will other pages/features break?
   - Is the old code still needed by un-migrated features?

3. **Is it small?**
   - If the improvement would create a large diff, split it

## Safe improvements

- Remove dead imports in files you're modifying
- Consolidate duplicate data (e.g., `POSTER_ITEMS` used twice with same data)
- Simplify component props after replacing hardcoded data
- Remove Google Sheets CSV loader once strings are in Payload
- Delete `styles/globals.css` (unused — app uses `app/[locale]/globals.css`)
- Fix `components.json` CSS path reference
- Remove `base.md` from repo root (project notes, not app code)
- Improve TypeScript types (add missing types, remove `any`)
- Add `alt` text to images that lack it

## Unsafe improvements (do NOT do without explicit request)

- Rename routes or URL paths
- Change component hierarchy
- Modify cinematic CSS effects
- Restructure the entire app directory
- Upgrade major dependencies
- Change the build or deployment pipeline

## Output
- Apply the improvement
- Verify `pnpm build` still passes
- Note what was changed and why in the commit message
