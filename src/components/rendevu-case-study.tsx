import { CaseStudySection } from "./case-study-section"
import { Blurb, Blurbs, Standfirst } from "./blurbs"
import { Subtitle, Title } from "./title"
import rendevuBackground from "../assets/rendevu-card-design.png"

const HIGHLIGHT_COLOR = "#ef5da8"

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
        <Standfirst className="!max-w-[550px]">
          <span className="!font-normal" style={{ color: HIGHLIGHT_COLOR }}>
            We transformed complexity into a refined, end-to-end app that
            simplifies booking, documentation, photography, and care delivery.
          </span>
        </Standfirst>
        <Blurb className="lg:!max-w-[443px]">
          Ceramic designed a MedSpa platform from the ground up, starting with
          deep, onsite discovery across every role - from front desk to
          practitioners and aestheticians. We mapped the real chaos of daily
          operations - overlapping appointments, late patients, cancellations,
          inconsistent photography, and time-intensive charting - and translated
          it into an elegant, unified application.
        </Blurb>
        <Blurb className="lg:!max-w-[410px]" textClassName="font-semibold">
          The result is software that brings order, speed and consistency to a
          notoriously unpredictable workflow.
        </Blurb>
      </Blurbs>
    </CaseStudySection>
  )
}
