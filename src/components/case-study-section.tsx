import * as React from "react"

import { motion } from "framer-motion"
import cx from "clsx"
import { Noise } from "./noise"
import { Container } from "./container"

interface Props {
  id?: string
  backgroundImage?: string
  title: React.ReactNode
  subtitle: React.ReactNode
  children?: React.ReactNode
  bottomContent?: React.ReactNode
  className?: string
}

export function CaseStudySection({
  id,
  backgroundImage,
  title,
  subtitle,
  children,
  bottomContent,
  className,
}: Props) {
  return (
    <section
      id={id}
      className={cx(
        "relative min-h-screen flex justify-start items-center",
        className,
      )}
    >
      {backgroundImage && <BackgroundImage uri={backgroundImage} />}

      <Noise />

      <Container
        className={cx(
          "relative z-10 flex flex-1 flex-col gap-6 lg:gap-8 justify-center",
          "lg:flex-row lg:items-start lg:gap-20",

          // TEMP until we get more content in - remove after
          "lg:!items-center",
        )}
      >
        <div className="lg:flex-1">
          {title}
          {subtitle}
        </div>

        {children && (
          <div className="overflow-visible pr-2 lg:mt-8 lg:flex-1">
            {children}
          </div>
        )}
      </Container>

      {bottomContent && (
        <div className="relative z-10 w-full -mt-6">
          <div className="px-10 pb-12">{bottomContent}</div>
        </div>
      )}
    </section>
  )
}

interface BackgroundImagesProps {
  uri: string
}

export function BackgroundImage({ uri }: BackgroundImagesProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.2 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url(${uri})`,
        }}
      />
    </motion.div>
  )
}
