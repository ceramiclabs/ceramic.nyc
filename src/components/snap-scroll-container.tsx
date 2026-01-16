import * as React from "react"

interface Props {
  children: React.ReactNode
}

export function SnapScrollContainer({ children }: Props) {
  return (
    <div
      id="scroll-container"
      className="snap-y snap-mandatory overflow-y-scroll h-screen"
    >
      {children}
    </div>
  )
}

export function SnapScrollSection({ children }: Props) {
  return (
    <div className="snap-start snap-always h-screen flex justify-center items-center">
      {children}
    </div>
  )
}
