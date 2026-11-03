import { useEffect, useId, useRef, type ReactNode } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { EASE } from "./split-section"

/**
 * Abstract background line art for headline slides. Thin light-blue strokes
 * at low opacity, faded toward the edges, drawn in once when scrolled into
 * view. Rendered behind the slide content (see SplitSection `background`).
 */

export type LineArtVariant =
  | "contours"
  | "constellation"
  | "flow"
  | "flow2"
  | "amplify"
  | "converge"
  | "phyllotaxis"
  | "capacitor"
  | "capacitorFade"
  | "capacitorGlow"
  | "orbits"
  | "lens"
  | "ridges"
  | "signal"

const W = 1600
const H = 1000
const STROKE = "var(--color-light-blue)"

// Deterministic PRNG so the art is identical on every render/visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const toPath = (pts: Array<[number, number]>, close = false) =>
  pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join("") + (close ? "Z" : "")

/** A: nested, gently irregular contours — topography / fingerprint. */
function contourPaths() {
  const cx = W * 0.68
  const cy = H * 0.52
  return Array.from({ length: 16 }, (_, i) => {
    const r = 60 + i * 38
    const pts: Array<[number, number]> = []
    for (let k = 0; k <= 160; k++) {
      const a = (k / 160) * Math.PI * 2
      const wobble =
        1 + 0.07 * Math.sin(3 * a + i * 0.45) + 0.04 * Math.sin(5 * a - i * 0.3)
      pts.push([
        cx + r * wobble * Math.cos(a) * 1.35,
        cy + r * wobble * Math.sin(a),
      ])
    }
    return toPath(pts, true)
  })
}

