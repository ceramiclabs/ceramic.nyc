import { motion, useReducedMotion } from "framer-motion"
import { EASE } from "./split-section"

/**
 * Abstract background line art for headline slides. Thin light-blue strokes
 * at low opacity, faded toward the edges, drawn in once when scrolled into
 * view. Rendered behind the slide content (see SplitSection `background`).
 */

export type LineArtVariant = "converge" | "phyllotaxis"

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

const toPath = (pts: Array<[number, number]>) =>
  pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join("")

/**
 * The design process. Disparate, tangled threads on the left are woven
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
 * Phyllotaxis. Each point sits one golden angle (~137.5°) past the last,
 * a little farther out. That single rule yields two interlocking families of
 * spirals (21 one way, 34 the other) that never crowd or break as they grow:
 * scale without losing grace. We draw the spiral arms (parastichies) as
 * continuous curves, centered off-canvas so only a sweep of them shows.
 */
function phyllotaxis() {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const N = 1400 // seeds; sets how far the pattern reaches
  const cx = W * 0.94
  const cy = H * 1.02
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

// Computed once at module load.
const PATHS: Record<LineArtVariant, Array<string>> = {
  converge: converge(),
  phyllotaxis: phyllotaxis(),
}

const MASKS: Record<LineArtVariant, string> = {
  converge:
    "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
  phyllotaxis:
    "radial-gradient(ellipse 75% 95% at 94% 100%, #000 25%, transparent 100%)",
}

export function LineArt({ variant }: { variant: LineArtVariant }) {
  const reduce = useReducedMotion()
  const paths = PATHS[variant]

  // Draw-on reveal; skipped entirely for reduced-motion users. "some" so
  // paths that run mostly off-canvas still trigger.
  const draw = (i: number) =>
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
              delay: (i / paths.length) * 0.9,
            },
            opacity: { duration: 0.6, delay: (i / paths.length) * 0.9 },
          },
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
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={STROKE}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            {...draw(i)}
          />
        ))}
      </g>
    </svg>
  )
}
