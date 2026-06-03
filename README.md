# Handoff: Evaluation User Persona Profile

## Overview
A single-page **User Persona Profile** worksheet for a graduate program-evaluation course
(Vanderbilt Peabody College, LLO 8230). Students use it to describe a representative user
of the program being evaluated — capturing who that person is and what they need, so the
evaluation stays anchored to a real human whose change it will try to detect.

The worksheet captures four things:
1. **Identity** — name, role/title, an avatar, and a short first-person quote.
2. **What they need from the program** (surface, practical needs).
3. **Problems they think they have** (obstacles as the user perceives them).
4. **What's really driving them** (underlying *interests*, *motivations*, and *challenges*).

It ships in two parallel variants from the same component:
- **Completed Example** — pre-filled with a worked sample ("Maya R.", a newly promoted team lead).
- **Blank** — empty placeholders for students to fill in and export.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — prototypes
showing the intended look and behavior, **not production code to copy directly**. The task is to
**recreate these designs in the target codebase's existing environment** (React, Vue, Svelte,
etc.) using its established component and styling patterns. If no environment exists yet, choose
the most appropriate framework and implement there.

The prototype uses in-browser Babel + global `window.*` component registration purely so it can
run as a static file. A real implementation should use proper modules/imports and the host app's
state management — none of the `window.PersonaCore` / `window.WSCore` globals are meaningful in
production.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified.
Recreate the UI pixel-perfectly using the codebase's libraries. Exact tokens are in **Design
Tokens** below.

## Layout (the chosen design — "Option 2 / Portrait")

Two-column artboard authored at **1920 × 1080** (16:9), scaled to fit the viewport via a
`transform: scale()` wrapper. CSS grid: `grid-template-columns: 568px 1fr`.

### Left column — Dark identity panel
- `background: #1C1C1C` (warm black), `color: #F5F3EF` (cream).
- `padding: 52px 52px 44px`; vertical flex stack, `gap: 30px`.
- Contents top-to-bottom:
  1. **Eyebrow** — one line, no wrap: `VANDERBILT PEABODY COLLEGE — LLO 8230: PROGRAM EVALUATION`.
     `font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase`.
     "Vanderbilt Peabody College" in muted cream; "LLO 8230: Program Evaluation" in gold `#CFAE70`.
  2. **Avatar** — 172px circle. 2px ring; shows derived initials (Source-Serif italic) when a name
     exists, else a dashed ring with a head-silhouette SVG. On the dark panel the ring is gold
     `#CFAE70`, the fill is `rgba(207,174,112,0.10)`, initials are cream.
  3. **Kicker** — `THE PERSONA`, 12px / 700 / `letter-spacing: 0.2em` / uppercase, gold `#CFAE70`.
  4. **Name** — editable. 52px / 700 / `letter-spacing: -0.035em` / `line-height: 0.98`, cream.
  5. **Role** — editable. 20px / 500, gold `#CFAE70`, `margin-top: 12px`.
  6. **Quote block** — top hairline `1px solid rgba(245,243,239,0.18)`, `padding-top: 26px`.
     A large decorative `"` in `rgba(207,174,112,0.5)` (Source Serif, 92px), then the editable
     quote: Source Serif **italic** 28px / `line-height: 1.42`, color `#EDE7DB`.
  7. **Footer hint** (pushed to bottom via `margin-top: auto`) — a small camera SVG + caption
     "Drop in a real photo when you have one." at `rgba(245,243,239,0.55)`. The Blank variant also
     shows a "Sample" ribbon here only while still on the untouched example.

### Right column — Prompts
- `padding: 46px 56px 30px`; vertical flex, `gap: 18px`.
- **Header row** (`justify-content: space-between`):
  - Title "User Persona Profile." — sans 46px / 700 / `letter-spacing: -0.035em`, black, `white-space: nowrap`.
  - **Sample / Blank toggle** — two pill buttons (see Interactions).
- **Intro paragraph** — 15.5px / `line-height: 1.45`, ink `#2A2825`, `max-width: 1080px`:
  > "A persona turns an abstract "user" into one specific person the evaluation must serve. Sketch
  > a representative user of the program being evaluated — who they are, what they need from it, the
  > problems they perceive, and the deeper needs beneath the surface. Keep the end in mind: these
  > are the people whose change the evaluation will try to detect."
