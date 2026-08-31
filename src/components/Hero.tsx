import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion"
import Magnetic from "./Magnetic"
import { CONTACT, ROLES } from "../data"

const CYCLE = [
  "Systems Architect",
  "Product Designer",
  "Full-Stack Engineer",
  "AI / ML Builder",
  "Venture Founder",
]

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
      className="relative w-full max-w-[280px] sm:max-w-[400px] mx-auto lg:mx-0 lg:ml-auto"
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 44, rotateY: 14 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
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
        className="relative glass-panel rounded-2xl overflow-hidden group border border-line/30"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <img
          src="/profile.jpg"
          alt="Anix K Binoj"
          draggable={false}
          className="w-full aspect-[4/5] object-cover object-top mix-blend-luminosity group-hover:mix-blend-normal opacity-80 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] scale-105 group-hover:scale-100"
        />
        {/* cinematic grade */}
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/90 via-transparent to-gold-2/20 mix-blend-multiply pointer-events-none" />
        {/* glass glare sweep */}
        <div className="sheen" aria-hidden />
        {/* bottom wash */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none" />

        {/* corner index */}
        <span className="absolute top-3 right-4 font-mono text-[0.5rem] tracking-[0.3em] text-ivory/60">
          04°N
        </span>

        {/* caption strip */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-4 py-3 border-t border-line/20 backdrop-blur-md bg-ink/30">
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-ivory/60">
            01 — SOFTWARE ARCHITECT
          </span>
        <span className="font-mono text-[0.55rem] tracking-[0.25em] text-gold text-shadow-glow">
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

function Letters({
  text,
  className = "",
  baseDelay = 0,
}: {
  text: string
  className?: string
  baseDelay?: number
}) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ lineHeight: "0.92" }}
        >
          <motion.span
            className={`inline-block ${className}`}
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.95,
              delay: baseDelay + i * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </>
  )
}

function CyclingWord() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % CYCLE.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="relative inline-block overflow-hidden align-baseline text-aurora">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="inline-block whitespace-nowrap"
          initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {CYCLE[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function LiveClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const p = (n: number) => n.toString().padStart(2, "0")
  return (
    <span className="font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase tabular-nums">
      {p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())} IST
    </span>
  )
}

function HeroBackdrop({ px, py }: { px: MotionValue<number>; py: MotionValue<number> }) {
  const x1 = useTransform(px, [-0.5, 0.5], [60, -60])
  const y1 = useTransform(py, [-0.5, 0.5], [44, -44])
  const x2 = useTransform(px, [-0.5, 0.5], [-70, 70])
  const y2 = useTransform(py, [-0.5, 0.5], [-34, 34])
  const x3 = useTransform(px, [-0.5, 0.5], [40, -40])
  const y3 = useTransform(py, [-0.5, 0.5], [-50, 50])

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, delay: 1.2, ease: "easeOut" }}
    >
      <div className="absolute inset-0 grid-floor opacity-35" />
      <motion.div
        className="orb orb-drift"
        style={{
          x: x1,
          y: y1,
          width: 540,
          height: 540,
          left: "-10%",
          top: "6%",
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.45), transparent 65%)",
        }}
      />
      <motion.div
        className="orb orb-drift"
        style={{
          x: x2,
          y: y2,
          width: 640,
          height: 640,
          right: "-14%",
          top: "-4%",
          background:
            "radial-gradient(circle, rgba(138, 43, 226, 0.4), transparent 65%)",
          animationDelay: "-3s",
        }}
      />
      <motion.div
        className="orb orb-drift"
        style={{
          x: x3,
          y: y3,
          width: 440,
          height: 440,
          left: "32%",
          bottom: "-12%",
          background:
            "radial-gradient(circle, rgba(255, 0, 127, 0.25), transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      <div className="scan-beam" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_38%,rgba(5,7,11,0.7))]" />
    </motion.div>
  )
}

