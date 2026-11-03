import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
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
 * Abstract background line art for the headline slides: thin light-blue
 * strokes at low opacity, faded toward the edges, each tied to scroll.
 * Rendered behind the slide content (see SplitSection `background`).
 *
 * - "capacitor" (hero): the electric field of a multilayer ceramic capacitor
 * - "signal" (product): noise resolving into signal as you scroll
 * - "phyllotaxis" (contact): golden-angle spirals growing in as you arrive
 */
export type LineArtVariant = "capacitor" | "signal" | "phyllotaxis"

const W = 1600
const H = 1000
const STROKE = "var(--color-light-blue)"

const LINE = {
  fill: "none",
  stroke: STROKE,
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke" as const,
}

// Shared smoothing for scroll-linked art: trails the scroll a little and
// settles without overshoot.
const SCROLL_SPRING = { stiffness: 60, damping: 24, mass: 0.6 }

const MASKS: Record<LineArtVariant, string> = {
  capacitor:
    "radial-gradient(ellipse 60% 75% at 68% 50%, #000 35%, transparent 100%)",
  signal:
    "linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
  phyllotaxis:
    "radial-gradient(ellipse 75% 95% at 94% 100%, #000 25%, transparent 100%)",
}

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

function ArtFrame({
  mask,
  viewBox = `0 0 ${W} ${H}`,
  children,
}: {
  mask: string
  viewBox?: string
  children: ReactNode
}) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {children}
    </svg>
  )
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

/* -------------------------------------------------------------------------- */
/* Capacitor (hero)                                                           */
/* -------------------------------------------------------------------------- */

// Where the (invisible) electrode stack sits.
const STACK_CX = W * 0.68
const STACK_CY = H * 0.5

/**
 * The field of a multilayer ceramic capacitor (MLCC), where Ceramic's name
 * comes from. Six electrode layers alternate +/− and are offset toward
 * opposite terminals, so the field leaking from the outer layers curls around
 * opposite ends: an S of nested loops. Lines are traced through the exact
 * field of uniformly charged finite plates, so the shapes are physically real.
 */
function capacitorPaths() {
  const layers = 6
  const gap = 34
  const len = 700
  const offset = 40
  const plates = Array.from({ length: layers }, (_, p) => {
    const sign = p % 2 === 0 ? 1 : -1
    const a = STACK_CX - len / 2 + sign * offset
    return { sign, y: STACK_CY + (p - (layers - 1) / 2) * gap, a, b: a + len }
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
      // Stop well past where the edge mask hides everything (it reaches
      // ~960 × 750 units from the core), so wide screens never show an end.
      const far = ((x - STACK_CX) / 1500) ** 2 + ((y - STACK_CY) / 1100) ** 2
      if (done || far > 1) break
    }
    return toPath(pts)
  }

  const top = plates[0]
  const bottom = plates[layers - 1]
  const lines: Array<string> = []
  for (let x = top.a + 28; x < top.b; x += 22)
    lines.push(trace(x, top.y - 1, 1, -1))
  for (let x = bottom.a + 28; x < bottom.b; x += 22)
    lines.push(trace(x, bottom.y + 1, -1, 1))
  return lines
}

const CAPACITOR = capacitorPaths()

// Visibility of the lines by distance from the core (mask luminance). Fully
// hidden just around the plates, so their literal edges never show, then a
// long ease-in so the lines dissolve into the dark rather than stopping at
// the rim of a hole.
const CORE_FADE: Array<[number, number]> = [
  [0, 0],
  [0.44, 0],
  [0.56, 0.14],
  [0.7, 0.45],
  [0.85, 0.8],
  [1, 1],
]

// The field scales with the viewport like a cover image up to this factor
// (about a 2000px-wide screen), then stops, staying in proportion to the
// headline, which stops growing at 2xl.
const CAPACITOR_MAX_SCALE = 1.25

function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/**
 * Frame the field for a w × h box: the core sits behind the standfirst
 * (68% across, or a fixed distance in from the content column on very wide
 * screens, where the type has stopped growing), at capped scale. Below the
 * cap this matches a plain `slice` of the 1600 × 1000 canvas exactly.
 */
function capacitorFrame(w: number, h: number) {
  const s = Math.min(Math.max(w / W, h / H), CAPACITOR_MAX_SCALE)
  const x = Math.min(w * 0.68, w * 0.1 + 1300)
  const y = h * 0.5
  return {
    viewBox: [STACK_CX - x / s, STACK_CY - y / s, w / s, h / s].join(" "),
    mask: `radial-gradient(ellipse ${960 * s}px ${750 * s}px at ${x}px ${y}px, #000 35%, transparent 100%)`,
  }
}