- **Three prompt cards** (`flex` column, `gap: 14px`). Each card: `1px solid #D8D2C5`,
  `border-radius: 16px`, `background: #fff`, `padding: 20px 24px 22px`.
  - **Card head**: a mono "tab" chip + an italic serif title (baseline-aligned, `gap: 14px`).
    - Tab chip: JetBrains Mono 12px / 600 / `letter-spacing: 0.06em`, text `#FBFAF7`,
      `background: #B49248` (deep gold), `padding: 4px 9px`, `border-radius: 6px`.
      The third card's tab uses `background: #1C1C1C` (black) to distinguish the "underlying" section.
    - Title: Source Serif **italic** 28px / 500 / `line-height: 1.08`, oak `#946E24`.
  - **Lead line**: 14px / `line-height: 1.4`, muted `#6F6A60`.
  - **Card 1 — tab `NEEDS`** · "What they need from the program" · lead "The practical outcomes and
    support this user is looking for." · an editable chip list (see Components).
  - **Card 2 — tab `PROBLEMS`** · "Problems they think they have" · lead "The obstacles as the user
    sees them — in their own words." · editable chip list.
  - **Card 3 — tab `UNDERLYING`** · "What's really driving them" · lead "The deeper interests,
    motivations, and challenges they may not name themselves." · three labeled facet rows
    (`grid-template-columns: 150px 1fr`): **Interests**, **Motivations**, **Challenges**, each its
    own editable chip list. Facet labels: sans 11.5px / 700 / `letter-spacing: 0.1em` / uppercase,
    deep gold `#B49248`.

## Components

### Editable text field
An inline contenteditable-style field. Empty state shows the placeholder via `::before`
(`content: attr(data-placeholder)`, italic, `color: currentColor` at `opacity: 0.42` on the dark
panel so it reads on both light and dark). Used for name, role, and quote.

### Editable chip list
A horizontal wrapping group of "chips" (rounded pill tokens), each an editable value with a
hover-reveal remove (×), plus an "Add …" affordance at the end. Enforces a min/max item count
(min 1; max 5–6 depending on the list). Chips: `border-radius: 999px`, sans 13px / 600,
`1.5px` border in rule `#D8D2C5`, hover tint `rgba(207,174,112,0.…)`.

### Avatar
Circle (172px on this variant). Derives up to two initials from the typed name and renders them
in Source-Serif italic; with no name, shows a dashed ring + head-silhouette SVG. A square variant
(rounded 18px) exists in the system but is not used in Option 2.

### Sample / Blank toggle
Two pill buttons in the header. "Sample" (+ icon) reloads the worked example; "Blank" (trash icon)
clears every field. Pills: `border-radius: 999px`, sans 12.5px / 600, `1.5px` border.

### Export button
A fixed top-right "Export PDF" button (hidden when printing/exporting). Triggers the browser print
path that emits a single-page PDF of the worksheet.

## Interactions & Behavior
- **Inline editing** — name, role, quote, and all chips are directly editable in place.
- **Chips** — add via the "Add" affordance, remove via a hover × (down to the minimum), edit text inline.
- **Sample / Blank toggle** — "Sample" loads the worked example and hides the sample ribbon; "Blank"
  empties all fields. Editing any field marks the sheet "touched" and hides the sample ribbon.
- **Sample ribbon** — shown only while the sheet still holds the untouched example
  ("Sample — edit any field to make it yours").
- **Persistence** — current field values persist to `localStorage` under a per-variant key
  (`ws.personaProfile.v2-example`, `ws.personaProfile.v2-blank`). In production, replace with the
  app's data layer.
- **Export to PDF** — single 1920×1080 page; print styles drop the scale transform, shadow, and
  hide the export button.
- **Responsive** — the artboard is fixed-aspect; a JS `fit()` scales the frame to
  `min(vw/1920, vh/1080)` and letterboxes on a dark background. Not a fluid/responsive layout — it's
  a fixed-canvas worksheet.

