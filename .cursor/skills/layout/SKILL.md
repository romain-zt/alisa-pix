# Skill: Layout — Editorial & Exhibition Composition

## Purpose

This skill teaches how to build layouts that feel like curated exhibitions, not web templates. Every layout decision must serve the photograph.

## When to Use

- When creating page layouts or section compositions
- When building gallery or portfolio views
- When arranging images with text
- When someone says "it looks too template-y"

## Core Concept: The Exhibition Model

A photography website is an exhibition. Each "room" (viewport) has:
- A **focal piece** (usually an image)
- **Supporting elements** (text, space, lines)
- A **transition** to the next room (scroll)

The visitor moves through rooms at their own pace. We guide, never push.

## Layout Patterns

### 1. The Opening (First Viewport)

The first thing the visitor sees. It must create **mystery and invitation**.

**Do:**
- Start with darkness. A sliver of the first image. Barely visible.
- Or: a single word (the brand name) in tracked uppercase, floating in space
- Or: a subtle gradient from black to slightly-less-black, hinting at what's below
- Delay any text by 200ms+. Let the darkness land first.

**Don't:**
- Full hero image immediately visible — too much too fast
- Headline + subheadline + CTA — this is not a SaaS
- Logo + navigation filling the top — too "website"

**Mobile implementation:**
```tsx
<section className="h-[100svh] relative flex items-end">
  {/* Image barely visible, cropped, mysterious */}
  <div className="absolute inset-0 overflow-hidden">
    <Image
      src={heroImage}
      alt=""
      fill
      className="object-cover opacity-40 scale-105"
      priority
      sizes="100vw"
    />
  </div>

  {/* Brand whisper at the bottom */}
  <div className="relative z-10 p-6 pb-12">
    <p className="text-[10px] tracking-[0.25em] uppercase text-[--text-muted]">
      Vasilisa
    </p>
  </div>
</section>
```

### 2. The Full-Bleed Image

A single image, edge to edge, commanding the entire viewport.

**Rules:**
- No padding, no margin, no rounded corners
- `object-fit: cover` with photographer-friendly aspect
- On mobile: full width, natural height (min 60vh, max 100vh)
- On desktop: max-height 90vh, centered

```tsx
<section className="w-full">
  <div className="relative w-full h-[70vh] md:h-[90vh] md:max-h-[900px]">
    <Image
      src={image}
      alt={alt}
      fill
      className="object-cover"
      sizes="100vw"
    />
  </div>
</section>
```

### 3. The Asymmetric Pair (Desktop)

Image takes 60-70% of the width. Text occupies the remainder with generous padding.

**Mobile:** stacks vertically — image full-width, text below with inset padding.
**Desktop:** side-by-side with intentional asymmetry.

```tsx
<section className="md:grid md:grid-cols-12 md:gap-0 md:min-h-[80vh] md:items-center">
  {/* Image: 7 of 12 columns */}
  <div className="relative h-[60vh] md:h-full md:col-span-7">
    <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 58vw, 100vw" />
  </div>

  {/* Text: 4 of 12 columns, offset by 1 */}
  <div className="px-6 py-12 md:col-span-4 md:col-start-9 md:py-0">
    <p className="text-[10px] tracking-[0.2em] uppercase text-[--text-muted] mb-4">
      Featured
    </p>
    <h2 className="font-serif font-light text-[--text-primary] text-title leading-tight">
      Title here
    </h2>
  </div>
</section>
```

### 4. The Editorial Grid (Gallery)

Not a uniform grid. A curated arrangement with visual hierarchy.

**Rules:**
- Mix image sizes: 1 large (spans 2 columns), 2-3 medium, 1-2 small
- Vary aspect ratios within the grid
- On mobile: single column, alternating between full-width and inset
- On desktop: 2-3 columns with intentional size variation
- Gap: `clamp(0.5rem, 1.5vw, 1rem)` — tight, not airy

**Repeating pattern (every 5-6 images):**
```
Row 1: [  Large image (2 cols)  ] [ Small portrait (1 col) ]
Row 2: [ Medium landscape (1 col) ] [  Medium portrait (1 col)  ]
Row 3: [         Full-bleed single image (3 cols)           ]
```

