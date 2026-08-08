import { motion } from "framer-motion"
import Reveal from "./Reveal"
import SectionHeading from "./SectionHeading"
import { WORK } from "../data"

export default function Work() {
  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="03"
          label="Selected Work"
          title="Systems I've"
          accent="brought to life"
        />

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {WORK.map((w, i) => (
            <Reveal key={w.name} delay={i * 0.12}>
              <motion.article
                className="group relative h-full flex flex-col border border-line bg-ink-2/50 p-8 md:p-10 overflow-hidden transition-colors duration-500 hover:border-ivory/25"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                data-cursor-label={`${w.name} · ${w.status}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(160,180,210,0.06),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative flex items-start justify-between mb-10">
                  <span className="font-sans text-4xl font-light text-ivory/20 group-hover:text-ivory/40 transition-colors duration-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.55rem] tracking-[0.25em] text-ivory/70 border border-line px-4 py-2 rounded-full">
                    {w.status}
                  </span>
                </div>

                <div className="relative mb-4">
                  <span className="label block mb-6">// {w.name}</span>
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-ivory leading-tight">
                    {w.title}
                  </h3>
                </div>

                <p className="relative text-sm text-mute font-light leading-relaxed mb-8">
                  {w.body}
                </p>

                <ul className="relative space-y-3 mb-10 mt-auto">
                  {w.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-4 text-sm text-ivory/60 font-light"
                    >
                      <span className="text-ivory/50 mt-1 text-xs">—</span>
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="relative border-t border-line pt-6">
                  <span className="font-mono text-[0.6rem] tracking-[0.2em] text-gold-2">
                    {w.tech}
                  </span>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}