/**
 * Keeps a hyphenated compound ("day-to-day", "AI-powered") on one line so
 * the browser never breaks the line at its hyphen.
 */
export function Nowrap({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>
}
