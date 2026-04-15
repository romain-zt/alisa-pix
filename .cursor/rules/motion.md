# Motion Rules — Stillness First

## Core Principle

Animation is rare. Movement is continuous but invisible.
The user should never think "that animated" — they should think "that breathes."

## Hierarchy

1. **Parallax depth** — continuous, driven by scroll, no trigger needed
2. **Slow transforms** — scale and opacity shifts over 1500ms+
3. **Scroll reveals** — elements emerge once, then stay
4. **Explicit animation** — reserved for page openings and key transitions only

If you reach for animation, first ask: can parallax or a depth shift achieve the same feeling?

## Forbidden

- Multiple simultaneous animations (max 1 visible animated element at any time)
- Fast transitions under 600ms (except micro-interactions like cursor state)
- Bounce, elastic, or spring easing — ever
- Animation on scroll that replays (once-only or continuous, never retriggered)
- Scroll-jacking or scroll-hijacking of any kind
- Loading spinners or skeleton screens (use blur-up placeholders)
- Attention-grabbing motion (pulsing, shaking, bouncing)
- Any motion that makes the user conscious of the interface

## Speed Reference

| Effect | Duration | Easing |
|--------|----------|--------|
| Parallax offset | Continuous | Linear (scroll-driven) |
| Scroll reveal | 1000–1400ms | cubicBezier(0.16, 1, 0.3, 1) |
| Depth shift (scale/opacity) | 1500–2500ms | cubicBezier(0.87, 0, 0.13, 1) |
| Page opening sequence | 1500–2000ms total | cubicBezier(0.16, 1, 0.3, 1) |
| Hover state (CSS only) | 500–800ms | cubicBezier(0.16, 1, 0.3, 1) |
| Color transition (B&W → color) | 600–1000ms | cubicBezier(0.16, 1, 0.3, 1) |

## Continuous vs Triggered

### Continuous (always running, scroll-driven)
- Parallax layers moving at different speeds
- Slow opacity fade based on scroll position
- Subtle scale shift as elements approach viewport center

### Triggered (once, on viewport entry)
- Element fade-in
- Stagger sequence
- Image color reveal

### Never
- Looping animations
- Animations that run when the element is not visible
- Animations that replay on scroll-back

## The Breath Pattern

The ideal motion model is **breathing**:

```
inhale  → slow expansion (scale 1.0 → 1.01 over 3s)
pause   → stillness (hold for scroll distance)
exhale  → slow contraction (scale 1.01 → 1.0 over 3s)
```

This is not a literal animation loop. It is driven by scroll position.
The user never perceives it as animation — they perceive it as presence.

## Performance Gate

- If frame rate drops below 55fps → remove the most recent effect
- Max 3 elements with `will-change` at any time
- All scroll listeners are `passive: true`
- All rAF loops check visibility before computing
- Test on real mobile Safari — that is the floor, not Chrome desktop
