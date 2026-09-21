import cx from "clsx"

export interface ContainerProps {
  className?: string
  children?: React.ReactNode
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cx("mx-auto w-full max-w-[80%]", className)}>
      {children}
    </div>
  )
}
