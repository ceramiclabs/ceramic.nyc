import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts"

// Generate weekly sales data with seasonality
const generateData = () => {
  const weeks = 52
  const data = []

  for (let week = 1; week <= weeks; week++) {
    // Create seasonal multiplier
    // Higher sales in Q4 (weeks 40-52), spring (weeks 12-20), and back-to-school (weeks 30-35)
    // Lower sales in Q1 (weeks 1-12) and mid-summer (weeks 24-30)
    let seasonalMultiplier = 1

    if (week >= 1 && week <= 8) {
      // Post-holiday slump
      seasonalMultiplier = 0.6 + (week / 8) * 0.2
    } else if (week >= 9 && week <= 20) {
      // Spring growth
      seasonalMultiplier = 0.8 + ((week - 9) / 12) * 0.3
    } else if (week >= 21 && week <= 30) {
      // Summer plateau
      seasonalMultiplier = 0.9 + Math.sin((week - 21) / 10) * 0.15
    } else if (week >= 31 && week <= 35) {
      // Back to school spike
      seasonalMultiplier = 1.15
    } else if (week >= 36 && week <= 39) {
      // Fall dip
      seasonalMultiplier = 0.95
    } else if (week >= 40 && week <= 52) {
      // Holiday season ramp-up and peak
      seasonalMultiplier = 1.0 + ((week - 40) / 13) * 0.6
    }

    // Base sales with seasonal variation and some randomness
    const baseSales = 5000
    const seasonalSales = baseSales * seasonalMultiplier
    const randomVariation = (Math.random() - 0.5) * 1000
    const sales = Math.floor(seasonalSales + randomVariation)

    data.push({
      week: `W${week}`,
      sales: Math.max(2000, sales), // Ensure minimum of 2000
    })
  }

  return data
}

const data = generateData()

interface Props {
  fill?: string
}

export function SalesChart({ fill }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-[40vh]"
    >
      {isInView && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Bar
              dataKey="sales"
              radius={[8, 8, 8, 8]}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={fill || "#4F46E5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}
