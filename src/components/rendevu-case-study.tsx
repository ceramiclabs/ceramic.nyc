import { CaseStudySection } from "./case-study-section"
import { Blurb, Blurbs } from "./blurbs"
import { Standfirst } from "./standfirst"
import { Nowrap } from "./nowrap"
import { Subtitle, Title } from "./title"
import rendevuBackground from "../assets/rendevu-card-design.png"

const HIGHLIGHT_COLOR = "#ef5da8"
// Brand pink mixed ~10% toward white: lifts the lead off the background image
const LEAD_COLOR = "#f16db1"

export function RendevuCaseStudy() {
  return (
    <CaseStudySection
      id="rendevu"
      backgroundImage={rendevuBackground}
      title={
        <Title style={{ color: HIGHLIGHT_COLOR }}>
          <span>Rendevu</span>
        </Title>
      }
      subtitle={
        <Subtitle>
          <span>Practice</span>
          <span>Intelligence</span>
        </Subtitle>
      }
    >
      <div id="TEST" />
      <Blurbs>
        <Standfirst
          className="lg:max-w-lg xl:max-w-md"
          // Heavier than the default thin so colored text holds up on images
          textClassName="font-light!"
        >
          <span style={{ color: LEAD_COLOR }}>
            Ceramic designed a MedSpa platform from the ground up, starting with
            deep, onsite discovery across every role, from front desk to
            practitioners and aestheticians.
          </span>
        </Standfirst>
        <Blurb className="lg:max-w-lg xl:max-w-md">
          We studied and mapped <Nowrap>day-to-day</Nowrap> operations:
          overlapping appointments, late arrivals, <Nowrap>last-minute</Nowrap>{" "}
          cancellations, room conflicts, inconsistent photography, and{" "}
          <Nowrap>time-intensive</Nowrap> charting. We designed new flows and
          built a fully native experience for iPhone and iPad. The result is a
          unified, <Nowrap>multi-provider</Nowrap> workflow that streamlines
          photography, forms, treatment charting, and{" "}
          <Nowrap>before-and-after</Nowrap> comparison and sharing.
        </Blurb>
      </Blurbs>
    </CaseStudySection>
  )
}
