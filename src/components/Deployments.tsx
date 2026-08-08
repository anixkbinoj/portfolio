import { motion } from "framer-motion"
import Reveal from "./Reveal"
import SectionHeading from "./SectionHeading"
import { DEPLOYMENTS } from "../data"

export default function Deployments() {
  return (
    <section
      id="deployments"
      className="relative py-28 md:py-40 bg-ink-2/40 border-y border-line"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="04"
          label="Core Deployments"
          title="Live &"
          accent="operational"
        />

        <div className="border-t border-line">
          {DEPLOYMENTS.map((d, i) => (
            <Reveal key={d.num} delay={i * 0.05}>
              <motion.a
                href="#contact"
                className="group relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[140px_1fr_1fr_auto] gap-6 md:gap-12 items-center py-8 md:py-10 border-b border-line overflow-hidden"
                data-hover
                data-cursor-label={`${d.name} · ${d.status}`}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 w-0 bg-ivory/[0.04] group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  aria-hidden
                />
                <span className="relative font-sans text-2xl md:text-4xl font-light text-ivory/20 group-hover:text-ivory/50 transition-colors duration-500 tabular-nums">
                  {d.num}
                </span>
                <div className="relative">
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-ivory group-hover:text-ivory/80 transition-colors duration-500">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-mute font-light">
                    {d.title}
                  </p>
                </div>
                <span className="relative hidden md:block font-mono text-[0.55rem] tracking-[0.3em] text-ivory/35 group-hover:text-ivory/70 transition-colors duration-500">
                  {d.status}
                </span>
                <span className="relative text-ivory/60 text-xl md:text-2xl -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  →
                </span>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}