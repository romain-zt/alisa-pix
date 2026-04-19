---
name: photograph
description: Reads a photograph the way a curator would — its light, its sound, its weather, its silence — and translates that feeling into creative briefs and into design tokens (color, depth, rhythm, motion) usable in this codebase. Use when the user references a photograph, mood image, film still, or wants UI/copy/imagery to carry a specific photographic atmosphere.
---

# Skill: Photograph — Reading & Translating the Image

## Purpose

A photograph is never just a picture. It is a temperature, a soundscape, a weight, a held breath. This skill teaches how to **read** a photograph across all senses, how to **brief** one that does not yet exist, and how to **translate** its feeling into the design language of this codebase (warm darkness, slow motion, soft edges, champagne accent).

## When to Use

- The user references a photograph, film still, or mood board image
- The user asks "what does this image feel like" / "make the page feel like this photo"
- The user wants to generate an image and needs a creative brief (camera, lens, light, mood)
- A section is being designed around a hero image and needs its tokens (color, motion, rhythm) to inherit the photo's feeling
- Copy needs to be written that lives next to a photograph and must not betray it

## The Three Acts

This skill always works in three passes. Skip none.

1. **READ** — describe what the photograph is doing across all senses
2. **BRIEF** — distill it into a shootable / generatable specification
3. **TRANSLATE** — convert the feeling into design tokens this codebase can use

---

## Act 1 — READ the photograph

A photograph speaks through eight registers. Address each one in 1–2 sentences. Be specific, sensory, and free of jargon. Never say "elegant", "beautiful", "stunning" — those are conclusions, not observations.

### 1. Light
- **Source**: window / candle / overcast sky / single bulb / reflected / unseen
- **Direction**: side / back / top / from below / wrapping / flat
- **Quality**: hard / soft / diffused / specular / smoky
- **Temperature**: tungsten 2700K / candle 1900K / north window 6500K / golden hour 3200K
- **Falloff**: fast (theatrical) / slow (dreamlike) / none (documentary)

### 2. Time
- Hour of day, season, century. A photo is always set in time.
- Is it the moment before, during, or after something happens?

### 3. Weather & Air
- Humidity, dust in the beam, smoke, breath visible, salt, pollen
- Is the air still or moving? Heavy or thin?

### 4. Sound
- What would you hear if you stepped inside the frame?
- Floorboard, distant traffic, a kettle, silk moving, breath, silence with tinnitus
- Volume in dB equivalent (a whisper, a library, a forest)

### 5. Smell
- Wax, wet stone, old paper, cedar, skin, rain on asphalt, espresso, none
- A photograph almost always implies a smell — name it

### 6. Texture & Weight
- Surfaces: silk / linen / plaster / brushed steel / aged paper / skin
- What would you feel under your hand? What is heavy in the frame?

### 7. Composition & Tension
- Where does the eye land first, and where does it travel?
- What is withheld? What is just outside the frame?
- Is the subject arriving or leaving?

### 8. Emotional Register
- One sentence, plain language. "She has just stopped speaking." "The room is waiting."
- Avoid adjectives — describe the situation.

### Output format for Act 1

```
LIGHT       — single north window, soft, 5500K, slow falloff into the room
TIME        — late winter afternoon, the hour before lamps go on
AIR         — still, slightly humid, dust visible in the beam
SOUND       — almost silent; a clock two rooms away, fabric settling
SMELL       — beeswax and cold stone
TEXTURE     — heavy linen, unpolished oak, the matte of unglazed ceramic
COMPOSITION — eye lands on the wrist, travels to the window, rests in shadow
REGISTER    — she has been here for hours and is not waiting for anyone
```

---

## Act 2 — BRIEF the photograph (for generation or shoot)

Use when an image needs to be created. Write briefs that a photographer or an image model can execute. Always include all eight fields.

```
SUBJECT     — what / who is in frame, in one line
SETTING     — location, era, surfaces around the subject
LIGHT       — source, direction, quality, temperature, key/fill ratio if relevant
LENS        — focal length, aperture (e.g. 50mm f/1.4, 85mm f/2, 35mm f/5.6)
FRAMING     — shot size (close / medium / wide), aspect ratio, where subject sits
PALETTE     — 3–5 named colors with hex if known, plus what is forbidden
MOOD        — one sentence in plain language (no adjective stacking)
GRAIN       — film stock equivalent (Portra 400 / Tri-X 400 / digital clean)
```

