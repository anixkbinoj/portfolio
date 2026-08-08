import Reveal from "./Reveal"
import Magnetic from "./Magnetic"
import WordsReveal from "./WordsReveal"
import { CONTACT } from "../data"

const LINKS = [
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phoneRaw}` },
  { label: "GitHub", value: "@anixkbinoj", href: CONTACT.github },
  {
    label: "LinkedIn",
    value: "Anix K Binoj",
    href: CONTACT.linkedin,
  },
  { label: "Instagram", value: "@ani_x._", href: CONTACT.instagram },
]

const PROCESS = [
  { num: "01", title: "Discover", text: "We talk about the product, the problem, and what success looks like." },
  { num: "02", title: "Propose", text: "Fixed scope, clear milestones, transparent pricing — no surprises." },
  { num: "03", title: "Build", text: "Design, engineering and delivery — you see progress every week." },
]

const TRUST = ["Replies within 24h", "NDA on request", "Fixed-scope milestones", "IP transfers to you"]

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-32 md:py-48 bg-ink-2/40 border-t border-line overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <span className="eyebrow">07 · Connect</span>
        </Reveal>

        <div className="mt-10">
          <h2 className="font-serif font-light leading-[1.02] text-[clamp(3rem,9vw,9rem)]">
            <WordsReveal text="Let's build" className="text-ivory" />
            <br />
            <em className="text-chrome italic font-normal">
              <WordsReveal text="the rare." delay={0.35} />
            </em>
          </h2>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-lg mx-auto text-mute font-light leading-relaxed">
            If you value execution, clarity, and ownership — I&rsquo;d be glad
            to hear about your product or system.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-12 grid sm:grid-cols-3 gap-px bg-line border border-line text-left max-w-4xl mx-auto">
            {PROCESS.map((p) => (
              <div key={p.num} className="relative bg-ink-2/60 px-6 py-6">
                <span className="font-mono text-[0.5rem] tracking-[0.3em] text-ivory/40">
                  {p.num}
                </span>
                <h3 className="mt-3 font-serif text-xl text-ivory">{p.title}</h3>
                <p className="mt-2 text-[0.78rem] text-mute leading-relaxed">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TRUST.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 border border-line px-4 py-2 font-mono text-[0.55rem] tracking-[0.2em] uppercase text-mute"
                data-hover
              >
                <span className="text-gold-2">+</span>
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-14 flex flex-wrap justify-center gap-4 md:gap-6">
            {LINKS.map((l) => (
              <Magnetic key={l.label} strength={0.25}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative inline-flex flex-col items-start gap-1 border border-line px-7 py-5 overflow-hidden transition-colors duration-500 hover:border-ivory/50 min-w-[150px]"
                  data-hover
                  data-cursor-label={l.label}
                >
                  <span className="absolute inset-0 bg-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative font-mono text-[0.52rem] tracking-[0.3em] text-mute group-hover:text-ink/70 transition-colors duration-500">
                    {l.label}
                  </span>
                  <span className="relative font-sans text-sm font-medium text-ivory group-hover:text-ink transition-colors duration-500">
                    {l.value}
                  </span>
                </a>
              </Magnetic>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}