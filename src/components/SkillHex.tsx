import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SectionHeading from "./SectionHeading"

const AXES = [
  { label: "Architecture", value: 0.95, desc: "Clean backend design, APIs, databases, role-based systems" },
  { label: "Full-Stack Dev", value: 0.92, desc: "React, Flutter, REST, SQL — end-to-end product builds" },
  { label: "AI / ML", value: 0.88, desc: "Intelligent features embedded into production software" },
  { label: "Product Design", value: 0.9, desc: "UX-first interfaces with rigorous interaction thinking" },
  { label: "Leadership", value: 0.9, desc: "Team operations, workflow discipline, documentation culture" },
  { label: "Entrepreneurship", value: 0.93, desc: "Venture building — Anix & Co, Antolanz, live products" },
]

const CX = 170
const CY = 165
const R = 100

const pt = (angleDeg: number, r: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

const axisPoints = AXES.map((_, i) => pt(i * 60, R))
const dataPoints = AXES.map((ax, i) => pt(i * 60, R * ax.value))
const centerString = Array(AXES.length).fill(`${CX},${CY}`).join(" ")

const toStr = (points: number[][]) =>
  points.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ")

const rings = [0.25, 0.5, 0.75, 1].map((f) =>
  AXES.map((_, i) => pt(i * 60, R * f))
)

export default function SkillHex() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="relative py-28 md:py-40 bg-ink-2/40 border-t border-line">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <SectionHeading
          num="06.b"
          label="Aptitude Matrix"
          title="Where I"
          accent="measure up"
        />

        <div className="grid lg:grid-cols-[auto_1fr] gap-16 lg:gap-24 items-center">
          {/* Radar */}
          <div className="mx-auto" data-cursor-label={active !== null ? `${AXES[active].label} · ${Math.round(AXES[active].value * 100)}%` : "Aptitude Matrix"}>
            <svg viewBox="0 0 340 340" className="w-[340px] md:w-[420px] h-auto">
              {/* rings */}
              {rings.map((r, i) => (
                <polygon
                  key={i}
                  points={toStr(r)}
                  fill="none"
                  stroke="rgba(150,170,195,0.12)"
                  strokeWidth={i === 3 ? 1 : 0.6}
                />
              ))}

              {/* spokes */}
              {axisPoints.map((p, i) => (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={p[0]}
                  y2={p[1]}
                  stroke="rgba(150,170,195,0.12)"
                  strokeWidth={0.6}
                />
              ))}

              {/* data polygon */}
              <motion.polygon
                points={centerString}
                whileInView={{ points: toStr(dataPoints) }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                fill="rgba(106,169,245,0.08)"
                stroke="#6aa9f5"
                strokeWidth={1.4}
              />

              {/* active ray */}
              {active !== null && (
                <motion.line
                  key={`ray-${active}`}
                  x1={CX}
                  y1={CY}
                  x2={dataPoints[active][0]}
                  y2={dataPoints[active][1]}
                  stroke="#6aa9f5"
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* vertex dots */}
              {dataPoints.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p[0]}
                  cy={p[1]}
                  r={active === i ? 5.5 : 3.5}
                  fill={active === i ? "#6aa9f5" : "#e9eef4"}
                  stroke="#05070b"
                  strokeWidth={1}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 300, damping: 15 }}
                  style={{ transformOrigin: `${p[0]}px ${p[1]}px` }}
                />
              ))}

              {/* value labels */}
              {dataPoints.map((p, i) => (
                <motion.text
                  key={i}
                  x={p[0]}
                  y={p[1] - 12}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="10"
                  letterSpacing="1"
                  fill={active === i ? "#6aa9f5" : "rgba(110,123,140,0.9)"}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                >
                  {Math.round(AXES[i].value * 100)}
                </motion.text>
              ))}

              {/* axis labels (interactive) */}
              {AXES.map((ax, i) => {
                const [lx, ly] = pt(i * 60, R + 34)
                return (
                  <g
                    key={ax.label}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    className="cursor-crosshair"
                  >
                    <circle cx={lx} cy={ly} r={22} fill="transparent" />
                    <text
                      x={lx}
                      y={ly + 4}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="11.5"
                      letterSpacing="1.5"
                      fill={active === i ? "#6aa9f5" : "rgba(233,238,244,0.55)"}
                      style={{ transition: "fill 0.3s" }}
                    >
                      {ax.label.toUpperCase()}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* readout */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {active === null ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="font-mono text-[0.6rem] tracking-[0.35em] text-mute uppercase mb-6">
                    {"//"} Hover an axis
                  </p>
                  <p className="font-serif text-3xl md:text-5xl font-light text-ivory/80 leading-snug max-w-lg">
                    One operator. <em className="text-chrome italic font-normal">Six disciplines.</em>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-6 mb-6">
                    <span className="font-serif italic text-5xl text-chrome">
                      {Math.round(AXES[active].value * 100)}%
                    </span>
                    <span className="h-px w-12 bg-ivory/30" />
                    <span className="font-mono text-[0.62rem] tracking-[0.3em] text-gold-2 uppercase">
                      {AXES[active].label}
                    </span>
                  </div>
                  <p className="text-ivory/70 font-light leading-relaxed max-w-lg">
                    {AXES[active].desc}
                  </p>
                  <div className="mt-8 w-full max-w-lg h-px bg-line relative overflow-hidden">
                    <motion.div
                      key={`bar-${active}`}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${AXES[active].value * 100}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}