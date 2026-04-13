# Skill: Migrate Local Content to Payload

Step-by-step guide to migrate existing hardcoded content to a Payload collection or global.

## Overview

This is the core migration skill. It covers the full cycle:
1. Discover → 2. Model → 3. Seed → 4. Wire → 5. Clean → 6. Verify

## Steps

### 1. Discover the content

Read these files to understand what you're migrating:

| What | Where |
|------|-------|
| TypeScript types | `lib/i18n/types.ts` |
| English content | `lib/i18n/fallback/en.ts` |
| French content | `lib/i18n/fallback/fr.ts` |
| Media catalog | `app/[locale]/content.ts` |
| SEO metadata | `lib/seo.ts` |
| Page component | `app/[locale]/[page]/*Content.tsx` |
| CSS tokens | `app/[locale]/globals.css` |

Document:
- All fields and their values
- Which fields the component actually renders
- Image paths referenced
- Locale-specific differences

### 2. Model in Payload

Create the collection/global (see `add-collection.md` or `add-global.md`):
- Derive fields from the existing TypeScript type
- Add `localized: true` to content fields
- Use `upload` for image references
- Include SEO fields if page-level

### 3. Write the seed script

Create `scripts/seed/seed-[feature].ts`:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

// Import directly from existing data
import { MEDIA } from '../../app/[locale]/content'
import { fallbackEn } from '../../lib/i18n/fallback/en'

export async function seedFeature() {
  const payload = await getPayload({ config })

  for (const item of fallbackEn.someData) {
    // Upload media
    const media = await uploadOrFindMedia(payload, item.imagePath, item.title)

    // Upsert content
    const existing = await payload.find({
      collection: 'feature',
      where: { slug: { equals: generateSlug(item.title) } },
      limit: 1,
    })

    const data = {
      title: item.title,
      slug: generateSlug(item.title),
      description: item.description,
      poster: media.id,
      // ... map all fields
    }

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'feature', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'feature', data })
    }
  }
}
```

### 4. Wire the frontend

Update the page's server component to fetch from Payload:
```typescript
const payload = await getPayload({ config })
const data = await payload.find({ collection: 'feature', locale })
```

Map Payload response to the existing component props shape.

### 5. Clean up old code

After verifying the Payload version works:
- Remove the migrated data from `content.ts` or fallback files (only if no other page uses it)
- Remove unused imports
- Update types if needed

### 6. Verify

Run through the full checklist:
- [ ] `pnpm build` passes
- [ ] `pnpm seed` completes without errors
- [ ] Re-running seed doesn't duplicate data
- [ ] Admin shows content correctly
- [ ] Frontend renders correctly (mobile + desktop)
- [ ] Locale switching works
- [ ] Images load from S3
- [ ] Old hardcoded data removed (if safe)
- [ ] On feature branch (not main)

## Common pitfalls

- Forgetting to upload images before creating content that references them
- Not handling the Payload media object shape (it returns `{ url, width, height, ... }`)
- Removing old data that un-migrated pages still need
- Seeds that use `create` without checking for existing docs (creates duplicates)
- Missing `localized: true` on content fields
