# Skill: Add Revalidation Hook

Step-by-step guide to set up on-demand revalidation when Payload content changes.

## Why

When content is edited in the Payload admin, the Next.js frontend should update without a full rebuild. On-demand ISR (Incremental Static Regeneration) or cache revalidation solves this.

## Steps

### 1. Create a revalidation helper

```typescript
// lib/revalidate.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidateCollection(collection: string, slug?: string) {
  switch (collection) {
    case 'works':
      revalidatePath('/[locale]/our-work', 'page')
      revalidatePath('/[locale]/development', 'page')
      if (slug) revalidatePath(`/[locale]/our-work/${slug}`, 'page')
      break
    case 'team-members':
      revalidatePath('/[locale]/our-team', 'page')
      revalidatePath('/[locale]/about', 'page')
      break
    case 'news':
      revalidatePath('/[locale]/press', 'page')
      revalidatePath('/[locale]/news', 'page')
      break
    default:
      revalidatePath('/', 'layout')
  }
}

export function revalidateGlobal(slug: string) {
  // Globals affect the whole site (layout, header, footer)
  revalidatePath('/', 'layout')
}
```

### 2. Add afterChange hooks to collections

```typescript
// In collection config:
hooks: {
  afterChange: [
    async ({ doc, collection }) => {
      revalidateCollection(collection.slug, doc.slug)
    },
  ],
  afterDelete: [
    async ({ collection }) => {
      revalidateCollection(collection.slug)
    },
  ],
}
```

### 3. Add afterChange hooks to globals

```typescript
// In global config:
hooks: {
  afterChange: [
    async ({ global }) => {
      revalidateGlobal(global.slug)
    },
  ],
}
```

### 4. Verify

- [ ] Edit a work item in admin → our-work page updates
- [ ] Edit site config global → layout/branding updates
- [ ] Delete a news item → press page updates
- [ ] Changes reflect without running `pnpm build`

## Notes
- Revalidation only works in production or with `output: 'standalone'`
- In dev mode (`pnpm dev`), pages re-render on every request
- For static exports, you'll need a different approach (webhooks + rebuild)
