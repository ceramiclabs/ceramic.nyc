import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import cx from "clsx"
import { track } from "@amplitude/unified"

export const BOOKING_URL = "https://calendly.com/brian-ceramic/30min"
export const CONTACT_EMAIL = "hello@ceramic.nyc"

const GLOW =
  "0 0 8px 2px rgba(173, 216, 230, 0.6), 0 0 16px 4px rgba(173, 216, 230, 0.3)"

// Shared by both CTA styles so the label inset (border + padding) matches and
// stacked buttons' text lines up on mobile.
const BUTTON_SHAPE = cx(
  "group inline-flex items-center gap-2 rounded-full border px-6 py-3.5",
  "font-display font-semibold text-lg lg:px-7 lg:py-4 lg:text-xl",
)

/** Primary pill CTA — opens the Calendly booking page. */
export function BookIntroCallButton({ location }: { location: string }) {
  return (
    <motion.a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("Intro Call Clicked", { location })}
      className={cx(BUTTON_SHAPE, "border-transparent text-black")}
      style={{ backgroundColor: "var(--color-light-blue)" }}
      whileHover={{ scale: 1.03, boxShadow: GLOW }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      Book an intro call
      <ArrowUpRight
        className={cx(
          "w-5 h-5 transition-transform duration-300",
          "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
        )}
        strokeWidth={2.25}
      />
    </motion.a>
  )
}

type TextActionProps = {
  children: React.ReactNode
  /** Lucide icon component, e.g. ArrowDown or ArrowUpRight */
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  /** Tailwind classes for the icon's hover nudge, matching its direction */
  iconHoverClassName?: string
} & (
  | ({ href: string } & Omit<React.ComponentProps<"a">, "children">)
  | ({ href?: undefined } & Omit<React.ComponentProps<"button">, "children">)
)

/** Secondary ghost-button CTA ("See our work", email link). */
export function TextAction({
  children,
  icon: Icon,
  iconHoverClassName = "group-hover:translate-x-0.5",
  className,
  ...props
}: TextActionProps) {
  const classes = cx(
    BUTTON_SHAPE,
    "border-white/25 text-white transition-colors duration-300",
    "hover:border-[#add8e6]/60 hover:bg-white/5 hover:text-[#add8e6]",
    className,
  )
  const content = (
    <>
      {children}
      <Icon
        className={cx(
          "w-5 h-5 transition-transform duration-300",
          iconHoverClassName,
        )}
        strokeWidth={2.25}
      />
    </>
  )

  if (props.href !== undefined) {
    return (
      <a className={classes} {...(props as React.ComponentProps<"a">)}>
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={classes}
      {...(props as React.ComponentProps<"button">)}
    >
      {content}
    </button>
  )
}

export const LINKEDIN_URL = "https://www.linkedin.com/company/ceramic-nyc"

/** Icon-only, muted LinkedIn link sized to sit in a row of CTAs. */
export function LinkedInButton({ location }: { location: string }) {
  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ceramic on LinkedIn"
      onClick={() => track("LinkedIn Clicked", { location })}
      className={cx(
        // A circle the same height as the text buttons (BUTTON_SHAPE)
        "group inline-flex size-[58px] items-center justify-center rounded-full border",
        "border-white/15 text-white/40 transition-colors duration-300",
        "hover:border-[#add8e6]/60 hover:bg-white/5 hover:text-[#add8e6]",
        "lg:size-[62px]",
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
  )
}
