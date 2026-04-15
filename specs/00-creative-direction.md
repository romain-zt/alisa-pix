# Creative Direction — Vasilisa Boudoir Photography

## Identity

**Vasilisa** is a luxury boudoir photography studio.
The website is not a marketing tool — it is an **experience**.
It must feel like entering a private gallery, not browsing a service page.

**Tagline:** *A bright trace of your personality*

---

## 1. What We Learned From the References

### From `composite-depannage-v0` (cinema restoration site)

**Worth keeping:**
- Cinematic CSS depth system (section tones, vignette layers)
- `IntersectionObserver`-based scroll reveals — lightweight, no library tax
- Editorial typography: serif headlines, tracked uppercase micro-labels
- Dynamic imports for below-fold content (performance)
- The *concept* of before/after reveals (clip-path transitions)

**Rejected:**
- 3+ simultaneous infinite animation loops (grain, lens, leak) — GPU waste
- Shadcn/chart/sidebar token bloat in global CSS
- Unfinished placeholder sections
- YouTube iframe hover previews — noisy for a photography context

### From `rfe` (film production company)

**Worth keeping:**
- Phased typography reveals (letter-spacing opens, slow fade)
- B&W → color treatment on hover — perfect for boudoir
- Editorial grid with mixed cell sizes (not uniform cards)
- Section tonal rhythm (near-black variants for mood shifts)
- Thin dividers and metallic accent lines (sparingly)
- CMS block-based page composition model

**Rejected:**
- Blood-red accent palette — reads horror/crime, not intimacy
- Split-screen dual portrait hero — boudoir = single subject or environment
- Multiple competing infinite CSS loops on every page
- Video autoplay on hover
- `data-ai-*` attributes on blocks

### From `old` (original Vasilisa Vite SPA)

**Worth keeping:**
- "Dark stage, work is light" — the core philosophy
- Generous letter-spacing on the brand name
- Full-bleed hero with asymmetric background positioning
- Drop-cap editorial detail on text pages
- The tagline itself

