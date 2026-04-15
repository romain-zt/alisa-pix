# Perception Rules — Design for Feeling, Not UI

## Core Principle

We do not design user interfaces. We design **perceptual experiences**.

The screen is not a page — it is a window into a spatial world.
Every decision must serve depth, presence, and immersion.

## The Three Planes

Every viewport is composed of three perceptual planes:

### Background (far)
- Large, soft, low-contrast
- Moves slowest (or is fixed)
- Blurred or desaturated
- Purpose: atmosphere, context, depth anchor

### Midground (middle)
- Primary content: images, text
- Moves at scroll speed (1:1) or slightly offset
- Full clarity and contrast
- Purpose: storytelling, focal point

### Foreground (near)
- Small, sharp, high-contrast accents
- Moves fastest or is fixed to viewport
- Thin lines, small labels, subtle overlays
- Purpose: intimacy, framing, spatial cue

```
Depth Stack:
┌─────────────────────────────────────────┐
│  FOREGROUND  (z: 30)  — accent, frame   │
│  ┌─────────────────────────────────┐    │
│  │  MIDGROUND (z: 20)  — content   │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │  BACKGROUND (z: 10)     │    │    │
│  │  │  — atmosphere           │    │    │
│  │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Depth Cues

The brain perceives depth through these cues. Use all of them:

### 1. Blur (Depth of Field)
- Background elements: `filter: blur(2px–6px)`
- Midground: sharp
- Foreground: sharp or very slightly soft
- Mimics camera lens behavior — the brain reads this as real depth

### 2. Scale (Size Falloff)
- Further = smaller
- An image at 60% width feels further than one at 90% width
- Use scale differences between planes: bg at 0.85, mid at 1.0, fg at 1.05

### 3. Opacity (Atmospheric Perspective)
- Further = more transparent
- Background elements: opacity 0.3–0.6
- Midground: opacity 0.9–1.0
- This mimics how real-world objects fade with distance

### 4. Speed (Motion Parallax)
- Further = moves slower
- Background: 0.3x–0.5x scroll speed
- Midground: 1.0x scroll speed
- Foreground: 1.1x–1.3x scroll speed (or fixed)
- The brain uses relative speed to judge distance

### 5. Overlap (Occlusion)
- Elements that overlap others are perceived as closer
- Intentional overlapping is the strongest depth cue
- Always have at least one overlap per major composition

### 6. Color Temperature
- Warm tones advance (feel closer)
- Cool tones recede (feel further)
- Background: slightly cooler (#0a080d)
- Foreground accents: slightly warmer (#C4A88A)

## Slow Reveal

Content must never appear all at once. Revelation is paced:

```
Phase 1: Shape — the user sees form before detail (blur or low opacity)
Phase 2: Clarity — the image sharpens or text becomes readable
Phase 3: Context — supporting elements appear (captions, labels)
Phase 4: Invitation — a subtle cue to continue (scroll indicator, next layer visible)
```

Each phase can be scroll-driven (not time-driven).
The user controls the pace of revelation through their scroll.

## Perceptual Weight

Every element has visual weight. Balance the composition:

| Heavy | Light |
|-------|-------|
| Large images | Small text |
| Dark areas | Light accents |
| Sharp focus | Soft blur |
| Static elements | Moving elements |
| Saturated (color) | Desaturated (B&W) |

A viewport must never be all-heavy or all-light.
Contrast in weight creates interest and directs the eye.

## The Perception Test

Before shipping:

1. Squint at the screen — can you still see distinct depth planes?
2. Cover the text — does the layout still communicate spatial depth?
3. Does the viewport feel like it has a "near" and a "far"?
4. Is there one clear focal point that the eye lands on first?
5. Does scrolling feel like moving through space, or moving a page?