/** B: sparse node network — a quiet neural-net / constellation. */
function constellation() {
  const rand = mulberry32(7)
  const nodes: Array<[number, number]> = []
  while (nodes.length < 28) {
    const p: [number, number] = [620 + rand() * 940, 90 + rand() * 820]
    if (nodes.every(([x, y]) => Math.hypot(x - p[0], y - p[1]) > 120))
      nodes.push(p)
  }
  const edges = new Set<string>()
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1]) }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j }) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`))
  })
  const lines = [...edges].map((e) => {
    const [i, j] = e.split("-").map(Number)
    return toPath([nodes[i], nodes[j]])
  })
  return { nodes, lines, rings: [3, 11, 19] }
}

/** C: scattered strands converging into a tight parallel band — idea → product. */
function flowPaths() {
  const rand = mulberry32(21)
  const n = 22
  return Array.from({ length: n }, (_, i) => {
    const start = 80 + (i / (n - 1)) * 840 + (rand() - 0.5) * 60
    const target = H * 0.5 - 70 + (i / (n - 1)) * 140
    const phase = rand() * Math.PI * 2
    const freq = 0.004 + rand() * 0.004
    const amp = 40 + rand() * 50
    const pts: Array<[number, number]> = []
    for (let x = -40; x <= W + 40; x += 16) {
      const t = Math.min(Math.max(x / W, 0), 1)
      const loose = (1 - t) ** 2
      pts.push([
        x,
        target +
          (start - target) * loose +
          amp * loose * Math.sin(freq * x + phase),
      ])
    }
    return toPath(pts)
  })
}

/**
 * C2: strands converge to a loose waist, then fan back out on the right to a
 * narrower spread than they started with — focus, then expansion.
 */
function flow2Paths() {
  const rand = mulberry32(21)
  const n = 22
  const leftSpan = 840 // px spread at the far left
  const t0 = 0.5 // where the waist sits (fraction of width)
  const waist = 0.3 // waist spread, relative to the left
  const right = 0.55 // right-side spread, relative to the left
  return Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1) - 0.5
    const jitterL = (rand() - 0.5) * 0.07
    const jitterR = (rand() - 0.5) * 0.05
    const phase = rand() * Math.PI * 2
    const freq = 0.004 + rand() * 0.004
    const amp = 40 + rand() * 50
    const pts: Array<[number, number]> = []
    for (let x = -40; x <= W + 40; x += 16) {
      const t = Math.min(Math.max(x / W, 0), 1)
      // Eases into and out of the waist (zero slope at t0, no kink)
      const before = t < t0
      const k = before ? ((t0 - t) / t0) ** 2 : ((t - t0) / (1 - t0)) ** 2
      const s = before ? waist + (1 - waist) * k : waist + (right - waist) * k
      const jitter = before ? jitterL * k : jitterR * k
      const loose = (s - waist) / (1 - waist)
      const cy = H * 0.5 + (before ? 0 : 30 * k) // right fan drifts down a touch
      pts.push([
        x,
        cy +
          (u + jitter) * leftSpan * s +
          amp * loose * Math.sin(freq * x + phase),
      ])
    }
    return toPath(pts)
  })
}

/**
 * G: one small source whose strands gain amplitude as they travel, each at a
 * slightly different harmonic — a single signal amplified into many.
 */
function amplify() {
  const n = 20
  const x0 = 620
  const cy = H * 0.5
  return Array.from({ length: n }, (_, i) => {
    const pts: Array<[number, number]> = []
    for (let x = x0; x <= W + 40; x += 6) {
      const t = (x - x0) / (W - x0)
      const env = t ** 1.5
      const fan = (i - (n - 1) / 2) * 22
      const wave = 170 * Math.sin(Math.PI * 2 * (0.9 + 0.09 * i) * t + i * 0.3)
      pts.push([x, cy + env * (fan + wave)])
    }
    return toPath(pts)
  })
}

/**
 * H: the design process. Disparate, tangled threads on the left are woven
 * together through the middle and resolve into one uniform band on the right.
 */
function converge() {
  const rand = mulberry32(5)
  const n = 22
  const cy = H * 0.5
  const lane = 13 // spacing of the resolved band
  const smooth = (a: number, b: number, t: number) => {
    const k = Math.min(Math.max((t - a) / (b - a), 0), 1)
    return k * k * (3 - 2 * k)
  }
  return Array.from({ length: n }, (_, i) => {
    const target = cy + (i - (n - 1) / 2) * lane
    // Chaos: each thread starts somewhere different and wanders on its own
    const offset = (rand() - 0.5) * 900
    const waves = Array.from({ length: 3 }, () => ({
      f: 0.004 + rand() * 0.016,
      a: 30 + rand() * 120,
      p: rand() * Math.PI * 2,
    }))
    const curl = rand() < 0.35 ? 40 + rand() * 50 : 0 // some threads loop
    const curlF = 0.012 + rand() * 0.01
    const curlP = rand() * Math.PI * 2
    // Weave: odd/even threads cross each other like a braid
    const braidPhase = (i % 2) * Math.PI + i * 0.15
    const pts: Array<[number, number]> = []
    for (let x = -60; x <= W + 40; x += 6) {
      const t = Math.min(Math.max(x / W, 0), 1)
      const chaos = 1 - smooth(0.02, 0.52, t)
      const weave = smooth(0.28, 0.48, t) * (1 - smooth(0.6, 0.8, t))
      const wander = waves.reduce(
        (sum, w) => sum + w.a * Math.sin(w.f * x + w.p),
        0,
      )
      const braid = 34 * Math.sin(0.018 * x + braidPhase)
      pts.push([
        x + chaos * curl * Math.cos(curlF * x + curlP),
        target +
          chaos * (offset + wander) +
          weave * braid +
          chaos * curl * Math.sin(curlF * x + curlP),
      ])
    }
    return toPath(pts)
  })
}

/**
 * I: phyllotaxis. Each point sits one golden angle (~137.5°) past the last,
 * a little farther out. That single rule yields two interlocking families of
 * spirals (21 one way, 34 the other) that never crowd or break as they grow:
 * scale without losing grace. We draw the spiral arms (parastichies) as
 * continuous curves, centered off-canvas so only a sweep of them shows.
 */
const PHYLLO_CX = W * 0.94
const PHYLLO_CY = H * 1.02

function phyllotaxis() {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const N = 1400 // seeds; sets how far the pattern reaches
  const cx = PHYLLO_CX
  const cy = PHYLLO_CY
  const c = 1500 / Math.sqrt(N) // r = c·√k
  const arms: Array<string> = []
  for (const m of [21, 34]) {
    // Angular step between seeds k and k+m, wrapped to (-π, π]
    let delta = (m * golden) % (Math.PI * 2)
    if (delta > Math.PI) delta -= Math.PI * 2
    for (let j = 1; j <= m; j++) {
      const pts: Array<[number, number]> = []
      for (let n = 0; j + m * n <= N; n += 0.25) {
        const k = j + m * n
        const a = j * golden + n * delta
        const r = c * Math.sqrt(k)
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
      }
      arms.push(toPath(pts))
    }
  }
  return arms
}

/**
 * J: the field of a multilayer ceramic capacitor (MLCC), where Ceramic's name
 * comes from. Six electrode layers alternate +/− and are offset toward
 * opposite terminals, so the field leaking from the outer layers curls around
 * opposite ends: an S of nested loops with calm, stored energy between the
 * layers. Lines are traced through the exact field of uniformly charged
 * finite plates, so the shapes are physically real.
 */
function capacitor() {
  const cx = W * 0.68
  const cy = H * 0.5
  const layers = 6
  const gap = 34
  const len = 700
  const offset = 40
  const plates = Array.from({ length: layers }, (_, p) => {
    const sign = p % 2 === 0 ? 1 : -1
    const a = cx - len / 2 + sign * offset
    return { sign, y: cy + (p - (layers - 1) / 2) * gap, a, b: a + len }
  })

  // Closed-form 2D field of a uniformly charged segment, summed over plates
  const field = (x: number, y: number): [number, number] => {
    let ex = 0
    let ey = 0
    for (const { sign, y: py, a, b } of plates) {
      const dy = Math.abs(y - py) < 1e-6 ? 1e-6 : y - py
      ex +=
        sign *
        0.5 *
        Math.log(((x - a) ** 2 + dy * dy) / ((x - b) ** 2 + dy * dy))
      ey += sign * (Math.atan((x - a) / dy) - Math.atan((x - b) / dy))
    }
    return [ex, ey]
  }

  const hits = (x0: number, y0: number, x1: number, y1: number, sign: number) =>
    plates.some(
      (p) =>
        p.sign === sign &&
        (y0 - p.y) * (y1 - p.y) <= 0 &&
        (x0 + x1) / 2 >= p.a - 2 &&
        (x0 + x1) / 2 <= p.b + 2,
    )

  // Follow the field (dir 1) or against it (dir -1) until reaching `target`
  const trace = (x: number, y: number, dir: number, target: number) => {
    const pts: Array<[number, number]> = [[x, y]]
    for (let step = 0; step < 3000; step++) {
      const [ex, ey] = field(x, y)
      const m = Math.hypot(ex, ey) || 1
      const nx = x + (dir * 3 * ex) / m
      const ny = y + (dir * 3 * ey) / m
      const done = hits(x, y, nx, ny, target)
      x = nx
      y = ny
      if (done || step % 3 === 0) pts.push([x, y])
      if (done || x < -150 || x > W + 150 || y < -150 || y > H + 150) break
    }
    return toPath(pts)
  }

  const top = plates[0]
  const bottom = plates[layers - 1]
  // `flow`: 1 if the path runs + → − (start to end), -1 if it runs − → +
  const lines: Array<{ d: string; flow: 1 | -1 }> = []
  for (let x = top.a + 28; x < top.b; x += 22)
    lines.push({ d: trace(x, top.y - 1, 1, -1), flow: 1 })
  for (let x = bottom.a + 28; x < bottom.b; x += 22)
    lines.push({ d: trace(x, bottom.y + 1, -1, 1), flow: -1 })
  return lines
}

/** D: tilted, nested orbits with a single marker on each — systems in motion. */
function orbits() {
  const cx = W * 0.68
  const cy = H * 0.5
  return Array.from({ length: 7 }, (_, i) => {
    const rx = 110 + i * 95
    const ry = rx * 0.4
    const d = `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`
    // Marker position on the (unrotated) ellipse; varied per ring
    const a = 0.6 + i * 1.7
    return {
      d,
      dot: [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as [number, number],
    }
  })
}

/** E: a square grid pinched by a soft lens/gravity well — structure bent by focus. */
function lensGrid() {
  const cx = W * 0.68
  const cy = H * 0.5
  const sigma = 280
  const pinch = 0.38
  const warp = ([x, y]: [number, number]): [number, number] => {
    const dx = x - cx
    const dy = y - cy
    const k = 1 - pinch * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
    return [cx + dx * k, cy + dy * k]
  }
  const step = 64
  const lines: Array<string> = []
  for (let y = -step; y <= H + step; y += step) {
    const pts: Array<[number, number]> = []
    for (let x = -step; x <= W + step; x += 12) pts.push(warp([x, y]))
    lines.push(toPath(pts))
  }
  for (let x = -step; x <= W + step; x += step) {
    const pts: Array<[number, number]> = []
    for (let y = -step; y <= H + step; y += 12) pts.push(warp([x, y]))
    lines.push(toPath(pts))
  }
  return lines
}

/** F: stacked signal ridges rising in the middle — data with a pulse. */
function ridges() {
  const rand = mulberry32(42)
  const n = 26
  return Array.from({ length: n }, (_, i) => {
    const base = 210 + i * 24
    const center = 1080 + (rand() - 0.5) * 120
    const width = 150 + rand() * 80
    const amp = 40 + rand() * 90 * Math.sin((i / (n - 1)) * Math.PI)
    const f1 = 0.02 + rand() * 0.02
    const f2 = 0.045 + rand() * 0.03
    const p1 = rand() * 6.28
    const p2 = rand() * 6.28
    const pts: Array<[number, number]> = []
    for (let x = -20; x <= W + 20; x += 8) {
      const env = Math.exp(-(((x - center) / width) ** 2))
      const jitter =
        0.65 + 0.25 * Math.sin(f1 * x + p1) + 0.1 * Math.sin(f2 * x + p2)
      pts.push([x, base - amp * env * jitter])
    }
    return toPath(pts)
  })
}

// Computed once at module load.
const CONTOURS = contourPaths()
const CONSTELLATION = constellation()
const FLOW = flowPaths()
const FLOW2 = flow2Paths()
const AMPLIFY = amplify()
const CONVERGE = converge()
const PHYLLOTAXIS = phyllotaxis()
const CAPACITOR = capacitor()
const ORBITS = orbits()
const LENS = lensGrid()
const RIDGES = ridges()

/**
 * K: noise → signal, driven by scroll. Each strand is a blend of jittery,
 * scattered noise and a clean sine; a soft boundary sweeps right → left as
 * the slide scrolls in, resolving the noise into one coherent, twisting
 * ribbon of signal.
 */
const SIGNAL_N = 18
const SIGNAL_STEP = 6
const SIGNAL_X0 = -60
const SIGNAL_X1 = W + 60

// Smooth 1D value noise from precomputed random knots.
function valueNoise(knots: Array<number>, spacing: number, x: number) {
  const f = (x - SIGNAL_X0) / spacing
  const i = Math.floor(f)
  const t = f - i
  const k = t * t * (3 - 2 * t)
  return knots[i] + (knots[i + 1] - knots[i]) * k
}

const SIGNAL_STRANDS = (() => {
  const rand = mulberry32(11)
  const knots = (spacing: number) =>
    Array.from(
      { length: Math.ceil((SIGNAL_X1 - SIGNAL_X0) / spacing) + 2 },
      () => rand() * 2 - 1,
    )
  return Array.from({ length: SIGNAL_N }, (_, i) => ({
    scatter: (rand() - 0.5) * 760,
    octaves: [
      { knots: knots(180), spacing: 180, amp: 120 },
      { knots: knots(48), spacing: 48, amp: 34 },
      { knots: knots(14), spacing: 14, amp: 9 },
    ],
    phase: i * 0.13,
    lane: (i - (SIGNAL_N - 1) / 2) * 5,
  }))
})()

/** Paths at scroll progress p (0 = all noise, 1 = all signal). */
function signalPaths(p: number) {
  const cy = H * 0.5
  // Boundary sweeps from just past the right edge to just past the left
  const edge = 1.1 - p * 1.3
  const width = 0.2
  return SIGNAL_STRANDS.map(({ scatter, octaves, phase, lane }) => {
    const pts: Array<[number, number]> = []
    for (let x = SIGNAL_X0; x <= SIGNAL_X1; x += SIGNAL_STEP) {
      const k = Math.min(Math.max((x / W - (edge - width)) / (2 * width), 0), 1)
      const s = k * k * (3 - 2 * k) // 0 = noise, 1 = signal
      const noise =
        scatter +
        octaves.reduce(
          (sum, o) => sum + o.amp * valueNoise(o.knots, o.spacing, x),
          0,
        )
      const signal = lane + 70 * Math.sin(0.011 * x + phase)
      pts.push([x, cy + noise * (1 - s) + signal * s])
    }
    return toPath(pts)
  })
}

const SIGNAL_FINAL = signalPaths(1)

function SignalArt({ mask }: { mask: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const paths = useRef<Array<SVGPathElement | null>>([])
  const bluePaths = useRef<Array<SVGPathElement | null>>([])
  const gradientId = useId()
  const reduce = useReducedMotion()
  // 0 as the slide's top enters the bottom of the viewport; ~0.72 once
  // it's in place (a little noise lingers left); 1 as you scroll past.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start -0.35"],
  })
  const progress = useSpring(scrollYProgress, SCROLL_SPRING)
  // Blue arrives as the lines unify: mostly lit once the slide lands.
  const blue = useTransform(progress, [0.4, 0.8], [0, 1])

  useMotionValueEvent(progress, "change", (v) => {
    if (reduce) return
    signalPaths(v).forEach((d, i) => {
      paths.current[i]?.setAttribute("d", d)
      bluePaths.current[i]?.setAttribute("d", d)
    })
  })

  const initial = reduce ? SIGNAL_FINAL : signalPaths(progress.get())
  const lines = (store: typeof paths, stroke: string) =>
    initial.map((d, i) => (
      <path
        key={i}
        ref={(el) => {
          store.current[i] = el
        }}
        d={d}
        {...LINE}
        stroke={stroke}
      />
    ))

  return (
    <div ref={ref} className="absolute inset-0">
      <ArtFrame mask={mask}>
        <defs>
          {/* Blue stays quiet behind the blurb, building past its right edge */}
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={W * 0.55}
            y1={0}
            x2={W * 0.98}
            y2={0}
          >
            <stop offset="0" stopColor={STROKE} stopOpacity={0} />
            <stop offset="0.6" stopColor={STROKE} stopOpacity={0.14} />
            <stop offset="1" stopColor={STROKE} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <g opacity={0.2}>{lines(paths, STROKE)}</g>
        <motion.g style={{ opacity: reduce ? 1 : blue }}>
          {lines(bluePaths, `url(#${gradientId})`)}
        </motion.g>
      </ArtFrame>
    </div>
  )
}

