import { useState, useEffect } from "react"

export function useScrollSpy(sectionIds: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // Sort by intersection ratio and pick the most visible one
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          )
          setActiveId(mostVisible.target.id)
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in upper portion of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ...options,
      }
    )

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sectionIds, options])

  return activeId
}
