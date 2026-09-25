---
name: Fire Season
description: A ranger's contour map where fire, lines and orders are drawn like pencil on a survey sheet.
colors:
  map-paper: "#edf0e8"
  form-paper: "#f6f7f2"
  rule: "#c9cdc3"
  ink: "#1c2120"
  ink-dim: "#545b57"
  ink-faint: "#858b86"
  signal: "#e2521c"
  signal-button: "#c2410c"
  fire: "#d8341c"
  retardant: "#d9677a"
  water: "#a9cde4"
  shoreline: "#4f8fbd"
  contour: "#a7784c"
  grass: "#e8e4c4"
  brush: "#c5d1a8"
  timber: "#a3c291"
  rock: "#d4d2cb"
  road: "#d95c45"
typography:
  title:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(38px, min(11vw, 13vh), 88px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "0.06em"
  clock:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.01em"
  body:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  form: "3px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
components:
  button:
    backgroundColor: "{colors.form-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.form}"
    padding: "0 16px"
    height: "44px"
  button-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.form-paper}"
  button-go:
    backgroundColor: "{colors.signal-button}"
    textColor: "#ffffff"
    rounded: "{rounded.form}"
    padding: "0 30px"
    height: "52px"
  crew-row:
    backgroundColor: "{colors.form-paper}"
    textColor: "{colors.ink}"
    height: "46px"
  panel:
    backgroundColor: "{colors.form-paper}"
    rounded: "{rounded.form}"
    padding: "18px"
---

# Design System: Fire Season

## Overview

Fire Season is a ranger's working map. The play surface is a survey-style contour map: fuel drawn as flat tints with small map symbols (tree dots, shrub marks, rock stipple), brown contours with every fifth one heavier, a red road cased in black, black squares for homes, a flag for the station and a 1 km scale bar. Everything the player does is drawn on the map the way a ranger marks a sheet: dashed pencil for planned line, solid black with ticks for cut line, pink for retardant.

The fire itself carries the state. Burning cells flicker orange and red, fresh burn is darkest and fades to ash over ninety minutes, and every edge of the fire is either red (still free to run) or held by black line. The day has three named states on the clock: Morning, Burn period, Laying down.

The player is planning under pressure on a phone or a laptop, often paused, so the world is light, high-contrast and quiet. The only saturated color is the signal orange, and it means fire, selection or the primary action.

## Colors

### Primary
- **Signal** (`#e2521c` on the map, `#c2410c` on filled buttons for contrast): fire edges, the selected crew's ring, the time needle, the primary action.

### Secondary
- **Retardant** (`#d9677a` at 42% over the map): air tanker drops, and nothing else.
- **Fire** (`#d8341c`, `#f08a24`): burning cells and the open fire edge.

### Neutral
- **Map paper** `#edf0e8`, **form paper** `#f6f7f2`, **rule** `#c9cdc3`, **ink** `#1c2120` with dim `#545b57` and faint `#858b86`.

### Map palette
Grass `#e8e4c4`, brush `#c5d1a8`, timber `#a3c291`, rock `#d4d2cb`, water `#a9cde4` with shoreline `#4f8fbd`, contour `#a7784c`, road `#d95c45` cased in `#2a2624`.

### Named Rules
- **Orange is fire.** Signal orange marks fire, the selected crew and the one primary action per screen. It never decorates.
- **Pink is air.** Retardant pink appears only where a tanker dropped.

## Typography

One workhorse sans stack (Segoe UI, system-ui, Roboto) for the whole game, because it is an Operate surface and the file loads nothing from the network. Hierarchy comes from weight (400, 600, 700, 800) and size; all figures use tabular lining numerals.

### Hierarchy
- **Title**: 800 weight, uppercase, 0.06em tracking, with "Season" in signal orange.
- **Clock**: 26px bold, the largest thing in the deck.
- **Heading**: 22px, 800 weight, for screen titles and the region name.
- **Body** 14px; **label** 11px with 0.04em tracking under stat figures and forecast hours.

## Layout

The map area and the deck split the viewport: portrait docks the deck at the bottom at 46% of the height (270 to 420px), landscape docks it right at 34% of the width (290 to 390px). The grid is generated to match the map area's shape (about 1,400 cells, 22 to 66 on a side) under a 58px forecast strip. Below 520px of height the deck compacts: smaller clock, tighter rows, 34px buttons.

## Elevation & Depth

Flat, like paper. Panels and buttons are defined by 1.5px ink borders; screens sit on a 55% ink scrim. No shadows anywhere.

## Shapes

3px corners on every rectangle. Crew markers use shape to show the kind of crew: circles for hand crews and hotshots, rectangles for engines, diamonds for dozers.

## Components

### Buttons
- **Button**: paper fill, 1.5px ink border, 44px. Pressing inverts to ink. Disabled is hatched with faint text.
- **Go**: filled signal orange with white text, once per screen (Report for duty, Respond, Back to station).

### Crew row (signature)
Marker, name, a live status line ("Cutting line, 7 to go", "Falling back") and a heat word. The selected row turns white and its marker gets an orange ring.

### Forecast strip (signature)
Eleven hourly slots from 10:00 to 20:00 with a wind arrow and speed, shaded by burn index along the bottom, an orange needle for now, and "?" beyond what the weather station can see.

### Radio line (signature)
One line under the stats: time in bold, then the message. Warnings turn orange for half an hour of game time.

### Stamp
The incident grade in a rotated orange circle; D and F are stamped in ink.

## Do's and Don'ts

### Do:
- Draw every order and state on the map as map symbology: dashed for planned, solid with ticks for cut, pink for retardant, red for an open fire edge.
- Keep the map light and let the fire be the only saturated area.
- Report events on the radio line in plain sentences, with the time.

### Don't:
- Don't add glows, blur or shadows; this is paper.
- Don't use orange for anything that is not fire, selection or the primary action.
- Don't use a colored side stripe to mark selection; ring the marker instead.
- Don't use emoji or text glyphs as icons; the pause, play and speaker icons are drawn SVG.
