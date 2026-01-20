import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import cx from "clsx"

const SECTION_IDS = ["intro", "product", "alside", "arena", "rendevu", "contact"]

export function ChevronButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isAtEnd, setIsAtEnd] = useState(false)

  useEffect(() => {
    const lastSection = document.getElementById(SECTION_IDS[SECTION_IDS.length - 1])
    if (!lastSection) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtEnd(entry.isIntersecting)
      },
      { threshold: 0.5 }
    )

    observer.observe(lastSection)
    return () => observer.disconnect()
  }, [])

  const handleClick = () => {
    if (isAtEnd) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Find current section and scroll to next
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id)
        if (section) {
          const rect = section.getBoundingClientRect()
          // If this section's top is below the current scroll position, scroll to it
          if (rect.top > 50) {
            section.scrollIntoView({ behavior: "smooth" })
            return
          }
        }
      }
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={cx(
          "w-11 h-11 rounded-full flex items-center justify-center",
          "bg-white/5 backdrop-blur-sm border border-white/10",
          "transition-colors"
        )}
        animate={{
          backgroundColor: isHovered
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.05)",
          boxShadow: isHovered
            ? "0 0 8px 2px rgba(173, 216, 230, 0.6), 0 0 16px 4px rgba(173, 216, 230, 0.3)"
            : "0 0 0px 0px rgba(173, 216, 230, 0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            color: isHovered ? "rgb(173, 216, 230)" : "rgb(255, 255, 255)",
            rotate: isAtEnd ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
