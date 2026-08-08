import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import * as THREE from "three"

const SIZE = 160
const PHOTO_SAMPLE = 200

type Variant = "face" | "photo"

function makeDotTexture() {
  const c = document.createElement("canvas")
  c.width = 64
  c.height = 64
  const ctx = c.getContext("2d")!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(0.35, "rgba(255,255,255,0.9)")
  g.addColorStop(0.75, "rgba(255,255,255,0.22)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}
const DOT = makeDotTexture()

interface FaceData {
  target: Float32Array
  edges: Uint8Array
  colors: Float32Array | null
}

function useFaceData(variant: Variant) {
  const [data, setData] = useState<FaceData | null>(null)

  useEffect(() => {
    let cancelled = false
    const sample = variant === "photo" ? PHOTO_SAMPLE : SIZE
    const total = sample * sample

    const process = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas")
      c.width = sample
      c.height = sample
      const ctx = c.getContext("2d", { willReadFrequently: true })
      if (!ctx) return
      ctx.filter = "contrast(1.4) brightness(1.08) saturate(1.15)"
      draw(ctx)
      const d = ctx.getImageData(0, 0, sample, sample).data

      const lum = new Float32Array(total)
      for (let i = 0; i < total; i++) {
        const j = i * 4
        lum[i] = (0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2]) / 255
      }

      let kept = total
      if (variant === "photo") {
        kept = 0
        for (let y = 0; y < sample; y++) {
          for (let x = 0; x < sample; x++) {
            const dx = x / sample - 0.5
            const dy = y / sample - 0.5
            if (dx * dx + dy * dy <= 0.25) kept++
          }
        }
      }

      const target = new Float32Array(kept * 3)
      const colors = variant === "photo" ? new Float32Array(kept * 3) : null
      const edges = new Uint8Array(kept)

      if (variant === "face") {
        for (let y = 1; y < sample - 1; y++) {
          for (let x = 1; x < sample - 1; x++) {
            const i = y * sample + x
            const gx =
              -lum[i - sample - 1] -
              2 * lum[i - 1] -
              lum[i + sample - 1] +
              lum[i - sample + 1] +
              2 * lum[i + 1] +
              lum[i + sample + 1]
            const gy =
              -lum[i - sample - 1] -
              2 * lum[i - sample] -
              lum[i - sample + 1] +
              lum[i + sample - 1] +
              2 * lum[i + sample] +
              lum[i + sample + 1]
            if (Math.sqrt(gx * gx + gy * gy) > 0.24) edges[i] = 1
          }
        }

        for (let i = 0; i < kept; i++) {
          const x = i % sample
          const y = (i / sample) | 0
          const l = lum[i]
          target[i * 3] = (x / sample - 0.5) * 2.3
          target[i * 3 + 1] = (0.5 - y / sample) * 2.3
          target[i * 3 + 2] = (l - 0.55) * 0.5
        }
      } else {
        let k = 0
        for (let y = 0; y < sample; y++) {
          for (let x = 0; x < sample; x++) {
            const dx = x / sample - 0.5
            const dy = y / sample - 0.5
            if (dx * dx + dy * dy > 0.25) continue
            const i = y * sample + x
            const l = lum[i]
            target[k * 3] = dx * 2.3
            target[k * 3 + 1] = -dy * 2.3
            target[k * 3 + 2] = (l - 0.5) * 0.3
            const j = i * 4
            colors![k * 3] = d[j] / 255
            colors![k * 3 + 1] = d[j + 1] / 255
            colors![k * 3 + 2] = d[j + 2] / 255
            k++
          }
        }
      }

      if (!cancelled) setData({ target, edges, colors })
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "/profile.jpg"
    img.onload = () =>
      process((ctx) => {
        if (variant === "photo") {
          const scale = Math.max(
            sample / img.naturalWidth,
            sample / img.naturalHeight
          )
          const dw = img.naturalWidth * scale
          ctx.drawImage(img, (dw - sample) / 2, 0, sample, sample, 0, 0, sample, sample)
        } else {
          ctx.drawImage(img, 0, 0, sample, sample)
        }
      })
    img.onerror = () =>
      process((ctx) => {
        const g = ctx.createRadialGradient(
          sample / 2, sample / 2, sample * 0.05,
          sample / 2, sample / 2, sample * 0.6
        )
        g.addColorStop(0, "rgba(255,255,255,0.95)")
        g.addColorStop(0.4, "rgba(180,220,255,0.55)")
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(0, 0, sample, sample)
      })

    return () => {
      cancelled = true
    }
  }, [variant])

  return data
}

const easeInOut = (t: number) =>
  t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t)

interface FaceCloudProps {
  pulse: RefObject<{ armed: boolean }>
  variant: Variant
  onBurst?: () => void
}

