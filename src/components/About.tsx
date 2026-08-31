import Reveal from "./Reveal"
import SectionHeading from "./SectionHeading"
import WordsReveal from "./WordsReveal"
import SkillHex from "./SkillHex"

const STATS = [
  { value: "02", label: "Companies Founded" },
  { value: "05", label: "Deployments Live" },
  { value: "10+", label: "Languages & Stacks" },
  { value: "∞", label: "Ownership" },
]

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="06"
          label="About"
          title="Architecture,"
          accent="disciplined"
        />

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-16">
<div>
            <p className="font-serif text-2xl md:text-4xl leading-snug text-ivory/85">
              <WordsReveal text="I focus on building software that solves" />{" "}
              <em className="text-chrome italic font-normal">
                <WordsReveal text="real problems." delay={0.35} />
              </em>{" "}
              <WordsReveal text="My work spans full-stack systems," delay={0.7} />{" "}
              <WordsReveal text="team leadership, and production-grade delivery —" delay={1.05} />{" "}
              <em className="text-chrome italic font-normal">
                <WordsReveal text="founded on clean architecture," delay={1.4} />
              </em>{" "}
              <WordsReveal text="disciplined execution, and ownership." delay={1.75} />
            </p>
            <Reveal delay={0.15}>
              <p className="mt-10 text-mute font-light leading-relaxed max-w-xl">
                From founding Anix &amp; Co, I own outcomes end to end — design, architecture,
                delivery, and the people who carry it forward.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a
                href="#contact"
                className="group mt-12 inline-flex items-center gap-6 font-mono text-[0.62rem] tracking-[0.35em] uppercase text-ivory/80"
                data-hover
                data-cursor-label="Connect"
              >
                <span className="border-b border-ivory/30 pb-1 group-hover:border-ivory transition-colors">
                  Start a conversation
                </span>
                <span className="transition-transform duration-500 group-hover:translate-x-2">
                  →
                </span>
              </a>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-px bg-line self-start">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-ink-2/60">
                <div className="p-8">
                  <p className="font-serif text-5xl font-light text-chrome">
                    {s.value}
                  </p>
                  <p className="mt-4 font-mono text-[0.55rem] tracking-[0.25em] text-mute uppercase leading-relaxed">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <SkillHex />
    </section>
  )
}