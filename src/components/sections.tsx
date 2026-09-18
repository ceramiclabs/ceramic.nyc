import { ScrollSection } from "../components/scroll-section"
import { Title } from "../components/title"
import { Standfirst } from "../components/standfirst"

export function ProductSection() {
  return (
    <ScrollSection id="product">
      <Title>
        <span>Product-forward.</span>
        <span>AI-native.</span>
        <span className="blue">Human-centered.</span>
      </Title>
      <Standfirst>
        <span className="blue font-semibold">
          We design systems and experiences that amplify human capability
        </span>
        , informed by real users and measured by business impact. We fuse
        AI-native research, design, and execution with old-school craft.
      </Standfirst>
    </ScrollSection>
  )
}

export function IntroSection() {
  return (
    <ScrollSection id="intro">
      <Title>
        <span className="blue">Design-driven.</span>
        <span>Forward-thinking.</span>
        <span>Exacting.</span>
      </Title>
      <Standfirst>
        Perfection doesn&rsquo;t exist. The work is to{" "}
        <span className="blue font-semibold">continuously refine and ship</span>
        . We apply creativity to every aspect of our work and continuously
        sharpen our craft.
      </Standfirst>
    </ScrollSection>
  )
}

export function ContactSection() {
  return (
    <ScrollSection id="contact">
      <Title>
        <span>Your</span>
        <span className="blue">force multiplier.</span>
        <span className="smaller">
          <a href="mailto:hello@ceramic.nyc">hello@ceramic.nyc</a>
        </span>
      </Title>
      <Standfirst>
        <span className="blue font-semibold">
          Founder-grade product and engineering
        </span>
        , embedded until the job is done. From first principles to production,
        we work the problem end to end. We move fast, ship what matters, and
        keep moving.
      </Standfirst>
    </ScrollSection>
  )
}
