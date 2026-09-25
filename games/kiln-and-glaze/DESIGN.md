---
name: Kiln & Glaze
description: A pottery studio at night where the only saturated colour is fired glaze, beside a stack of index-card recipes.
colors:
  wall: "#353c40"
  wall-deep: "#262b2e"
  card: "#f4f5f2"
  card-shade: "#e9ecea"
  rule: "#d6dcdf"
  blue-rule: "#c9d7ea"
  card-top: "#e3a49c"
  ink: "#1e2a31"
  ink-dim: "#50606a"
  ink-faint: "#87949b"
  cobalt: "#2f55c0"
  cobalt-press: "#23439c"
  ember: "#f0a04b"
  bench: "#4a3f35"
  wheel: "#80878c"
  white: "#ffffff"
  card-white: "#fbfbf9"
  title-glaze: "#9fc9b4"
  mist: "#dfe4e6"
  link-rule: "#7f9be3"
  scrollbar: "#bcc6cb"
  scrim: "#14191c"
typography:
  title:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(40px, min(12vw, 13vh), 92px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
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
  recipe:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: "normal"
  label:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  micro:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  tagline:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  panel-title:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  control: "10px"
  card: "12px"
  panel: "14px"
  pip: "8px"
  thumb: "3px"
  round-button: "21px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "14px"
components:
  button:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
  button-go:
    backgroundColor: "{colors.cobalt}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 30px"
    height: "52px"
  recipe-card:
    backgroundColor: "#fbfbf9"
    rounded: "{rounded.card}"
    padding: "12px 14px"
  oxide-pip:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.pip}"
    height: "34px"
  panel:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.panel}"
    padding: "20px"
---

# Design System: Kiln & Glaze

## Overview

Kiln & Glaze is a working pottery studio at night. The scene is a slate studio wall in soft plaster blotches, a wooden bench, and whichever station the player is at: the wheel with its splash pan, the banding wheel and glaze bucket, the kiln under a firing trace, the finished-work shelf, or a pegboard of test tiles. Nothing in the scene is saturated except fired glaze, so every colour the player sees is one they made.

The side panel is a stack of index cards: pale card stock, a warm rule along the top edge, and blue ruling under the recipe lines so they read like a potter's notes. Recipes are written plainly, base first, then each oxide as a pass.

The kiln is the one place with heat. Its chamber glows from dull red to yellow-white as it climbs, and above it a graticule draws the firing as it happens: temperature in ember amber, the air in the kiln as a dimmer blue channel, the target cone as a dashed line.

## Colors

### Primary
- **Cobalt** (`#2f55c0`, pressed `#23439c`): the one action on each screen, the active tab underline, selection rings and the pull handle being dragged.

### Heat
- **Ember** (`#f0a04b`): the temperature trace, the cone line and the word "Second" on flawed pots. The kiln glow ramps from `#5a1a10` through `#b8341c` and `#f08a2a` to `#ffe0a0`.

### Neutral
- **Wall** `#353c40` to `#262b2e`, **bench** `#4a3f35`, **card** `#f4f5f2` with shade `#e9ecea`, **rule** `#d6dcdf`, **blue rule** `#c9d7ea`, **ink** `#1e2a31` with dim `#50606a` and faint `#87949b`.

### Glazes
The 36 glaze colours live in the game's glaze table (celadon `#a9c9b2`, tenmoku `#2a1a12` with rust `#9a5220`, copper red `#9e1f2a`, cobalt `#2446a8` and so on). They appear only on pots and test tiles.

### Named Rules
- **Colour is glaze.** Nothing in the interface competes with the pots; the UI stays slate, card and ink.
- **Cobalt is the action.** One cobalt button per screen.
- **Amber is heat.** Ember amber appears only for temperature and firing.

## Typography

One sans stack (Segoe UI, system-ui, Roboto) for the whole game, as the project loads nothing from the network. Hierarchy comes from weight (400, 600, 700, 800) and size. Recipe lines sit at a 26px line height so they rest on the card's blue ruling. Numbers are tabular.

## Layout

The scene and the card panel split the viewport: portrait docks the panel at the bottom at 47% of the height (280 to 460px), landscape docks it right at 36% of the width (300 to 420px). Each station lays itself out inside the scene area: the wheel sits on the bench at 80% of the height, the kiln sits under a graticule that takes a quarter of the height, the book board picks 6 or 9 columns by shape. On the title screen in landscape the shelf of pots moves to the right and the title reads down the left.

## Elevation & Depth

Flat, like card on a wall. Panels are defined by a 2px ink rule; screens sit on a 60% slate scrim. Depth in the scene comes from paint: a shadow ellipse under each pot, a left-light, right-dark shading on every pot, and the gloss highlight that only glossy glazes get.

## Shapes

10px on controls, 12px on cards, 14px on panels, 8px on oxide pips. Test tiles are square with a bare-clay strip along the bottom, as real test tiles are.

## Components

### Buttons
- **Button**: card fill, 1.5px ink border, 44px. Pressing inverts to ink and nudges down a pixel. Disabled is hatched with faint text.
- **Go**: filled cobalt with white text.

### Glaze card (signature)
Base as a segmented control, then one row per unlocked oxide with five pips (0 to 4), then the dip thickness. Each row is one pass of oxide, and the card shows every pass at once.

### Firing trace (signature)
A ten by four graticule. Temperature draws in amber, air in blue, the target cone as a dashed amber line. The readout sits in the lower left so it never meets the sound button.

### Test-tile board (signature)
36 tiles hung on a pegboard. A found glaze fills its tile with the fired colour over a strip of bare clay. An unfound glaze is a frosted pane; bought notes are written on the frost.

### Pot
Drawn from a four-point profile (foot, belly, shoulder, lip) through a smooth curve. Raw pots show throwing rings, glazed pots are chalky, fired pots carry their glaze pattern, surface and a bare foot.

## Do's and Don'ts

### Do:
- Let the glazes be the only colour in the scene.
- Write recipes and firings as plain sentences a potter would write.
- Show what went wrong on the pot itself, as a flaw and a "Second" mark.

### Don't:
- Don't add glows, blur shadows or gradient text to the interface.
- Don't use cobalt or amber for decoration.
- Don't use emoji or text glyphs as icons; the sound icons are drawn SVG and everything else is drawn on the canvas.
- Don't show a fired colour before the kiln opens; raw glaze looks chalky, as it does in a real studio.

The blue ruling and the disabled hatching are the two repeating-gradient textures here. The ruling is the index card itself and the hatching marks disabled controls; neither is surface decoration.
