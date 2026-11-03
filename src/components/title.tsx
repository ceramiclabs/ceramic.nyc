import * as React from "react"
import cx from "clsx"
import { motion } from "framer-motion"

interface Props extends React.ComponentProps<"h2"> {
  children: React.ReactNode
  className?: string
}

export function Title({ children, className, ...attrs }: Props) {
  const childArray = React.Children.toArray(children)

  return (
    <h2
      className={cx(
        // Same scale as the hero headline (hero-section.tsx)
        "font-display font-bold leading-[1em] tracking-[-0.03em] text-[11vw]",
        "lg:shrink-0 lg:max-w-[60%] xl:text-[6.5rem] 2xl:text-[8rem]",
        "[&>span]:inline-block",
        className,
      )}
      {...attrs}
    >
      {childArray.map((child, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: index * 0.2,
          }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ display: "block" }}
        >
          {child}
        </motion.span>
      ))}
    </h2>
  )
}

export function Subtitle({ children, className, ...attrs }: Props) {
  const childArray = React.Children.toArray(children)

  return (
    <h3
      className={cx(
        "leading-[.95em] tracking-[-0.1rem] font-display font-bold text-[2.5rem]",
        "lg:text-[6rem] lg:tracking-[-0.25rem] lg:leading-[.9em]",
        "border-b border-stone-700 pb-7 lg:pb-9 mt-4",
        "[&>span]:inline-block",
        className,
      )}
      {...attrs}
    >
      {childArray.map((child, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: index * 0.2,
          }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ display: "block" }}
        >
          {child}
        </motion.span>
      ))}
    </h3>
  )
}
