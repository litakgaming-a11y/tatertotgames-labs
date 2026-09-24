# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Casual players on phones and desktops. They arrive from the TaterTot Labs site or from YouTube Playables and play in short sessions, often one-handed on a phone, sometimes coming back later to check on progress.

## Product Purpose

TaterTot Labs is a collection of small free browser games from TaterTot Games (tatertotgames.com). Each game is built around one idea you can learn in a few seconds, with deeper progression underneath that rewards coming back. Success is a player who understands the game at a glance and returns to it.

## Positioning

Every game is a single self-contained HTML file that loads almost instantly, needs no install and works with touch or mouse at any screen shape, with a real meta layer under a one-touch hook.

## Operating Context

Played in the browser from the hub site (tatertotgames-labs.pages.dev) and, through a build step in playables/, as YouTube Playables. Sessions are short and interrupted; games pause when hidden and save progress locally (cloud saves on YouTube).

## Capabilities and Constraints

- One HTML file per game, inline script plus the site's analytics tag; no network calls, no external fonts or libraries, no iframes, alert, eval or workers.
- Must work from 9:32 to 32:9, portrait and landscape, touch and mouse.
- Must pass YouTube Playables certification through playables/build.py and playables/qa.mjs (pause, mute, saves, no off-screen or ghost controls).
- Analytics events are whitelisted in functions/_shared.js; new games must be added there.

## Brand Commitments

- Studio name: TaterTot Games. The site shows tatertotgames.com at the top and bottom of every page, and each game carries a tatertotgames.com badge.
- Games are called by their titles, never "prototypes".
- Copy is short, plain and human. No em dashes anywhere.

## Evidence on Hand

Real gameplay screenshots in assets/shots/, Codex-generated key and title art in assets/art/ and dist/art/. There are no player numbers, reviews or press to quote; none may be invented.

## Product Principles

1. Learnable in seconds: the core action is obvious on the first screen.
2. Depth underneath: every game has a meta layer worth returning to.
3. Instant and self-contained: nothing to load, nothing to install.
4. Honest and human: no invented claims, no filler copy.
