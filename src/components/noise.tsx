interface Props {
  backgroundColor?: string
}

export function Noise({ backgroundColor = "transparent" }: Props) {
  return (
    <div className="noise-wrapper" style={{ backgroundColor }}>
      <div className="noise" />
    </div>
  )
}
