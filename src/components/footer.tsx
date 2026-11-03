import { Container } from "./container"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-3">
      <Container className="text-white/40">
        &copy;{new Date().getFullYear()} Ceramic LLC
      </Container>
    </footer>
  )
}
