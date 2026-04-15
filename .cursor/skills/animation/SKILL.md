# Skill: Animation — anime.js for Luxury Photography

## Purpose

This skill defines how to use anime.js to create emotional, performant animations for a luxury photography website. The goal is **feeling**, not **spectacle**.

## When to Use

- When implementing scroll-triggered reveals
- When sequencing element entrances
- When creating parallax effects
- When reviewing animation performance

## Core Library: anime.js

We use anime.js (v4+) as our animation engine. Not framer-motion. Not GSAP.

**Why anime.js:**
- Lightweight (~17KB minified)
- Clean timeline API
- No React wrapper needed — works with refs
- Performant: targets CSS transforms directly

## Installation

```bash
pnpm add animejs
```

```typescript
// anime.js v4 uses named exports
import { animate, createTimeline, utils } from 'animejs';
// animate() replaces anime({targets, ...})
// createTimeline() replaces anime.timeline()
// utils.stagger() replaces anime.stagger()
```

### v4 API differences from v3:
- `anime({ targets, ... })` → `animate(target, { ... })`
- `anime.timeline()` → `createTimeline()`
- `anime.stagger()` → `utils.stagger()`
- `easing` property → `ease` property
- Timeline `.add({ targets, ... }, offset)` → `.add(target, { ... }, timeOffset)`

## Animation Categories

### 1. Scroll Reveals (Primary Pattern)

Elements fade in and translate as they enter the viewport.

**Implementation pattern:**
```typescript
// hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface RevealOptions {
  translateY?: number;
  duration?: number;
  delay?: number;
  easing?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);
  const hasRevealed = useRef(false);

  const {
    translateY = 30,
    duration = 1000,
    delay = 0,
    easing = 'cubicBezier(0.16, 1, 0.3, 1)',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      el.style.opacity = '1';
      return;
    }

    // Set initial state
    el.style.opacity = '0';
    el.style.transform = `translateY(${translateY}px)`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true;

          animate(el, {
            opacity: [0, 1],
            translateY: [translateY, 0],
            duration,
            delay,
            ease: easing,
          });

          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [translateY, duration, delay, easing]);

  return ref;
}
```

**Usage:**
```tsx
function GalleryCaption({ text }: { text: string }) {
  const ref = useScrollReveal<HTMLParagraphElement>({
    translateY: 20,
    duration: 800,
    delay: 200,
  });

  return <p ref={ref} className="text-caption">{text}</p>;
}
```

### 2. Staggered Group Reveals

Multiple siblings animate in sequence.

**Implementation pattern:**
```typescript
// hooks/useStaggerReveal.ts
import { useEffect, useRef } from 'react';
import { animate, utils } from 'animejs';

interface StaggerOptions {
  stagger?: number;
  translateY?: number;
  duration?: number;
  easing?: string;
}

export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options: StaggerOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    stagger = 100,
    translateY = 25,
    duration = 900,
    easing = 'cubicBezier(0.16, 1, 0.3, 1)',
  } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      children.forEach((child) => {
        (child as HTMLElement).style.opacity = '1';
      });
      return;
    }

    // Set initial state
    children.forEach((child) => {
      (child as HTMLElement).style.opacity = '0';
      (child as HTMLElement).style.transform = `translateY(${translateY}px)`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(Array.from(children) as HTMLElement[], {
            opacity: [0, 1],
            translateY: [translateY, 0],
            duration,
            ease: easing,
            delay: utils.stagger(stagger),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [childSelector, stagger, translateY, duration, easing]);

  return ref;
}
```

### 3. Parallax (Light, CSS-Driven)

Parallax is a **subtle depth hint**, not a scroll-jacking experience.

**Rules:**
- Maximum parallax offset: 15% of section height
- Only ONE parallax layer per section
- Use `transform: translateY()` only — never `top` or `margin`
- Use `will-change: transform` on parallax elements
- Disable on mobile or reduce to 5% offset (less scroll distance available)

**Implementation:**
```typescript
// hooks/useParallax.ts
import { useEffect, useRef } from 'react';

export function useParallax<T extends HTMLElement>(
  speed: number = 0.1 // 0.05 to 0.15 range
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // Disable parallax on small screens
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const effectiveSpeed = isSmallScreen ? speed * 0.3 : speed;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (elementCenter - viewportCenter) * effectiveSpeed;

        el!.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}
```

### 4. Timeline Sequences (Page Openings)

For the initial page reveal — a choreographed entrance.

**Rules:**
- Total sequence duration: max 2 seconds
- No more than 4 steps in a sequence
- Each step uses the same easing family
- After the sequence plays, it never replays (session flag or once-only)

**Example — Homepage opening:**
```typescript
function useOpeningSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Just show everything immediately
      containerRef.current.style.opacity = '1';
      return;
    }

    const veil = containerRef.current.querySelector('.opening-veil') as HTMLElement;
    const img = containerRef.current.querySelector('.opening-image') as HTMLElement;
    const title = containerRef.current.querySelector('.opening-title') as HTMLElement;

    const tl = createTimeline({
      defaults: { ease: 'cubicBezier(0.16, 1, 0.3, 1)' },
    });

    tl.add(veil, { opacity: [1, 0], duration: 1200 }, 0)
      .add(img, { opacity: [0, 1], scale: [1.02, 1], duration: 1000 }, 600)
      .add(title, { opacity: [0, 1], translateY: [15, 0], duration: 800 }, 800);
  }, []);

  return containerRef;
}
```

## Performance Rules

### Do
- Use `transform` and `opacity` exclusively for animation properties
- Set `will-change: transform` on elements that will animate (remove after animation ends)
- Use `passive: true` on scroll listeners
- Use `requestAnimationFrame` for scroll-based calculations
- Disconnect `IntersectionObserver` after triggering
- Test on real iPhone (Safari is the bottleneck)

### Do Not
- Animate `filter`, `backdrop-filter`, `box-shadow`, `border-radius`
- Use `anime.js` for hover states (CSS transitions are faster)
- Run more than 2 anime.js instances simultaneously
- Use `will-change` on more than 3 elements at once
- Create scroll listeners without `passive: true`
- Forget to check `prefers-reduced-motion`

### Debugging Performance

```typescript
// Temporary: add to any component to check frame rate
useEffect(() => {
  if (process.env.NODE_ENV !== 'development') return;

  let frames = 0;
  let lastTime = performance.now();

  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      console.log(`FPS: ${frames}`);
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(tick);
  }

  const id = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(id);
}, []);
```

## Animation Decision Tree

```
Is the element entering the viewport for the first time?
├── Yes → useScrollReveal (fade + translateY)
│   ├── Is it part of a group? → useStaggerReveal
│   └── Is it an image? → CSS transition on filter (B&W → color)
│
├── Is this a page-level opening?
│   └── Yes → anime.timeline (max 2s, max 4 steps)
│
├── Is this a depth/spatial effect?
│   └── Yes → useParallax (max 15%, disabled on mobile)
│
├── Is this a hover/interaction state?
│   └── Yes → CSS transition only (no anime.js)
│
└── None of the above → Don't animate it.
```

## Easing Reference

| Name | Value | When to use |
|------|-------|-------------|
| Emerge | `cubicBezier(0.16, 1, 0.3, 1)` | Default for all reveals — fast start, gentle land |
| Quiet | `cubicBezier(0.87, 0, 0.13, 1)` | Slow in, slow out — for emphasis transitions |
| Sharp | `cubicBezier(0.76, 0, 0.24, 1)` | Decisive — for navigation or quick state changes |

**Never use:** `linear`, `ease`, `ease-in-out` (too generic), `spring` (wrong personality)
