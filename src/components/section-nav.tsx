import { motion } from "framer-motion"
import cx from "clsx"
import { useScrollSpy } from "../hooks/use-scrollspy"

type Section = {
  id: string
  label: string
  customColor?: string
}

const sections: Array<Section> = [
  { id: "intro", label: "Dual CTOs" },
  { id: "product", label: "Product-forward" },
  { id: "alside", label: "Alside", customColor: "#e76e50" },
  { id: "arena", label: "Arena", customColor: "#ddff0e" },
  { id: "rendevu", label: "Rendevu", customColor: "#ef5da8" },
  { id: "contact", label: "Get in touch" },
]

const sectionIds = sections.map((s) => s.id)

export function SectionNav() {
  const activeId = useScrollSpy(sectionIds)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    // <motion.nav
    //   initial={{ opacity: 0, x: 20 }}
    //   animate={{ opacity: 1, x: 0 }}
    //   transition={{ duration: 0.8, delay: 1 }}
    //   className={cx(
    //     "fixed right-8 z-50",
    //     "top-1/2 -translate-y-1/2!",
    //     "px-4 py-6 rounded-3xl",
    //     "bg-white/5 backdrop-blur-xl border border-white/10",
    //     "shadow-2xl shadow-black/20",
    //     "hidden lg:block"
    //   )}
    // >
    <div
      className={cx(
        "fade-in fixed right-6 z-50 top-1/2 -translate-y-1/2 px-4 py-6 rounded-3xl",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "shadow-2xl shadow-black/20 lg:right-8"
      )}
    >
      <div className={cx("flex flex-col gap-6 items-center")}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative"
            aria-label={section.label}
          >
            <motion.div
              className={cx(
                "w-2 h-2 rounded-full",
                !activeId ? "bg-white/20" : ""
              )}
              animate={{
                scale: activeId === section.id ? 1.2 : 1,
                backgroundColor:
                  activeId === section.id
                    ? section.customColor || "rgb(173, 216, 230)"
                    : "rgba(255, 255, 255, 0.2)",
                boxShadow:
                  activeId === section.id
                    ? `0 0 8px 2px ${
                        section.customColor || "rgba(173, 216, 230, 0.6)"
                      }, 0 0 16px 4px ${
                        section.customColor
                          ? section.customColor + "4d"
                          : "rgba(173, 216, 230, 0.3)"
                      }`
                    : "0 0 0px 0px rgba(173, 216, 230, 0)",
              }}
              whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </div>
    // </motion.nav>
  )
}
