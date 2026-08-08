import { useRef } from "react"
import type { ReactNode } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#*+"

interface ScrambleTextProps {
  text: string
  className?: string
  children?: ReactNode
}

export default function ScrambleText({ text, className }: ScrambleTextProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const stop = () => {
    cancelAnimationFrame(frameRef.current)
    clearTimeout(timerRef.current)
  }

  const run = () => {
    stop()
    const el = nodeRef.current
    if (!el) return
    const target = text
    const total = 14
    let iter = 0
    const tick = () => {
      iter++
      el.textContent = target
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " "
          const revealed = Math.floor((iter / total) * target.length)
          if (i < revealed) return ch
          return CHARS[(Math.random() * CHARS.length) | 0]
        })
        .join("")
      if (iter < total) frameRef.current = requestAnimationFrame(tick)
      else el.textContent = target
    }
    frameRef.current = requestAnimationFrame(tick)
  }

  const restore = () => {
    stop()
    if (nodeRef.current) nodeRef.current.textContent = text
  }

  return (
    <span
      ref={nodeRef}
      className={className}
      onMouseEnter={run}
      onMouseLeave={restore}
      onFocus={run}
      onBlur={restore}
      aria-label={text}
    >
      {text}
    </span>
  )
}