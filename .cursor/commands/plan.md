# Command: /plan

Plan a migration step or feature for the RFE Payload CMS migration.

## Inputs
- **Feature/page to migrate** (e.g., "works collection", "about page", "design system global")

## Steps

1. **Search existing content**
   - Read the relevant data files: `content.ts`, `lib/i18n/fallback/en.ts`, `lib/i18n/types.ts`, `lib/seo.ts`
   - Read the page component that renders this content
   - Read `globals.css` if design tokens are involved
   - List image assets in `public/assets/` that this feature references

2. **Inventory what exists**
   - Document the current TypeScript types
   - Document the actual data (how many items, what fields are populated)
   - Document which fields the component actually renders
   - Note any locale-specific behavior

3. **Propose migration plan**
   ```
   # PLAN: Migrate [Feature]

   ## Current state
   - Data source: [file path]
   - Type: [TypeScript type]
   - Items: [count]
   - Rendered by: [component path]

   ## Tasks (in dependency order)
   1. ⏳ Create Payload [collection/global/block]
   2. ⏳ Write seed script (from existing data)
   3. ⏳ Upload media assets via seed
   4. ⏳ Update frontend to fetch from Payload Local API
   5. ⏳ Remove old hardcoded data
   6. ⏳ Verify: build, seed, admin, frontend, responsive

   ## Dependencies
   - Requires: [what must exist first]

   ## Branch
   - `migrate/[feature-name]`
   ```

4. **Flag risks**
   - What other pages depend on the same data?
   - Will removing old data break other features?
   - Are there locale-specific concerns?

## Output
A concrete, actionable plan with tasks, dependencies, and branch name. Ready to execute with `/implement`.
