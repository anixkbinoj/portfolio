import { useEffect, useState } from "react"
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion"
import { NAV } from "../data"
import ScrambleText from "./ScrambleText"

export default function Nav() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  })
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
        scrolled
          ? "bg-ink/70 backdrop-blur-md py-4"
          : "bg-transparent py-7"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <a
          href="#top"
          className="font-mono text-[0.7rem] tracking-[0.35em] uppercase text-ivory glitch-hover"
          data-hover
        >
          ANIX<span className="text-gold-2">K</span>BINOJ
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="group relative">
              <ScrambleText
                text={item.label}
                className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-mute transition-colors duration-300 group-hover:text-ivory"
              />
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ivory/70 transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-ivory opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ivory" />
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-ivory/60">
            Available
          </span>
        </div>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 z-[100]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span
            className={`block h-px w-7 bg-ivory transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-7 bg-ivory transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <motion.div
        style={{ scaleX: progress }}
        className="h-px bg-ivory/40 origin-left w-full"
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            className="lg:hidden fixed inset-0 top-0 bg-ink/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-[95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {NAV.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl font-light text-ivory hover:text-ivory/70 transition-colors"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}