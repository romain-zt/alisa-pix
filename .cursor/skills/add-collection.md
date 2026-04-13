# Skill: Add a Payload Collection

Step-by-step guide to create a new Payload collection for the RFE migration.

## Prerequisites
- Payload CMS is installed and configured in `payload.config.ts`
- Media collection exists (if this collection has image fields)
- Docker Compose is running (Postgres + MinIO)

## Steps

### 1. Discover existing content

Before writing any schema:

```bash
# Find the current data source
# Check these files for the content you're modeling:
```

- Read `app/[locale]/content.ts` for media/poster data
- Read `lib/i18n/fallback/en.ts` for localized content
- Read `lib/i18n/types.ts` for TypeScript type definitions
- Read the page component that renders this content (e.g., `OurWorkContent.tsx`)

Document:
- Fields in the TypeScript type
- Fields actually rendered in the component
- Number of items
- Image paths referenced
- Locale-specific behavior

### 2. Create the collection file

```
collections/[CollectionName].ts
```

Template:
```typescript
import type { CollectionConfig } from 'payload'

export const CollectionName: CollectionConfig = {
  slug: 'collection-name',
  labels: {
    singular: 'Item',
    plural: 'Items',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    // ... map remaining fields from existing type
  ],
}
```

### 3. Field mapping reference

| Existing TS type | Payload field |
|-----------------|---------------|
| `string` (short) | `{ type: 'text' }` |
| `string` (long) | `{ type: 'textarea' }` or `{ type: 'richText' }` |
| `number` | `{ type: 'number' }` |
| `string[]` (tags) | `{ type: 'select', hasMany: true, options: [...] }` |
| `string` (image path) | `{ type: 'upload', relationTo: 'media' }` |
| `string` (URL) | `{ type: 'text' }` with URL validation |
| `'film' \| 'series'` | `{ type: 'select', options: [...] }` |
| `boolean` | `{ type: 'checkbox' }` |

### 4. Add localization

Mark content fields that should be translatable:
```typescript
{ name: 'title', type: 'text', localized: true }
{ name: 'description', type: 'textarea', localized: true }
```

Do NOT localize: `slug`, `year`, `id`, `videoUrl`, `category`, `tags`

### 5. Add SEO group (for page-level collections)

```typescript
{
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'textarea', localized: true },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
```

### 6. Register in payload.config.ts

```typescript
import { CollectionName } from './collections/CollectionName'

// In the config:
collections: [Media, CollectionName, /* ... */],
```

### 7. Write the seed script

See skill: `add-seed-script.md`

### 8. Verify

- [ ] `pnpm build` passes
- [ ] Collection appears in admin panel
- [ ] Fields render correctly in admin
- [ ] Seed script populates data
- [ ] Frontend can fetch data via Local API
