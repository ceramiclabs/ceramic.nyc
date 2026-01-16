import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { SectionNav } from "./components/section-nav"
import { ChevronButton } from "./components/chevron-button"
import { AlsideCaseStudy } from "./components/alside-case-study"
import { ArenaCaseStudy } from "./components/arena-case-study"
import { RendevuCaseStudy } from "./components/rendevu-case-study"
import {
  ContactSection,
  IntroSection,
  ProductSection,
} from "./components/sections"

export function App() {
  return (
    <div className="relative">
      <Header />
      <SectionNav />
      <ChevronButton />
      <main>
        <IntroSection />
        <ProductSection />
        <AlsideCaseStudy />
        <ArenaCaseStudy />
        <RendevuCaseStudy />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