const MASKS: Record<LineArtVariant, string> = {
  signal:
    "linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
  contours:
    "radial-gradient(ellipse 55% 60% at 68% 52%, #000 35%, transparent 100%)",
  constellation:
    "radial-gradient(ellipse 60% 65% at 70% 50%, #000 40%, transparent 100%)",
  flow: "linear-gradient(to right, transparent 0%, #000 25%, #000 75%, transparent 100%)",
  flow2:
    "linear-gradient(to right, transparent 0%, #000 25%, #000 75%, transparent 100%)",
  capacitor:
    "radial-gradient(ellipse 60% 75% at 68% 50%, #000 35%, transparent 100%)",
  capacitorFade:
    "radial-gradient(ellipse 60% 75% at 68% 50%, #000 35%, transparent 100%)",
  capacitorGlow:
    "radial-gradient(ellipse 60% 75% at 68% 50%, #000 35%, transparent 100%)",
  phyllotaxis:
    "radial-gradient(ellipse 75% 95% at 94% 100%, #000 25%, transparent 100%)",
  converge:
    "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
  amplify:
    "radial-gradient(ellipse 55% 70% at 75% 50%, #000 40%, transparent 100%)",
  orbits:
    "radial-gradient(ellipse 60% 70% at 68% 50%, #000 40%, transparent 100%)",
  lens: "radial-gradient(ellipse 50% 60% at 68% 50%, #000 30%, transparent 100%)",
  ridges:
    "radial-gradient(ellipse 50% 70% at 68% 50%, #000 45%, transparent 100%)",
}

