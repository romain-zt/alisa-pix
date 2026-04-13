# Skill: Verify Changes

Step-by-step guide to verify a migration step is complete and correct.

## Steps

### 1. Build check

```bash
pnpm build
```

This must succeed. Fix any TypeScript or build errors before proceeding.

### 2. Seed check

```bash
pnpm seed
```

Run the seed. Then run it again to verify idempotency:
```bash
pnpm seed  # second run — must not duplicate data
```

### 3. Admin verification

1. Start the dev server: `pnpm dev`
2. Open `http://localhost:3000/admin`
3. Log in with seed admin credentials
4. Navigate to the new collection/global
5. Verify:
   - All expected items are present
   - Fields have correct values
   - Media uploads are visible (thumbnails load)
   - Localized fields show locale switcher
   - Editing a field and saving works

### 4. Frontend verification

1. Open the relevant page (e.g., `http://localhost:3000/en/our-work`)
2. Check:
   - Content renders correctly
   - Images load (check network tab for S3 URLs)
   - Cinematic effects work (grain, depth, lens)
   - Scroll reveals trigger
   - B&W to color transition on hover

3. Check mobile (375px viewport):
   - Layout is responsive
   - Touch targets ≥ 44px
   - Menu works

4. Check desktop (1440px viewport):
   - Full-width layouts look correct
   - Grid layouts display properly

### 5. Locale check (if applicable)

1. Switch locale (e.g., `/fr/our-work`)
2. Verify localized content changes
3. Verify images remain correct (or change if locale-aware)

### 6. Branch safety check

```bash
git branch --show-current
# Must NOT be 'main' or 'master'

git log --oneline -5
# Verify recent commits are sensible
```

### 7. Diff review

```bash
git diff --stat main
# Review the scope of changes
```

Verify:
- No accidental deletions of needed files
- No `.env` or credentials in the diff
- No giant binary files committed
- Commit messages are clear

### 8. Output report

```
## Verification: [Feature Name]

Build:     ✅
Seed:      ✅ (idempotent: ✅)
Admin:     ✅
Frontend:  ✅ (mobile: ✅, desktop: ✅)
Locale:    ✅ / N/A
Branch:    ✅ (on: migrate/feature-name)
Cleanup:   ✅

Verdict: PASS
```
