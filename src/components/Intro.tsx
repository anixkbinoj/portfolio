import { useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import Typewriter from "./Typewriter"
import Scramble from "./Scramble"
import { INTRO_LINES } from "../data"

const NAME: { ch: string; cls: string }[] = [
  ..."ANIX".split("").map((ch) => ({ ch, cls: "text-ivory" })),
  { ch: " ", cls: "text-ivory" },
  { ch: "K", cls: "text-chrome italic" },
  { ch: " ", cls: "text-ivory" },
  ..."BINOJ".split("").map((ch) => ({ ch, cls: "text-ivory" })),
]

export default function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)
  const [exit, setExit] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const doneRef = useRef(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [22, -22]), {
    stiffness: 60,
    damping: 18,
  })
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), {
    stiffness: 60,
    damping: 18,
  })
  const ox1 = useTransform(mx, [-0.5, 0.5], [70, -70])
  const oy1 = useTransform(my, [-0.5, 0.5], [50, -50])
  const ox2 = useTransform(mx, [-0.5, 0.5], [-80, 80])
  const oy2 = useTransform(my, [-0.5, 0.5], [-40, 40])

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setExit(true)
    setTimeout(onDone, 700)
  }, [onDone])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 250),
      setTimeout(() => setPhase(2), 1700),
      setTimeout(() => setPhase(3), 2900),
      setTimeout(finish, 3800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [finish])

  const skip = () => {
    if (skipped || exit) return
    setSkipped(true)
    setPhase(3)
    finish()
  }

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[110] bg-ink overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          onClick={skip}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            mx.set((e.clientX - r.left) / r.width - 0.5)
            my.set((e.clientY - r.top) / r.height - 0.5)
          }}
          onPointerLeave={() => {
            mx.set(0)
            my.set(0)
          }}
        >
          {/* atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_32%,rgba(0,0,0,0.78)_100%)]" aria-hidden />
          <motion.div
            className="orb"
            style={{
              x: ox1,
              y: oy1,
              width: 540,
              height: 540,
              left: "-10%",
              top: "4%",
              background:
                "radial-gradient(circle, rgba(79,212,197,0.4), transparent 65%)",
            }}
            aria-hidden
          />
          <motion.div
            className="orb"
            style={{
              x: ox2,
              y: oy2,
              width: 600,
              height: 600,
              right: "-14%",
              bottom: "-12%",
              background:
                "radial-gradient(circle, rgba(106,169,245,0.4), transparent 65%)",
              animationDelay: "-5s",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 grid-floor opacity-25" aria-hidden />
          <div className="scan-beam" aria-hidden />
          <div className="hud-frame" aria-hidden />

          <motion.p
            className="absolute top-7 left-16 md:left-20 label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Anix K Binoj — Portfolio
          </motion.p>
          <motion.p
            className="absolute top-7 right-16 md:right-20 label hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Software Architect
          </motion.p>

          {/* center stage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="text-center px-6 relative" style={{ x: tx, y: ty }}>
              {/* rotating ring behind name */}
              <svg
                viewBox="0 0 200 200"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78vw] max-w-[680px] opacity-[0.14] spin-slow pointer-events-none"
                aria-hidden
              >
                <circle
                  cx="100"
                  cy="100"
                  r="99"
                  fill="none"
                  stroke="#6aa9f5"
                  strokeWidth="0.4"
                  strokeDasharray="2 7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  fill="none"
                  stroke="#4fd4c5"
                  strokeWidth="0.3"
                  strokeDasharray="1 10"
                />
              </svg>

              <AnimatePresence mode="wait">
                {phase >= 1 && (
                  <motion.p
                    key="tag"
                    className="font-mono text-[0.6rem] tracking-[0.45em] text-ivory/50 mb-10 uppercase"
                    initial={{ opacity: 0, letterSpacing: "0.9em" }}
                    animate={{ opacity: 1, letterSpacing: "0.45em" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Scramble text="Welcome" />
                  </motion.p>
                )}
              </AnimatePresence>

              <h1
                className="font-serif font-light leading-none flex flex-wrap justify-center gap-x-0 relative z-10"
                style={{ textShadow: "0 0 50px rgba(106,169,245,0.22)" }}
              >
                {NAME.map((l, i) => (
                  <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                      className={`inline-block ${l.cls} text-[clamp(3.4rem,10vw,9rem)]`}
                      initial={{ y: "115%", rotate: 4, filter: "blur(8px)" }}
                      animate={
                        phase >= 2
                          ? { y: 0, rotate: 0, filter: "blur(0px)" }
                          : { y: "115%", rotate: 4, filter: "blur(8px)" }
                      }
                      transition={{
                        duration: 0.75,
                        delay: phase >= 2 ? 0.05 * i : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {l.ch === " " ? " " : l.ch}
                    </motion.span>
                  </span>
                ))}
              </h1>

              {phase >= 2 && (
                <motion.div
                  className="mx-auto mt-8 flex items-center gap-6 justify-center"
                  initial={{ opacity: 0, scaleX: 0.4 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="h-px w-16 md:w-32 bg-ivory/25" />
                  <span className="font-mono text-[0.55rem] tracking-[0.4em] text-mute uppercase whitespace-nowrap">
                    Software Architect · Kerala, India
                  </span>
                  <span className="h-px w-16 md:w-32 bg-ivory/25" />
                </motion.div>
              )}

              {/* stamp */}
              <AnimatePresence>
                {phase === 3 && (
                  <motion.div
                    className="mt-10 inline-flex items-center gap-4 border border-line px-8 py-3 font-mono text-[0.62rem] tracking-[0.45em] text-ivory/70 uppercase relative overflow-hidden"
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  >
                    <span className="absolute inset-0 scanlines opacity-30" aria-hidden />
                    <span className="relative">Ready to build</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* credentials feed */}
          <div className="absolute bottom-8 left-6 md:left-12 max-w-[520px]">
            <div className="flex items-center gap-3 font-mono text-[0.55rem] tracking-[0.3em] text-gold/70 uppercase mb-3">
              <span className="caret-slot" aria-hidden />
              system.boot
            </div>
            <Typewriter
              lines={INTRO_LINES}
              className="font-mono text-[0.62rem] md:text-[0.72rem] leading-[1.9] tracking-[0.08em] text-ivory/60"
              charDelay={26}
            />
          </div>

          <motion.p
            className="absolute bottom-8 right-6 md:right-12 font-mono text-[0.55rem] tracking-[0.3em] text-mute uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: skipped ? 0.25 : 0.6 }}
          >
            {skipped ? "Skip" : "Click to skip ·"}
          </motion.p>

          {/* exit curtain light */}
          <motion.div
            className="absolute inset-0 bg-ivory/[0.04] pointer-events-none"
            animate={{ opacity: phase >= 3 ? [0, 1, 0] : 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
