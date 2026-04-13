# Skill: Add a Payload Block

Step-by-step guide to create a reusable Payload block for page building.

## When to use blocks

- Flexible page sections that editors can add/reorder
- Content types that repeat across pages (hero, gallery, CTA, text section)
- When a page has multiple sections with different layouts

## Steps

### 1. Identify the section to model

Look at the current page component (e.g., `HomeContent.tsx`, `AboutContent.tsx`):
- What sections does the page have?
- Which sections are unique vs. reusable?
- What data does each section need?

### 2. Create the block file

```
blocks/[BlockName].ts
```

Template:
```typescript
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheadline',
      type: 'text',
      localized: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
```

### 3. Use blocks in a collection

```typescript
// In a Pages collection:
{
  name: 'layout',
  type: 'blocks',
  blocks: [HeroBlock, ContentBlock, GalleryBlock],
}
```

### 4. Render blocks in frontend

```typescript
function renderBlock(block: any) {
  switch (block.blockType) {
    case 'hero':
      return <CinematicHero {...block} />
    case 'content':
      return <ContentSection {...block} />
    case 'gallery':
      return <MediaGallery {...block} />
    default:
      return null
  }
}
```

### 5. Seed blocks

```typescript
await payload.create({
  collection: 'pages',
  data: {
    title: 'Home',
    slug: 'home',
    layout: [
      {
        blockType: 'hero',
        headline: "There's always more to the story.",
        subheadline: 'True Crime / Real Drama',
      },
      // ...
    ],
  },
})
```

### 6. Verify

- [ ] Block appears as an option in the admin page editor
- [ ] Fields render correctly in admin
- [ ] Seed creates pages with blocks
- [ ] Frontend renders each block type
- [ ] `pnpm build` passes

## RFE-specific blocks to consider

| Block | Maps to current component |
|-------|--------------------------|
| `hero` | `CinematicHero` |
| `content` | Text sections in `AboutContent` |
| `work-grid` | `WorkGrid` component |
| `team-grid` | Team section in `OurTeamContent` |
| `gallery` | `MediaGallery` |
| `press-list` | Press items in `PressContent` |
| `contact-form` | Contact form in `ContactContent` |
