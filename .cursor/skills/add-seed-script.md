# Skill: Add a Seed Script

Step-by-step guide to create a deterministic, rerunnable seed script for Payload content.

## Steps

### 1. Create the seed file

```
scripts/seed/seed-[feature].ts
```

### 2. Import existing data

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

// Import from existing hardcoded data:
import { MEDIA } from '../../app/[locale]/content'
import { fallbackEn } from '../../lib/i18n/fallback/en'
import { generateSlug } from '../../lib/works'
```

### 3. Write upsert helpers

```typescript
async function upsertBySlug(
  payload: Payload,
  collection: string,
  slug: string,
  data: Record<string, unknown>
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      data,
    })
  }

  return payload.create({ collection, data: { ...data, slug } })
}

async function uploadMediaIfNeeded(
  payload: Payload,
  localPath: string,
  alt: string
) {
  const filename = path.basename(localPath)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  if (existing.docs.length > 0) return existing.docs[0]

  const absolutePath = path.resolve(process.cwd(), 'public', localPath.replace(/^\//, ''))
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Media file not found: ${absolutePath}`)
    return null
  }

  const buffer = fs.readFileSync(absolutePath)
  const ext = path.extname(localPath).toLowerCase()
  const mimeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }

  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      name: filename,
      mimetype: mimeMap[ext] || 'application/octet-stream',
      size: buffer.length,
    },
  })
}
```

### 4. Write the seed function

```typescript
export async function seedWorks() {
  const payload = await getPayload({ config })
  const items = MEDIA.posters.en // or fallbackEn.ourWork

  console.log(`Seeding ${items.length} works...`)

  for (const item of items) {
    // Upload poster image
    const media = await uploadMediaIfNeeded(
      payload,
      item.src,
      item.title
    )

    // Upsert work item
    await upsertBySlug(payload, 'works', generateSlug(item.title), {
      title: item.title,
      year: item.year,
      description: item.description || '',
      tags: item.tags,
      category: item.category,
      videoUrl: item.videoUrl || '',
      poster: media?.id,
    })
  }

  console.log('Works seeded successfully.')
}
```

### 5. Add to the orchestrator

```typescript
// scripts/seed/index.ts
import { seedAdmin } from './seed-admin'
import { seedMedia } from './seed-media'
import { seedWorks } from './seed-works'
// ...

async function seed() {
  console.log('Starting seed...')
  await seedAdmin()
  await seedMedia()
  await seedWorks()
  // ... add more in dependency order
  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
```

### 6. Add pnpm script

```json
{
  "scripts": {
    "seed": "tsx scripts/seed/index.ts"
  }
}
```

### 7. Verify

- [ ] `pnpm seed` completes without errors
- [ ] Running `pnpm seed` twice produces the same result (no duplicates)
- [ ] Content appears correctly in admin panel
- [ ] Media files are uploaded to S3
- [ ] Relationships are correct (e.g., work → poster image)
