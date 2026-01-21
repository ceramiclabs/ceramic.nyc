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
        "leading-[.75em] tracking-[-0.3rem] font-display font-bold text-[5rem]",
        "lg:text-[10rem] lg:flex-shrink-0 lg:max-w-[60%]",
        "[&>span]:inline-block",
        className
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
        "leading-[.9em] tracking-[-0.1rem] font-display font-bold text-[2.5rem]",
        "lg:text-[6rem] lg:tracking-[-0.25rem] lg:leading-[.8em]",
        "border-b border-stone-700 pb-9 mt-4",
        "[&>span]:inline-block",
        className
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
