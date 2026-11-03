import { useEffect, useState } from "react"

/**
 * Resolves once web fonts have loaded (or after `timeoutMs`, so a slow font
 * CDN never blocks the page). Use it to hold entrance animations until text
 * is in its final font — otherwise the fallback→webfont swap reflows the
 * text mid-animation and it visibly jumps.
 */
export function useFontsReady(timeoutMs = 1000) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs))
    Promise.race([document.fonts.ready, timeout]).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [timeoutMs])

  return ready
}