### Briefing rules

- Prefer **one** light source with intent over multi-light setups
- Aperture: shallow (f/1.4–f/2.8) for intimacy, mid (f/4–f/5.6) for stillness, deep (f/8+) for documentary
- Always name what is **not** in the image — what is excluded is half the brief
- For image models: write the brief as a single dense paragraph after the structured fields

---

## Act 3 — TRANSLATE the feeling into this codebase

The Vasilisa design system speaks in warm darkness, slow motion, soft edges, and champagne accent. A photograph entering the codebase must be translated into these dialects. Map each photographic property to a code property.

### Color translation

| Photograph quality | Token to touch | How |
|---|---|---|
| Warm light (≤3500K) | `--bg-silk`, `--bg-ember` | shift toward `#0d0907`, add radial micro-gradient from light source position |
| Cool light (≥5000K) | `--bg-silk` | hold at `#0d0b09` — never go cooler than this; warmth is non-negotiable |
| Dominant accent in photo | `--accent` | pull toward champagne family, desaturate to ≤15% saturation |
| High-contrast photo | text colors | use `--text-cream` on `--bg-shadow`, large size, generous tracking |
| Low-contrast / hazy photo | text colors | use `--text-whisper` or `--text-ghost`, smaller size, more space |

### Motion translation

| Photograph quality | Motion treatment |
|---|---|
| Stillness, held breath | 800–1200ms eases, no parallax, fade-only reveals |
| A moment caught mid-action | 500–700ms eases, gentle parallax (0.85x scroll), subtle scale on enter |
| Long exposure / blur | slow continuous drift, no hover snaps, mask reveals |
| Documentary / sharp | minimal motion, opacity-only transitions |

Always use the project's house easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

### Edge translation

A photograph never has a hard edge in this codebase. Choose the dissolve based on the photo's own falloff:

```css
.image-soft-edge {
  mask-image: linear-gradient(to bottom,
    transparent 0%, black 8%, black 92%, transparent 100%);
}
```

- Fast falloff in the photo → 4–6% mask stops (tighter dissolve)
- Slow falloff → 10–14% mask stops (longer fade into the surface)

### Depth & rhythm translation

- A photograph with **deep space** → echo with depth-system layering (background blur + foreground content)
- A photograph that is **flat / graphic** → flatten the section, remove parallax, increase rhythm of negative space
- A **loud** photograph (busy frame) → quieter typography, more space around it
- A **quiet** photograph → typography can carry more weight, copy can sit closer

### Copy translation

Copy that lives beside a photograph must obey the photograph's volume.

- A whispered photograph cannot carry a headline that shouts
- A documentary photograph should be paired with factual, unornamented copy
- A staged / theatrical photograph permits more lyrical copy
- Never describe the photograph in the copy. Let it speak.

---

## Output format for the user

When this skill is invoked, return in this order:

```
READ
[8-line sensory read]

BRIEF (only if an image is being created)
[8-line creative brief]

TRANSLATION
- Color: [tokens to touch and how]
- Motion: [duration, easing, reveal style]
- Edge: [mask values]
- Rhythm: [spacing / density]
- Copy: [tone constraints]

ONE LINE
[a single sentence the team can carry — the photograph's promise]
```

---

## Forbidden moves

- ❌ "Cinematic", "stunning", "elegant", "premium" — these are not observations
- ❌ Multi-light briefs unless explicitly justified (rim + key + fill by default = wrong)
- ❌ Cool color temperatures in translation — this codebase is always warm
- ❌ Hard edges, box shadows, sharp transitions in the translation step
- ❌ Describing the photo in the body copy that sits beside it
- ❌ Treating sound and smell as optional — they are how the photograph proves it is real

## The Photograph Test

Before approving the translation:

1. If the photograph were removed, would the section still feel like the photograph?
2. Could the copy live under this image without contradicting its silence?
3. Does the motion match the photograph's exposure time?
4. Is the warmest pixel in the page warmer than the warmest pixel in the photograph? (It should not be — the photo always leads.)
