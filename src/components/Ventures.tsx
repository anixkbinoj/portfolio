import { motion } from "framer-motion"
import Reveal from "./Reveal"
import SectionHeading from "./SectionHeading"
import Magnetic from "./Magnetic"
import { VENTURES } from "../data"

export default function Ventures() {
  return (
    <section id="ventures" className="relative py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="01"
          label="Ventures"
          title="Companies I"
          accent="build with"
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {VENTURES.map((v, i) => {
            const inner = (
              <>
                <div className="flex items-center gap-8 md:gap-12">
                  <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full border border-line flex items-center justify-center bg-ink-2/80">
                    <div className="absolute inset-2 rounded-full border border-line/60" />
                    <img
                      src={v.img}
                      alt={v.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-[0.58rem] tracking-[0.3em] text-mute">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-10 bg-line" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-4xl font-light text-ivory tracking-wide">
                      {v.name}
                    </h3>
                    <p className="mt-3 font-mono text-[0.6rem] tracking-[0.25em] uppercase text-ivory/50">
                      {v.role}
                    </p>
                    <p className="mt-4 text-sm text-mute font-light leading-relaxed">
                      {v.note}
                    </p>
                  </div>
                </div>
                {v.href && (
                  <span className="absolute top-6 right-6 font-mono text-[0.55rem] tracking-[0.3em] text-ivory/60 border border-line px-4 py-2 rounded-full">
                    Visit ↗
                  </span>
                )}
              </>
            )

            return (
              <Reveal key={v.name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group border border-line bg-ink-2/50 p-8 md:p-12 overflow-hidden"
                  data-cursor-media={v.img}
                  data-cursor-label={v.href ? "Open venture ↗" : v.role}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-ivory/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {v.href ? (
                    <Magnetic className="relative">
                      <a
                        href={v.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                        data-hover
                      >
                        {inner}
                      </a>
                    </Magnetic>
                  ) : (
                    <div className="relative">{inner}</div>
                  )}
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}