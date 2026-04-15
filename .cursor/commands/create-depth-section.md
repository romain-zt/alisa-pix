# Command: Create a Section with 3D Depth Illusion

## Trigger

Use when asked to "create a section with depth", "add 3D feeling", or "make this section immersive".

## Steps

### Step 1 — Define Layers

Before writing any code, define the 3 depth layers:

```
Background layer:
  - What element? (atmospheric image, gradient, shape)
  - Blur: ___px
  - Opacity: ___
  - Parallax speed: ___x

Midground layer:
  - What element? (primary image, text block)
  - This is the focal point — full clarity
  - Parallax speed: 0.85x–1.0x

Foreground layer:
  - What element? (accent text, thin line, label)
  - Parallax speed: 1.1x–1.3x (or fixed)
```

### Step 2 — Assign Depth Values

Set the CSS perspective container and translateZ offsets:

```css
.depth-section {
  perspective: 1200px;
  perspective-origin: 50% 50%;
  position: relative;
  overflow: hidden;
  min-height: 120vh; /* depth sections need vertical space */
}

.layer-bg {
  position: absolute;
  inset: -10%; /* oversized to prevent edge gaps during parallax */
  transform: translateZ(-200px) scale(1.17);
  filter: blur(4px);
  opacity: 0.35;
  z-index: 1;
}

.layer-mid {
  position: relative;
  transform: translateZ(0);
  z-index: 10;
}

.layer-fg {
  position: absolute;
  transform: translateZ(80px) scale(0.93);
  z-index: 20;
}
```

### Step 3 — Apply Parallax Speeds

Use the `useParallaxLayer` hook (from parallax skill) or `useDepthScroll` (from depth-system skill):

```tsx
const bgRef = useParallaxLayer({ speed: 0.4 });
const midRef = useParallaxLayer({ speed: 0.9 });
const fgRef = useParallaxLayer({ speed: 1.2 });
```

### Step 4 — Apply Depth Cues

Layer the perceptual depth cues:

- **Blur**: background blurred, midground sharp, foreground sharp
- **Opacity**: background dim, midground full, foreground slightly transparent
- **Scale**: background large (compensated), foreground slightly reduced
- **Color temperature**: background cooler, foreground warmer

### Step 5 — Verify

Run through the checklist:

- [ ] 3 distinct depth layers visible
- [ ] Background is blurred and dim
- [ ] Midground is the clear focal point
- [ ] Layers move at different speeds on scroll
- [ ] At least 1 element overlaps another
- [ ] Section height is >= 120vh (gives parallax room to breathe)
- [ ] Performance: < 55fps → reduce blur or remove bg layer
- [ ] `prefers-reduced-motion`: layers flatten to single plane
- [ ] Mobile: parallax reduced to 30% of desktop values

## Output

A section component with:
- 3 depth layers
- CSS perspective + translateZ
- Scroll-driven parallax
- Blur/opacity depth cues
- Responsive and accessible
