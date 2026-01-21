import { CaseStudySection } from "../components/case-study-section"
import { SalesChart } from "../components/sales-chart"
import { Blurb, Blurbs, Standfirst } from "./blurbs"
import { Subtitle, Title } from "./title"

const HIGHLIGHT_COLOR = "#e76e50"

export function AlsideCaseStudy() {
  return (
    <CaseStudySection
      id="alside"
      backgroundImage="/path/to/your/image.jpg"
      title={
        <Title style={{ color: HIGHLIGHT_COLOR }}>
          <span>Alside</span>
        </Title>
      }
      subtitle={
        <Subtitle>
          <span>Foundry Ontology</span>
          <span>&amp; DRP app</span>
        </Subtitle>
      }
      bottomContent={<SalesChart fill={HIGHLIGHT_COLOR} />}
    >
      <Blurbs>
        <Standfirst className="lg:!max-w-[560px]">
          Legacy systems, manual processes, bubble gum and tape - and a lot of
          spreadsheets. We became a student of their organization, interviewing
          stakeholders and building trust with honestly, realism, and a
          willingness to get our hands dirty. What they need is{" "}
          <span className="font-medium">
            real inventory intelligence, all in one place.
          </span>
        </Standfirst>
        <Blurb
          title="Custom ontology &amp; OSDK"
          highlightColor={HIGHLIGHT_COLOR}
          className="lg:max-w-[445px]"
        >
          We built a dedicated ontology, with cohesive data designed to give
          real people the information they need. Where complexity arose, we used
          advanced platform tools like codelabs &amp; PySpark. Finally, we
          connected it all through the platform OSDK in both Python &amp;
          TypeScript.
        </Blurb>
        <Blurb
          title="Rethinking &amp; digitizing processes"
          highlightColor={HIGHLIGHT_COLOR}
          className="lg:max-w-[450px]"
        >
          Leveraging our UI toolkit,{" "}
          <span className="font-semibold blue">Glaze</span>, we built a custom
          frontend entirely driven by the Ontology. We took an age old ordering
          process based on spreadsheets and turned it into single source
          ordering process. We released early, tested often, and rolled it out
          to the executive team, 124 branch managers, and 4 planners &mdash;
          consolidating their needs into a unified control plane.
        </Blurb>
      </Blurbs>
    </CaseStudySection>
  )
}
