import logoSvg from "../assets/ceramic-logo.svg"

export function Header() {
  return (
    <header className="fixed w-full top-0 left-0 z-[101] py-6">
      <div className="mx-auto max-w-[80%]">
        <div className="logo">
          <img src={logoSvg} alt="Logo" className="w-20 relative top-0.5" />
        </div>
      </div>
    </header>
  )
}