// Shared smoothing for scroll-linked art: trails the scroll a little and
// settles without overshoot.
const SCROLL_SPRING = { stiffness: 60, damping: 24, mass: 0.6 }

const LINE = {
  fill: "none",
  stroke: STROKE,
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke" as const,
}

/** One-time draw-on reveal; nothing for reduced-motion users. */
function drawOn(reduce: boolean | null, i: number, total: number) {
  if (reduce) return {}
  const delay = (i / total) * 0.9
  return {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: "some" as const },
    transition: {
      pathLength: { duration: 2.4, ease: EASE, delay },
      opacity: { duration: 0.6, delay },
    },
  }
}

function ArtFrame({ mask, children }: { mask: string; children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {children}
    </svg>
  )
}

/**
 * Hero: the capacitor's field draws in on load while a pulse of current runs
 * back along every field line into the layers (charging). Scrolling out of
 * the hero then sends the pulse the other way, + → −, in step with the
 * scroll (discharging).
 */
// Where the (invisible) electrode stack sits, matching capacitor().
const STACK_CX = W * 0.68
const STACK_CY = H * 0.5

/**
 * How the field meets the electrode stack:
 * - "none": lines stop on the (invisible) plates
 * - "fade": lines dissolve before reaching the stack; blue settles into the
 *   lines around the core once charged
 * - "glow": fade, plus a soft core of light that charges/discharges
 */
