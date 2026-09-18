import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import cx from "clsx"
import logoSvg from "../assets/ceramic-logo.svg"

function scrollToCaseStudies() {
  document.getElementById("arena")?.scrollIntoView({ behavior: "smooth" })
}

export function Header() {
  return (
    <header className="fixed w-full top-0 left-0 z-[101] py-6">
      <div className="mx-auto max-w-[80%] md:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[60%] flex items-center justify-between">
        <div className="logo">
          <img src={logoSvg} alt="Logo" className="w-20 relative top-0.5" />
        </div>

        <motion.nav
          aria-label="Primary"
          className="flex items-center gap-5 sm:gap-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <motion.a
            href="#arena"
            onClick={(e) => {
              e.preventDefault()
              scrollToCaseStudies()
            }}
            className={cx(
              "group relative text-xs font-medium tracking-wide text-white/70",
              "transition-colors duration-300 hover:text-white",
            )}
            whileTap={{ scale: 0.97 }}
          >
            Case Studies
            <span
              aria-hidden
              style={{ backgroundColor: "var(--color-light-blue)" }}
              className={cx(
                "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0",
                "transition-transform duration-300 ease-out",
                "group-hover:scale-x-100",
              )}
            />
          </motion.a>

          <motion.a
            href="mailto:hello@ceramic.nyc"
            className={cx(
              "group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs",
              "font-medium bg-white/5 backdrop-blur-xl border border-white/10",
              "text-white shadow-lg shadow-black/20",
            )}
            initial={false}
            whileHover={{
              color: "rgb(173, 216, 230)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(173, 216, 230, 0.5)",
              boxShadow:
                "0 0 8px 2px rgba(173, 216, 230, 0.6), 0 0 16px 4px rgba(173, 216, 230, 0.3)",
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            Let&rsquo;s talk
            <span
              className={cx(
                "flex transition-all duration-300 ease-out",
                "group-hover:-translate-y-px group-hover:translate-x-px",
              )}
              style={{ color: "inherit" }}
            >
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-colors duration-300 group-hover:text-[#add8e6]"
                strokeWidth={2.25}
              />
            </span>
          </motion.a>
        </motion.nav>
      </div>
    </header>
  )
}
