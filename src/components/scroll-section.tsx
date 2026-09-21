import * as React from "react"
import cx from "clsx"
import { Noise } from "./noise"
import { Container } from "./container"

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
        "relative min-h-screen flex justify-start items-center",
        "last:pb-24 lg:last:pb-0",
      )}
    >
      <Noise backgroundColor={backgroundColor} />
      <Container
        className={cx(
          "relative z-10 flex flex-col gap-16",
          "lg:flex-row lg:items-center lg:gap-20",
        )}
      >
        {children}
      </Container>
    </section>
  )
}
