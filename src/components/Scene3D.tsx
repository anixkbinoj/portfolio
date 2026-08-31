import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei"
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing"
import type { DepthOfFieldEffect } from "postprocessing"
import * as THREE from "three"
import { getGpuTier, type GpuTier } from "../lib/performance"

interface MotionProps {
  animated: boolean
}

interface TargetRef {
  current: THREE.Object3D | null
}

interface DofRef {
  current: DepthOfFieldEffect | null
}

function Particles({ count, animated }: { count: number } & MotionProps) {
  const ref = useRef<THREE.Points>(null!)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.pow(Math.random(), 1.6) * 16
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
      pos[i * 3 + 2] = r * Math.cos(phi) - 6
      const t = Math.random()
      c.setHSL(
        0.57 + t * 0.08,
        0.25 + Math.random() * 0.25,
        0.6 + Math.random() * 0.28
      )
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame((state) => {
    const mat = ref.current.material as THREE.PointsMaterial
    if (animated) {
      const t = state.clock.elapsedTime
      ref.current.rotation.y = t * 0.02 + state.pointer.x * 0.08
      ref.current.rotation.x = Math.sin(t * 0.015) * 0.04 + state.pointer.y * 0.05
      mat.opacity = 0.72 + Math.sin(t * 1.1) * 0.14
    } else {
      ref.current.rotation.y = state.pointer.x * 0.08
      ref.current.rotation.x = state.pointer.y * 0.05
      mat.opacity = 0.8
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GoldenKnot({
  animated,
  knotRef,
}: MotionProps & { knotRef: TargetRef }) {
  const knot = useRef<THREE.Mesh>(null!)
  const wire = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    knotRef.current = knot.current
  }, [knotRef])

  useFrame((state) => {
    if (!animated) return
    const t = state.clock.elapsedTime
    knot.current.rotation.x = t * 0.14
    knot.current.rotation.y = t * 0.2
    knot.current.position.y = Math.sin(t * 0.3) * 0.35
    wire.current.rotation.x = -t * 0.1
    wire.current.rotation.y = t * 0.16
    wire.current.position.y = Math.sin(t * 0.3) * 0.35
  })

  return (
    <group position={[3.4, 0.6, -3]}>
      <Float
        speed={1.4}
        rotationIntensity={animated ? 0.4 : 0}
        floatIntensity={animated ? 0.6 : 0}
      >
        <mesh ref={knot} scale={1}>
          <torusKnotGeometry args={[1, 0.3, 220, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={1}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={0.8}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[100, 400]}
            envMapIntensity={2.0}
            emissive="#8a2be2"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh ref={wire} scale={1.22}>
          <torusKnotGeometry args={[1, 0.3, 160, 20]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>
    </group>
  )
}

function ChromeOrb({ animated }: MotionProps) {
  const orb = useRef<THREE.Group>(null!)
  const mesh = useRef<THREE.Mesh>(null!)
  const base = useMemo(() => new THREE.Vector3(-3.7, -0.85, -4.9), [])

  useFrame((state) => {
    if (!animated) return
    const t = state.clock.elapsedTime
    mesh.current.position.x = Math.sin(t * 0.25) * 0.55
    mesh.current.position.y = Math.sin(t * 0.4 + 1.2) * 0.18
    orb.current.rotation.y = t * 0.1
  })

  return (
    <group ref={orb} position={base}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshPhysicalMaterial
          color="#dfeaff"
          metalness={1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  )
}

function Rings({ animated }: MotionProps) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!animated) return
    const t = state.clock.elapsedTime
    group.current.rotation.z = t * 0.05
    group.current.rotation.x = Math.sin(t * 0.1) * 0.2
  })

  const rings = useMemo(() => {
    const arr = []
    for (let i = 0; i < 3; i++) {
      arr.push({
        radius: 5.5 + i * 1.6,
        tube: 0.004 + i * 0.0015,
        opacity: 0.14 - i * 0.035,
        tilt: (i - 1) * 0.35,
      })
    }
    return arr
  }, [])

  return (
    <group ref={group} position={[0, 0, -8]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[r.tilt, 0, 0]}>
          <torusGeometry args={[r.radius, r.tube, 8, 180]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#00f0ff" : "#8a2be2"}
            transparent
            opacity={r.opacity * 1.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function AutoFocus({ target, dofRef }: { target: TargetRef; dofRef: DofRef }) {
  const v = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const effect = dofRef.current
    if (!effect || !target.current) return
    target.current.getWorldPosition(v)
    effect.target = v
  })

  return null
}

function PostFX({ tier, knotRef }: { tier: GpuTier; knotRef: TargetRef }) {
  const dofRef = useRef<DepthOfFieldEffect | null>(null)

  const effects = [
    <Bloom
      key="bloom"
      intensity={1.2}
      luminanceThreshold={0.4}
      luminanceSmoothing={0.2}
      mipmapBlur
      radius={0.8}
    />,
    <ChromaticAberration
      key="ca"
      offset={new THREE.Vector2(0.003, 0.003)}
      radialModulation={false}
      modulationOffset={0}
    />,
    ...(tier === 2
      ? [
          <DepthOfField
            key="dof"
            ref={dofRef}
            target={[3.4, 0.6, -3]}
            focusDistance={3}
            focusRange={2}
            bokehScale={1.6}
            height={480}
          />,
          <AutoFocus key="af" target={knotRef} dofRef={dofRef} />,
        ]
      : []),
  ]

  return <EffectComposer multisampling={tier === 2 ? 4 : 2}>{effects}</EffectComposer>
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer
        intensity={2.6}
        position={[0, 4, 5]}
        scale={[12, 3, 1]}
        rotation-x={-Math.PI / 2}
        color="#ffffff"
      />
      <Lightformer
        intensity={3.2}
        position={[6, 1.5, 3]}
        scale={[2.4, 1.3, 1]}
        rotation-y={-Math.PI / 2.6}
        color="#4fd4c5"
      />
      <Lightformer
        intensity={1.6}
        position={[-5, 0.5, 2]}
        scale={[1.8, 1.1, 1]}
        rotation-y={Math.PI / 2.4}
        color="#6aa9f5"
      />
      <Lightformer
        form="ring"
        intensity={1.2}
        position={[0, 2, -7]}
        scale={4}
        color="#3d5a99"
      />
      <Lightformer
        intensity={0.8}
        position={[0, -4, 4]}
        scale={[14, 2, 1]}
        rotation-x={Math.PI / 2}
        color="#1c2a40"
      />
    </Environment>
  )
}

function Rig() {
  useFrame((state) => {
    const { camera, pointer } = state
    camera.position.x += (pointer.x * 1.0 - camera.position.x) * 0.05
    camera.position.y += (pointer.y * 0.7 + 0.15 - camera.position.y) * 0.05
    camera.lookAt(0, 0, -2)
  })
  return null
}

function VisibilityPause() {
  const setFrameloop = useThree((s) => s.setFrameloop)

  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always")
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [setFrameloop])

  return null
}

export default function Scene3D() {
  const tier = useMemo<GpuTier>(() => getGpuTier(), [])
  const [dprScale, setDprScale] = useState(0.85)
  const knotRef = useRef<THREE.Object3D | null>(null)

  const animated = tier > 0
  const particles = tier === 0 ? 900 : tier === 1 ? 2200 : 3500
  const dprCap = tier === 0 ? 1 : tier === 1 ? 1.5 : 2

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.15, 8], fov: 55, near: 0.5, far: 40 }}
        dpr={[1, dprCap * dprScale]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        <Rig />
        <VisibilityPause />
        <Particles count={particles} animated={animated} />
        <GoldenKnot animated={animated} knotRef={knotRef} />
        <ChromeOrb animated={animated} />
        <Rings animated={animated} />
        <Studio />
        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.55}
          scale={16}
          blur={2.8}
          far={5}
          resolution={tier === 2 ? 1024 : 512}
          frames={animated ? undefined : 1}
        />
        <PerformanceMonitor
          iterations={45}
          onDecline={() => setDprScale((v) => Math.max(0.6, v - 0.2))}
          onIncline={() => setDprScale((v) => Math.min(1, v + 0.2))}
        >
          <>
            {tier > 0 ? <PostFX tier={tier} knotRef={knotRef} /> : null}
          </>
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
