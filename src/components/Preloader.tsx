import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const dur = 1000
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
        }, 450)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (finishT) clearTimeout(finishT)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden">
            <motion.p
              className="label mb-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Anix K Binoj — Portfolio
            </motion.p>
          </div>
          <div className="flex items-end gap-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-8xl md:text-[9rem] leading-none font-light tabular-nums text-chrome"
            >
              {count}
            </motion.span>
            <span className="font-mono text-xs text-mute mb-4">%</span>
          </div>
          <div className="w-64 md:w-96 h-px bg-line mt-10 overflow-hidden">
            <motion.div
              className="h-full bg-ivory/80"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}