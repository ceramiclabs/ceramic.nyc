import { ScrollSection } from "../components/scroll-section"
import { Title } from "../components/title"
import { Blurb, Blurbs, Standfirst } from "../components/blurbs"

export function IntroSection() {
  return (
    <ScrollSection id="intro">
      <Title className="!2xl:max-w-[70%]">
        <span className="blue">Dual CTOs.</span>
        <span>Experts in product-led innovation</span>
        <span>&amp; modern dev.</span>
      </Title>
      <Blurbs>
        <Standfirst className="lg:!max-w-[430px]">
          Large teams, small team, no team, building cultures and devx from
          scratch. The goal is the same &mdash;{" "}
          <span className="blue font-semibold">
            dig your heels in and deliver.
          </span>
        </Standfirst>
        <Blurb title="Forward-thinking" className="lg:!max-w-[310px]">
          Obsessively explore emerging technologies, optimizing our tooling -
          never rigid in our methods and selection process.
        </Blurb>
        <Blurb title="Design-driven">
          With backgrounds in architecture and UX design, we apply creativity to
          all aspects of our work and constantly refine our craft.
        </Blurb>
      </Blurbs>
    </ScrollSection>
  )
}

export function ProductSection() {
  return (
    <ScrollSection id="product" backgroundColor="bg-light-blue/70">
      <Title>
        <span>Product-forward.</span>
        <span>AI-native.</span>
        <span className="blue">Human-centered.</span>
      </Title>
      <Blurbs>
        <Standfirst className="lg:!max-w-[450px]">
          <span className="blue font-semibold">We build with intent.</span>{" "}
          Every decision is measured against real user needs and business
          impact.
        </Standfirst>
        <Blurb title="Skip the hype" className="lg:!max-w-[350px]">
          Old-school craft. New-school tools. We marry traditional engineering
          rigor with AI-native thinking.
        </Blurb>
        <Blurb title="Unapologetically human">
          Technology serves people. We design systems and experiences that
          augment human capability, not replace it.
        </Blurb>
      </Blurbs>
    </ScrollSection>
  )
}

export function ContactSection() {
  return (
    <ScrollSection id="contact">
      <Title>
        <span>Let us be</span>
        <span className="blue">your force multiplier.</span>
        <span className="smaller">
          <a href="mailto:hello@ceramic.nyc">hello@ceramic.nyc</a>
        </span>
      </Title>
      <Blurbs className="lg:self-start lg:mt-6">
        <Standfirst className="lg:!max-w-[440px]">
          <span className="blue font-semibold">Do more with less.</span> You
          decide on the footprint, together we can tackle any idea from
          conception to delivery and beyond.
        </Standfirst>
        <Blurb title="No death by process">
          Time is money, and speed is the strategy. We stay light, move fast,
          and ship what matters.
        </Blurb>
        <Blurb title="We keep it simple">
          Retain us for Advisory &amp; Leadership; Hire us for Design & Software
          Development. Our favorite &mdash; Do both. Either way, we come in hot.
        </Blurb>
      </Blurbs>
    </ScrollSection>
  )
}
