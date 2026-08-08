import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Typewriter from "./Typewriter"
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

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setExit(true)
    setTimeout(onDone, 700)
  }, [onDone])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 250), // typing starts
      setTimeout(() => setPhase(2), 1700), // name reveal
      setTimeout(() => setPhase(3), 2900), // stamp
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
        >
          {/* atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />

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
            <div className="text-center px-6">
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
                    Welcome
                  </motion.p>
                )}
              </AnimatePresence>

              <h1 className="font-serif font-light leading-none flex flex-wrap justify-center gap-x-0">
                {NAME.map((l, i) => (
                  <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                      className={`inline-block ${l.cls} text-[clamp(3.4rem,10vw,9rem)] ${l.ch === "K" ? "text-chrome" : ""}`}
                      initial={{ y: "115%", rotate: 4 }}
                      animate={
                        phase >= 2
                          ? { y: 0, rotate: 0 }
                          : { y: "115%", rotate: 4 }
                      }
                      transition={{
                        duration: 0.7,
                        delay: phase >= 2 ? 0.045 * i : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {l.ch === " " ? "\u00A0" : l.ch}
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
                    className="mt-10 inline-flex items-center gap-4 border border-line px-8 py-3 font-mono text-[0.62rem] tracking-[0.45em] text-ivory/70 uppercase"
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  >
                    Ready to build
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* credentials feed */}
          <div className="absolute bottom-8 left-6 md:left-12 max-w-[520px]">
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