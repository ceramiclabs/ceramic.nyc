# Ceramic — Design Audit

**Date:** 2026-09-01
**Primary source:** `src/` (every component, `style.css`, `index.html`, `tailwind.config.js`)
**Secondary source:** `Ceramic-Brand/` (`design-tokens.css`, `design-tokens.json`, `Ceramic Design System.html`, `Ceramic Accent Study.html`, `README.md`)

Every value below was read out of the source. Where the source and the brand docs disagree, the source wins and the discrepancy is called out in §11. Claims about what the browser actually renders were verified by compiling the stylesheet (`tailwindcss -c tailwind.config.js -i src/style.css`) and inspecting the output, not by reading the JSX alone.

---

## 1. Executive summary

The design system on paper is tight — one accent, two families, a clean spacer/gutter scale. The design system **as it renders** is a different thing. Five build-level breaks mean a large share of the documented system never reaches the browser:

| #     | Break                                                              | Effect                                                                                                                                  | Evidence                              |
| ----- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **A** | Google Fonts URL for the display family is malformed               | **Encode Sans Condensed never loads at all.** Request returns HTTP 400                                                                  | `src/index.html:21`                   |
| **B** | `@theme {}` (Tailwind v4 syntax) in a Tailwind **v3.4.17** project | Block is passed through verbatim and ignored by the browser. `font-display`, `bg-light-blue`, `--animate-fadein` never become utilities | `src/style.css:24-42`, `package.json` |
| **C** | `font-display` utility does not exist                              | Every heading falls back to the body stack — which is itself wrong (see D)                                                              | `title.tsx:16,49`, `blurbs.tsx:62,91` |
| **D** | `@apply font-sans` resolves to Tailwind's _default_ `font-sans`    | `ui-sans-serif, system-ui, …` — **Roboto is loaded but never applied to anything**                                                      | `style.css:101`                       |
| **E** | `box-sizing: inherit` overrides Preflight's `border-box`           | Root has no `border-box` to inherit → whole document computes as `content-box`                                                          | `style.css:123-129`                   |

Net effect: **the site currently renders entirely in the OS system sans-serif.** Neither brand typeface is in use. Every type token in `Ceramic-Brand/` is describing a rendering that does not happen.

Everything else in this audit — the hardcoded colors, the one-off widths, the duplicated glow strings — is ordinary drift and is individually minor. §1 is the part that matters.

---

## 2. Color — every literal in the source

### 2.1 Declared tokens (`src/style.css:5-22`)

| Token                | Value     | Used at                                                      |
| -------------------- | --------- | ------------------------------------------------------------ |
| `--color-blue-black` | `#0d1212` | `style.css:113` (`body` background-color)                    |
| `--color-light-blue` | `#add8e6` | `style.css:175` (`.blue`), `blurbs.tsx:63` (inline fallback) |
| `--color-grey-300`   | `#444`    | **never used**                                               |

### 2.2 Hardcoded hex — outside the token layer

| Value           | File:line                           | Context                    | Note                                                                                                                                                      |
| --------------- | ----------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#000` → `#111` | `style.css:114`                     | `body` background gradient | Two raw hexes; not tokenized                                                                                                                              |
| `#ddff0e`       | `arena-case-study.tsx:6`            | `HIGHLIGHT_COLOR` const    | Arena accent                                                                                                                                              |
| `#ddff0e`       | `section-nav.tsx:15`                | `customColor`              | **Same value, second literal**                                                                                                                            |
| `#ef5da8`       | `rendevu-case-study.tsx:6`          | `HIGHLIGHT_COLOR` const    | Rendevu accent                                                                                                                                            |
| `#ef5da8`       | `section-nav.tsx:16`                | `customColor`              | **Same value, second literal**                                                                                                                            |
| `#e76e50`       | `alside-case-study.tsx:6`           | `HIGHLIGHT_COLOR` const    | Alside accent                                                                                                                                             |
| `#e76e50`       | `section-nav.tsx:14`                | commented out              | Dead                                                                                                                                                      |
| `#4F46E5`       | `sales-chart.tsx:84`                | `fill \|\| "#4F46E5"`      | **Indigo. Off-palette entirely** — not in any brand doc. Unreachable in practice (only caller passes a fill) but it is the component's documented default |
| `#fff`          | `src/assets/ceramic-logo.svg`       | `.cls-1 { fill: #fff }`    | Baked into the SVG; cannot be recolored via `currentColor`                                                                                                |
| `#000`          | `src/assets/ceramic-logo-black.svg` | `fill:#000`                | Same                                                                                                                                                      |

Each project accent is written **twice** — once in the case-study component, once in `section-nav.tsx`. There is no shared constant. Changing Arena's lime requires two edits in two files.

### 2.3 Hardcoded `rgb()` / `rgba()`

| Value                                | File:line               | Context                                                                                    |
| ------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------ |
| `rgb(173, 216, 230)`                 | `section-nav.tsx:70`    | Active dot fill (default)                                                                  |
| `rgba(173, 216, 230, 0.6)`           | `section-nav.tsx:75`    | Dot glow, inner                                                                            |
| `rgba(173, 216, 230, 0.3)`           | `section-nav.tsx:79`    | Dot glow, outer                                                                            |
| `rgba(173, 216, 230, 0)`             | `section-nav.tsx:81`    | Glow, off-state                                                                            |
| `rgb(173, 216, 230)`                 | `chevron-button.tsx:77` | Icon color on hover                                                                        |
| `rgba(173, 216, 230, 0.6)`           | `chevron-button.tsx:70` | Chevron glow, inner                                                                        |
| `rgba(173, 216, 230, 0.3)`           | `chevron-button.tsx:70` | Chevron glow, outer                                                                        |
| `rgba(173, 216, 230, 0)`             | `chevron-button.tsx:71` | Glow, off-state                                                                            |
| `rgba(255, 255, 255, 0.1)`           | `chevron-button.tsx:67` | Chevron bg, hover                                                                          |
| `rgba(255, 255, 255, 0.05)`          | `chevron-button.tsx:68` | Chevron bg, rest                                                                           |
| `rgba(255, 255, 255, 0.4)`           | `section-nav.tsx:84`    | Dot, hover                                                                                 |
| `rgba(255, 255, 255, 0.2)`           | `section-nav.tsx:71`    | Dot, inactive                                                                              |
| `rgba(255, 255, 255, 0.2)`           | `style.css:199, 211`    | Scrollbar thumb (×2)                                                                       |
| `rgb(255, 255, 255)`                 | `chevron-button.tsx:77` | Icon color at rest                                                                         |
| `rgba(0,0,0,0)` → `rgba(0,0,0,0.75)` | `style.css:154-158`     | Noise vignette                                                                             |
| `#add8e6` decimal is `173,216,230`   | —                       | **The accent is written as a hex once and as an rgb triple eight times.** No single source |

