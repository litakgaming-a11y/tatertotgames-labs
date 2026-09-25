---
name: Tide Pool
description: A naturalist's watercolor field journal beside a painted rock pool that the tide fills and drains.
colors:
  page: "#fafcfb"
  page-shade: "#eef4f4"
  wash: "#d9eaf0"
  rule: "#c6d8dc"
  ink: "#173a5e"
  ink-dim: "#3d5f7c"
  ink-faint: "#7f97a8"
  coral: "#e8553f"
  coral-button: "#c8402c"
  kelp: "#3f7a52"
  sea: "#1d4f6b"
  sand: "#d8c7a0"
  shelf: "#7e768a"
  pool-shallow: "#5fb1c9"
  pool-deep: "#1f6f8f"
typography:
  title:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(40px, min(12vw, 13vh), 92px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "0.02em"
  heading:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  latin:
    fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  label:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  pill: "22px"
  card: "14px"
  panel: "18px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "14px"
components:
  button:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  button-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.page}"
  button-go:
    backgroundColor: "{colors.coral-button}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "52px"
  resident-row:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    height: "52px"
  species-card:
    backgroundColor: "{colors.wash}"
    rounded: "{rounded.card}"
    padding: "12px 14px"
  panel:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.panel}"
    padding: "20px"
---

# Design System: Tide Pool

## Overview

Tide Pool is a naturalist's field journal kept beside a rock pool. The pool is painted, not drawn: wet sand in soft blots, a violet-grey rock shelf built from three layered washes, water that is pale at the edges and deep in the middle with pigment gathered along the rim the way watercolor dries. The creatures are small painted figures with an ink outline in a darker shade of their own color.

The journal is the working side. It is a pale page ruled in a light blue-grey, set in one workhorse sans, with Latin names in an italic book serif as a field guide would print them. Everything the player needs to decide is in plain sentences: who lives here, whether they are happy, and why not.

The tide is the clock. It floods across the whole scene as a translucent band with a white edge, and the tide clock at the top of the journal shows the moon, one day of tide as a curve, and a coral needle for now.

## Colors

### Primary
- **Coral** (`#e8553f` in the scene, `#c8402c` on filled buttons for contrast): the one action per screen, the tab underline, the selection ring around a creature, the tide needle and the watch marker's rim.

### Secondary
- **Kelp** (`#3f7a52`): only the "observed" pips and ticks, and the Happy mood chip.

### Neutral
- **Page** `#fafcfb`, **page shade** `#eef4f4`, **wash** `#d9eaf0` (selected rows and species cards), **rule** `#c6d8dc`, **ink** `#173a5e` with dim `#3d5f7c` and faint `#7f97a8`.

### Scene
Sand `#d8c7a0`, sea `#1d4f6b` to `#2f7e98`, shelf `#7e768a` in three washes, pool `#5fb1c9` to `#1f6f8f`. Each cove tints its water differently (Kelp Point greener, Reef Shelf bluer, Deep Channel darker).

### Named Rules
- **Coral is attention.** Coral marks the thing to press or the thing selected, never decoration.
- **Green is observed.** Kelp green only means something has been found, settled or watched.

## Typography

One sans stack (Segoe UI, system-ui, Roboto) for everything the player reads, so the file loads nothing from the network. The only other face is an italic book serif (Georgia, Palatino) for Latin names, because that is how a field guide sets them. Figures use tabular lining numerals.

### Hierarchy
- **Title**: 800 weight, "Pool" in coral.
- **Heading**: 16px 800 for species cards; 14px 700 for row names.
- **Body** 14px; secondary lines 12.5px in ink dim; **label** 11.5px under guide portraits.

## Layout

The pool area and the journal split the viewport: portrait docks the journal at the bottom at 44% of the height (260 to 420px), landscape docks it right at 36% of the width (300 to 420px). The scene is a 100 by 100 unit square fitted into the pool area. On the title screen in landscape the pool moves to the right 64% and the title reads down the left. Below 520px of height the journal compacts: a shorter tide clock, shorter tabs and rows.

## Elevation & Depth

Flat, like paper. The journal and panels are defined by a 2px ink rule and a page color; screens sit on a navy scrim at 50%. Depth in the scene comes from paint only: a soft shadow wash under stones and darker pigment at the pool rim. No box shadows or glows.

## Shapes

Pills (22px) for every button, 14px cards, 18px panels, circles for portraits, pips and the watch marker. Stones are irregular painted polygons; no two share a seed.

## Components

### Buttons
- **Button**: page fill, 1.5px ink border, 44px pill. Pressing inverts to ink and nudges down a pixel. Disabled is dotted with faint text.
- **Go**: filled coral with white text, once per screen (Go down to the shore, Back to the pool).

### Resident row (signature)
Portrait, name with a count, a plain reason line ("Needs more crevices.", "Out in the open with a hunter about.") and a mood chip: Happy in kelp green, Getting by in olive, Unhappy in coral red. Tapping it opens the species card above the list and rings the creature in the pool.

### Species card (signature)
Name, Latin name in italic serif, what it needs in one sentence, what is wrong now, and three observation ticks: found, settled, watched. The watched line becomes the recorded fact once seen.

### Guide entry (signature)
A circular portrait over the name and three pips. Undiscovered entries are drawn as a pale ghost silhouette named Unknown, so absence is designed too.

### Tide clock (signature)
The moon in its phase, one day of tide as a filled curve, a coral needle for now, the state of the water with a countdown on the left and the moon note on the right, which shortens and then gives way when the journal is narrow.

## Do's and Don'ts

### Do:
- Write every state as a sentence a naturalist would write.
- Keep the scene painterly: blots, washes, pigment at edges.
- Let the tide move across the whole scene.
- Draw what is missing: ghost entries, empty pips.

### Don't:
- Don't add glows, blur shadows or gradient text.
- Don't use coral for decoration.
- Don't use emoji or text glyphs as icons; the speaker icons are drawn SVG and the watch marker is drawn on the canvas.
- Don't add timers that nag; the tide is the only clock and nothing can be lost.
