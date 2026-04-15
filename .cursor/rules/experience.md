# Experience Rules — Non-Negotiable Laws

## Core Principle

We do not build websites. We build **spatial experiences**.
The user must feel they are **inside** the image, not looking at a screen.

## Forbidden

- Linear scrolling (section → section → section)
- Stacked content blocks
- Predictable layouts where the user knows what comes next
- Uniform grids
- Symmetrical compositions
- Any pattern where the scroll position directly maps to content position 1:1
- "Sections" with clear boundaries — the experience must flow

## Required

### Layered Composition

Every viewport must contain at least 2 depth layers.
Content exists in the foreground, midground, and background simultaneously.

```
z-index model:
  background  → slow-moving, blurred, large scale
  midground   → primary content, images, text
  foreground  → overlay elements, accent lines, subtle particles
```

### Overlapping Content

Elements must bleed across their logical boundaries.
An image from one "section" can overlap the next.
Text can sit partially over an image edge.
Nothing is confined to its box.

```css
/* Overlap pattern — elements break their container */
.overlap-up   { margin-top: clamp(-4rem, -8vh, -8rem); position: relative; z-index: 2; }
.overlap-down { margin-bottom: clamp(-3rem, -6vh, -6rem); position: relative; z-index: 1; }
.bleed-left   { margin-left: clamp(-2rem, -5vw, -4rem); }
.bleed-right  { margin-right: clamp(-2rem, -5vw, -4rem); }
```

### Depth Illusion

Every composition must create the feeling that some elements are **closer** and some are **further away**.

Tools:
- `scale` — smaller = further
- `opacity` — dimmer = further
- `filter: blur()` — blurred = further
- `translateZ` with `perspective` — actual spatial offset

### Visual Tension

At least one element per viewport must break the expected grid.
This creates the feeling that the composition is alive, not generated.

- An image that is 5% rotated
- Text that sits at an unexpected position
- An element that is partially cropped by the viewport edge
- Asymmetric spacing that creates directional pull

## The Test

After building any section, ask:

1. If I removed all text, would this still feel like an experience?
2. Can I tell where one "section" ends and another begins? (If yes → redesign)
3. Does this feel like walking through a gallery or scrolling a page? (Must be gallery)
4. Is there at least one moment of surprise in this viewport?
5. Does the scroll feel like it reveals layers, or just moves content up?
