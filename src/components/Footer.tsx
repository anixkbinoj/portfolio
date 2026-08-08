import { NAV } from "../data"
import ScrambleText from "./ScrambleText"

export default function Footer() {
  return (
    <footer className="relative border-t border-line py-16 bg-ink">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <a href="#top" className="font-serif text-3xl md:text-5xl font-light text-ivory" data-hover>
            Anix <em className="text-chrome italic">K Binoj</em>
          </a>

          <nav className="flex flex-wrap gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-[0.6rem] tracking-[0.3em] uppercase"
                data-hover
              >
                <ScrambleText
                  text={item.label}
                  className="text-mute hover:text-ivory transition-colors"
                />
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase">
            © {new Date().getFullYear()} Anix K Binoj
          </p>
          <p className="font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase">
            Software Architect · Founder · COO
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-3 font-mono text-[0.55rem] tracking-[0.3em] text-mute hover:text-ivory transition-colors"
            data-hover
          >
            Back to top
            <span className="group-hover:-translate-y-1 transition-transform duration-300">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}