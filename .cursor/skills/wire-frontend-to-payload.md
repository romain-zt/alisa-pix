# Skill: Wire Frontend to Payload

Step-by-step guide to replace hardcoded data with Payload CMS data in a frontend page.

## Prerequisites
- The Payload collection/global exists and has a working seed
- The admin panel shows the seeded content

## Steps

### 1. Identify the current data flow

Read the page file (e.g., `app/[locale]/our-work/page.tsx`):
- Where does the data come from? (usually `LanguageContext` → fallback files)
- What props does the `*Content.tsx` component receive?
- What type is the data? (e.g., `WorkItem[]`, `SiteContent`)

### 2. Get the Payload client

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
```

### 3. Fetch data in the server component (page.tsx)

```typescript
// For collections:
const works = await payload.find({
  collection: 'works',
  locale: locale, // pass the current locale
  sort: '-year',
  limit: 100,
})

// For globals:
const siteConfig = await payload.findGlobal({
  slug: 'site-config',
  locale: locale,
})
```

### 4. Map Payload data to component props

The component may expect a different shape than Payload returns. Create a mapping:

```typescript
const workItems = works.docs.map((doc) => ({
  id: doc.id,
  title: doc.title,
  year: doc.year,
  src: typeof doc.poster === 'object' ? doc.poster.url : '',
  tags: doc.tags || [],
  description: doc.description || '',
  videoUrl: doc.videoUrl || '',
  category: doc.category,
}))
```

### 5. Handle images

Payload media returns an object with `url`, `width`, `height`, etc.

```typescript
// Old: src="/assets/works/out-for-love.png"
// New: src={doc.poster?.url || ''}

// For Next.js Image:
<Image
  src={doc.poster?.url || '/placeholder.jpg'}
  alt={doc.poster?.alt || doc.title}
  width={doc.poster?.width || 800}
  height={doc.poster?.height || 1200}
/>
```

Configure `next.config` for remote images:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '9000', // MinIO
    },
    // Production S3/CDN pattern
  ],
},
```

### 6. Support dual data sources during migration

If only some pages are migrated:

```typescript
// Temporary pattern during migration:
let workItems: WorkItem[]

try {
  const payload = await getPayload({ config })
  const works = await payload.find({ collection: 'works', locale })
  workItems = works.docs.map(mapPayloadWorkToWorkItem)
} catch {
  // Fallback to hardcoded data if Payload isn't ready
  workItems = MEDIA.posters[locale]
}
```

### 7. Update the layout if needed

If the page previously got data from `LanguageContext`, update the server component to pass data as props instead.

### 8. Verify

- [ ] Page renders with Payload data
- [ ] Images load from S3 (not `/assets/`)
- [ ] Locale switching shows correct content
- [ ] Mobile and desktop look correct
- [ ] Cinematic effects still work
- [ ] `pnpm build` passes