## State Management
Per worksheet instance:
- `name: string`, `role: string`, `quote: string`
- `needs: string[]`, `problems: string[]` (1–6 each)
- `interests: string[]`, `motivations: string[]`, `challenges: string[]` (1–5 each)
- `touched: boolean` — flips true on any edit; gates the sample ribbon.
- A `mode` prop (`"example" | "blank"`) chooses the initial dataset (worked sample vs. empty).
- Actions: `set(field, value)`, `setList(field, list)`, `loadExample()`, `clearAll()`.

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| black | `#1C1C1C` | dark panel bg, title text, "underlying" tab |
| ink | `#2A2825` | body text |
| cream | `#F5F3EF` | dark-panel text |
| paper | `#FBFAF7` | artboard bg, chip-on-gold text |
| sand | `#E0D5C0` | (accent block borders elsewhere in system) |
| gold | `#CFAE70` | avatar ring, kicker, role, eyebrow accent |
| deep-gold | `#B49248` | tab chips, facet labels |
| oak | `#946E24` | card titles (serif italic) |
| rule | `#D8D2C5` | hairlines, chip & card borders |
| muted | `#6F6A60` | lead lines, secondary text |
| quote text | `#EDE7DB` | quote on dark panel |
| card bg | `#FFFFFF` | prompt cards |

### Typography
- **Sans** — "Inter Tight" (fallbacks: Inter, system). Titles, names, chips, labels.
- **Serif** — "Source Serif 4" (fallback: Georgia). Card titles & quote — used **italic**.
- **Mono** — "JetBrains Mono" (fallbacks: ui-monospace, Menlo). Tab chips.
- Key sizes: name 52 · title 46 · quote 28 · card title 28 · role 20 · intro 15.5 · lead 14 ·
  chip 13 · footer hint 12.5 · kicker 12 · facet label 11.5 · eyebrow 10.5 (all px).
- `-webkit-font-smoothing: antialiased`; `font-feature-settings: "ss01","ss02","kern"`.

### Spacing / radii / misc
- Artboard 1920×1080; left column 568px.
- Card radius 16; chip/pill radius 999; tab chip radius 6; avatar 172 circle.
- Card border & hairlines 1px; field/chip borders 1.5px.
- Panel padding 52/52/44; right column padding 46/56/30.

## Assets
No external image assets. The avatar is a placeholder (CSS + inline SVG); replace with a real
photo upload in production. Icons (camera, +, trash, remove ×) are inline SVG. Fonts load from
Google Fonts (Inter Tight, Source Serif 4, JetBrains Mono) — swap to the host app's font pipeline.

## Screenshots
Reference renders are in `screenshots/`:
- `01-completed-example.png` — the chosen design (Option 2 / Portrait), filled-in worked example.
- `02-blank.png` — the same design in its empty state for students to fill in.
- `03-explorations-canvas.png` — all three explored directions side-by-side (Option 2 is the selected one).

## Files
Design-reference files in this bundle (all relative to the project root):
- `User Persona Profile — Completed Example.html` — entry point, example variant (`mode="example"`).
- `User Persona Profile — Blank.html` — entry point, blank variant (`mode="blank"`).
- `persona-v2.jsx` — **the chosen design (Option 2 / Portrait)**: layout, styles, component tree.
- `persona-core.jsx` — shared persona pieces: state hook + dataset, Avatar, Sample toggle, ribbon, eyebrow.
- `worksheet-core.jsx` — primitives reused from the course's worksheet system: Editable, Chip,
  EditableChipList, Blank, ExportButton.
- `styles.css` — design tokens (`--vu-*`, `--sans/--serif/--mono`) and editable-surface styles.
- `User Persona Profile — Explorations.html` + `persona-v1.jsx` / `persona-v3.jsx` — the two
  *alternative* directions (light "Profile" and "Dossier / field-notes"). Reference only — Option 2
  is the selected design.

> Note: this worksheet is part of a larger course visual system ("Vanderbilt-restrained worksheet
> system"). The tokens and `worksheet-core` primitives are shared with a sibling artifact
> (Pluralistic Program Description). Keep them centralized if implementing multiple worksheets.