**Rejected:**
- Right-click blocking + alert() — hostile, amateur
- Vite default purple links (#646cff)
- Triple watermark overlays — noisy, not premium
- `window.outerWidth` responsive checks — brittle
- 12px body text
- Stock CSS spinner
- Roboto + Inter font mix without hierarchy

---

## 2. Visual Philosophy

### Darkness as Intimacy

The site lives in near-black. Not because "dark mode is trendy" — because darkness creates intimacy. A dark room with one light on. A gallery at night. The photographs are the light source.

- **Background:** warm near-black (`#0a0908` range, not cold `#000`)
- **Text:** warm off-white (`#F0EBE3` range), never pure white
- **Accent:** one metallic warm tone — champagne/rose-gold (`#C4A88A`)
- **Secondary accent:** soft blush (`#C4A0A0`)
- **Never:** pure black, pure white, saturated colors, neon, gradients

### Breathing Space

Every section must breathe. The user should feel *space*, not *content*.

- Minimum `clamp(4rem, 10vh, 8rem)` between major sections
- Text blocks never wider than `38ch` on mobile, `52ch` on desktop
- Images get the space — text is the whisper beside them
- Empty space is not waste — it is the most expensive element

### Typography Tone

Two voices, one conversation:

1. **Display/Brand:** A refined serif or display face — for the name, section titles, and whispered labels. Tracked, light, unhurried.
2. **Body:** Clean sans-serif — for reading. Small but legible. Never competing with the images.

Scale: `clamp()` fluid type. No fixed `px` sizes outside of micro-labels.

Hierarchy through **weight and spacing**, not size jumps. A 12px tracked uppercase label can feel more powerful than a 48px headline — if it has room.

### Sensual Rhythm

The page has a heartbeat. Not a metronome — a human pulse.

- **Slow sections:** large image, minimal text, long scroll distance
- **Pause sections:** empty space, a single word, a thin line
- **Detail sections:** closer crop, typography, a sentence
- **Immersion sections:** edge-to-edge, no UI chrome, just the image

This is not a "scroll to see features" page. It is a **visual poem**.

---

## 3. Motion Philosophy

### What Motion Means Here

Motion is not decoration. Motion is **emotion**.

- A slow fade = "welcome"
- A delayed reveal = "anticipation"
- A parallax shift = "depth, presence"
- No motion = "confidence, stillness"

### Rules

1. **Never animate for attention.** Animate for *feeling*.
2. **Maximum 2 animated elements per viewport** at any time.
3. **No continuous loops.** Everything starts. Everything ends.
4. **Scroll triggers only.** No autoplay. No timers. No hover-triggered motion on mobile.
5. **Reduced motion respected.** Always. `prefers-reduced-motion: reduce` disables everything except opacity fades.
6. **Transform-only animations.** `translate`, `scale`, `opacity`. Never `width`, `height`, `top`, `left`, `filter` in animations.

### Animation Personality

| Property | Value |
|----------|-------|
| Default duration | 800ms–1200ms |
| Easing | `cubicBezier(0.16, 1, 0.3, 1)` (expo out — the "emerge") |
| Stagger | 80ms–150ms between siblings |
| Parallax | Maximum 15% of section height |
| Delay before first animation | 200ms minimum (let the content settle) |

### What We Never Do

- Bounce
- Elastic overshoot
- Continuous rotation
- Scale > 1.05 on any element
- Blur transitions (GPU-heavy, laggy on mobile)
- Canvas or WebGL anything
- More than 1 parallax layer per section

---

## 4. Color System

### Primary Palette

| Token | Value | Role |
|-------|-------|------|
| `--bg-deep` | `#0a0908` | Primary background — warm near-black |
| `--bg-surface` | `#0f0d0b` | Card/section surface — slightly lifted |
| `--text-primary` | `#F0EBE3` | Primary text — warm parchment |
| `--text-muted` | `rgba(240, 235, 227, 0.5)` | Secondary text, captions |
| `--accent` | `#C4A88A` | Champagne/rose-gold — lines, highlights |
| `--accent-soft` | `rgba(196, 168, 138, 0.4)` | Accent at reduced presence |
| `--blush` | `#C4A0A0` | Soft blush — subtle warmth |

### Section Tones (near-black variants for mood shifts)

| Token | Value | Character |
|-------|-------|-----------|
| `--tone-silk` | `#0d0b09` | Warm, intimate |
| `--tone-shadow` | `#080808` | Neutral depth |
| `--tone-ember` | `#0d0907` | Warm glow |
| `--tone-velvet` | `#0a080d` | Cool, mysterious |
| `--tone-smoke` | `#0b0a0d` | Hazy, soft |

### Rules

- No color should draw attention away from photographs
- Accent is used for: thin lines, tiny labels, hover states
- Never use accent as background
- Text links: underline in `--accent-soft`, no color change on hover — only opacity shift

---

## 5. Image Treatment

### Philosophy

Images are the **content**. Everything else is frame.

### Rules

1. **Default state: desaturated** — B&W or low-saturation (CSS `filter: grayscale(0.8) contrast(1.05)`)
2. **Active/hover state: full color** — smooth 600ms transition
3. **Never crop to squares** — respect the photographer's composition. Use `object-fit: cover` with photographer-friendly ratios (3:4, 2:3, 4:5 for portrait; 16:9, 3:2 for landscape)
4. **No rounded corners on photographs** — this is not a UI element
5. **No drop shadows on photographs** — the dark background IS the frame
6. **Loading: blur-up placeholder** — tiny base64 blur, not skeleton, not spinner
7. **Grain overlay (optional):** one static SVG noise layer at 3-5% opacity over the page — not per-image, not animated

---

## 6. Layout Principles

### Mobile (Primary)

- **Full-width images** — edge to edge, no padding
- **Text inset** — `padding-inline: clamp(1.5rem, 5vw, 3rem)`
- **Vertical storytelling** — one idea per screen height
- **Thumb zone:** all interactive elements in bottom 60% of screen
- **No horizontal scroll** — ever

### Desktop (Enhancement)

- **Asymmetric compositions** — image 60-70%, text 30-40%
- **Broken grid** — images can overlap text zones by 10-20%
- **Sticky elements** — text can stick while image scrolls (or vice versa)
- **Max content width:** `1400px` with generous side margins
- **No centered marketing copy** — align left or right, with tension against the image

### Never

- Feature grids (3-column icon + text)
- Card carousels
- Centered hero with CTA button
- "About Us" sections with circular team photos
- Testimonial sliders
- Pricing tables

---

## 7. Component Vocabulary

Instead of generic web components, think in **exhibition terms**:

| Instead of | Use |
|-----------|-----|
| Hero section | **Opening** — a moment of mystery before the first image |
| Feature grid | **Gallery wall** — images at different scales, asymmetric |
| CTA block | **Invitation** — a whispered line with a subtle link |
| Testimonial | **Trace** — a single sentence, attributed, floating in space |
| Footer | **Colophon** — minimal, the photographer's mark |
| Navigation | **Index** — hidden until summoned, like a gallery guide |

---

## 8. Performance Contract

| Metric | Target |
|--------|--------|
| FPS | 60fps minimum on iPhone 12+ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| JS bundle (initial) | < 80KB gzipped |
| Animation technique | CSS transforms + anime.js (no GSAP, no Framer Motion) |
| Images | Next.js `<Image>` with `sizes`, `priority` for above-fold |
| Fonts | 2 maximum, `font-display: swap`, preloaded |
| No | Canvas, WebGL, heavy blur, box-shadow animations |

---

## 9. What "Done" Looks Like

The website should feel like:

- Walking into a dimly lit gallery
- Each scroll reveals the next piece
- The photographer's eye guides your eye
- You feel calm, not marketed to
- You want to stay, not click away
- The experience is the portfolio

It should NOT feel like:

- A Squarespace photography template
- A startup landing page with dark mode
- A Webflow agency portfolio
- A CSS animation showcase
- A social media feed

---

## 10. Reference Mood

Think: **Helmut Newton exhibition catalog meets Acne Studios website meets the silence between tracks on a vinyl record.**

Not: **Unsplash landing page meets Dribbble dark mode template meets "cool CSS tricks" blog post.**