function FaceCloud({ pulse, variant, onBurst }: FaceCloudProps) {
  const data = useFaceData(variant)
  const groupRef = useRef<THREE.Group>(null!)
  const fillRef = useRef<THREE.Points>(null!)
  const edgeRef = useRef<THREE.Points>(null!)
  const burstAtRef = useRef(-10)
  const isPhoto = variant === "photo"

  const buffers = useMemo(() => {
    if (!data) return null
    const n = data.target.length / 3
    const master = new Float32Array(data.target.length)
    const start = new Float32Array(data.target.length)
    const scatter = new Float32Array(data.target.length)
    const fillColors = new Float32Array(data.target.length)

    let edgeCount = 0
    for (let i = 0; i < n; i++) if (data.edges[i]) edgeCount++
    const edgeMap = new Uint32Array(edgeCount)
    const edgePositions = new Float32Array(edgeCount * 3)
    const edgeColors = new Float32Array(edgeCount * 3)
    const c = new THREE.Color()
    let ei = 0

    for (let i = 0; i < n; i++) {
      const r = 1.4 + Math.random() * 0.3
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      start[i * 3] = r * Math.sin(ph) * Math.cos(th)
      start[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8
      start[i * 3 + 2] = r * Math.cos(ph)
      scatter[i * 3] = start[i * 3] * 2.6
      scatter[i * 3 + 1] = start[i * 3 + 1] * 2.6
      scatter[i * 3 + 2] = start[i * 3 + 2] * 2.6

      if (data.colors) {
        fillColors[i * 3] = data.colors[i * 3]
        fillColors[i * 3 + 1] = data.colors[i * 3 + 1]
        fillColors[i * 3 + 2] = data.colors[i * 3 + 2]
      } else {
        const l = 0.5 - data.target[i * 3 + 2]
        c.setHSL(0.58 + l * 0.12, 0.45, 0.4 + l * 0.42)
        fillColors[i * 3] = c.r
        fillColors[i * 3 + 1] = c.g
        fillColors[i * 3 + 2] = c.b
      }

      if (data.edges[i]) {
        edgeMap[ei] = i
        c.setHSL(0.6, 0.5, 0.9)
        edgeColors[ei * 3] = c.r
        edgeColors[ei * 3 + 1] = c.g
        edgeColors[ei * 3 + 2] = c.b
        ei++
      }
    }

    master.set(data.target)

    return { start, scatter, fillColors, edgeMap, edgePositions, edgeColors, edgeCount }
  }, [data])

  const geometry = useMemo(() => {
    if (!buffers || !data) return null
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(data.target.slice(), 3))
    g.setAttribute("color", new THREE.BufferAttribute(buffers.fillColors, 3))
    return g
  }, [buffers, data])

  const edgeGeometry = useMemo(() => {
    if (!buffers || buffers.edgeCount === 0) return null
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(buffers.edgePositions, 3))
    g.setAttribute("color", new THREE.BufferAttribute(buffers.edgeColors, 3))
    return g
  }, [buffers])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!geometry || !fillRef.current) return
    const { start, scatter, edgeMap, edgeCount } = buffers!
    const target = data!.target

    if (pulse.current?.armed) {
      burstAtRef.current = t
      pulse.current.armed = false
      onBurst?.()
    }

    const g = groupRef.current
    g.rotation.y = t * 0.05 + state.pointer.x * 0.22
    g.rotation.x = state.pointer.y * 0.14
    g.position.y = Math.sin(t * 0.5) * 0.06

    const pos = geometry.attributes.position.array as Float32Array
    const n = target.length / 3
    const sinceBurst = t - burstAtRef.current
    const bursting = sinceBurst >= 0 && sinceBurst < 0.85
    const kBack = easeInOut(
      sinceBurst >= 0.85 ? Math.min((sinceBurst - 0.85) / 1.5, 1) : 0
    )

    for (let i = 0; i < n; i++) {
      let seed = Math.sin(i * 127.1 + 311.7) * 43758.5453
      seed -= Math.floor(seed)

      const kArr = easeInOut(Math.max(0, Math.min(t * 0.6 - seed * 0.5, 1)))
      const ax = start[i * 3] + (target[i * 3] - start[i * 3]) * kArr
      const ay = start[i * 3 + 1] + (target[i * 3 + 1] - start[i * 3 + 1]) * kArr
      const az = start[i * 3 + 2] + (target[i * 3 + 2] - start[i * 3 + 2]) * kArr

      if (bursting) {
        const kOut = easeInOut(Math.min(sinceBurst / 0.85, 1))
        pos[i * 3] = ax + (scatter[i * 3] - ax) * kOut
        pos[i * 3 + 1] = ay + (scatter[i * 3 + 1] - ay) * kOut
        pos[i * 3 + 2] = az + (scatter[i * 3 + 2] - az) * kOut
      } else if (burstAtRef.current >= 0) {
        pos[i * 3] =
          scatter[i * 3] + (ax - scatter[i * 3]) * kBack + Math.sin(t * 0.9 + seed * 9) * 0.004
        pos[i * 3 + 1] = scatter[i * 3 + 1] + (ay - scatter[i * 3 + 1]) * kBack
        pos[i * 3 + 2] = scatter[i * 3 + 2] + (az - scatter[i * 3 + 2]) * kBack
      } else {
        pos[i * 3] = ax + Math.sin(t * 0.9 + seed * 9) * 0.004
        pos[i * 3 + 1] = ay
        pos[i * 3 + 2] = az
      }
    }

    if (edgeGeometry && edgeCount > 0) {
      const epos = edgeGeometry.attributes.position.array as Float32Array
      for (let k = 0; k < edgeCount; k++) {
        const mi = edgeMap[k] * 3
        epos[k * 3] = pos[mi]
        epos[k * 3 + 1] = pos[mi + 1]
        epos[k * 3 + 2] = pos[mi + 2]
      }
      edgeGeometry.attributes.position.needsUpdate = true
    }

    geometry.attributes.position.needsUpdate = true
  })

  if (!data || !buffers || !geometry) return null

  const fillSize = isPhoto ? 0.022 : 0.012

  return (
    <group ref={groupRef}>
      <points ref={fillRef} geometry={geometry}>
        <pointsMaterial
          map={DOT}
          size={fillSize}
          vertexColors
          transparent
          opacity={isPhoto ? 0.95 : 0.55}
          sizeAttenuation
          depthWrite={false}
          blending={isPhoto ? THREE.NormalBlending : THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      {isPhoto && (
        <points geometry={geometry}>
          <pointsMaterial
            map={DOT}
            color="#6aa9f5"
            size={fillSize * 3.2}
            transparent
            opacity={0.14}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      )}
      {edgeGeometry && (
        <points ref={edgeRef} geometry={edgeGeometry}>
          <pointsMaterial
            map={DOT}
            size={0.024}
            vertexColors
            transparent
            opacity={1}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      )}
    </group>
  )
}

