# Skill: Depth System — Fake 3D Without WebGL

## Purpose

This skill teaches how to create convincing 3D depth using only CSS transforms, opacity, blur, and scroll-driven parallax. No WebGL. No Three.js. No canvas. Pure DOM illusion.

## When to Use

- When building any section that needs spatial depth
- When the user says "make it feel 3D" or "add depth"
- When a layout feels flat or template-like
- When creating hero sections, galleries, or transitions between content zones

## The Layer Model

Every depth composition has exactly 3 layers:

```
Layer 1 — BACKGROUND (far)
  ├── z-index: 1
  ├── scale: 0.85–0.92
  ├── opacity: 0.2–0.5
  ├── filter: blur(3px–8px)
  ├── parallax speed: 0.3x–0.5x scroll
  └── content: atmospheric images, shapes, gradients

Layer 2 — MIDGROUND (middle)
  ├── z-index: 10
  ├── scale: 1.0
  ├── opacity: 0.9–1.0
  ├── filter: none
  ├── parallax speed: 1.0x scroll (or 0.85x for subtle float)
  └── content: primary images, text blocks

Layer 3 — FOREGROUND (near)
  ├── z-index: 20
  ├── scale: 1.02–1.08
  ├── opacity: 0.7–1.0
  ├── filter: none or blur(0.5px) for extreme closeness
  ├── parallax speed: 1.2x–1.5x scroll (or fixed)
  └── content: accent lines, labels, framing elements
```

## CSS Perspective Method

The most performant approach uses CSS `perspective` and `translateZ`:

```css
.depth-container {
  perspective: 1200px;
  perspective-origin: 50% 50%;
  overflow: hidden;
}

.layer-bg {
  transform: translateZ(-300px) scale(1.25);
  /* scale compensates for the shrink from negative Z */
}

.layer-mid {
  transform: translateZ(0px);
}

.layer-fg {
  transform: translateZ(100px) scale(0.92);
  /* scale compensates for the enlargement from positive Z */
}
```

**Key formula**: When using `translateZ`, elements further back appear smaller. Compensate with `scale`:

```
compensated_scale = 1 + (translateZ / perspective)
For translateZ(-300px) with perspective 1200px:
  scale = 1 + (300 / 1200) = 1.25
```

## Scroll-Driven Depth

Each layer moves at a different speed based on scroll position:

```typescript
// hooks/useDepthScroll.ts
import { useEffect, useRef, useCallback } from 'react';

interface DepthLayer {
  element: HTMLElement;
  speed: number; // 0.3 = slow (bg), 1.0 = normal (mid), 1.3 = fast (fg)
}

export function useDepthScroll(containerRef: React.RefObject<HTMLElement>) {
  const layers = useRef<DepthLayer[]>([]);
  const ticking = useRef(false);

  const registerLayer = useCallback((element: HTMLElement, speed: number) => {
    layers.current.push({ element, speed });
    element.style.willChange = 'transform';
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const containerRect = container!.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const containerCenter = containerRect.top + containerRect.height / 2;
        const scrollDelta = containerCenter - viewportCenter;

        layers.current.forEach(({ element, speed }) => {
          const offset = scrollDelta * (speed - 1) * 0.15;
          element.style.transform = `translateY(${offset}px)`;
        });

        ticking.current = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      layers.current.forEach(({ element }) => {
        element.style.willChange = 'auto';
      });
    };
  }, [containerRef]);

  return { registerLayer };
}
```

## Opacity Falloff Pattern

Distance fades elements. Apply opacity based on depth:

```css
/* Atmospheric fade — further elements are more transparent */
.depth-bg    { opacity: 0.3; }
.depth-mid   { opacity: 1.0; }
.depth-fg    { opacity: 0.85; }

/* Interactive: on scroll proximity, background elements brighten slightly */
.depth-bg.in-view { opacity: 0.5; transition: opacity 2000ms ease; }
```

## Blur for Distance

Mimics camera depth-of-field:

```css
.depth-bg {
  filter: blur(4px);
  /* Use a blurred version of the image instead if performance is an issue */
}

.depth-mid {
  filter: none; /* always sharp — this is the focal plane */
}

.depth-fg-extreme {
  filter: blur(0.5px);
  /* very slight softness = "too close to focus" */
}
```

**Performance note**: `filter: blur()` is GPU-composited but can cause paint on Safari. For background images, prefer pre-blurred image assets over CSS blur.

## Implementation Checklist

When building a depth section:

- [ ] Container has `perspective` set (1000px–1500px)
- [ ] At least 2 layers with different `translateZ` values
- [ ] Background layer has reduced opacity AND blur
- [ ] Midground layer is the focal point (sharp, full opacity)
- [ ] Each layer moves at a different parallax speed
- [ ] Scale compensation is applied to translateZ layers
- [ ] `will-change: transform` is set and cleaned up
- [ ] `prefers-reduced-motion` is respected (flatten all layers)
- [ ] Test on Safari mobile — if blur is slow, use pre-blurred assets

## Depth Decision Tree

```
Does this section need spatial feeling?
├── No → flat layout is fine
└── Yes
    ├── Is there a background image/element?
    │   └── Yes → Layer 1: blur + low opacity + slow parallax
    ├── Is there primary content?
    │   └── Yes → Layer 2: sharp + full opacity + normal speed
    ├── Are there accent/framing elements?
    │   └── Yes → Layer 3: sharp + fast parallax or fixed
    └── Apply perspective container + translateZ offsets
```
