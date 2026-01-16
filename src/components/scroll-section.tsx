import * as React from "react"
import cx from "clsx"
import { Noise } from "./noise"

interface Props {
  id?: string
  children: React.ReactNode
  backgroundColor?: string
}

export function ScrollSection({ id, children, backgroundColor }: Props) {
  return (
    <section
      id={id}
      className={cx(
        "relative min-h-screen pt-24 flex justify-start items-start",
        "lg:items-center lg:pt-0 last:pb-24 lg:last:pb-0"
      )}
    >
      <Noise backgroundColor={backgroundColor} />
      <div
        className={cx(
          "relative z-10 mx-auto max-w-[80%] flex flex-col gap-16",
          "lg:flex-row lg:items-center lg:gap-20"
        )}
      >
        {children}
      </div>
    </section>
  )
}