interface ParticlePortraitProps {
  className?: string
  burstRef?: RefObject<{ armed: boolean }>
  autoBurst?: boolean
  variant?: Variant
}

export default function ParticlePortrait({
  className,
  burstRef,
  autoBurst = true,
  variant = "face",
}: ParticlePortraitProps) {
  const internal = useRef({ armed: false })
  const pulse = burstRef ?? internal
  const isPhoto = variant === "photo"

  const [resolved, setResolved] = useState(false)
  const resolveTimer = useRef<number | null>(null)
  const loopTimer = useRef<number | null>(null)

  const clearLoop = useCallback(() => {
    if (loopTimer.current) {
      window.clearTimeout(loopTimer.current)
      loopTimer.current = null
    }
  }, [])

  const scheduleResolve = useCallback((delay: number) => {
    if (resolveTimer.current) window.clearTimeout(resolveTimer.current)
    resolveTimer.current = window.setTimeout(() => setResolved(true), delay)
  }, [])

  const arm = (delay: number) => {
    clearLoop()
    loopTimer.current = window.setTimeout(() => {
      pulse.current.armed = true
      setResolved(false)
      scheduleResolve(2400)
      arm(2400 + 2000)
    }, delay)
  }
  const armRef = useRef(arm)
  armRef.current = arm

  const handleBurst = useCallback(() => {
    if (!isPhoto) return
    clearLoop()
    setResolved(false)
    scheduleResolve(2400)
    arm(0)
  }, [isPhoto, clearLoop, scheduleResolve])

  useEffect(() => {
    if (!isPhoto) return
    const first = window.setTimeout(() => setResolved(true), 2600)
    const firstArm = window.setTimeout(() => arm(0), 2600 + 2000)
    return () => {
      window.clearTimeout(first)
      window.clearTimeout(firstArm)
      clearLoop()
      if (resolveTimer.current) window.clearTimeout(resolveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPhoto, clearLoop])

  useEffect(() => {
    if (!autoBurst || isPhoto) return
    const t = setTimeout(() => {
      pulse.current.armed = true
    }, 2600)
    return () => clearTimeout(t)
  }, [autoBurst, isPhoto, pulse])

  return (
    <div
      className={className}
      data-hover
      onClick={(e) => {
        e.stopPropagation()
        pulse.current.armed = true
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: resolved ? 0 : 1 }}
        transition={{ duration: resolved ? 0.9 : 0.4, ease: "easeInOut" }}
      >
        <Canvas
          camera={{ position: [0, 0, 2.9], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <FaceCloud pulse={pulse} variant={variant} onBurst={handleBurst} />
        </Canvas>
      </motion.div>
      {isPhoto && (
        <motion.img
          src="/profile.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: resolved ? 1 : 0 }}
          transition={{ duration: resolved ? 0.9 : 0.3, ease: "easeInOut" }}
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  )
}