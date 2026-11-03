import { ArrowDown } from "lucide-react"
import { scrollToCaseStudies } from "../lib/scroll"
import { useFontsReady } from "../hooks/use-fonts-ready"
import { SplitSection } from "./split-section"
import { Standfirst } from "./standfirst"
import { BookIntroCallButton, TextAction } from "./cta"
import { LineArt, type LineArtVariant } from "./line-art"

// TEMP: preview hero line art via ?hero=<variant>
const heroArt = new URLSearchParams(window.location.search).get(
  "hero",
) as LineArtVariant | null

export function HeroSection() {
  // Hold the entrance until Encode Sans has loaded so the fallback→webfont
  // swap can't reflow the headline mid-animation.
  const fontsReady = useFontsReady()

  return (
    <SplitSection
      id="hero"
      headingLevel="h1"
      size="primary"
      trigger="mount"
      ready={fontsReady}
      background={<LineArt variant={heroArt ?? "capacitorFade"} />}
      lines={[
        { text: "We design and" },
        { text: "ship AI products" },
        { text: "with your team.", className: "blue" },
      ]}
      aside={
        <Standfirst className="lg:max-w-lg xl:max-w-md">
          Embedded tech leads for research, design, and full-stack engineering.
          From first principles to production, on aggressive timelines.
        </Standfirst>
      }
      actions={
        <>
          <BookIntroCallButton location="hero" />
          <TextAction
            icon={ArrowDown}
            iconHoverClassName="group-hover:translate-y-0.5"
            onClick={scrollToCaseStudies}
          >
            See our work
          </TextAction>
        </>
      }
    />
  )
}