type CapacitorCore = "none" | "fade" | "glow"

function CapacitorArt({
  mask,
  core = "none",
}: {
  mask: string
  core?: CapacitorCore
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const fadeId = `${id}-fade`
  const maskId = `${id}-mask`
  const glowId = `${id}-glow`
  const blueId = `${id}-blue`
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const scrolled = useSpring(scrollYProgress, SCROLL_SPRING)

  // On load the pulse plays in reverse (1 → 0): current flows back from the
  // far ends of the field into the layers, charging the capacitor. Starts
  // once the field lines are mostly drawn in.
  const intro = useMotionValue(reduce ? 0 : 1)
  useEffect(() => {
    if (reduce) return
    const controls = animate(intro, 0, {
      duration: 3.2,
      ease: "easeInOut", // even travel; EASE front-loads it into a flash
      delay: 1.4,
    })
    return () => controls.stop()
  }, [intro, reduce])

  // Whichever is further along wins, so scrolling mid-intro just takes over.
  const progress = useTransform([intro, scrolled], ([a, b]: Array<number>) =>
    Math.max(a, b),
  )
  // Pulse is a short dash on a normalized path (pathLength = 1) with a gap
  // longer than the path, so exactly one dash travels and none wrap around.
  const forward = useTransform(progress, [0, 1], [0.08, -1])
  const backward = useTransform(progress, [0, 1], [-1, 0.08])
  const pulseOpacity = useTransform(progress, [0, 0.05, 0.8, 1], [0, 1, 1, 0])
  // Core light: full when charged (progress 0), dim when discharged.
  const glowOpacity = useTransform(progress, [0, 1], [1, 0.25])
  // Blue lines: arrive as the charge completes and stay; drain on discharge.
  // Fade: no pulses, so the blue itself carries the charge — it lights up
  // gradually over the whole intro. With pulses (glow), it arrives as the
  // pulses land. Either way it stays lit, dimming as you scroll away.
  const withPulses = core !== "fade"
  const blueOpacity = useTransform(
    progress,
    withPulses ? [0, 0.3] : [0, 0.9],
    [1, 0],
  )
  const lineMask = core === "none" ? undefined : `url(#${maskId})`

  return (
    <div ref={ref} className="absolute inset-0">
      <ArtFrame mask={mask}>
        <defs>
          {/* Elliptical falloff around the stack: black (hidden) at the
              core, white (visible) beyond it. Stretched 3:1 horizontally. */}
          <radialGradient
            id={fadeId}
            gradientUnits="userSpaceOnUse"
            cx={STACK_CX}
            cy={STACK_CY}
            r={600}
            gradientTransform={`translate(${STACK_CX} ${STACK_CY}) scale(1 0.34) translate(${-STACK_CX} ${-STACK_CY})`}
          >
            <stop offset="0" stopColor="#000" />
            <stop offset="0.72" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-300}
            y={-300}
            width={W + 600}
            height={H + 600}
          >
            <rect
              x={-300}
              y={-300}
              width={W + 600}
              height={H + 600}
              fill={`url(#${fadeId})`}
            />
          </mask>
          <radialGradient
            id={glowId}
            gradientUnits="userSpaceOnUse"
            cx={STACK_CX}
            cy={STACK_CY}
            r={460}
            gradientTransform={`translate(${STACK_CX} ${STACK_CY}) scale(1 0.2) translate(${-STACK_CX} ${-STACK_CY})`}
          >
            <stop offset="0" stopColor={STROKE} stopOpacity={0.22} />
            <stop offset="0.5" stopColor={STROKE} stopOpacity={0.08} />
            <stop offset="1" stopColor={STROKE} stopOpacity={0} />
          </radialGradient>
          {/* Blue strongest around the core, fading outward */}
          <radialGradient
            id={blueId}
            gradientUnits="userSpaceOnUse"
            cx={STACK_CX}
            cy={STACK_CY}
            r={1000}
            gradientTransform={`translate(${STACK_CX} ${STACK_CY}) scale(1 0.55) translate(${-STACK_CX} ${-STACK_CY})`}
          >
            <stop offset="0" stopColor={STROKE} stopOpacity={0.6} />
            <stop offset="0.4" stopColor={STROKE} stopOpacity={0.42} />
            <stop offset="0.75" stopColor={STROKE} stopOpacity={0.12} />
            <stop offset="1" stopColor={STROKE} stopOpacity={0} />
          </radialGradient>
        </defs>
        {core === "glow" && (
          <motion.rect
            x={STACK_CX - 460}
            y={STACK_CY - 92}
            width={920}
            height={184}
            fill={`url(#${glowId})`}
            style={{ opacity: reduce ? 1 : glowOpacity }}
          />
        )}
        <g mask={lineMask}>
          <g opacity={0.2}>
            {CAPACITOR.map(({ d }, i) => (
              <motion.path
                key={i}
                d={d}
                {...LINE}
                {...drawOn(reduce, i, CAPACITOR.length)}
              />
            ))}
          </g>
          {core !== "none" && (
            <motion.g style={{ opacity: reduce ? 1 : blueOpacity }}>
              {CAPACITOR.map(({ d }, i) => (
                <path key={i} d={d} {...LINE} stroke={`url(#${blueId})`} />
              ))}
            </motion.g>
          )}
          {!reduce && withPulses && (
            <motion.g style={{ opacity: pulseOpacity }}>
              <g opacity={0.6}>
                {CAPACITOR.map(({ d, flow }, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    {...LINE}
                    strokeWidth={1.5}
                    pathLength={1}
                    strokeDasharray="0.08 2"
                    style={{
                      strokeDashoffset: flow === 1 ? forward : backward,
                    }}
                  />
                ))}
              </g>
            </motion.g>
          )}
        </g>
      </ArtFrame>
    </div>
  )
}

