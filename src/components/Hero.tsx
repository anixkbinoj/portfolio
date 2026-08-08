import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Magnetic from "./Magnetic"
import { CONTACT, ROLES } from "../data"

function Figure() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 140,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 20,
  })

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-[400px] mx-auto lg:mx-0 lg:ml-auto"
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      data-cursor-label="Anix K Binoj"
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {/* grounding shadow */}
      <div className="figure-shadow" aria-hidden />

      {/* offset frame */}
      <div className="absolute inset-0 translate-x-4 translate-y-4 border border-line" aria-hidden />

      {/* figure block */}
      <motion.div
        className="relative border border-ivory/15 bg-ink-2 overflow-hidden group"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <img
          src="/profile.jpg"
          alt="Anix K Binoj"
          draggable={false}
          className="w-full aspect-[4/5] object-cover object-top grayscale contrast-[1.06] saturate-[0.85] group-hover:grayscale-0 group-hover:contrast-105 group-hover:saturate-110 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        {/* cinematic grade */}
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/75 via-transparent to-gold-2/10 mix-blend-multiply pointer-events-none" />
        {/* glass glare sweep */}
        <div className="sheen" aria-hidden />
        {/* bottom wash */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/85 to-transparent pointer-events-none" />

        {/* corner index */}
        <span className="absolute top-3 right-4 font-mono text-[0.5rem] tracking-[0.3em] text-ivory/60">
          04°N
        </span>

        {/* caption strip */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-4 py-3 border-t border-line">
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-ivory/60">
            01 — SOFTWARE ARCHITECT
          </span>
        <span className="font-mono text-[0.55rem] tracking-[0.25em] text-gold-2">
          ANIX K BINOJ
        </span>
      </div>
      </motion.div>

      {/* caption below */}
      <div className="flex items-center justify-between mt-5">
        <span className="label">Software Architect</span>
        <span className="font-mono text-[0.5rem] tracking-[0.3em] text-mute">
          KERALA · INDIA
        </span>
      </div>
    </motion.div>
  )
}

function RolesStrip() {
  return (
    <motion.div
      className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border-y border-line"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
    >
      {ROLES.map((r, i) => (
        <div
          key={r.id}
          className="group relative bg-ink-2 px-5 py-4 overflow-hidden"
          data-hover
        >
          <div className="absolute inset-0 bg-ivory/0 group-hover:bg-ivory/[0.04] transition-colors duration-500" />
          <span className="relative block font-mono text-[0.5rem] tracking-[0.3em] text-mute mb-2">
            0{i + 1}
          </span>
          <span className="relative block font-serif text-lg md:text-xl text-ivory group-hover:text-ivory transition-colors duration-500">
            {r.id}
          </span>
          <span className="relative block text-[0.68rem] text-mute mt-1 leading-snug">
            {r.desc}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-24 overflow-hidden"
    >
      {/* vertical index */}
      <div
        className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        aria-hidden
      >
        <span className="font-mono text-[0.55rem] tracking-[0.35em] text-mute uppercase">
          Portfolio — 2026
        </span>
        <span className="w-px h-16 bg-line" />
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
        {/* Text */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          <motion.div
            className="flex items-center gap-6 mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="label">Portfolio</span>
            <span className="h-px w-12 bg-line" />
            <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
              Kerala · India
            </span>
          </motion.div>

          <h1 className="font-serif font-light leading-[0.92] tracking-[-0.02em]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(4.5rem,12vw,11rem)] text-ivory"
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                Anix
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(4.5rem,12vw,11rem)]"
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <em className="text-chrome italic font-normal">K.</em>{" "}
                <span className="text-ivory/60">Binoj</span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[0.62rem] tracking-[0.3em] uppercase text-mute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-ivory/60">Software Architect</span>
            <span className="text-ivory/30">/</span>
            <span>Designer of systems</span>
            <span className="text-ivory/30">/</span>
            <span>Developer of products</span>
            <span className="text-ivory/30">/</span>
            <span>Founder</span>
          </motion.div>

          <motion.p
            className="mt-6 max-w-xl text-ivory/70 font-light text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            I build products end-to-end — the design, the code, the company
            around it. Founder of{" "}
            <a
              href={CONTACT.anixCo}
              target="_blank"
              rel="noreferrer"
              className="text-ivory border-b border-gold/50 hover:border-gold transition-colors"
            >
              Anix &amp; Co
            </a>{" "}
            and Co-Founder &amp; COO at Antolanz Pvt Ltd.
          </motion.p>

          <RolesStrip />

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Magnetic>
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-6 px-10 py-4 bg-ivory text-ink text-[0.62rem] font-mono tracking-[0.35em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(233,238,244,0.15)]"
                data-hover
                data-cursor-label="Start a project"
              >
                <span className="absolute inset-0 bg-ivory/15 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Start a Project</span>
                <span className="relative">→</span>
              </a>
            </Magnetic>
            <a
              href="#work"
              className="group relative inline-flex items-center gap-6 px-10 py-4 border border-ivory/40 text-ivory/80 text-[0.62rem] font-mono tracking-[0.35em] uppercase overflow-hidden transition-colors duration-500 hover:border-ivory hover:text-ivory"
              data-hover
              data-cursor-label="View work ↓"
            >
              <span className="absolute inset-0 bg-ivory/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative">View Work</span>
              <span className="relative">→</span>
            </a>
          </motion.div>
        </div>

        {/* Figure */}
        <div className="order-1 lg:order-2 lg:col-span-5 pt-6 lg:pt-0">
          <Figure />
        </div>
      </div>

      {/* bottom metadata strip */}
      <motion.div
        className="absolute bottom-8 left-6 md:left-12 hidden md:flex items-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase">
          9.6°N 76.2°E
        </span>
        <span className="w-px h-4 bg-line" />
        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-ivory opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ivory" />
          </span>
          Available for work
        </span>
      </motion.div>

      <motion.a
        href="#ventures"
        className="absolute bottom-8 right-6 md:right-12 hidden md:flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        aria-label="Scroll down"
      >
        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase">
          Scroll
        </span>
        <motion.span
          className="block w-px h-12 bg-gradient-to-b from-ivory to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.a>
    </section>
  )
}