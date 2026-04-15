# Skill: Non-Linear Layout — Breaking the Grid

## Purpose

This skill teaches how to compose layouts that defy the conventional top-to-bottom, left-to-right reading pattern. Content enters from unexpected positions, overlaps intentionally, and creates visual flow that follows emotional logic, not structural logic.

## When to Use

- When a layout feels "stacked" or predictable
- When converting a standard section into an immersive composition
- When the user says "break the grid" or "make it less boring"
- When reviewing layouts that feel template-like

## Core Principles

### 1. Overlapping Elements

Elements must cross their logical boundaries. Nothing is confined to its box.

```css
/* Overlap upward into the previous section */
.overlap-enter {
  margin-top: clamp(-6rem, -10vh, -12rem);
  position: relative;
  z-index: 5;
}

/* Image that bleeds past its text companion */
.image-bleed {
  width: clamp(100%, 70vw, 110%);
  margin-left: clamp(-2rem, -5vw, -5rem);
}

/* Caption that sits partially over the image */
.caption-overlap {
  position: relative;
  margin-top: clamp(-2rem, -4vh, -4rem);
  padding-left: clamp(2rem, 8vw, 6rem);
  z-index: 10;
}
```

### 2. Multi-Axis Entry

Elements should not all enter from the same direction. Variety in entry creates spatial richness.

```
Standard (boring):     Everything slides up from below
Non-linear (alive):   Image from left, text from right,
                       accent fades in from nothing,
                       background scale-reveals from center
```

**Entry directions to combine:**
- Vertical (translateY): primary content
- Horizontal (translateX): supporting elements, accents
- Scale (from center): background layers, atmospheric elements
- Opacity only (no movement): text, captions — they materialize

**Rule: max 2 different entry directions per viewport.** More than that becomes chaotic.

### 3. Broken Grid

No element should perfectly align with the element above or below it unless that alignment serves a specific purpose.

```css
/* Offset grid — each row shifts */
.grid-broken {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
}

/* First item: columns 1-5 */
.grid-broken > :nth-child(1) { grid-column: 1 / 6; }

/* Second item: columns 4-9 (overlaps with first) */
.grid-broken > :nth-child(2) {
  grid-column: 4 / 10;
  margin-top: clamp(4rem, 8vh, 8rem);
}

/* Third item: columns 7-12 */
.grid-broken > :nth-child(3) {
  grid-column: 7 / 13;
  margin-top: clamp(-2rem, -4vh, -4rem);
}
```

### 4. Visual Flow ≠ Scroll Direction

The eye should travel in a path that is NOT simply top-to-bottom.

```
Typical scroll path (boring):
  ↓ ↓ ↓ ↓ ↓

Non-linear eye path (alive):
  ↓ → ↘ ← ↓ → ↓
```

Create this through:
- Alternating image positions (left, then right, then center)
- Varying text alignment per section
- Asymmetric spacing that pulls the eye diagonally
- An element at the edge of the viewport that draws attention sideways

### 5. Viewport Edge Awareness

The edges of the viewport are powerful compositional tools. Elements partially visible at the edge create:
- **Mystery** — what continues beyond the frame?
- **Depth** — the world extends past what we see
- **Tension** — the composition is alive, not contained

```css
/* Element cropped by viewport right edge */
.peek-right {
  width: 60vw;
  margin-left: auto;
  margin-right: clamp(-4rem, -8vw, -8rem);
}

/* Element cropped by viewport left edge */
.peek-left {
  width: 60vw;
  margin-left: clamp(-4rem, -8vw, -8rem);
}

/* Tall element cropped top and bottom — feels immersive */
.immersive-crop {
  height: 120vh;
  margin-top: -10vh;
  margin-bottom: -10vh;
  overflow: hidden;
}
```

## Composition Templates

### The Stagger

Images placed at alternating horizontal positions with vertical overlap:

```
┌───────────────────────────────┐
│          ┌──────────┐         │
│          │  Image 1  │         │
│          └──────────┘         │
│  ┌──────────┐                  │
│  │  Image 2  │                  │
│  └──────────┘                  │
│              ┌──────────┐      │
│              │  Image 3  │      │
│              └──────────┘      │
│     ┌──────────┐               │
│     │  Image 4  │               │
│     └──────────┘               │
└───────────────────────────────┘
```

### The Overlap Stack

Images layered on top of each other with offset, creating depth:

```
┌───────────────────────────────┐
│  ┌─────────────────────┐      │
│  │                     │      │
│  │    Image BG         │      │
│  │    (blurred, dim)   │      │
│  │   ┌──────────────┐  │      │
│  │   │  Image MID    │  │      │
│  │   │  (sharp)      │  │      │
│  └───│               │──┘      │
│      │  ┌────────┐   │         │
│      │  │ Caption │   │         │
│      └──┴────────┴───┘         │
└───────────────────────────────┘
```

### The Diagonal Pull

Content arranged along a diagonal axis:

```
┌───────────────────────────────┐
│ ┌────────┐                     │
│ │ Image  │                     │
│ └────────┘                     │
│          "Caption text"        │
│                                │
│              ┌──────────────┐  │
│              │   Image      │  │
│              └──────────────┘  │
│         "Caption text"         │
│                                │
│  ┌────────────────┐            │
│  │    Image       │            │
│  └────────────────┘            │
└───────────────────────────────┘
```

## Mobile Adaptation

On mobile (< 768px), non-linear layout simplifies but keeps its character:

- Overlaps reduce to 30-50% of desktop values
- Horizontal bleeds max at -1rem to -2rem
- Grid breaks simplify to single-column but with staggered margins
- Viewport edge crops are more subtle

```css
/* Desktop: aggressive offset */
.broken-element {
  margin-left: clamp(-4rem, -8vw, -8rem);
}

/* Mobile override: gentle offset */
@media (max-width: 768px) {
  .broken-element {
    margin-left: clamp(-1rem, -3vw, -2rem);
  }
}
```

## The Layout Test

1. Cover the images with your hand — does the empty space alone create an interesting composition?
2. If you drew lines connecting the centers of each element, would the path be non-linear?
3. Is there at least one overlap per major section?
4. Does any element touch or cross the viewport edge?
5. Could you predict where the next element will appear? (If yes → redesign)
