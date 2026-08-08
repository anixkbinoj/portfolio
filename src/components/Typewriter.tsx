import { useEffect, useState } from "react"

interface TypewriterProps {
  lines: string[]
  className?: string
  charDelay?: number
  lineDelay?: number
  onDone?: () => void
}

export default function Typewriter({
  lines,
  className,
  charDelay = 22,
  lineDelay = 320,
  onDone,
}: TypewriterProps) {
  const [lineIdx, setLineIdx] = useState(0)
  const [text, setText] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (lineIdx >= lines.length) {
      setDone(true)
      onDone?.()
      return
    }

    const full = lines[lineIdx]
    let i = 0
    let destroyed = false
    const interval = setInterval(() => {
      if (destroyed) return
      i += 1
      setText(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(interval)
        setTimeout(() => {
          if (!destroyed) {
            setLineIdx((v) => v + 1)
            setText("")
          }
        }, lineDelay)
      }
    }, charDelay)

    return () => {
      destroyed = true
      clearInterval(interval)
    }
  }, [lineIdx, lines, charDelay, lineDelay, onDone])

  if (done) return null

  return (
    <div className={className}>
      {lines.slice(0, lineIdx).map((l, i) => (
        <p key={i} className="text-ivory/60">
          {l}
        </p>
      ))}
      <p className="text-ivory">
        {text}
        <span className="caret-slot" />
      </p>
    </div>
  )
}