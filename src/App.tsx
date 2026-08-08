import { lazy, Suspense, useCallback, useEffect, useState } from "react"
import Lenis from "lenis"
import Preloader from "./components/Preloader"
import Intro from "./components/Intro"
import Cursor from "./components/Cursor"
import Overlay from "./components/Overlay"
import Nav from "./components/Nav"
import Hero from "./components/Hero"
import ProofStrip from "./components/ProofStrip"
import Marquee from "./components/Marquee"
import Ventures from "./components/Ventures"
import Capabilities from "./components/Capabilities"
import Work from "./components/Work"
import Deployments from "./components/Deployments"
import Philosophy from "./components/Philosophy"
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

const Scene3D = lazy(() => import("./components/Scene3D"))

type Stage = "preload" | "intro" | "live"

export default function App() {
  const [stage, setStage] = useState<Stage>("preload")

  const toIntro = useCallback(() => setStage("intro"), [])
  const toLive = useCallback(() => setStage("live"), [])

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])

  return (
    <>
      {stage === "live" && <Cursor />}
      {stage === "preload" && <Preloader onDone={toIntro} />}
      {stage === "intro" && <Intro onDone={toLive} />}

      <Overlay />
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {stage === "live" && (
        <div className="relative z-10">
          <Nav />
          <main>
            <Hero />
            <ProofStrip />
            <Marquee />
            <Ventures />
            <Capabilities />
            <Work />
            <Deployments />
            <Philosophy />
            <About />
          </main>
          <Contact />
          <Footer />
        </div>
      )}
    </>
  )
}