import { useEffect, useState } from "react"

export default function Scramble({
  text,
  className = "",
  speed = 38,
  duration = 1100,
}: {
  text: string
  className?: string
  speed?: number
  duration?: number
}) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+"
  const [out, setOut] = useState(text)

  useEffect(() => {
    let frame = 0
    const total = Math.max(1, Math.floor(duration / speed))
    const id = setInterval(() => {
      frame++
      const reveal = frame / total
      setOut(
        text
          .split("")
          .map((c, i) => {
            if (c === " ") return " "
            if (i < reveal * text.length) return c
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
      )
      if (frame >= total) {
        clearInterval(id)
        setOut(text)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, duration])

  return <span className={className}>{out}</span>
}