### 2.4 Opacity utilities (Tailwind, resolved)

| Class             | File:line                                        | Computes to                                     |
| ----------------- | ------------------------------------------------ | ----------------------------------------------- |
| `text-white/80`   | `blurbs.tsx:70`                                  | `rgb(255 255 255 / 0.8)` — body copy            |
| `text-white/40`   | `footer.tsx:4`                                   | `rgb(255 255 255 / 0.4)` — legal                |
| `bg-white/5`      | `section-nav.tsx:41,49`; `chevron-button.tsx:62` | `rgb(255 255 255 / 0.05)` — glass fill          |
| `border-white/10` | `section-nav.tsx:41,49`; `chevron-button.tsx:62` | `rgb(255 255 255 / 0.1)` — glass border         |
| `bg-white/20`     | `section-nav.tsx:64`                             | `rgb(255 255 255 / 0.2)` — dot, null-state only |
| `shadow-black/20` | `section-nav.tsx:42,50`                          | `rgb(0 0 0 / 0.2)` — glass shadow color         |

The **same glass surface** is expressed two ways in the same component tree: as Tailwind classes on the container (`bg-white/5 border-white/10`) and as raw `rgba()` strings inside a Framer `animate` prop (`chevron-button.tsx:67-68`). They agree today by coincidence.

### 2.5 The dead tint

`sections.tsx:36` passes `backgroundColor="bg-light-blue/70"` into `<ScrollSection>`, which forwards it to `<Noise>`, which applies it as **`style={{ backgroundColor }}`** (`noise.tsx:7`).

A Tailwind class name is being used as a CSS property _value_. `background-color: bg-light-blue/70` is invalid and is dropped by the browser. Two independent failures stacked: the class wouldn't exist anyway (break B), and it isn't being used as a class. **The Product section's blue tint has never rendered.**

---

## 3. Typography — families & loading

### 3.1 What is requested (`src/index.html:20-21`)

```html
<link
  ...
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
/>
<link
  ...
  href="https://fonts.googleapis.com/css2?family=Encode+Sans+Condensed:wght@600,700,800&display=swap"
/>
```

| Request                           | Status                            |
| --------------------------------- | --------------------------------- |
| Roboto 300                        | **HTTP 200** — loads fine         |
| Encode Sans Condensed 600,700,800 | **HTTP 400 — "Invalid selector"** |

The `css2` API requires semicolons between weights (`wght@600;700;800`). Commas are rejected. **The display family is never fetched.**

### 3.2 What is applied

| Declaration                                           | File:line                             | Resolves to                                                                                                               |
| ----------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--font-sans: "Roboto", Helvetica, sans-serif`        | `style.css:25` (inside `@theme`)      | **Ignored** — v4 syntax in a v3 build                                                                                     |
| `--font-display: "Encode Sans Condensed", sans-serif` | `style.css:26` (inside `@theme`)      | **Ignored** — same                                                                                                        |
| `@apply font-sans` on `html, body`                    | `style.css:101`                       | `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", …` — Tailwind's **default**, not Roboto                       |
| `font-display` class                                  | `title.tsx:16,49`; `blurbs.tsx:62,91` | **Utility not generated.** No font-family applied; inherits the system stack                                              |
| `.encode-extrabold`                                   | `style.css:93-97`                     | Correct rule (`Encode Sans Condensed`, 800) — but the class is **never used by any component**, and the font isn't loaded |

**Result: Roboto is downloaded and never used. Encode Sans Condensed is never downloaded. Everything renders in the OS system sans.**

### 3.3 Weights requested by the markup