/**
 * Final slide: scrolling down to it grows the phyllotaxis outward from its
 * (off-canvas) center while it unfurls a few degrees, landing complete as
 * the slide settles.
 */
function PhyllotaxisArt({ mask }: { mask: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const group = useRef<SVGGElement>(null)
  const gradientId = useId()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.05"],
  })
  const progress = useSpring(scrollYProgress, SCROLL_SPRING)
  const grow = useTransform(progress, [0, 1], [0.04, 1])
  // The core picks up blue over the last stretch, as the pattern completes.
  const bloom = useTransform(progress, [0.7, 1], [0, 1])
  const rotate = (v: number) =>
    `rotate(${-28 * (1 - v)} ${PHYLLO_CX} ${PHYLLO_CY})`

  useMotionValueEvent(progress, "change", (v) => {
    if (!reduce) group.current?.setAttribute("transform", rotate(v))
  })

  const arms = (stroke?: string) =>
    PHYLLOTAXIS.map((d, i) => (
      <motion.path
        key={i}
        d={d}
        {...LINE}
        {...(stroke && { stroke })}
        style={reduce ? undefined : { pathLength: grow }}
      />
    ))

  return (
    <div ref={ref} className="absolute inset-0">
      <ArtFrame mask={mask}>
        <defs>
          {/* Blue concentrated at the flower's core, dissolving outward */}
          <radialGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            cx={PHYLLO_CX}
            cy={PHYLLO_CY}
            r={950}
          >
            <stop offset="0" stopColor={STROKE} stopOpacity={0.85} />
            <stop offset="0.45" stopColor={STROKE} stopOpacity={0.4} />
            <stop offset="1" stopColor={STROKE} stopOpacity={0} />
          </radialGradient>
        </defs>
        <g ref={group} transform={rotate(reduce ? 1 : progress.get())}>
          <g opacity={0.2}>{arms()}</g>
          <motion.g style={{ opacity: reduce ? 1 : bloom }}>
            {arms(`url(#${gradientId})`)}
          </motion.g>
        </g>
      </ArtFrame>
    </div>
  )
}