```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
  {/* Large — spans 8 columns */}
  <div className="md:col-span-8 relative aspect-[3/2]">
    <Image src={images[0]} alt="" fill className="object-cover" />
  </div>

  {/* Small portrait — spans 4 columns */}
  <div className="md:col-span-4 relative aspect-[3/4]">
    <Image src={images[1]} alt="" fill className="object-cover" />
  </div>

  {/* Two medium — 6 columns each */}
  <div className="md:col-span-6 relative aspect-[4/5]">
    <Image src={images[2]} alt="" fill className="object-cover" />
  </div>
  <div className="md:col-span-6 relative aspect-[3/2]">
    <Image src={images[3]} alt="" fill className="object-cover" />
  </div>

  {/* Full bleed */}
  <div className="md:col-span-12 relative aspect-[16/9]">
    <Image src={images[4]} alt="" fill className="object-cover" />
  </div>
</div>
```

### 5. The Breathing Pause

Pure negative space between major sections. A reset.

**Options:**
- Empty div with `min-h-[20vh]` to `min-h-[40vh]`
- A single thin horizontal line (1px, `--accent-soft`) centered
- A single word or micro-label floating in space

```tsx
{/* Pure breathing space */}
<div className="min-h-[25vh]" aria-hidden="true" />

{/* Line pause */}
<div className="flex items-center justify-center min-h-[20vh]" aria-hidden="true">
  <div className="w-12 h-px bg-[--accent-soft]" />
</div>

{/* Word pause */}
<div className="flex items-center justify-center min-h-[30vh]">
  <p className="text-[10px] tracking-[0.3em] uppercase text-[--text-muted]">
    Portfolio
  </p>
</div>
```

### 6. The Overlap (Desktop Only)

An image overlaps into the text zone, or vice versa. Creates tension and depth.

**Rules:**
- Overlap by 10-20% maximum
- Only on desktop (md: breakpoint and above)
- Use negative margins or CSS Grid overlapping areas
- The overlapping element must have higher z-index

```tsx
<section className="relative md:grid md:grid-cols-12 md:min-h-[70vh] md:items-center">
  <div className="relative h-[50vh] md:h-[60vh] md:col-span-7 md:col-start-1 md:row-start-1 z-10">
    <Image src={image} alt="" fill className="object-cover" />
  </div>

  {/* Text overlaps the image zone by 2 columns */}
  <div className="px-6 py-12 md:col-span-5 md:col-start-6 md:row-start-1 md:z-20 md:py-0">
    <div className="md:bg-[--bg-deep]/80 md:backdrop-blur-sm md:p-8">
      <h2 className="font-serif font-light text-title">Title</h2>
    </div>
  </div>
</section>
```

### 7. The Colophon (Footer)

Not a "footer" — a photographer's mark at the end of the exhibition.

**Rules:**
- Minimal: brand name, one contact method, maybe social links
- Generous top spacing (at least `8rem`)
- Small type, tracked, muted
- No "newsletter signup", no "latest blog posts", no sitemap

```tsx
<footer className="pt-32 pb-12 px-6">
  <div className="max-w-md">
    <p className="text-[10px] tracking-[0.25em] uppercase text-[--text-muted] mb-6">
      Vasilisa
    </p>
    <p className="text-caption text-[--text-muted] mb-1">
      Boudoir photography — Paris
    </p>
    <a href="mailto:hello@vasilisa.com" className="text-caption text-[--accent] underline underline-offset-4">
      hello@vasilisa.com
    </a>
  </div>
</footer>
```

## Mobile-First Composition Rules

1. **Single column always.** No side-by-side on mobile unless both elements are very small.
2. **Images: full-width** (0 padding). Text: inset (`px-6` minimum).
3. **Touch targets: 44x44px** minimum for any interactive element.
4. **100svh, not 100vh** — accounts for mobile browser chrome.
5. **Vertical rhythm in `rem`** — consistent spacing that doesn't change with viewport.
6. **No sticky elements on mobile** except a minimal header (if needed at all).
7. **Navigation: hidden by default.** A thin bar or hamburger at most. Full-screen overlay on open.

## Desktop Enhancement Rules

1. **Max content width: 1400px** with auto margins.
2. **Image grids: 2-3 columns max.** More than 3 reduces image impact.
3. **Text max-width: 52ch.** Never wider.
4. **Use CSS Grid 12-column** for asymmetric layouts.
5. **Hover states: B&W → color** transition on images (600ms).
6. **Cursor: consider a custom cursor** (small dot) for gallery views.

## Anti-Patterns (Reject Immediately)

| Pattern | Why it fails |
|---------|-------------|
| 3-column feature grid | Looks like SaaS, not photography |
| Centered hero + CTA button | Looks like a template |
| Card with image + title + description + button | Looks like e-commerce |
| Masonry grid with 4+ columns | Images become thumbnails, lose impact |
| Full-width text banner | Reads as "marketing", not "art" |
| Parallax on every section | Motion sickness, no contrast |
| Sticky sidebar navigation | Reads as "documentation", not "gallery" |
