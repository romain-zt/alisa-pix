# Command: Audit Experience Quality

## Trigger

Use when asked to "review the experience", "audit the quality", "is this good enough?", or before any major deployment.

## The Audit

Go through each section of the page and score against these criteria. Each question is binary: YES or NO. No middle ground.

---

### 1. ALIVENESS — Does It Feel Alive?

- [ ] Is there at least 1 element with continuous motion (parallax, slow drift)?
- [ ] Do different elements move at different speeds on scroll?
- [ ] Is there a sense that the composition breathes (scale shifts, opacity changes)?
- [ ] Does hover interaction feel responsive but unhurried (500ms+ transitions)?
- [ ] Would removing all motion make the page feel dead? (Must be yes)

**Score: ___ / 5**

If < 3: Add depth layers with parallax, add slow scroll-driven opacity or scale shifts.

---

### 2. IMMERSION — Does It Feel Immersive?

- [ ] Can you see at least 2 depth planes in the current viewport?
- [ ] Is there at least 1 blurred background element creating depth?
- [ ] Does some content extend beyond the viewport edge (creating mystery)?
- [ ] Is there overlap between elements (not everything in its own box)?
- [ ] Does scrolling feel like moving through space, not moving a page?

**Score: ___ / 5**

If < 3: Apply the depth system skill. Add translateZ layers, blur background, apply parallax speeds.

---

### 3. UNPREDICTABILITY — Is It Surprising?

- [ ] Would the user fail to predict where the next element appears?
- [ ] Are element horizontal positions varied (not always centered)?
- [ ] Is there at least 1 moment that breaks the established pattern?
- [ ] Does the rhythm change (dense → sparse → void alternation)?
- [ ] Is there asymmetry in the composition?

**Score: ___ / 5**

If < 3: Apply non-linear layout skill. Break the grid, stagger positions, add viewport edge crops.

---

### 4. LINEARITY — Is It Too Linear?

- [ ] Does the page NOT follow a simple top-to-bottom reading pattern?
- [ ] Is the eye path diagonal or zigzag (not straight down)?
- [ ] Are sections NOT uniformly spaced?
- [ ] Do elements enter from different directions (not all from below)?
- [ ] Is there NO visible section boundary (no borders, no clear separators)?

**Score: ___ / 5**

If < 3: Break section boundaries. Add overlaps, vary spacing, offset elements horizontally.

---

### 5. EMOTION — Does It Feel Sensual?

- [ ] Are all colors warm (no cool grays, no pure black, no pure white)?
- [ ] Are transitions slow and soft (no snapping, no instant changes)?
- [ ] Is there surface texture (noise, micro-gradients)?
- [ ] Do images have soft edges where they meet the background?
- [ ] Does the typography feel light and intimate (no bold, no shouting)?

**Score: ___ / 5**

If < 3: Apply sensual design skill. Warm colors, slow transitions, soft edges, surface texture.

---

### 6. PERFORMANCE — Is It Smooth?

- [ ] Does it hold 60fps on desktop Chrome?
- [ ] Does it hold 55fps on mobile Safari?
- [ ] Are all scroll listeners passive?
- [ ] Are images properly sized and lazy-loaded?
- [ ] Is `prefers-reduced-motion` respected everywhere?

**Score: ___ / 5**

If < 3: Apply performance guardian. Remove heavy effects, pre-blur images, reduce parallax layers.

---

## Final Verdict

**Total: ___ / 30**

| Score | Verdict |
|-------|---------|
| 25-30 | **Ship it.** This is an experience. |
| 20-24 | **Almost.** Fix the weakest category, then ship. |
| 15-19 | **Not ready.** Address the 2 lowest categories. |
| < 15  | **Start over.** This is a website, not an experience. Redesign from scratch using the layer model. |

## The Final Question

Look at the page as a whole and answer honestly:

**Does this look like a website, a template, or a landing page?**

→ If yes: **Delete and redesign.**

**Does this feel like a living visual world?**

→ If yes: **Keep.**
