import { CaseStudySection } from "./case-study-section"
import { Blurb, Blurbs } from "./blurbs"
import { Standfirst } from "./standfirst"
import { Nowrap } from "./nowrap"
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
        {/* Hidden for now — may come back
        <Standfirst className="lg:max-w-lg xl:max-w-md">
          <span style={{ color: HIGHLIGHT_COLOR }}>
            Ceramic partnered with a Manhattan-based AI client for what began as
            frontend consulting and quickly evolved into a year-long, onsite
            collaboration.
          </span>
        </Standfirst>
        */}
        <Standfirst
          className="lg:max-w-lg xl:max-w-md"
          // Heavier than the default thin so colored text holds up on images
          textClassName="font-light!"
        >
          <span style={{ color: HIGHLIGHT_COLOR }}>
            Operating as embedded tech leads, we helped conceive, design, and
            ship four <Nowrap>AI-powered</Nowrap> applications, each tailored to
            a specific customer and delivered on aggressive timelines.
          </span>
        </Standfirst>
        <Blurb className="lg:max-w-lg xl:max-w-md">
          We worked <Nowrap>shoulder-to-shoulder</Nowrap> with internal teams
          and end users, moving from whiteboard to prototype to production in
          tight, iterative cycles. Our team built across the full stack,
          including React, Python, OpenAI integrations, video and audio systems,
          and computer vision. We drove rapid experimentation and continuous
          iteration, grounded in <Nowrap>real-world</Nowrap> feedback.
        </Blurb>
      </Blurbs>
    </CaseStudySection>
  )
}
