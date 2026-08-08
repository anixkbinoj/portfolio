import { motion } from "framer-motion"
import Reveal from "./Reveal"
import SectionHeading from "./SectionHeading"
import { PHILOSOPHY } from "../data"

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="05"
          label="Philosophy"
          title="How I"
          accent="operate"
        />

        <div className="grid sm:grid-cols-2 gap-px bg-line">
          {PHILOSOPHY.map((p, i) => (
            <Reveal key={p} delay={i * 0.08}>
              <motion.div
                className="group relative p-10 md:p-16 min-h-[220px] md:min-h-[280px] flex items-end overflow-hidden bg-ink-2/60"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <span
                  className="absolute -top-4 -right-2 font-sans text-[7rem] md:text-[10rem] leading-none text-ivory/[0.04] group-hover:text-ivory/[0.09] transition-colors duration-700 select-none tabular-nums"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <motion.span
                    className="block w-10 h-px bg-ivory/25 mb-8 origin-left"
                    variants={{
                      rest: { scaleX: 0.5 },
                      hover: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <p className="font-serif italic text-2xl md:text-4xl font-light text-ivory/80 group-hover:text-ivory transition-colors duration-500">
                    {p}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}