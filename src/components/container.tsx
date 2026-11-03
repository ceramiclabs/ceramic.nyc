import cx from "clsx"

export interface ContainerProps {
  className?: string
  children?: React.ReactNode
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cx(
        // Phones: 24px gutters. sm and up: centered 80% column.
        "mx-auto w-full max-w-[calc(100%-3rem)] sm:max-w-[80%]",
        className,
      )}
    >
      {children}
    </div>
  )
}
