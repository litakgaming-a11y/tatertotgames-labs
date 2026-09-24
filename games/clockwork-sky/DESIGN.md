---
name: Clockwork Sky
description: A working brass orrery drawn in fine engraving lines on a night-ink ground.
colors:
  night-ink: "#0c1322"
  night-ink-raised: "#111b31"
  deck: "#0a1020"
  deck-raised: "#0e1729"
  engraving: "#e2d6ba"
  text: "#ece3cc"
  text-dim: "#b8ad93"
  text-faint: "#7f7763"
  brass: "#d8a94e"
  brass-bright: "#f0c874"
  vermilion: "#e2573c"
  verdigris: "#74b8a8"
  cinder: "#c8674a"
  brine: "#4f9c9a"
  ochre: "#c99a45"
  frost: "#8fb5d6"
  heath: "#9d86b8"
  umbra: "#8a9a5e"
typography:
  plate:
    fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, 'Iowan Old Style', serif"
    fontSize: "clamp(30px, min(9vw, 12vh), 76px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.16em"
  heading:
    fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.08em"
  readout:
    fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.01em"
  body:
    fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  plate: "2px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
components:
  button-plate:
    textColor: "{colors.text}"
    rounded: "{rounded.plate}"
    padding: "0 16px"
    height: "44px"
  button-plate-active:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.deck}"
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.deck}"
    rounded: "{rounded.plate}"
    padding: "0 28px"
    height: "50px"
  tab:
    textColor: "{colors.text-dim}"
    typography: "{typography.label}"
    height: "42px"
  gear-knob:
    backgroundColor: "{colors.deck-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.round}"
    size: "44px"
  panel:
    backgroundColor: "{colors.deck}"
    rounded: "{rounded.plate}"
    padding: "20px"
---

# Design System: Clockwork Sky

## Overview

Clockwork Sky is a working astronomical instrument, not a game HUD. The play surface is an orrery on a graduated brass limb: engraved rings, roman hour numerals, a star drawn as ruled rays, and planets rendered like hand-tinted plate engravings. Every control belongs to the mechanism: a winding key charges the limb, a mainspring gauge shows load, gears are dials, and a one-minute track forecasts line-ups the way a sequencer's chase light shows where "now" is.

The world refuses the idle-game default of candy-colored chunky buttons, glowing counters and a shop list pasted over a cartoon backdrop. Motion comes only from the mechanism: planets turn, rays rotate with the drive, line-ups are ruled out from the star. Nothing bobs or pulses for attention.

The player's scene is a phone in the evening or a desktop tab left running, so the ground is dark and the contrast comes from cream engraving and brass.

## Colors

### Primary
- **Brass** (`#d8a94e`) and **Bright brass** (`#f0c874`): everything mechanical. Button plates, the limb, gear dials, the winding charge, lit stars on the chart, the active tab rule, three-planet line-ups.

### Secondary
- **Vermilion** (`#e2573c`): only line-ups of four or more planets and the overload zone of the mainspring gauge. It means "big" and nothing else.
- **Verdigris** (`#74b8a8`): ice, moons and anything bought with ice.

### Neutral
- **Night ink** (`#0c1322`, raised `#111b31`): the sky ground, vignetted to `#090e1b` at the edges.
- **Deck** (`#0a1020`, raised `#0e1729`): the instrument panel and screens.
- **Engraving** (`#e2d6ba` at 12 to 85% alpha): every line on the sky. **Text** `#ece3cc`, dim `#b8ad93`, faint `#7f7763`.

### Planet tints
Cinder `#c8674a`, Brine `#4f9c9a`, Ochre `#c99a45`, Frost `#8fb5d6`, Heath `#9d86b8`, Umbra `#8a9a5e`: muted watercolor tints, always under hatch shading and a cream outline.

### Named Rules
- **One brass.** Brass is the only accent for controls. A new control never gets a new color.
- **Vermilion is earned.** It appears only when four or more planets line up, or the spring is overloaded.

## Typography

One serif stack for the whole world (Georgia, Palatino, Book Antiqua), because engraved instrument plates are lettered in roman capitals. The file loads no fonts from the network, so a system serif is the constraint, not a choice; see Don'ts.

### Hierarchy
- **Plate** (title): regular weight, 0.16em tracking, sized by the smaller of width and height.
- **Heading** (screen titles): 22px, 0.08em tracking.
- **Readout** (light total): 26px with tabular lining numerals.
- **Body** 14px; **label** 12 to 12.5px with 0.04 to 0.06em tracking for tabs, sub-lines and notes.
- All numbers use `font-variant-numeric: tabular-nums lining-nums`.

## Layout

The sky and the deck split the viewport. Portrait: the deck docks at the bottom at 44% of the height (250 to 400px). Landscape (wider than 1.05 times the height): the deck docks right at 36% of the width (300 to 420px). The orrery centers in what remains, with 64px above for the readout and 34px below for the hint line, and its radius leaves 7% outside the limb for the hour numerals. Deck rows use 14px side padding and 10px vertical rhythm; sections separate with hairlines at 7 to 12% engraving alpha, never with cards.

## Elevation & Depth

Flat. Depth comes from line weight and alpha, not shadows. Screens sit on a 74% night scrim with a single 1px brass-tinted edge. The only soft light in the world is the star's own radial glow on the canvas.

## Shapes

2px corners on every rectangle (plates, panels, tabs, chips). Circles for planets, moons, gear knobs, seals and chart stars. No pills.

## Components

### Buttons
- **Plate**: 1px brass border, cream text, 44px tall. Hover washes brass at 12%. **Pressing inverts** to a solid brass plate with deck-colored text. **Disabled is hatched**: a 135 degree engraving hatch, faint border and faint text.
- **Primary plate**: solid brass with deck text, 50px, used once per screen (Wind the sky, Collect).

### Navigation
Four equal tabs under the track. The active tab gets cream text and a 2px brass rule under its middle half; a small brass dot marks a tab with something new.

### Gear dial (signature)
Two drawn chevrons around a 44px knob with a dotted brass rim (the teeth). The knob shows the gear as `p:q`; a brass notch rotates to the gear's position in the owned set.

### Line-up track (signature)
A canvas strip one minute wide. Pairs are 5px faint brass ticks; three planets get a brass post with a dot; four or more get a vermilion post. The heading names the biggest line-up ahead.

### Mainspring gauge (signature)
A half-dial with brass graduations, a vermilion arc past capacity, and a needle that trembles when overloaded.

### Seals
Logbook entries carry a 32px round seal with a double brass rim once observed, hatched and faint before.

## Do's and Don'ts

### Do:
- Draw every sky element as a line or a flat tint with hatch shading; keep engraving alpha low and let brass carry emphasis.
- Tie motion to the mechanism: rotation speed follows the drive, line-ups rule outward from the star in 0.3s and fade.
- Show state through the control itself: inverted when pressed, hatched when unaffordable, dotted when not yet owned.

### Don't:
- Don't add glows, outer halos or drop shadows to controls; the star is the only light source.
- Don't introduce a second accent color for a new feature.
- Don't use Unicode glyphs or emoji as icons; draw them as 1.5px-stroke SVG like the mute and dial chevrons.
- Don't treat the system serif as the ideal: it is the file's no-network constraint. If a self-hosted face can ever be embedded, a real engraved roman should replace it for the plate lettering.
