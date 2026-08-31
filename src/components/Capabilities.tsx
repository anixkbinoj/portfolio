import { motion } from "framer-motion"
import Reveal from "./Reveal"
import SectionHeading from "./SectionHeading"
import { CAPABILITIES } from "../data"

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative py-28 md:py-40 bg-ink/50 backdrop-blur-md border-y border-gold-2/10 shadow-[inset_0_0_100px_rgba(138,43,226,0.05)]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="02"
          label="Capabilities"
          title="What I"
          accent="command"
        />

        <div className="border-t border-line">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.06}>
              <motion.div
                className="group relative grid md:grid-cols-[120px_1fr_1.4fr] gap-6 md:gap-12 items-center py-10 md:py-14 border-b border-line cursor-crosshair"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <span className="font-serif italic text-4xl md:text-5xl font-light text-ivory/10 group-hover:text-gold transition-colors duration-500 font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                  {c.num}
                </span>
                <h3 className="font-serif text-2xl md:text-4xl font-semibold text-ivory transition-transform duration-500 group-hover:translate-x-3 group-hover:text-gold-3">
                  {c.title}
                </h3>
                <p className="text-mute font-light text-sm md:text-base leading-relaxed md:max-w-xl">
                  {c.text}
                </p>
                <motion.span
                  className="hidden md:block absolute right-0 text-gold opacity-0 font-bold"
                  variants={{
                    rest: { opacity: 0, x: -20 },
                    hover: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="inline-block drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">→</span>
                </motion.span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}