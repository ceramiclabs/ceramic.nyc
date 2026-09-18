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
    <div
      className={cx("flex max-w-lg pr-10 lg:pr-0 lg:max-w-[510px]", className)}
    >
      <span
        className={cx(
          "text-white/80 leading-normal text-balance text-xl font-display font-thin",
          "lg:text-2xl ",
          textClassName,
        )}
      >
        {children}
      </span>
    </div>
  )
}
