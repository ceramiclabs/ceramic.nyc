import cx from "clsx"

interface StandfirstProps {
  children: React.ReactNode
  className?: string
  textClassName?: string
}

export function Standfirst({
  className,
  textClassName,
  children,
}: StandfirstProps) {
  return (
    <div className={cx("flex w-full max-w-xs lg:max-w-sm", className)}>
      <span
        className={cx(
          "text-white/80 leading-normal text-pretty text-xl font-display font-thin",
          "lg:text-2xl lg:max-w-lg",
          textClassName,
        )}
      >
        {children}
      </span>
    </div>
  )
}