function RolesStrip() {
  return (
    <motion.div
      className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line/20 border-y border-line/30 relative overflow-hidden rounded-xl glass"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
    >
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" aria-hidden />
      {ROLES.map((r, i) => (
        <div
          key={r.id}
          className="group relative bg-ink/50 px-5 py-4 overflow-hidden backdrop-blur-sm"
          data-hover
        >
          <div className="absolute inset-0 bg-gold-2/0 group-hover:bg-gold-2/10 transition-colors duration-500" />
          <span className="relative block font-mono text-[0.5rem] tracking-[0.3em] text-gold mb-2 group-hover:text-gold-3 transition-colors duration-500">
            0{i + 1}
          </span>
          <span className="relative block font-serif text-lg md:text-xl text-ivory font-medium group-hover:text-ivory transition-colors duration-500">
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
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setInteractive(fine.matches && !reduced.matches)
    update()
    fine.addEventListener("change", update)
    reduced.addEventListener("change", update)
    return () => {
      fine.removeEventListener("change", update)
      reduced.removeEventListener("change", update)
    }
  }, [])

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const tx = useSpring(useTransform(px, [-0.5, 0.5], [18, -18]), {
    stiffness: 60,
    damping: 18,
  })
  const ty = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), {
    stiffness: 60,
    damping: 18,
  })
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 60,
    damping: 18,
  })
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), {
    stiffness: 60,
    damping: 18,
  })

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-24 overflow-hidden"
      onPointerMove={(e) => {
        if (!interactive) return
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <HeroBackdrop px={px} py={py} />
      <div className="hud-frame" aria-hidden />

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
        <motion.div
          className="order-2 lg:order-1 lg:col-span-7 relative"
          style={
            interactive
              ? {
                  x: tx,
                  y: ty,
                  rotateX: tiltX,
                  rotateY: tiltY,
                  transformPerspective: 900,
                  transformStyle: "preserve-3d",
                }
              : undefined
          }
        >
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

          <h1 className="font-serif font-light leading-[0.92] tracking-[-0.02em] text-[4rem] sm:text-[6rem] lg:text-[7.5rem]">
            <span className="block">
              <Letters text="Anix" className="text-ivory font-medium" baseDelay={0.25} />
            </span>
            <span className="block">
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-2 italic font-bold pr-4"
                  initial={{ y: "120%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.95,
                    delay: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  K.
                </motion.span>
              </span>{" "}
              <Letters text="Binoj" className="text-ivory/90 font-medium" baseDelay={0.5} />
            </span>
          </h1>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[0.62rem] tracking-[0.3em] uppercase text-mute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-ivory/80">Software Architect</span>
            <span className="text-ivory/30">/</span>
            <CyclingWord />
          </motion.div>

          <motion.p
            className="mt-6 max-w-xl text-ivory/85 font-light text-base md:text-lg leading-relaxed"
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
            </a>
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
                className="group relative inline-flex items-center gap-6 px-10 py-4 bg-gold text-ink text-[0.62rem] font-mono font-bold tracking-[0.35em] uppercase overflow-hidden transition-all duration-500 rounded-full hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
                data-hover
                data-cursor-label="Start a project"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Start a Project</span>
                <span className="relative group-hover:translate-x-2 transition-transform duration-300">→</span>
              </a>
            </Magnetic>
            <a
              href="#work"
              className="group relative inline-flex items-center gap-6 px-10 py-4 border border-gold-2/50 text-ivory text-[0.62rem] font-mono tracking-[0.35em] uppercase overflow-hidden transition-colors duration-500 hover:border-gold-2 hover:bg-gold-2/10 rounded-full backdrop-blur-sm"
              data-hover
              data-cursor-label="View work ↓"
            >
              <span className="relative">View Work</span>
              <span className="relative group-hover:translate-y-1 transition-transform duration-300">↓</span>
            </a>
          </motion.div>
        </motion.div>

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
        <LiveClock />
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