export function LineArt({ variant }: { variant: LineArtVariant }) {
  const reduce = useReducedMotion()
  if (variant === "signal") return <SignalArt mask={MASKS.signal} />
  if (variant === "capacitor") return <CapacitorArt mask={MASKS.capacitor} />
  if (variant === "capacitorFade")
    return <CapacitorArt mask={MASKS.capacitor} core="fade" />
  if (variant === "capacitorGlow")
    return <CapacitorArt mask={MASKS.capacitor} core="glow" />
  if (variant === "phyllotaxis")
    return <PhyllotaxisArt mask={MASKS.phyllotaxis} />

  // Draw-on reveal; skipped entirely for reduced-motion users.
  const draw = (i: number, total: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: "some" as const },
          transition: {
            pathLength: {
              duration: 2.4,
              ease: EASE,
              delay: (i / total) * 0.9,
            },
            opacity: { duration: 0.6, delay: (i / total) * 0.9 },
          },
        }

  const common = {
    fill: "none",
    stroke: STROKE,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
  }

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ maskImage: MASKS[variant], WebkitMaskImage: MASKS[variant] }}
    >
      <g opacity={0.2}>
        {variant === "contours" &&
          CONTOURS.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              {...common}
              {...draw(i, CONTOURS.length)}
            />
          ))}

        {variant === "constellation" && (
          <>
            {CONSTELLATION.lines.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                {...common}
                {...draw(i, CONSTELLATION.lines.length)}
              />
            ))}
            {CONSTELLATION.nodes.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={3} fill={STROKE} />
            ))}
            {CONSTELLATION.rings.map((i) => (
              <circle
                key={`ring-${i}`}
                cx={CONSTELLATION.nodes[i][0]}
                cy={CONSTELLATION.nodes[i][1]}
                r={14}
                {...common}
              />
            ))}
          </>
        )}

        {variant === "flow" &&
          FLOW.map((d, i) => (
            <motion.path key={i} d={d} {...common} {...draw(i, FLOW.length)} />
          ))}

        {variant === "flow2" &&
          FLOW2.map((d, i) => (
            <motion.path key={i} d={d} {...common} {...draw(i, FLOW2.length)} />
          ))}

        {variant === "amplify" &&
          AMPLIFY.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              {...common}
              {...draw(i, AMPLIFY.length)}
            />
          ))}

        {variant === "converge" &&
          CONVERGE.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              {...common}
              {...draw(i, CONVERGE.length)}
            />
          ))}

        {variant === "orbits" && (
          <g transform={`rotate(-16 ${W * 0.68} ${H * 0.5})`}>
            {ORBITS.map(({ d }, i) => (
              <motion.path
                key={i}
                d={d}
                {...common}
                {...draw(i, ORBITS.length)}
              />
            ))}
            {ORBITS.map(({ dot: [x, y] }, i) => (
              <circle key={`dot-${i}`} cx={x} cy={y} r={4} fill={STROKE} />
            ))}
          </g>
        )}

        {variant === "lens" &&
          LENS.map((d, i) => (
            <motion.path key={i} d={d} {...common} {...draw(i, LENS.length)} />
          ))}

        {variant === "ridges" &&
          RIDGES.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              {...common}
              {...draw(i, RIDGES.length)}
            />
          ))}
      </g>
    </svg>
  )
}
