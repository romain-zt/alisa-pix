# Skill: Rhythm — Pacing the Experience

## Purpose

This skill teaches how to create temporal rhythm in a spatial experience. Like music: tension and release, motion and stillness, density and void. Without rhythm, even beautiful visuals feel monotonous.

## When to Use

- When planning the sequence of a page
- When a page feels "samey" or monotonous
- When deciding where motion belongs
- When something feels busy or overwhelming

## Core Pattern

```
STILL → MOTION → STILL → REVEAL
```

This is the fundamental unit of rhythm. Everything is a variation of this.

- **STILL**: a moment of rest where the eye absorbs what is visible
- **MOTION**: a single, slow change (parallax shift, element emerging, opacity change)
- **STILL**: another rest — the new state is absorbed
- **REVEAL**: new content becomes visible, starting the next cycle

## Pacing Zones

Map every page into alternating zones:

### Dense Zone (High Energy)
- Multiple elements visible
- Smaller images in editorial arrangements
- Text and image together
- Duration: 0.5–1x viewport height
- Purpose: **stimulation**, variety, showing range

### Sparse Zone (Low Energy)
- One element or none
- Large image or empty space
- If text: one line maximum
- Duration: 1–2x viewport height
- Purpose: **breathing**, focus, emotional weight

### Void Zone (Zero Energy)
- Empty space — just the background color
- Or a single thin accent line
- Duration: 0.3–0.5x viewport height
- Purpose: **reset**, transition, creating anticipation

```
Page rhythm example:
┌─────────────────────┐
│     VOID            │  ← 30vh of darkness, anticipation
│     SPARSE          │  ← hero image, 150vh, slow parallax
│     VOID            │  ← 40vh, just the warm black
│     DENSE           │  ← gallery grid, 80vh, multiple images
│     SPARSE          │  ← featured image, 120vh, with caption
│     VOID            │  ← 30vh breathing space
│     DENSE           │  ← more work, editorial layout
│     SPARSE          │  ← closing image or statement
│     VOID            │  ← generous space before footer
└─────────────────────┘
```

## Contrast Between Motion and Stillness

Motion is only powerful when preceded by stillness.

### Rule: The 3:1 Ratio

For every 1 viewport of motion, there must be 3 viewports of stillness.

| ❌ Wrong | ✅ Right |
|----------|---------|
| Parallax → Parallax → Parallax | Still → Still → Parallax → Still |
| Reveal → Reveal → Reveal | Reveal → Still → Still → Reveal |
| Everything moves | One thing moves, everything else rests |

### Where Motion Belongs

- At the **transition** between zones (not within them)
- On the **dominant element** of a zone (not supporting elements)
- After a **void** (motion after emptiness creates surprise)

### Where Motion Does Not Belong

- In void zones (void means void)
- On every element in a dense zone (pick one, let the rest be static)
- On text (text should appear, then be still)

## Scroll Distance as Time

In a scroll experience, distance = time. Control pacing through height:

```css
/* Fast moment — content passes quickly */
.zone-dense { min-height: 60vh; }

/* Slow moment — content lingers */
.zone-sparse { min-height: 130vh; }

/* Pause — intentional emptiness */
.zone-void { min-height: 35vh; }
```

A section with `min-height: 200vh` and one image forces the user to spend time with that image. This is **slow**. Use it for your best work.

A section with `min-height: 50vh` and 4 images passes quickly. This is **fast**. Use it for variety and range.

## The Breath

Every page should feel like it breathes:

```
Inhale  → space expands (void zone, generous padding)
Hold    → moment of focus (one image, full attention)
Exhale  → density releases (quick editorial section)
Pause   → reset before next breath
```

A page that only inhales (all sparse) feels empty.
A page that only exhales (all dense) feels overwhelming.
The rhythm between them is what creates life.

## Implementation

When planning a page, write out the rhythm before writing code:

```
1. VOID   — 30vh — warm darkness, thin line accent
2. SPARSE — 150vh — hero image, parallax 0.4x, slow reveal
3. VOID   — 40vh — nothing, just background shift (#0a0908 → #080808)
4. DENSE  — 80vh — 4 images editorial grid, stagger reveal
5. SPARSE — 120vh — featured work, caption, parallax 0.5x
6. VOID   — 35vh — breathing, background shift back
7. DENSE  — 70vh — more work, asymmetric grid
8. SPARSE — 100vh — closing statement or signature image
9. VOID   — 50vh — generous void before footer
```

This is the score. Code is the performance.
