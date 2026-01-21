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
        "text-xs gap-2 flex flex-col",
        "max-w-64",
        "lg:text-sm lg:max-w-xs",
        className
      )}
    >
      {title && (
        <span
          className="font-display font-semibold text-xs lg:text-sm"
          style={{ color: highlightColor ?? "var(--color-light-blue)" }}
        >
          {title}
        </span>
      )}
      <span
        className={cx("font-light text-white/80 leading-normal", textClassName)}
      >
        {children}
      </span>
    </div>
  )
}

interface StandfirstProps extends BlurbProps {}

export function Standfirst(props: StandfirstProps) {
  return (
    <Blurb
      {...props}
      className={cx(
        "!max-w-lg pr-10 lg:pr-0 lg:max-w-[510px] mb-2",
        props.className
      )}
      textClassName={cx(
        "font-display text-xl lg:text-2xl font-thin",
        props.textClassName
      )}
    />
  )
}
