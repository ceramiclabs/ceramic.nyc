import * as React from "react"
import { motion, type TargetAndTransition } from "framer-motion"
import cx from "clsx"
import { Noise } from "./noise"
import { Container } from "./container"

// Soft ease-out (expo-like): fast start, long gentle settle — no overshoot.
export const EASE = [0.22, 1, 0.36, 1] as const

export type HeadlineLine = { text: string; className?: string }

// Headline scales. Secondary is ~75% of primary so the hero stays the only
// oversized type; secondary sizes fit "Product-forward." on one line at
// every breakpoint.
const HEADLINE_SIZES = {
  primary: "text-[11vw] xl:text-[6.5rem] 2xl:text-[8rem]",
  secondary: "text-[10.5vw] sm:text-[9.5vw] lg:text-[5rem] 2xl:text-[6rem]",
} as const

interface Props {
  id: string
  lines: Array<HeadlineLine>
  /** Right-hand column on desktop (stacks under the headline below xl). */
  aside: React.ReactNode
  /** Row under the headline, e.g. CTAs. */
  actions?: React.ReactNode
  /** Full-width row at the bottom of the section. */
  footer?: React.ReactNode
  /** Decorative layer behind the content (e.g. <LineArt />). */
  background?: React.ReactNode
  headingLevel?: "h1" | "h2"
  /** "primary" for the hero; "secondary" for every other slide. */
  size?: keyof typeof HEADLINE_SIZES
  /**
   * "mount": animate on page load, held until `ready` (e.g. fonts loaded).
   * "inView": animate when scrolled into view.
   */
  trigger?: "mount" | "inView"
  ready?: boolean
}

/**
 * Shared layout for the headline-led sections (hero, product, contact):
 * big headline on the left, standfirst on the right, optional CTA row and
 * footer row. Stacks on mobile/tablet, splits at xl.
 */
export function SplitSection({
  id,
  lines,
  aside,
  actions,
  footer,
  background,
  headingLevel = "h2",
  size = "secondary",
  trigger = "inView",
  ready = true,
}: Props) {
  const Heading = headingLevel === "h1" ? motion.h1 : motion.h2

  // Same target/timing for both triggers; only *when* it plays differs.
  const reveal = (target: TargetAndTransition) =>
    trigger === "inView"
      ? { whileInView: target, viewport: { once: true, amount: 0.3 } }
      : { animate: ready ? target : undefined }

  return (
    <section
      id={id}
      className={cx(
        "relative box-border min-h-screen flex flex-col justify-center pt-28 pb-36",
        "xl:pb-28",
      )}
    >
      {background && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {background}
        </div>
      )}
      <Noise />
      <Container className="relative z-10 flex flex-col">
        <div
          className={cx(
            "flex flex-col gap-10",
            "xl:flex-row xl:items-center",
            // Gap grows with the viewport (64px at 1280 → 144px cap ~2300+)
            "xl:gap-[clamp(4rem,8vw_-_3rem,9rem)]",
          )}
        >
          <Heading
            className={cx(
              "font-display font-bold leading-[1em] tracking-[-0.03em]",
              HEADLINE_SIZES[size],
              // Size to content, but give way to the aside's min width; lines
              // then wrap only at hyphens (spaces are non-breaking below).
              "xl:flex-[0_1_auto] xl:min-w-0",
            )}
          >
            {lines.map((line, index) => (
              <motion.span
                key={line.text}
                className={cx("block", line.className)}
                initial={{ opacity: 0, y: "0.3em" }}
                {...reveal({ opacity: 1, y: 0 })}
                transition={{ duration: 1, ease: EASE, delay: index * 0.12 }}
              >
                {line.text.replace(/ /g, " ")}
              </motion.span>
            ))}
          </Heading>

          <motion.div
            className="xl:flex-[1_1_0] xl:min-w-[12.5rem]"
            initial={{ opacity: 0, x: 24 }}
            {...reveal({ opacity: 1, x: 0 })}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          >
            {aside}
          </motion.div>
        </div>

        {actions && (
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-16"
            initial={{ opacity: 0, y: 12 }}
            {...reveal({ opacity: 1, y: 0 })}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            {actions}
          </motion.div>
        )}

        {footer && (
          <motion.div
            className="mt-16 border-t border-white/10 pt-5 lg:mt-20"
            initial={{ opacity: 0 }}
            {...reveal({ opacity: 1 })}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          >
            {footer}
          </motion.div>
        )}
      </Container>
    </section>
  )
}
