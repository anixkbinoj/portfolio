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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[90] transition-all duration-500 w-[95%] max-w-[1600px] rounded-2xl ${
        scrolled
          ? "glass-panel py-3 px-6 shadow-[0_8px_32px_rgba(0,240,255,0.05)]"
          : "bg-transparent py-5 px-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <a
          href="#top"
          className="font-mono text-[0.7rem] tracking-[0.35em] uppercase text-ivory glitch-hover flex items-center gap-2"
          data-hover
        >
          ANIX<span className="text-gold font-bold">K</span>BINOJ
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="group relative">
              <ScrambleText
                text={item.label}
                className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-mute transition-colors duration-300 group-hover:text-gold"
              />
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-gold-2 transition-all duration-500 group-hover:w-full rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 glass px-4 py-1.5 rounded-full border border-gold-2/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-80 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-ivory/80 font-semibold">
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