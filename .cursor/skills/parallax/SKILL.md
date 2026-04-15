# Skill: Parallax — Scroll-Driven Spatial Depth

## Purpose

This skill teaches how to implement multi-speed parallax that feels like moving through physical space. Not the aggressive "parallax scrolling" of 2013 — subtle, smooth, imperceptible depth.

## When to Use

- When a layout feels flat despite having good composition
- When images need to feel like they exist at different distances
- When transitioning between content zones
- When the user asks for "depth" or "immersion"

## Core Rules

1. **Small offsets only** — max 15% of element height
2. **Never aggressive** — the user should not notice parallax consciously
3. **Smooth interpolation** — no jumps, no snapping, no jank
4. **Mobile reduction** — 30% of desktop parallax on screens < 768px
5. **Disable on reduced motion** — always respect accessibility

## Speed Tiers

```
Tier 1 — Background:    0.3x–0.5x scroll speed  (moves slow = feels far)
Tier 2 — Content:       0.85x–1.0x scroll speed  (moves with user)
Tier 3 — Foreground:    1.1x–1.3x scroll speed   (moves fast = feels near)
Tier 4 — Fixed:         0x scroll speed           (stays in place = infinite distance)
```

**Never exceed 1.5x** for any layer. Past that, the illusion breaks.

## Implementation: Scroll-Based Parallax

```typescript
// hooks/useParallaxLayer.ts
import { useEffect, useRef } from 'react';

interface ParallaxOptions {
  speed: number;       // 0.3 to 1.3
  direction?: 'y' | 'x';
  maxOffset?: number;  // px, prevents extreme values
}

export function useParallaxLayer<T extends HTMLElement>(
  options: ParallaxOptions
) {
  const ref = useRef<T>(null);
  const { speed, direction = 'y', maxOffset = 150 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const effectiveSpeed = isSmall ? speed * 0.3 + 0.7 : speed;
    // On mobile: speed 0.3 becomes 0.79, speed 1.3 becomes 1.09
    // Much subtler range on small screens

    let ticking = false;

    function update() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const delta = (elementCenter - viewportCenter) * (effectiveSpeed - 1);

        const clamped = Math.max(-maxOffset, Math.min(maxOffset, delta));

        if (direction === 'y') {
          el!.style.transform = `translate3d(0, ${clamped}px, 0)`;
        } else {
          el!.style.transform = `translate3d(${clamped}px, 0, 0)`;
        }

        ticking = false;
      });
    }

    el.style.willChange = 'transform';
    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      el.style.willChange = 'auto';
    };
  }, [speed, direction, maxOffset]);

  return ref;
}
```

## Multi-Layer Composition

Apply different speeds to create a scene with depth:

```tsx
function DepthScene() {
  const bgRef = useParallaxLayer<HTMLDivElement>({ speed: 0.4 });
  const midRef = useParallaxLayer<HTMLDivElement>({ speed: 0.9 });
  const fgRef = useParallaxLayer<HTMLDivElement>({ speed: 1.2 });

  return (
    <div className="relative h-[150vh] overflow-hidden">
      {/* Background — slow, blurred, low opacity */}
      <div ref={bgRef} className="absolute inset-0 opacity-30 blur-sm">
        <img src="..." className="w-full h-full object-cover" />
      </div>

      {/* Midground — normal speed, sharp */}
      <div ref={midRef} className="relative z-10">
        <img src="..." className="w-[80vw] aspect-[3/4]" />
      </div>

      {/* Foreground — fast, accent elements */}
      <div ref={fgRef} className="absolute bottom-0 right-0 z-20 opacity-80">
        <span className="text-micro uppercase tracking-[0.2em]">
          Featured
        </span>
      </div>
    </div>
  );
}
```

## Smooth Interpolation

For extra smoothness, use lerp (linear interpolation) instead of direct values:

```typescript
// Smooth parallax with lerp — eliminates any micro-jank
function useSmoothParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null);
  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    function onScroll() {
      const rect = el!.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      target.current = (elementCenter - viewportCenter) * (speed - 1);
    }

    function animate() {
      // Lerp factor: 0.08 = very smooth, 0.15 = responsive
      current.current += (target.current - current.current) * 0.08;
      el!.style.transform = `translate3d(0, ${current.current}px, 0)`;
      rafId.current = requestAnimationFrame(animate);
    }

    el.style.willChange = 'transform';
    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      el.style.willChange = 'auto';
    };
  }, [speed]);

  return ref;
}
```

## Performance Rules

- Max 5 parallax layers per page (fewer is better)
- All scroll listeners: `{ passive: true }`
- Use `translate3d` (not `translateY`) to force GPU compositing
- Set `will-change: transform` only while the element is near the viewport
- On mobile Safari: test with 6x CPU throttle in devtools
- If fps drops below 55: remove the furthest background layer first

## Anti-Patterns

| Bad | Good |
|-----|------|
| Parallax on every element | Parallax on 2-3 key layers |
| Speed difference > 0.7 between layers | Speed difference 0.2–0.5 between layers |
| Parallax on text blocks | Parallax on images and accents only |
| Jumpy position updates | Lerp-smoothed interpolation |
| Same parallax speed everywhere | Varied speeds creating clear depth |
| Parallax + CSS animation on same element | One movement system per element |
