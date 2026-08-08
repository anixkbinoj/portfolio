import { useRef, type ReactNode, type PointerEvent } from "react"

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export default function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
    el.style.transform = "translate(0px, 0px)"
    setTimeout(() => {
      if (el) el.style.transition = ""
    }, 600)
  }

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  )
}