# Skill: Design System — Awwwards-Level Luxury Photography

## Purpose

This skill teaches the agent how to design like the best editorial and luxury websites. Not "dark mode SaaS" — actual museum/gallery/fashion design language.

## When to Use

- When creating any new component or page
- When reviewing existing UI for quality
- When the user asks to "make it look better" or "more premium"

## Core Design Principles

### 1. Image Dominance

The photograph is always the hero. Everything else is supporting cast.

**Rules:**
- Images occupy 60–80% of any composition
- Text is always smaller, lighter, and less prominent than the image
- Never place text on top of the important parts of a photograph
- When text accompanies an image, it sits adjacent — whispering, not shouting
- Image aspect ratios are sacred: 3:4, 2:3, 4:5 for portrait; 16:9, 3:2 for landscape

**Implementation:**
```css
/* Image containers respect photographer's intent */
.portrait { aspect-ratio: 3/4; }
.landscape { aspect-ratio: 3/2; }
.editorial { aspect-ratio: 2/3; }

/* Default: desaturated, full color on interaction */
.gallery-image {
  filter: grayscale(0.8) contrast(1.05);
  transition: filter 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
.gallery-image:hover,
.gallery-image[data-active="true"] {
  filter: grayscale(0) contrast(1);
}
```

### 2. Rhythm: Fast / Slow / Pause

A page is a musical composition. It has tempo changes.

**Slow section** (2–3x viewport height):
- One large image, full-width or near-full
- Minimal text — a title or a single sentence
- Parallax optional (max 15% offset)
- Purpose: immersion, letting the eye rest on the work

**Fast section** (0.5–1x viewport height):
- Multiple smaller images in an editorial grid
- Quick visual scanning
- Denser information
- Purpose: showing range, variety

**Pause section** (0.3–0.5x viewport height):
- Empty space with one element: a line, a word, a thin accent
- Or completely empty
- Purpose: breathing, transition, emotional reset

**Pattern for a homepage:**
```
[Pause] → Opening mystery (dark, maybe a sliver of light)
[Slow]  → Hero image reveal (single, powerful)
[Pause] → Brand name / tagline
[Fast]  → Gallery preview (3-5 images, editorial grid)
[Slow]  → Featured image (full-bleed, with caption)
[Pause] → Invitation to explore
[Fast]  → More work / categories
[Pause] → Colophon / footer
```

### 3. Contrast as Storytelling

Not just light/dark — contrast in scale, density, motion, and attention.

**Scale contrast:**
- Pair a massive image with tiny tracked text
- A full-bleed photo next to a `10px` uppercase label feels luxurious
- Same-size elements feel democratic (fine for grids, boring for storytelling)

**Density contrast:**
- A section packed with images followed by vast emptiness
- Dense text block (a paragraph) surrounded by breathing space
- Never consistent density throughout — it reads as "template"

**Motion contrast:**
- One element moves slowly while everything else is still
- After 3 static sections, one subtle parallax creates surprise
- Motion after stillness > motion after motion

**Attention contrast:**
- Most of the page whispers. One element per spread "speaks."
- If everything demands attention, nothing gets it

### 4. Typography as Architecture

Type is not just "the text" — it is a structural element.

**Hierarchy toolkit (ordered by impact):**
1. **Space around text** — the most powerful tool
2. **Letter-spacing** — `0.08em` (reading) to `0.25em` (display)
3. **Weight** — 300 (light) for elegance, 400 (regular) for body
4. **Size** — use `clamp()`, fluid, never the primary differentiator
5. **Case** — uppercase for labels (max 3 words), sentence case for everything else

**Type scale:**
```css
--text-micro: clamp(0.625rem, 1.5vw, 0.75rem);   /* 10-12px: labels */
--text-caption: clamp(0.75rem, 1.8vw, 0.875rem);  /* 12-14px: captions */
--text-body: clamp(0.875rem, 2vw, 1rem);           /* 14-16px: body */
--text-lead: clamp(1rem, 2.5vw, 1.25rem);          /* 16-20px: lead text */
--text-title: clamp(1.5rem, 4vw, 2.5rem);          /* 24-40px: section titles */
--text-display: clamp(2rem, 5vw, 3.5rem);          /* 32-56px: page titles */
```

**Never:**
- Use more than 3 levels of type size on one screen
- Make body text smaller than 14px on mobile
- Set line-height below 1.4 for body text
- Use font-weight above 500 anywhere

### 5. The Dark Frame

The website's darkness is not a "theme" — it is the gallery wall.

**Implementation:**
- Background is never pure black (`#000`). Always warm: `#0a0908`, `#0d0b09`
- Text is never pure white (`#fff`). Always warm: `#F0EBE3`, `#E8E2D9`
- The warmth creates intimacy. Cool blacks feel corporate. Warm blacks feel private.
- Section tone shifts (tiny color variations in near-black) create subconscious rhythm without visible borders

**Section tone usage:**
```css
/* Alternate between tones — no visible border, but the eye feels the shift */
.section-silk  { background: #0d0b09; } /* warm */
.section-shadow { background: #080808; } /* neutral */
.section-ember  { background: #0d0907; } /* warm glow */
.section-velvet { background: #0a080d; } /* cool mystery */
```

### 6. Negative Space as Premium Signal

The most expensive real estate in luxury design is **empty space**.

**Rules:**
- Section padding: `clamp(4rem, 10vh, 8rem)` vertically
- Text inset from edge: `clamp(1.5rem, 5vw, 3rem)` on mobile
- Between an image and its caption: `clamp(1rem, 3vh, 2rem)`
- Between sections: at least one full breath (100vh pause optional between major sections)

**What premium feels like:**
- An image takes 70% of the screen, and the remaining 30% is just dark background
- A caption sits alone with 4rem of space above and below
- The footer has 8rem of space above it before any content

**What cheap feels like:**
- Content touching the edges on all sides
- Three elements competing for attention in the same viewport
- No clear "resting point" for the eye

## Implementation Checklist

When building any UI component:

- [ ] Is the photograph the dominant visual element?
- [ ] Is there enough empty space around text?
- [ ] Does the typography use spacing/weight for hierarchy (not size)?
- [ ] Are animations subtle and transform-only?
- [ ] Does the color palette stay within warm near-blacks and off-whites?
- [ ] Would this feel right in a printed photography catalog?
- [ ] Does this section have a clear tempo (slow/fast/pause)?
- [ ] On mobile, does the image go edge-to-edge?
- [ ] Is there only ONE focal point per viewport?
