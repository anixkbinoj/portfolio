import type { CSSProperties } from "react"
import { MARQUEE } from "../data"

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="relative border-y border-line overflow-hidden py-5 md:py-6 bg-ink-2/60">
      <div className="animate-marquee flex whitespace-nowrap w-max" style={{ "--dur": "46s" } as CSSProperties}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-mono text-xs md:text-sm tracking-[0.35em] uppercase font-light text-ivory/35 px-8 md:px-12">
              {item}
            </span>
            <span className="text-ivory/25 text-lg">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}