import { ArrowUpRight } from "lucide-react"
import { track } from "@amplitude/unified"
import { ScrollSection } from "../components/scroll-section"
import { Title } from "../components/title"
import { Standfirst } from "../components/standfirst"
import { Blurbs } from "./blurbs"
import { SplitSection } from "./split-section"
import { LineArt } from "./line-art"
import { BookIntroCallButton, CONTACT_EMAIL, TextAction } from "./cta"
import { Nowrap } from "./nowrap"

export function ProductSection() {
  return (
    <SplitSection
      id="product"
      background={<LineArt variant="converge" />}
      lines={[
        { text: "AI-native." },
        { text: "Product-forward." },
        { text: "Human-centered.", className: "blue" },
      ]}
      aside={
        <Standfirst className="lg:max-w-lg xl:max-w-md">
          We design systems and experiences that amplify human capability,
          informed by real users and measured by business impact. We fuse{" "}
          <Nowrap>AI-native</Nowrap> research, design, and execution with{" "}
          <Nowrap>old-school</Nowrap> craft.
        </Standfirst>
      }
    />
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
      <Blurbs>
        <Standfirst>
          Perfection doesn&rsquo;t exist. The work is to{" "}
          <span className="blue font-semibold">
            continuously refine and ship
          </span>
          . We apply creativity to every aspect of our work and continuously
          sharpen our craft.
        </Standfirst>
      </Blurbs>
    </ScrollSection>
  )
}

export function ContactSection() {
  return (
    <SplitSection
      id="contact"
      lines={[
        { text: "We’re your" },
        { text: "force multiplier.", className: "blue" },
      ]}
      aside={
        <Standfirst className="lg:max-w-lg xl:max-w-md">
          Founder-grade product and engineering, embedded until the job is done.
          Together we can take any idea from conception to delivery and beyond.
        </Standfirst>
      }
      actions={
        <>
          <BookIntroCallButton location="contact" />
          <TextAction
            href={`mailto:${CONTACT_EMAIL}`}
            icon={ArrowUpRight}
            iconHoverClassName="group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            onClick={() => track("Contact Clicked", { location: "contact" })}
          >
            {CONTACT_EMAIL}
          </TextAction>
        </>
      }
    />
  )
}
