# Command: Transform Linear Layout into Immersive Flow

## Trigger

Use when asked to "break the layout", "make it non-linear", "transform this into an experience", or when any section feels like a standard stacked layout.

## Steps

### Step 1 — Map Current Layout

Identify the current structure:

```
Current:
  Section 1 — [element A]
  Section 2 — [element B]
  Section 3 — [element C]
  Section 4 — [element D]
```

This is the enemy: predictable, linear, stacked.

### Step 2 — Break Alignment

Shift each element off the center axis. No two consecutive elements should share the same horizontal position:

```
Transformed:
  [element A] ← left-aligned, bleeds left edge
       [element B] ← center-right, overlaps A's bottom
  [element C] ← offset left, larger scale
            [element D] ← far right, partially cropped by viewport
```

Implementation:
```css
.flow-item:nth-child(odd)  { margin-left: 0; margin-right: auto; max-width: 65vw; }
.flow-item:nth-child(even) { margin-left: auto; margin-right: 0; max-width: 55vw; }
.flow-item:nth-child(3n)   { margin-left: 15vw; max-width: 70vw; }
```

### Step 3 — Add Overlapping

Elements must cross boundaries. Each major composition needs at least 1 overlap:

```css
.flow-item + .flow-item {
  margin-top: clamp(-4rem, -8vh, -8rem);
  position: relative;
}
```

For images overlapping text zones:
```css
.flow-image {
  position: relative;
  z-index: 5;
}
.flow-caption {
  margin-top: clamp(-2rem, -4vh, -4rem);
  position: relative;
  z-index: 10;
  padding-left: clamp(2rem, 6vw, 4rem);
}
```

### Step 4 — Add Breathing Spaces

Insert void zones between dense content:

```
[dense content] → [void: 30-50vh of nothing] → [next content]
```

Void zones are not empty — they are warm darkness with maybe a thin accent line or a single word:

```tsx
<div className="h-[40vh] flex items-center justify-center">
  <div className="w-[60px] h-[1px] bg-[#C4A88A] opacity-30" />
</div>
```

### Step 5 — Add Rhythm

Apply the rhythm pattern from the rhythm skill:

```
VOID    — 30vh breathing space
SPARSE  — 130vh, one image, parallax
VOID    — 40vh, background tone shift
DENSE   — 80vh, editorial grid
SPARSE  — 120vh, featured image
VOID    — 35vh, anticipation
```

Vary section heights to control pacing. Tall = slow, short = fast.

### Step 6 — Verify

- [ ] No two consecutive elements are at the same horizontal position
- [ ] At least 3 overlaps across the page
- [ ] At least 2 void zones (pure breathing space)
- [ ] Eye path is non-linear when tracing element centers
- [ ] At least 1 element is partially cropped by viewport edge
- [ ] Rhythm alternates between dense and sparse
- [ ] On mobile: overlaps reduce but don't disappear
- [ ] Scroll reveals surprise — you can't predict next element's position

## Output

A transformed layout that:
- Breaks the grid
- Has overlapping elements
- Includes breathing spaces
- Creates non-linear visual flow
- Feels like walking through a gallery, not scrolling a page
