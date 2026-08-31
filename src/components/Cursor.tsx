import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [media, setMedia] = useState<string | null>(null)
  const [mediaRot, setMediaRot] = useState(0)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 240, damping: 24, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 240, damping: 24, mass: 0.5 })
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    setEnabled(fine)
    if (!fine) return

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const labeled = t.closest<HTMLElement>("[data-cursor-label]")
      const mediaEl = t.closest<HTMLElement>("[data-cursor-media]")
      setHovering(
        !!t.closest(
          "a, button, [data-hover], .project-item, input, textarea, select"
        )
      )
      setLabel(labeled?.dataset.cursorLabel ?? null)
      if (mediaEl?.dataset.cursorMedia) {
        setMedia(mediaEl.dataset.cursorMedia)
        setMediaRot((Math.random() - 0.5) * 10)
      } else if (!mediaEl) {
        setMedia(null)
      }
    }
    const dn = () => setDown(true)
    const up = () => setDown(false)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseover", over)
    window.addEventListener("mousedown", dn)
    window.addEventListener("mouseup", up)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", over)
      window.removeEventListener("mousedown", dn)
      window.removeEventListener("mouseup", up)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      {/* media preview */}
      {media && (
        <motion.div
          className="fixed top-0 left-0 z-[125] pointer-events-none"
          style={{ x: ringX, y: ringY }}
        >
          <motion.div
            className="relative"
            animate={{ rotate: mediaRot }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ translateX: 28, translateY: 28 }}
          >
            <div className="w-24 h-28 md:w-28 md:h-32 rounded-lg overflow-hidden border border-gold/30 shadow-[0_0_30px_rgba(0,240,255,0.4)] bg-ink-2">
              <img src={media} alt="" className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-300" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* label chip */}
      {label && (
        <motion.div
          className="fixed top-0 left-0 z-[124] pointer-events-none"
          style={{ x: ringX, y: ringY }}
        >
          <motion.div
            className="whitespace-nowrap font-mono text-[0.52rem] tracking-[0.28em] uppercase text-ink bg-gold font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.6)] backdrop-blur-md"
            style={{ translateX: 22, translateY: -34 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="fixed top-0 left-0 z-[120] pointer-events-none"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full border border-gold shadow-[0_0_10px_rgba(0,240,255,0.5)] bg-gold/5 backdrop-blur-[2px]"
          animate={{
            width: hovering ? 64 : 28,
            height: hovering ? 64 : 28,
            opacity: label || media ? 0.15 : hovering ? 1 : 0.6,
            scale: down ? 0.85 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{ translateX: "-50%", translateY: "-50%" }}
        />
      </motion.div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[120] pointer-events-none mix-blend-difference"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(0,240,255,0.8)] -translate-x-1/2 -translate-y-1/2" />
      </div>
    </>
  )
}