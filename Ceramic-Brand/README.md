# Ceramic — Design System

The Ceramic design system, extracted from the ceramic.nyc source of truth (its `style.css`, Tailwind setup, and components) — exact to production. A standalone design reference for reuse and handoff.

## Contents

| File | What it is |
|---|---|
| **Ceramic Design System.html** | The living style guide — color, type, spacing, effects, components, logo usage, and voice. Open in a browser. Self-contained (fonts embedded). Click any color swatch to copy it. |
| **design-tokens.css** | CSS custom properties — drop-in for code updates to the site. |
| **design-tokens.json** | The same tokens as structured JSON — the portable format for design tools (Figma, Style Dictionary, etc.). |
| **Ceramic Accent Study.html** | Record of the accent decision — four candidates measured, D · Luminous `#a6e4f7` adopted. Kept so it can be revisited. |
| **ceramic-logo-white.svg** | Primary wordmark, white (for dark backgrounds). |
| **ceramic-logo-black.svg** | Alternate wordmark, black (for light backgrounds). |

> Brand guidelines and the PE/VC one-sheet are being workshopped in a separate session and are not kept here. PDFs removed for now — regenerate on request. Anything moved out sits in `_removed/`.

## The system in brief

- **Color** — Ink `#0d1212` canvas (a `#000→#111` gradient), a single light-blue accent `#a6e4f7`, white type at 100 / 80 / 40% opacity. Project accents: Arena `#ddff0e`, Rendevu `#ef5da8`, Alside `#e76e50`.
- **Type** — Encode Sans Condensed (600/700/800) for headlines and labels; Roboto Light (300) for body.
- **Spacing** — spacers 8/32/40; gutters 24/50/70/112/140; 80% centered content column.

All values are exact to production **except the accent**, deliberately updated 2026-08-05 from `#add8e6` to `#a6e4f7`. The live site still ships the old value and is pending update. The HTML renders offline — fonts embedded as base64.

## Dark-only

An "on light" section was drafted and removed on 2026-08-05 — it defined a light surface for a context that does not exist yet. The system is dark-first and now dark-only. If a light treatment is ever needed, design it against a real artifact; the one fact to carry forward is that the pale accent fails text contrast on white.
