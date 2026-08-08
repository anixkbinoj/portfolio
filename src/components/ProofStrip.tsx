import Reveal from "./Reveal"
import { VENTURES } from "../data"

const STATS = [
  { value: "02", label: "Companies founded" },
  { value: "05", label: "Deployments live" },
  { value: "10+", label: "Languages & stacks" },
  { value: "100%", label: "Ownership taken" },
]

export default function ProofStrip() {
  return (
    <section className="relative bg-ink-2/40 border-y border-line">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line mb-10">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="px-6 py-6 bg-ink">
                <span className="block font-serif text-4xl md:text-5xl font-light text-ivory leading-none tabular-nums">
                  {s.value}
                </span>
                <span className="block mt-3 font-mono text-[0.55rem] tracking-[0.25em] uppercase text-mute">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-mute w-full md:w-56 shrink-0">
              Built &amp; led with
            </span>
            <div className="flex flex-wrap items-center gap-8 md:gap-12">
              {VENTURES.map((v) => (
                <a
                  key={v.name}
                  href={v.href ?? undefined}
                  target={v.href ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4"
                  data-hover
                  data-cursor-label={v.name}
                >
                  <img
                    src={v.img}
                    alt={`${v.name} logo`}
                    className="h-8 md:h-9 w-auto grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <span className="hidden md:block font-mono text-[0.55rem] tracking-[0.2em] text-mute group-hover:text-ivory/80 transition-colors duration-500">
                    {v.role}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}