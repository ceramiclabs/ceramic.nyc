import * as React from "react"
import { motion } from "framer-motion"
import cx from "clsx"

interface Props {
  children: React.ReactNode
  className?: string
}

export function Blurbs({ children, className }: Props) {
  const childArray = React.Children.toArray(children)

  return (
    <div
      className={cx("flex flex-col gap-6 z-5 lg:gap-8 lg:flex-1", className)}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.4 + index * 0.2,
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

interface BlurbProps {
  title?: string
  highlightColor?: string
  children: React.ReactNode
  className?: string
  textClassName?: string
}

export function Blurb({
  title,
  highlightColor,
  children,
  className,
  textClassName,
}: BlurbProps) {
  return (
    <div
      className={cx(
        "text-sm gap-2 flex flex-col w-full max-w-xl lg:max-w-sm",
        "lg:text-base",
        className,
      )}
    >
      {title && (
        <span
          className="font-display font-semibold text-sm lg:text-base"
          style={{ color: highlightColor ?? "var(--color-light-blue)" }}
        >
          {title}
        </span>
      )}
      <span
        className={cx(
          // Right padding softens the rag. Kept on this auto-width span (not
          // the w-full parent) because the site's elements are content-box.
          "font-light text-white/80 leading-normal text-pretty pr-4 lg:pr-6",
          textClassName,
        )}
      >
        {children}
      </span>
    </div>
  )
}
