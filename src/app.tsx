import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { SectionNav } from "./components/section-nav"
import { ChevronButton } from "./components/chevron-button"
import { ArenaCaseStudy } from "./components/arena-case-study"
import { RendevuCaseStudy } from "./components/rendevu-case-study"
import { HeroSection } from "./components/hero-section"
import { ContactSection, ProductSection } from "./components/sections"

export function App() {
  return (
    <div className="relative">
      <Header />
      <SectionNav />
      <ChevronButton />
      <main>
        <HeroSection />
        <ProductSection />
        <ArenaCaseStudy />
        <RendevuCaseStudy />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
