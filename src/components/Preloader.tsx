import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Scramble from "./Scramble"

const STAGES = [
  "Initializing core",
  "Compiling assets",
  "Rendering scene",
  "Establishing link",
  "Deploying",
]

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const dur = 1300
    let raf = 0
    let finishT: ReturnType<typeof setTimeout> | undefined
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        finishT = setTimeout(() => {
          setDone(true)
          onDone()
        }, 480)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (finishT) clearTimeout(finishT)
    }
  }, [onDone])

  const R = 120
  const C = 2 * Math.PI * R
  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(count / (100 / STAGES.length)))]

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* atmosphere */}
          <div className="absolute inset-0 grid-floor opacity-30" aria-hidden />
          <div
            className="orb"
            style={{
              width: 520,
              height: 520,
              left: "-12%",
              top: "8%",
              background:
                "radial-gradient(circle, rgba(79,212,197,0.42), transparent 65%)",
            }}
            aria-hidden
          />
          <div
            className="orb"
            style={{
              width: 560,
              height: 560,
              right: "-14%",
              bottom: "-12%",
              background:
                "radial-gradient(circle, rgba(106,169,245,0.4), transparent 65%)",
              animationDelay: "-4s",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_32%,rgba(0,0,0,0.82))]" aria-hidden />

          <motion.p
            className="label mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Anix K Binoj — Portfolio
          </motion.p>

          {/* progress ring + counter */}
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <svg viewBox="0 0 280 280" className="absolute inset-0 -rotate-90">
              <circle
                cx="140"
                cy="140"
                r={R}
                fill="none"
                stroke="rgba(150,170,195,0.14)"
                strokeWidth="1"
              />
              <motion.circle
                cx="140"
                cy="140"
                r={R}
                fill="none"
                stroke="url(#plGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - count / 100)}
              />
              <defs>
                <linearGradient id="plGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4fd4c5" />
                  <stop offset="1" stopColor="#6aa9f5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <motion.span
                className="font-serif text-7xl md:text-8xl leading-none font-light tabular-nums text-chrome block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {count}
              </motion.span>
              <span className="font-mono text-xs text-mute">%</span>
            </div>
          </div>

          {/* status + bar */}
          <div className="mt-12 flex flex-col items-center gap-5">
            <Scramble
              key={stage}
              text={stage}
              className="font-mono text-[0.6rem] tracking-[0.45em] text-ivory/60 uppercase"
            />
            <div className="w-72 md:w-96 h-px bg-line overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-ivory/80"
                style={{ width: `${count}%` }}
              />
              <div className="absolute inset-0 scanlines opacity-40" aria-hidden />
            </div>
          </div>

          <span className="absolute bottom-7 font-mono text-[0.5rem] tracking-[0.3em] text-mute uppercase">
            Loading experience
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