| Weight | Class               | File:line                                                                                         | Loaded?                                 |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 100    | `font-thin`         | `blurbs.tsx:91` (Standfirst)                                                                      | No — nothing near it is loaded          |
| 300    | `font-light`        | `blurbs.tsx:70` (body)                                                                            | Roboto 300 ✓ (but Roboto isn't applied) |
| 400    | `!font-normal`      | `rendevu-case-study.tsx:28`                                                                       | No                                      |
| 500    | `font-weight: 500`  | `style.css:180` (`.smaller`)                                                                      | No                                      |
| 500    | `font-medium`       | `alside-case-study.tsx:33`                                                                        | No                                      |
| 600    | `font-semibold`     | `blurbs.tsx:62`; `sections.tsx:17,44,73`; `alside-case-study.tsx:54`; `rendevu-case-study.tsx:41` | Requested but 400'd                     |
| 700    | `font-bold`         | `title.tsx:16,49`                                                                                 | Requested but 400'd                     |
| 800    | `.encode-extrabold` | `style.css:95`                                                                                    | Requested but 400'd; class unused       |

Eight distinct weights are asked for across the codebase. **One** (Roboto 300) actually arrives, and it lands on nothing.

---

## 4. Typography — every size, leading and tracking

### 4.1 Set in `title.tsx` (arbitrary values)

| Element             | Property       | Mobile                        | Desktop (`lg:`)                 | Line   |
| ------------------- | -------------- | ----------------------------- | ------------------------------- | ------ |
| `Title` (`<h2>`)    | font-size      | `text-[5rem]` = 80px          | `lg:text-[10rem]` = 160px       | 16, 17 |
|                     | line-height    | `leading-[.75em]`             | (inherits)                      | 16     |
|                     | letter-spacing | `tracking-[-0.3rem]` = −4.8px | (inherits)                      | 16     |
|                     | max-width      | —                             | `lg:max-w-[60%]`                | 17     |
| `Subtitle` (`<h3>`) | font-size      | `text-[2.5rem]` = 40px        | `lg:text-[6rem]` = 96px         | 49, 50 |
|                     | line-height    | `leading-[.9em]`              | `lg:leading-[.8em]`             | 49, 50 |
|                     | letter-spacing | `tracking-[-0.1rem]` = −1.6px | `lg:tracking-[-0.25rem]` = −4px | 49, 50 |
|                     | border         | `border-b border-stone-700`   |                                 | 51     |
|                     | padding-bottom | `pb-9` = 2.25rem / 36px       |                                 | 51     |
|                     | margin-top     | `mt-4` = 1rem / 16px          |                                 | 51     |

**Tracking is set in `rem`, against a font-size that changes.** Converted to `em`:

|                   | Font size | Tracking (rem) | Effective `em` |
| ----------------- | --------- | -------------- | -------------- |
| Title, mobile     | 80px      | −0.3rem        | **−0.060em**   |
| Title, desktop    | 160px     | −0.3rem        | **−0.030em**   |
| Subtitle, mobile  | 40px      | −0.1rem        | **−0.040em**   |
| Subtitle, desktop | 96px      | −0.25rem       | **−0.042em**   |

Two consequences: the 80px mobile title is tracked **twice as tight** as the 160px desktop title, and the 96px subtitle is tracked **tighter than the 160px title above it**. Tracking should open as type shrinks; here it closes.

### 4.2 Set in `blurbs.tsx`

| Element     | Property    | Mobile                                        | Desktop                              | Line   |
| ----------- | ----------- | --------------------------------------------- | ------------------------------------ | ------ |
| Blurb label | font-size   | `text-xs` = 0.75rem / lh 1rem                 | `lg:text-sm` = 0.875rem / lh 1.25rem | 62     |
|             | weight      | `font-semibold` (600)                         |                                      | 62     |
|             | color       | `highlightColor` ?? `var(--color-light-blue)` |                                      | 63     |
| Blurb body  | font-size   | `text-xs`                                     | `lg:text-sm`                         | 54, 56 |
|             | weight      | `font-light` (300)                            |                                      | 70     |
|             | line-height | `leading-normal` (1.5)                        |                                      | 70     |
|             | wrap        | `text-balance`                                |                                      | 70     |
| Standfirst  | font-size   | `text-xl` = 1.25rem / lh 1.75rem              | `lg:text-2xl` = 1.5rem / lh 2rem     | 91     |
|             | weight      | `font-thin` (100)                             |                                      | 91     |

`text-balance` is applied to **body copy** (`blurbs.tsx:70`) — the one place the brand doc says to use `pretty` instead, since `balance` is capped at ~6 lines by browsers. It is applied to **no headings**, which is where it belongs.

### 4.3 Set in `style.css`

| Rule         | Value                                                                       | Line    |
| ------------ | --------------------------------------------------------------------------- | ------- |
| `.smaller`   | `font-size: 0.2em` — relative to `Title`, so **16px mobile / 32px desktop** | 178-182 |
| `.smaller`   | `font-weight: 500`; `letter-spacing: 0`                                     | 180-181 |
| `footer div` | `font-size: 10px`                                                           | 192-194 |

`.smaller` is used once, on the contact email inside a `Title` (`sections.tsx:67`). Its size is an `em` multiplier of a responsive parent — it is legible on desktop and marginal at 16px on mobile.

### 4.4 Full font-size inventory (rendered px)

`10px` (footer) · `12px` (blurb, mobile) · `14px` (blurb, `lg`) · `16px` (`.smaller`, mobile) · `20px` (standfirst, mobile) · `24px` (standfirst, `lg`) · `32px` (`.smaller`, `lg`) · `40px` (subtitle, mobile) · `80px` (title, mobile) · `96px` (subtitle, `lg`) · `160px` (title, `lg`)

Eleven steps, four of them arbitrary one-offs, none of them named. There is no type scale in code — only `text-xs`/`sm`/`xl`/`2xl` from Tailwind plus five bracket values.

---

## 5. Spacing

### 5.1 Declared tokens — all unused

`src/style.css:10-21` declares a full spacing system. **Not one of these variables is referenced by any component or any other CSS rule.**

| Token               | Value                                              | Consumers                                                                     |
| ------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `--spacer-sm`       | `8px`                                              | none                                                                          |
| `--spacer-md`       | `32px`                                             | none                                                                          |
| `--spacer`          | `40px`                                             | none                                                                          |
| `--gutter-sm`       | `24px`                                             | `--container-width` only                                                      |
| `--gutter`          | `50px`                                             | `--max-width` only                                                            |
| `--gutter-md`       | `70px`                                             | none                                                                          |
| `--gutter-lg`       | `112px`                                            | none                                                                          |
| `--gutter-xl`       | `140px`                                            | none                                                                          |
| `--container-width` | `calc(100% - (var(--gutter-sm) * 2))`              | none                                                                          |
| `--max-width`       | `calc(var(--screen-xl-min) - (var(--gutter) * 2))` | none — **and `--screen-xl-min` is never defined**, so the `calc()` is invalid |
| `--gutter-auto`     | `calc((100vw - var(--max-width)) / 2)`             | none — invalid by inheritance from `--max-width`                              |

The layout is instead built from Tailwind's default scale plus `max-w-[80%] xl:max-w-[70%]`, repeated literally in four files.

### 5.2 Spacing actually in use

| Class                             | Computed | File:line                                                         |
| --------------------------------- | -------- | ----------------------------------------------------------------- |
| `gap-2`                           | 8px      | `blurbs.tsx:54`                                                   |
| `gap-6`                           | 24px     | `blurbs.tsx:15`; `section-nav.tsx:53`                             |
| `gap-8`                           | 32px     | `case-study-section.tsx:45`; `blurbs.tsx:15` (`lg:`)              |
| `gap-16`                          | 64px     | `scroll-section.tsx:23`                                           |
| `lg:gap-20`                       | 80px     | `scroll-section.tsx:24`; `case-study-section.tsx:46`              |
| `mb-2`                            | 8px      | `blurbs.tsx:87`                                                   |
| `mt-4`                            | 16px     | `title.tsx:51`                                                    |
| `mt-6` / `-mt-6`                  | ±24px    | `sections.tsx:71` (`lg:`); `case-study-section.tsx:65` (negative) |
| `lg:mt-8`                         | 32px     | `case-study-section.tsx:58`                                       |
| `pb-9`                            | 36px     | `title.tsx:51`                                                    |
| `pb-12`                           | 48px     | `case-study-section.tsx:66`                                       |
| `pr-2`                            | 8px      | `case-study-section.tsx:58`                                       |
| `py-3`                            | 12px     | `footer.tsx:3`                                                    |
| `px-4`                            | 16px     | `section-nav.tsx:48`                                              |
| `py-6`                            | 24px     | `header.tsx:5`; `section-nav.tsx:48`                              |
| `pr-10` / `px-10`                 | 40px     | `blurbs.tsx:87`; `case-study-section.tsx:66`                      |
| `pt-24` / `!pt-24` / `last:pb-24` | 96px     | `scroll-section.tsx:16,17`; `case-study-section.tsx:34`           |
| `py-32` / `lg:!pt-32`             | 128px    | `case-study-section.tsx:30`; `alside-case-study.tsx:13`           |
| `bottom-6` / `right-6`            | 24px     | `chevron-button.tsx:52`; `section-nav.tsx:48`                     |
| `right-8`                         | 32px     | `section-nav.tsx:50`                                              |
| `top-0.5`                         | 2px      | `header.tsx:8`                                                    |

Twenty distinct spacing values against a declared token set of eight — and the two sets share only `8px`, `24px`, `32px`, `40px` by accident.

### 5.3 The padding conflict

`case-study-section.tsx:30,34` sets `py-32` (128px top/bottom), then immediately overrides with `!pt-24 lg:!pt-0` — both marked `TEMP until we get more content in - remove after`. Alside then passes `lg:!pt-32` (`alside-case-study.tsx:13`), which collides with `lg:!pt-0`.

Both are `!important` at equal specificity, so the winner is decided by **generated source order**, not by the component. In the current build `.lg\:\!pt-32` (line 1360) emits after `.lg\:\!pt-0` (line 1356), so Alside wins — because "0" sorts before "32". Any change to class names or Tailwind's ordering silently flips this.

---

## 6. Widths — the one-off inventory

Every content width in the site is an arbitrary pixel value written at the call site. There are **fourteen** of them, spanning 310–563px, with no shared rhythm:

| Value               | File:line                     | Element            |
| ------------------- | ----------------------------- | ------------------ |
| `lg:!max-w-[310px]` | `sections.tsx:21`             | Intro blurb        |
| `lg:!max-w-[350px]` | `sections.tsx:48`             | Product blurb      |
| `lg:!max-w-[410px]` | `rendevu-case-study.tsx:41`   | Rendevu blurb      |
| `lg:!max-w-[420px]` | `arena-case-study.tsx:42`     | Arena blurb        |
| `lg:!max-w-[430px]` | `sections.tsx:14`             | Intro standfirst   |
| `lg:!max-w-[440px]` | `arena-case-study.tsx:35`     | Arena blurb        |
| `lg:!max-w-[440px]` | `sections.tsx:72`             | Contact standfirst |
| `lg:!max-w-[443px]` | `rendevu-case-study.tsx:33`   | Rendevu blurb      |
| `lg:!max-w-[450px]` | `sections.tsx:43`             | Product standfirst |
| `lg:!max-w-[452px]` | `alside-case-study.tsx:40,51` | Alside blurbs (×2) |
| `!max-w-[550px]`    | `rendevu-case-study.tsx:27`   | Rendevu standfirst |
| `lg:!max-w-[563px]` | `alside-case-study.tsx:28`    | Alside standfirst  |
| `lg:max-w-[510px]`  | `blurbs.tsx:87`               | Standfirst default |
| `lg:max-w-[60%]`    | `title.tsx:17`                | Title              |

`410` / `420` / `430` / `440` / `443` / `450` / `452` — seven values inside a 42px band. These read as the residue of nudging line-breaks by hand rather than as a design decision.

Two further problems in `blurbs.tsx:87`:

- The default is `!max-w-lg` (512px, **important**) _and_ `lg:max-w-[510px]` (510px, **not** important). Important wins at every breakpoint, so **`lg:max-w-[510px]` is dead code** — the 510px value never applies anywhere.
- Because the base default is `!important`, every caller is _forced_ to also use `!important` to override it. That is the direct cause of all fourteen `!` prefixes above.

Standard-scale widths, for completeness: `max-w-64` (256px, `blurbs.tsx:55`), `lg:max-w-xs` (320px, `blurbs.tsx:56`), `!max-w-lg` (512px, `blurbs.tsx:87`), `max-w-[80%] xl:max-w-[70%]` (`header.tsx:6`, `footer.tsx:4`, `scroll-section.tsx:23`, `case-study-section.tsx:44`).

### 6.1 Dead class

`sections.tsx:8` — `className="!2xl:max-w-[70%]"`. The `!` prefix must follow the variant (`2xl:!max-w-[70%]`), not precede it. Tailwind does not parse this; **`max-w-[70%]` appears nowhere in the compiled CSS.** The Intro title has no width cap at `2xl`.

---

## 7. Radius, elevation, blur, z-index

### 7.1 Radius

| Value    | Class / literal         | File:line                                     | Applied to                             |
| -------- | ----------------------- | --------------------------------------------- | -------------------------------------- |
| `9999px` | `rounded-full`          | `chevron-button.tsx:61`; `section-nav.tsx:63` | Chevron button, nav dots               |
| `24px`   | `rounded-3xl`           | `section-nav.tsx:40,48`                       | Glass nav panel                        |
| `8px`    | `radius={[8, 8, 8, 8]}` | `sales-chart.tsx:77`                          | Recharts bars — raw array, not a token |
| `3px`    | `border-radius: 3px`    | `style.css:212`                               | Scrollbar thumb                        |

### 7.2 Shadows and glows — every one

| Value                                                                   | File:line               | Context                                         |
| ----------------------------------------------------------------------- | ----------------------- | ----------------------------------------------- |
| `0 25px 50px -12px rgb(0 0 0 / 0.2)`                                    | `section-nav.tsx:42,50` | `shadow-2xl shadow-black/20` on the glass panel |
| `0 0 8px 2px rgba(173,216,230,0.6), 0 0 16px 4px rgba(173,216,230,0.3)` | `chevron-button.tsx:70` | Chevron hover glow                              |
| `0 0 0px 0px rgba(173,216,230,0)`                                       | `chevron-button.tsx:71` | Chevron rest state                              |
| `0 0 8px 2px ${customColor}, 0 0 16px 4px ${customColor + "4d"}`        | `section-nav.tsx:74-80` | Active dot, project color                       |
| `0 0 8px 2px rgba(173,216,230,0.6), 0 0 16px 4px rgba(173,216,230,0.3)` | `section-nav.tsx:75-79` | Active dot, default accent                      |
| `0 0 0px 0px rgba(173,216,230,0)`                                       | `section-nav.tsx:81`    | Dot rest state                                  |

The glow geometry — `0 0 8px 2px` + `0 0 16px 4px` at `.6`/`.3` — is written out **three times** across two files, once as a template literal with a hand-appended `"4d"` hex alpha (`section-nav.tsx:77`). `4d` = 30%, matching the `.3` in the other two by convention only. There is no `--glow-accent` variable in `src/`.

`shadow-2xl` alone is `rgb(0 0 0 / 0.25)`; `shadow-black/20` restates it at `0.2`. The brand doc records `0.2`, which is what ships.

### 7.3 Backdrop blur

| Value  | Class              | File:line               |
| ------ | ------------------ | ----------------------- |
| `24px` | `backdrop-blur-xl` | `section-nav.tsx:41,49` |
| `4px`  | `backdrop-blur-sm` | `chevron-button.tsx:62` |

### 7.4 Opacity constants

| Value     | File:line                   | Applied to                       |
| --------- | --------------------------- | -------------------------------- |
| `0.3`     | `style.css:144`             | `.noise-wrapper`                 |
| `0.5`     | `style.css:170`             | `.noise` layer                   |
| `0.2`     | `case-study-section.tsx:81` | Background photo (`whileInView`) |
| `0` → `1` | `style.css:89-90, 132-134`  | `.fade-in`, `.logo`              |
| `0.75`    | `style.css:157`             | Vignette terminus                |

### 7.5 Z-index — five layers, three systems

| Value | Where                                                                        | File:line                                                                                                                               |
| ----- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `101` | `header { z-index: 101 }` in CSS **and** `z-[101]` class on the same element | `style.css:118-121` **and** `header.tsx:5` — duplicated                                                                                 |
| `50`  | `z-50`                                                                       | `section-nav.tsx:48`; `chevron-button.tsx:52`                                                                                           |
| `10`  | `z-10`                                                                       | `scroll-section.tsx:23`; `case-study-section.tsx:44,65`                                                                                 |
| `9`   | `.noise-wrapper { z-index: 9 }`                                              | `style.css:143`                                                                                                                         |
| `5`   | `z-5`                                                                        | `blurbs.tsx:15` — **not a valid Tailwind v3 class.** The v3 scale is 0/10/20/30/40/50/auto. Not generated; blurbs get no z-index at all |

Also note `footer` (`footer.tsx:3`) is `fixed` with **no z-index**, sitting in the same stacking context as the `z-9` noise overlay and `z-10` content.

---

## 8. Motion

| Animation            | Spec                                                                                                | File:line                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Logo / chrome fade   | `opacity 0→1`, `800ms`, `600ms` delay, `forwards`, 1 iteration                                      | `style.css:88-91` (`.fade-in`), `131-134` (`.logo`) — **two identical rules**         |
| Title line reveal    | `y: 100 → 0`, `opacity 0→1`, `0.8s`, `easeOut`, stagger `index * 0.2s`, `viewport once, amount 0.3` | `title.tsx:26-33`                                                                     |
| Subtitle line reveal | identical to Title                                                                                  | `title.tsx:60-67` — **duplicated block**, `Title` and `Subtitle` share no abstraction |
| Blurb reveal         | `x: 50 → 0`, `opacity 0→1`, `0.5s`, `easeOut`, delay `0.4 + index * 0.2s`, `once, amount 0.3`       | `blurbs.tsx:20-27`                                                                    |
| Background photo     | `opacity 0 → 0.2`, `1.2s`, `easeOut`, `once, amount 0.2`                                            | `case-study-section.tsx:80-83`                                                        |
| Chevron entrance     | `y: 10 → 0`, `opacity 0→1`, `0.6s`, `0.8s` delay                                                    | `chevron-button.tsx:53-55`                                                            |
| Chevron hover / tap  | `scale 1.1` / `scale 0.95`                                                                          | `chevron-button.tsx:56-57`                                                            |
| Chevron color + glow | `0.3s`                                                                                              | `chevron-button.tsx:73`                                                               |
| Chevron flip at end  | `rotate: 180`                                                                                       | `chevron-button.tsx:78`                                                               |
| Nav dot active       | `scale 1.2`, `0.3s`                                                                                 | `section-nav.tsx:67, 86`                                                              |
| Chart bars           | `1000ms`, `ease-out`, `animationBegin: 0`                                                           | `sales-chart.tsx:79-81`                                                               |
| Chart container      | `opacity 0→1`, `0.6s`, re-fires (`once: false`)                                                     | `sales-chart.tsx:59, 66`                                                              |
| Noise loop           | `noise 1s steps(11, end) infinite both`                                                             | `style.css:171`                                                                       |
| Smooth scroll        | `scroll-behavior: smooth`                                                                           | `style.css:109`                                                                       |

### 8.1 Broken keyframes

`style.css:50-86`, `@keyframes noise`:

```css
0% {
  transform: translateX(0px, 0px);
} /* line 52 — invalid */
70% {
  transform: translateY(50px, 100px);
} /* line 74 — invalid */
```

`translateX()` and `translateY()` take **one** argument. Both declarations are invalid and dropped by the parser, so the `0%` and `70%` keyframes contribute no transform — the grain jumps at those two steps instead of stepping evenly. The other nine use `translate()` correctly. (Almost certainly a find-and-replace slip from `translate`.)

Two keyframes also animate `background-size` (`500px` at 60%, `700px` at 90%) against a base of `320px` (`style.css:169`) — the grain scale pumps between 320/500/700px over the loop. Undocumented in the brand system.

### 8.2 No reduced-motion handling

There is no `@media (prefers-reduced-motion: reduce)` block anywhere in `src/`. The infinite noise loop, all scroll reveals, and `scroll-behavior: smooth` run regardless of the user's setting. The brand docs do not mention it either.

---

## 9. Dead, unused, and vestigial

| Item                                                | File                            | Status                                                                         |
| --------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| `--color-grey-300`                                  | `style.css:8`                   | Declared, never referenced                                                     |
| `--spacer-sm/-md/--spacer`                          | `style.css:10-12`               | Declared, never referenced                                                     |
| `--gutter-sm/-md/-lg/-xl/--gutter`                  | `style.css:13-17`               | Declared, never referenced                                                     |
| `--container-width`, `--max-width`, `--gutter-auto` | `style.css:19-21`               | Never referenced; two of the three contain an invalid `calc()`                 |
| `@theme { … }`                                      | `style.css:24-42`               | Entire block inert under Tailwind v3                                           |
| `--animate-fadein` + `@keyframes fadein`            | `style.css:32-41`               | Inside `@theme`; never reachable                                               |
| `.encode-extrabold`                                 | `style.css:93-97`               | Class never appears in any component                                           |
| `.blurbs-scroll` + 3 scrollbar rules                | `style.css:196-213`             | Class never appears in any component                                           |
| `lg:max-w-[510px]`                                  | `blurbs.tsx:87`                 | Always beaten by `!max-w-lg` on the same element                               |
| `!2xl:max-w-[70%]`                                  | `sections.tsx:8`                | Malformed; never compiled                                                      |
| `z-5`                                               | `blurbs.tsx:15`                 | Not a valid v3 class; never compiled                                           |
| `bg-light-blue/70`                                  | `sections.tsx:36`               | Class string used as a CSS value; never rendered                               |
| `#4F46E5`                                           | `sales-chart.tsx:84`            | Off-palette fallback fill                                                      |
| `<div id="TEST" />`                                 | `rendevu-case-study.tsx:25`     | Debug leftover in shipped markup                                               |
| `SnapScrollContainer` / `SnapScrollSection`         | `snap-scroll-container.tsx`     | Entire file unreferenced by `app.tsx`                                          |
| `AlsideCaseStudy`                                   | `alside-case-study.tsx`         | Not rendered by `app.tsx`                                                      |
| `SalesChart`                                        | `sales-chart.tsx`               | Only consumer is `AlsideCaseStudy` — transitively unused                       |
| Commented-out `<motion.nav>`                        | `section-nav.tsx:33-45, 92`     | 13 lines of dead JSX duplicating the live element below it                     |
| Commented-out Alside nav entry                      | `section-nav.tsx:14`            | —                                                                              |
| `"alside"` in `SECTION_IDS`                         | `chevron-button.tsx:6`          | Section never renders; the chevron's next-section scan steps over a missing id |
| `TEMP until we get more content in`                 | `case-study-section.tsx:33, 48` | Two temporary overrides, still shipping                                        |

---

## 10. Accessibility observations

Recorded because they intersect the design system, not as a separate a11y audit.

| Finding                   | Detail                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No `<h1>` on the page** | `Title` renders `<h2>` (`title.tsx:14`), `Subtitle` renders `<h3>`. The document has no level-1 heading. The brand doc flags this too.                                                                                                                                                                                                                                           |
| **No focus styles**       | Nothing in `src/` defines `:focus` or `:focus-visible`. The nav dots (`section-nav.tsx:55`) and chevron (`chevron-button.tsx:48`) are `<button>`s with no visible keyboard affordance beyond the UA default, which the glass styling largely obscures. `design-tokens.css:47-48` defines `--focus-ring`; **it exists only in the brand folder and is not imported by the site.** |
| **Contrast**              | On `#0d1212`: white 18.9:1, white/80 12.2:1, `#add8e6` 12.4:1, Arena `#ddff0e` 16.5:1 — all AAA. Rendevu `#ef5da8` 6.1:1 and Alside `#e76e50` 6.1:1 are AA (fine at their display sizes). `text-white/40` on the footer is **3.8:1** at **10px** — below AA for body text at that size.                                                                                          |
| **Nav dot hit area**      | `w-2 h-2` = 8×8px (`section-nav.tsx:63`) with no padding on the `<button>`. Well under the 24×24px minimum target size.                                                                                                                                                                                                                                                          |
| **Infinite animation**    | The noise loop runs forever with no reduced-motion escape (§8.2).                                                                                                                                                                                                                                                                                                                |
| **Decorative logo alt**   | `alt="Logo"` (`header.tsx:8`) — should be the wordmark text (`"Ceramic"`) or empty if decorative.                                                                                                                                                                                                                                                                                |

---

## 11. Source vs. `Ceramic-Brand/` — discrepancies

The brand folder describes itself as "exact to production." It is not, in the following places. Source is authoritative.

| #   | Brand docs say                                                                      | Source actually does                                                                                                                                                                         | Verdict                                                                                                                                                         |
| --- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Accent is `#a6e4f7` (`design-tokens.css:19`, JSON, style guide, accent study)       | `#add8e6` (`style.css:7`) plus `rgb(173,216,230)` in eight places                                                                                                                            | **Known & documented** — the docs flag the site as "pending update." Note the migration is bigger than one line: nine call sites, eight of them decimal `rgb()` |
| 2   | "Encode Sans Condensed (600/700/800) for headlines"                                 | **The font never loads** (HTTP 400, `index.html:21`) and `font-display` compiles to nothing                                                                                                  | **Doc is wrong about production.** Not mentioned anywhere in the brand folder                                                                                   |
| 3   | "Roboto Light (300) for body"                                                       | Roboto loads; `@apply font-sans` resolves to the _system_ stack, so it is applied to nothing                                                                                                 | **Doc is wrong about production**                                                                                                                               |
| 4   | H1 = weight 700, lh 0.75, tracking −0.03em                                          | 700 ✓, lh 0.75 ✓, tracking `−0.3rem` = −0.03em desktop / **−0.06em mobile**                                                                                                                  | Doc captures the desktop value only; the mobile figure is called out in the style guide prose but not in the token                                              |
| 5   | H2 = weight **600**, lh **0.86**, tracking **−0.02em**                              | weight **700**, lh **0.8**/`.9`, tracking **−0.042em**/−0.04em                                                                                                                               | **Doc is aspirational, not extracted.** It says so in a note; the token file presents it as a value                                                             |
| 6   | Standfirst weight 600 ("markup says thin but only 600–800 load, so it renders 600") | Markup says `font-thin` (100). **Since Encode never loads, it renders at 100 in the system font** — genuinely thin, not 600                                                                  | **Doc's reasoning is right, its premise is wrong**                                                                                                              |
| 7   | `--eyebrow-*` tokens, `.eyebrow` component, rules and code samples                  | **No eyebrow exists anywhere in `src/`**                                                                                                                                                     | Doc invents a component. Legitimate as a forward spec — but it is filed as an extraction                                                                        |
| 8   | `.statement` / `.statement--ruled`, `--statement-*`, `--pull-*` aliases             | **No statement component in `src/`.** The nearest thing is `Standfirst` in `blurbs.tsx`, which shares none of the values (2rem/300/1.15/−0.01em/52ch vs. 1.25–1.5rem/100/1.5/0/arbitrary px) | Same as #7                                                                                                                                                      |
| 9   | "System-wide: every display element `balance`, every paragraph `pretty`"            | `text-balance` appears **once**, on body copy (`blurbs.tsx:70`). No `text-pretty` anywhere. No headings balanced                                                                             | Doc describes intent; source does the inverse                                                                                                                   |
| 10  | H3 (3rem) and H4 (1.75rem) tokens                                                   | **Neither size exists in the site.** There is no third or fourth heading level                                                                                                               | Doc extends the scale beyond what ships                                                                                                                         |
| 11  | `--focus-ring` / `--color-focus`, marked `"added": true`                            | Not present in `src/`; no focus styling at all                                                                                                                                               | Correctly marked as an addition; not yet adopted                                                                                                                |
| 12  | Spacers 8/32/40, gutters 24/50/70/112/140                                           | Declared in `style.css` and **used by nothing**                                                                                                                                              | Doc records the declaration, not the usage. Actual spacing comes from Tailwind's scale (§5.2)                                                                   |
| 13  | `--shadow-glass: 0 25px 50px -12px rgba(0,0,0,0.2)`                                 | Matches (`shadow-2xl shadow-black/20`) ✓                                                                                                                                                     | Accurate                                                                                                                                                        |
| 14  | Project accents `#ddff0e` / `#ef5da8` / `#e76e50`                                   | Match ✓ — but each is duplicated across two files                                                                                                                                            | Values accurate; doc doesn't note the duplication                                                                                                               |
| 15  | Noise: "320px tile, wrapper .3 / layer .5, radial vignette"                         | Matches ✓ — but omits the `background-size` pumping to 500px/700px mid-loop, and the two invalid keyframes                                                                                   | Partially accurate                                                                                                                                              |
| 16  | Motion specs (easing, durations, staggers)                                          | All match ✓                                                                                                                                                                                  | Accurate                                                                                                                                                        |
| 17  | Logo "80px wide (w-20)"                                                             | Matches ✓ (`header.tsx:8`)                                                                                                                                                                   | Accurate                                                                                                                                                        |
| 18  | Contrast ratios measured against `#a6e4f7`                                          | Site ships `#add8e6`; its real ratio on ink is **12.4:1**, not 13.5:1                                                                                                                        | Still AAA; the number is for the un-shipped color                                                                                                               |
| 19  | Body gradient `#000 → #111`                                                         | Matches ✓ (`style.css:114`)                                                                                                                                                                  | Accurate                                                                                                                                                        |
| 20  | Hairline `#44403c` (stone-700)                                                      | Matches ✓ — `border-stone-700` (`title.tsx:51`)                                                                                                                                              | Accurate                                                                                                                                                        |

**Summary:** the brand folder is accurate on color values, effects, motion, and the logo. It is **aspirational** on typography (the optical ramp, H3/H4), and it **invents** two components (eyebrow, statement) that have no source counterpart. Most importantly, it is silent on the fact that neither brand typeface currently renders.

---

## 12. Prioritized recommendations

### P0 — the site is not rendering the brand

1. **Fix the font URL.** `src/index.html:21` — `wght@600,700,800` → `wght@600;700;800`. One character class. Without this nothing else in typography matters.
2. **Decide Tailwind v3 or v4.** The codebase is v3.4.17 with a v4 `@theme` block. Either move the tokens into `tailwind.config.js` `theme.extend` (v3), or upgrade to v4 and drop `postcss.config.js`/`tailwind.config.js` for the CSS-first config. Until then `font-display`, `bg-light-blue` and `--animate-fadein` do not exist.
3. **Point `font-sans` at Roboto.** Either via the config (v3) or by dropping `@apply font-sans` and setting `font-family: var(--font-sans)` directly.
4. **Remove `box-sizing: inherit`** (`style.css:123-129`) or add `html { box-sizing: border-box }`. Preflight already sets `border-box` on everything; this rule undoes it.

### P1 — token consolidation

5. **One accent, one place.** Replace the nine `#add8e6` / `rgb(173,216,230,…)` literals with a variable and an `--color-accent-rgb` triple. Then the `#a6e4f7` migration is a one-line change instead of nine.
6. **One glow.** Extract `--glow-accent` and the `${color}4d` pattern into a helper; it is currently written three times.
7. **Project accents in one module.** `#ddff0e`, `#ef5da8`, `#e76e50` each live in two files with no link between them.
8. **Either use the spacer/gutter tokens or delete them.** Eleven declared variables with zero consumers is worse than none — it implies a system the code does not follow.
9. **Delete `--max-width` / `--gutter-auto`** or define `--screen-xl-min`. They are currently invalid `calc()`s.

### P2 — typography

10. **Move tracking to `em`.** `title.tsx:16,49,50` — `-0.3rem` → `-0.03em`, `-0.25rem` → `-0.02em`, `-0.1rem` → `-0.02em`. This fixes the mobile title being tracked twice as tight as desktop, and the subtitle being tighter than the title.
11. **Promote `Title` to `<h1>`** (`title.tsx:14`), demote `Subtitle` to `<h2>`.
12. **Swap the wrap rules.** `text-balance` on headings and standfirsts; `text-pretty` on the body copy where `text-balance` currently sits (`blurbs.tsx:70`).
13. **Fold `Title` and `Subtitle` together.** `title.tsx:23-38` and `57-72` are byte-identical reveal blocks.

### P3 — layout hygiene

14. **Drop `!important` from the `Standfirst` default** (`blurbs.tsx:87`). It is the root cause of all fourteen `!max-w-[…]` overrides; remove it and the call sites can use plain classes.
15. **Collapse the fourteen one-off widths** into three or four named measures. Seven values inside a 42px band (410–452) are not carrying design intent.
16. **Fix `z-5`** (`blurbs.tsx:15`) → `z-10` or an arbitrary `z-[5]`, and give the fixed `footer` an explicit z-index.
17. **Fix the tint** — `sections.tsx:36` / `noise.tsx:7`: pass a real CSS color, or pass a class and apply it with `className`.
18. **Resolve the `TEMP` padding overrides** (`case-study-section.tsx:33-34, 48-49`) — they are load-bearing on a source-order accident.

### P4 — cleanup & a11y

19. Delete: `.encode-extrabold`, `.blurbs-scroll`, `snap-scroll-container.tsx`, the commented `<motion.nav>` block, `<div id="TEST" />`, `"alside"` from `SECTION_IDS`, `lg:max-w-[510px]`.
20. Fix `!2xl:max-w-[70%]` → `2xl:!max-w-[70%]` (`sections.tsx:8`), or drop it.
21. Fix the two invalid noise keyframes (`style.css:52, 74`) — `translateX(0px, 0px)` → `translate(0px, 0px)`, `translateY(50px, 100px)` → `translate(50px, 100px)`.
22. Adopt `--focus-ring` from `design-tokens.css` and add `:focus-visible` styles to the two `<button>` components.
23. Add a `prefers-reduced-motion` block covering the noise loop, the scroll reveals, and `scroll-behavior`.
24. Enlarge the nav-dot hit area to ≥24×24px (pad the `<button>`, keep the 8px dot).
25. Replace `alt="Logo"` with `alt="Ceramic"` (`header.tsx:8`).

### P5 — reconcile the brand folder

26. Correct the "exact to production" framing in `Ceramic-Brand/README.md`. Split it into **extracted** (color, effects, motion, logo, spacing declarations) and **proposed** (optical type ramp, H3/H4, eyebrow, statement, focus ring) so a reader can tell which is which.
27. Record the font-loading break in the brand docs, or fix P0-1 first and delete the need.
28. Once the accent moves to `#a6e4f7`, re-measure and update the site; until then the 13.5:1 figure describes a color that isn't shipping (the real one is 12.4:1 — still AAA).

---

## Appendix — asset notes

| Asset                                   | Size       | Note                                                                                                                                                                       |
| --------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/assets/arena-kareem-game-play.png` | **6.4 MB** | Rendered at 20% opacity, `bg-cover`, behind text. A PNG at this size for a background wash is ~6MB of payload for an effect that would survive heavy JPEG/WebP compression |
| `src/assets/rendevu-card-design.png`    | 1.1 MB     | Same treatment, same note                                                                                                                                                  |
| `src/assets/noise.png`                  | 579 KB     | Tiled at 320px, animated infinitely. A far smaller tile — or an SVG `feTurbulence` — would do the same job                                                                 |
| `src/assets/ceramic-logo.svg`           | —          | `fill: #fff` hardcoded in an internal `<style>` block; cannot be themed via `currentColor`                                                                                 |
| `src/assets/ceramic-logo-black.svg`     | —          | Different viewBox (`0 0 372.11 133.5`) from the white mark (`0 0 366.25 95.27`) — the two are **not** drop-in swaps and will not align if exchanged                        |
| `public/ceramic-made.jpg`               | 25 KB      | OG image ✓                                                                                                                                                                 |
| `dist/`                                 | —          | Gitignored and untracked ✓, but the local copy is **stale** — built Jan 2026, several commits behind. Don't audit against it; it predates the current source               |
