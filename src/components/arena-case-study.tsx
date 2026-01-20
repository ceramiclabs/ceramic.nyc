import { CaseStudySection } from "./case-study-section"
import { Blurb, Blurbs, Standfirst } from "./blurbs"
import { Subtitle, Title } from "./title"
import arenaBackground from "../assets/arena-kareem-game-play.png"

const HIGHLIGHT_COLOR = "#ddff0e"

export function ArenaCaseStudy() {
  return (
    <CaseStudySection
      id="arena"
      backgroundImage={arenaBackground}
      title={
        <Title style={{ color: HIGHLIGHT_COLOR }}>
          <span>Arena</span>
        </Title>
      }
      subtitle={
        <Subtitle>
          <span>Rapid ideation,</span>
          <span>prototyping</span>
          <span>&amp; delivery</span>
        </Subtitle>
      }
      bottomContent={null}
    >
      <Blurbs>
        <Standfirst>
          <span className="" style={{ color: HIGHLIGHT_COLOR }}>
            Ceramic partnered with a Manhattan-based AI client for what began as
            frontend consulting and quickly evolved into a year-long, onsite
            collaboration.
          </span>
        </Standfirst>
        <Blurb highlightColor={HIGHLIGHT_COLOR} className="lg:max-w-[440px]">
          Operating as embedded tech leads, we helped conceive, design, and ship
          four AI-powered applications, each tailored to a specific customer and
          delivered on aggressive timelines. We worked shoulder-to-shoulder with
          internal teams and end users, moving from whiteboard to prototype to
          production in tight, iterative cycles.
        </Blurb>
        <Blurb highlightColor={HIGHLIGHT_COLOR} className="lg:max-w-[420px]">
          Our team built across the full stack - spanning React, Python, OpenAI
          integrations, video and audio systems, and computer vision - all while
          driving rapid experimentation, real-world feedback, and continuous
          iteration.
        </Blurb>
      </Blurbs>
    </CaseStudySection>
  )
}
