# Skill: Model Design System in Payload

Step-by-step guide to make the RFE design system editable via Payload CMS.

## Steps

### 1. Read current design tokens

Read `app/[locale]/globals.css` and extract:
- All `:root` CSS custom properties
- Font declarations
- Section tone values
- Easing functions
- Radius and spacing values

Also read:
- `lib/seo.ts` for `SITE_CONFIG` (brand name, URL, contact)
- `Header.tsx` and `Footer.tsx` for hardcoded brand references
- Logo files in `public/assets/logos/` and `public/`

### 2. Create the SiteConfig global

```typescript
// globals/SiteConfig.ts
import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Configuration',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'brandName', type: 'text', required: true, defaultValue: 'RFE' },
            { name: 'brandFullName', type: 'text', defaultValue: 'Rohm Feifer Entertainment' },
            { name: 'tagline', type: 'text', localized: true },
            { name: 'subTagline', type: 'text', localized: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Colors',
          fields: [
            {
              name: 'palette',
              type: 'group',
              fields: [
                { name: 'background', type: 'text', defaultValue: '#070708' },
                { name: 'foreground', type: 'text', defaultValue: '#F5F0EB' },
                { name: 'accentRed', type: 'text', defaultValue: '#8B1A1A' },
                { name: 'accentRose', type: 'text', defaultValue: '#C4A0A0' },
                { name: 'accentGold', type: 'text', defaultValue: '#B5975A' },
              ],
            },
            {
              name: 'sectionTones',
              type: 'group',
              fields: [
                { name: 'deep', type: 'text', defaultValue: '#050506' },
                { name: 'charcoal', type: 'text', defaultValue: '#0a0a0c' },
                { name: 'slate', type: 'text', defaultValue: '#0c0d10' },
                { name: 'warm', type: 'text', defaultValue: '#0b0908' },
                { name: 'cool', type: 'text', defaultValue: '#080a0d' },
                { name: 'ember', type: 'text', defaultValue: '#0d0907' },
                { name: 'dusk', type: 'text', defaultValue: '#090810' },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            { name: 'headingFont', type: 'text', defaultValue: 'Sackers Gothic' },
            { name: 'bodyFont', type: 'text', defaultValue: 'Inter' },
            { name: 'serifFont', type: 'text', defaultValue: 'Fraunces' },
            { name: 'baseRadius', type: 'text', defaultValue: '0.25rem' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'siteUrl', type: 'text', defaultValue: 'https://www.rohmfeiferentertainment.com' },
            { name: 'metaTitleSuffix', type: 'text', defaultValue: 'RFE' },
            { name: 'defaultMetaDescription', type: 'textarea', localized: true },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
            { name: 'keywords', type: 'text', hasMany: true, localized: true },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'instagram', type: 'text' },
            { name: 'imdb', type: 'text' },
            { name: 'linkedin', type: 'text' },
            { name: 'vimeo', type: 'text' },
            { name: 'tiktok', type: 'text' },
          ],
        },
      ],
    },
  ],
}
```

### 3. Seed from current values

```typescript
// scripts/seed/seed-site-config.ts
export async function seedSiteConfig() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-config',
    data: {
      brandName: 'RFE',
      brandFullName: 'Rohm Feifer Entertainment',
      tagline: "There's always more to the story.",
      subTagline: 'True Crime / Real Drama',
      palette: {
        background: '#070708',
        foreground: '#F5F0EB',
        accentRed: '#8B1A1A',
        accentRose: '#C4A0A0',
        accentGold: '#B5975A',
      },
      sectionTones: {
        deep: '#050506',
        charcoal: '#0a0a0c',
        slate: '#0c0d10',
        warm: '#0b0908',
        cool: '#080a0d',
        ember: '#0d0907',
        dusk: '#090810',
      },
      headingFont: 'Sackers Gothic',
      bodyFont: 'Inter',
      serifFont: 'Fraunces',
      baseRadius: '0.25rem',
      siteUrl: 'https://www.rohmfeiferentertainment.com',
      metaTitleSuffix: 'RFE',
      defaultMetaDescription: 'stories that refuse to stay quiet.',
      instagram: 'https://www.instagram.com/elisabethrohm/',
      imdb: 'https://www.imdb.com/name/nm0738400/',
    },
  })
}
```

### 4. Inject in root layout

```typescript
// app/(frontend)/[locale]/layout.tsx
const siteConfig = await payload.findGlobal({ slug: 'site-config' })

const cssVars = {
  '--background': siteConfig.palette?.background || '#070708',
  '--foreground': siteConfig.palette?.foreground || '#F5F0EB',
  '--rfe-red': siteConfig.palette?.accentRed || '#8B1A1A',
  '--rfe-rose': siteConfig.palette?.accentRose || '#C4A0A0',
  '--rfe-gold': siteConfig.palette?.accentGold || '#B5975A',
  '--tone-deep': siteConfig.sectionTones?.deep || '#050506',
  // ... map all tokens
} as React.CSSProperties

<html lang={locale} style={cssVars}>
```

### 5. Verify

- [ ] Seed populates all design tokens
- [ ] Admin shows the Site Configuration global with tabs
- [ ] Changing a color in admin → CSS variable updates → site colors change
- [ ] Cinematic effects still work (they reference `var(--...)`)
- [ ] Tailwind utility classes still work (`bg-background`, `text-foreground`)
- [ ] `pnpm build` passes
