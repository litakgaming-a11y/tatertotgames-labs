---
name: Pinball Almanac
description: A screen-printed pinball flyer come to life, with electro-mechanical score reels and four seasonal tables in two inks each.
colors:
  navy: "#1d2340"
  navy-deep: "#141a33"
  paper: "#efe6d2"
  paper-shade: "#e4d8bd"
  rule: "#cbbd9c"
  ink: "#1d2340"
  ink-dim: "#4a4f68"
  ink-faint: "#857f70"
  vermilion: "#e4472f"
  vermilion-button: "#c7361f"
  marigold: "#f3b21f"
  teal: "#178f86"
  pink: "#d9487c"
  rail: "#e9e1cc"
  white: "#ffffff"
  paper-hover: "#f7f0e1"
  vermilion-hover: "#b32f1a"
  vermilion-press: "#8f2514"
typography:
  title:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "clamp(46px, min(15vw, 13vh), 120px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "clamp(34px, 7vw, 54px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "normal"
  reel:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "78% of the reel window"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  note:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  page-label:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  button:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  section:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  button-large:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  panel-title:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  final-score:
    fontFamily: "Bahnschrift, 'Roboto Condensed', 'Arial Narrow', sans-serif-condensed, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  control: "4px"
  panel: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-go:
    backgroundColor: "{colors.vermilion-button}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 30px"
    height: "54px"
  reel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    height: "44px"
  panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
    padding: "22px 20px 20px"
---

# Design System: Pinball Almanac

## Overview

Pinball Almanac is an old printed pinball flyer that plays. Every table is screen-printed: a deep navy ground with two flat inks laid on in bands, sunbursts and halftone dots, the second ink printed a fraction off register. Rails are cream, bumpers are cream caps with an ink ring, flippers are cream bats with rubber in the table's first ink, and the ball is the only chrome on the table.

The backglass is an electro-mechanical score display: eight reel windows that roll to each new digit, with a chime per step as the reels count up. Beside the reels there are only three readouts: ball, bonus multiplier and one line of news.

Between games the almanac is a flyer page on aged stock: the season's table printed as a preview, its six missions with stars, and the sockets you fit parts into.

## Colors

### Table inks
Each table uses navy plus two inks: County Fair vermilion `#e4472f` and marigold `#f3b21f`; Tidewater teal `#178f86` and marigold; Night Train vermilion and teal; Comet Year pink `#d9487c` and teal. The first ink marks the table's rules (letters, modes, slings, bumpers); the second marks shots, lanes and the drop bank.

### Neutral
- **Navy** `#1d2340` with deep `#141a33`, **paper** `#efe6d2` with shade `#e4d8bd`, **rule** `#cbbd9c`, **ink** `#1d2340` with dim `#4a4f68` and faint `#857f70`, **rail** `#e9e1cc`.

### Primary action
- **Vermilion button** `#c7361f` with white text: one per page (Open the almanac, Play, Resume, Play again).

### Named Rules
- **Lamps are designed unlit.** An unlit insert is its ink mixed 72% toward navy with a faint outline; lit is the full ink with a paper outline and white letter. Nothing glows.
- **Two inks a table.** No table introduces a third saturated colour.

## Typography

A condensed bold face for everything printed: Bahnschrift where Windows has it, Roboto Condensed on Android, Arial Narrow on Macs, the platform condensed sans elsewhere. Body copy in the almanac uses the system sans for reading. The title is set on a slight diagonal with a second-ink shadow offset three pixels, the way a two-colour print misregisters.

## Layout

Portrait: the backglass runs across the top (14% of the height, 92 to 128px) with the table name and buttons on one row, the reels centred below, and ball, bonus and news on the bottom line; the table fills the rest. Landscape: the table is centred at full height and the backglass becomes a column to its left, with a short control note at the foot. The almanac splits into preview and page: stacked in portrait, side by side in landscape.

## Elevation & Depth

Flat print. Objects on the table carry a hard dark offset beneath them (bumpers, rails, flippers, the ball) as a printed shadow; the interface itself has none. Screens sit on a 66% navy scrim.

## Shapes

4px corners on controls, 6px on panels. On the table: round bumpers and lamps, triangular slings and shot arrows, square reel windows.

## Components

### Backglass reels (signature)
Eight windows; blank leading windows are dark, used ones are paper with navy digits. A digit that changes slides in from below over 90ms.

### Inserts (signature)
Shot arrows in front of every ramp and orbit, letter lamps for the table's word, bonus 2x to 6x, three mode lamps, the lock, mode and extra-ball lamps at the saucer, shoot again, kickback.

### Almanac page
Heading in the table's first ink, one line on the season, best score, six missions each with a star, two sockets and a cabinet slot as segmented controls, and the Play button.

## Do's and Don'ts

### Do:
- Print everything in the table's two inks on navy.
- Show every lamp unlit as well as lit.
- Keep the backglass to score, ball, bonus and one line.

### Don't:
- Don't use a dot-matrix display, neon glows, lens flares or chrome beyond the ball.
- Don't add a third saturated ink to a table.
- Don't use emoji or glyph icons; pause, sound and arrows are drawn SVG.

The one repeating-gradient texture is the diagonal hatching on disabled controls, used the same way across the TaterTot games.
