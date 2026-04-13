# Skill: Add a Payload Global

Step-by-step guide to create a new Payload Global for the RFE migration.

## When to use a Global

- Singleton data (one instance, not a list)
- Site-wide config: branding, navigation, contact info, footer, SEO defaults
- Design system tokens: colors, typography, spacing

## Prerequisites
- Payload CMS is configured
- Media collection exists (if the global has image fields)

## Steps

### 1. Discover existing content

Identify the current source:

| Global | Current source |
|--------|---------------|
| Site config | `globals.css` (CSS vars), `lib/seo.ts` |
| Navigation | `Header.tsx` (hardcoded `navItems`) |
| Contact info | `lib/i18n/fallback/en.ts` → `contactInfo` |
| Footer | `Footer.tsx` (hardcoded email, links) |

Read the relevant files and note all values.

### 2. Create the global file

```
globals/[GlobalName].ts
```

Template:
```typescript
import type { GlobalConfig } from 'payload'

export const GlobalName: GlobalConfig = {
  slug: 'global-name',
  label: 'Global Name',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tab Name',
          fields: [
            { name: 'fieldName', type: 'text', required: true },
            // ...
          ],
        },
      ],
    },
  ],
}
```

### 3. Use tabs for organization

Group related fields into tabs for clean admin UX:
```typescript
tabs: [
  { label: 'Brand', fields: [/* logo, name, tagline */] },
  { label: 'Colors', fields: [/* palette values */] },
  { label: 'SEO', fields: [/* meta defaults */] },
]
```

### 4. Localize appropriate fields

```typescript
{ name: 'tagline', type: 'text', localized: true }
{ name: 'metaDescription', type: 'textarea', localized: true }
```

### 5. Register in payload.config.ts

```typescript
import { GlobalName } from './globals/GlobalName'

globals: [GlobalName, /* ... */],
```

### 6. Seed the global

```typescript
await payload.updateGlobal({
  slug: 'global-name',
  data: {
    fieldName: 'value from current code',
    // ...
  },
})
```

### 7. Fetch in frontend

```typescript
// In a server component
const data = await payload.findGlobal({ slug: 'global-name' })
```

### 8. Verify

- [ ] Global appears in admin sidebar
- [ ] All fields are editable
- [ ] Seed populates values correctly
- [ ] Frontend reads and renders the values
- [ ] `pnpm build` passes