/**
 * Hero: the field draws in on load, dissolving into the (unseen) electrode
 * stack, then lights up with a blue gradient centered on the core and stays
 * lit. Scrolling out of the hero dims it again.
 */
function CapacitorArt({ mask }: { mask: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const frame = size && size.w > 0 ? capacitorFrame(size.w, size.h) : null
  const id = useId()
  const fadeId = `${id}-fade`
  const maskId = `${id}-mask`
  const blueId = `${id}-blue`
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const scrolled = useSpring(scrollYProgress, SCROLL_SPRING)

  // 1 → 0 on load ("charging"), starting once the lines are mostly drawn.
  const charge = useMotionValue(reduce ? 0 : 1)
  useEffect(() => {
    if (reduce) return
    const controls = animate(charge, 0, {
      duration: 3.2,
      ease: "easeInOut",
      delay: 1.4,
    })
    return () => controls.stop()
  }, [charge, reduce])

  // Whichever is further along wins, so scrolling mid-intro just takes over.
  const dim = useTransform([charge, scrolled], ([a, b]: Array<number>) =>
    Math.max(a, b),
  )
  const blueOpacity = useTransform(dim, [0, 0.9], [1, 0])

  return (
    <div ref={ref} className="absolute inset-0">
      <ArtFrame mask={frame?.mask ?? mask} viewBox={frame?.viewBox}>
        <defs>
          {/* Elliptical falloff around the stack: black (hidden) at the
              core, white (visible) beyond it. Stretched 3:1 horizontally. */}
          <radialGradient
            id={fadeId}
            gradientUnits="userSpaceOnUse"
            cx={STACK_CX}
            cy={STACK_CY}
            r={950}
            gradientTransform={`translate(${STACK_CX} ${STACK_CY}) scale(1 0.31) translate(${-STACK_CX} ${-STACK_CY})`}
          >
            {CORE_FADE.map(([offset, v]) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={`rgb(${v * 255} ${v * 255} ${v * 255})`}
              />
            ))}
          </radialGradient>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-1000}
            y={-1000}
            width={W + 2000}
            height={H + 2000}
          >
            <rect
              x={-1000}
              y={-1000}
              width={W + 2000}
              height={H + 2000}
              fill={`url(#${fadeId})`}
            />
          </mask>
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
        <g mask={`url(#${maskId})`}>
          <g opacity={0.2}>
            {CAPACITOR.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                {...LINE}
                {...drawOn(reduce, i, CAPACITOR.length)}
              />
            ))}
          </g>
          <motion.g style={{ opacity: reduce ? 1 : blueOpacity }}>
            {CAPACITOR.map((d, i) => (
              <path key={i} d={d} {...LINE} stroke={`url(#${blueId})`} />
            ))}
          </motion.g>
        </g>
      </ArtFrame>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Signal (product)                                                           */
/* -------------------------------------------------------------------------- */

/*
 * Noise → signal, driven by scroll. Each strand is a blend of jittery,
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

/* -------------------------------------------------------------------------- */
/* Phyllotaxis (contact)                                                      */
/* -------------------------------------------------------------------------- */

const PHYLLO_CX = W * 0.94
const PHYLLO_CY = H * 1.02

/**
 * Each point sits one golden angle (~137.5°) past the last, a little farther
 * out. That single rule yields two interlocking families of spirals (21 one
 * way, 34 the other) that never crowd or break as they grow: scale without
 * losing grace. We draw the spiral arms (parastichies) as continuous curves,
 * centered off-canvas so only a sweep of them shows.
 */
function phyllotaxisPaths() {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const N = 1400 // seeds; sets how far the pattern reaches
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
        pts.push([PHYLLO_CX + r * Math.cos(a), PHYLLO_CY + r * Math.sin(a)])
      }
      arms.push(toPath(pts))
    }
  }
  return arms
}

const PHYLLOTAXIS = phyllotaxisPaths()

/**
 * Final slide: scrolling down to it grows the phyllotaxis outward from its
 * (off-canvas) center while it unfurls a few degrees, landing complete as
 * the slide settles, when its core picks up blue.
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

/* -------------------------------------------------------------------------- */

export function LineArt({ variant }: { variant: LineArtVariant }) {
  const mask = MASKS[variant]
  if (variant === "capacitor") return <CapacitorArt mask={mask} />
  if (variant === "signal") return <SignalArt mask={mask} />
  return <PhyllotaxisArt mask={mask} />
}
