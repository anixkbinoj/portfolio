export type GpuTier = 0 | 1 | 2

function isWeakRenderer(): boolean {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    if (!gl) return true
    const ext = gl.getExtension("WEBGL_debug_renderer_info")
    if (!ext) return false
    const info = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
    return /swiftshader|llvmpipe|software/i.test(info)
  } catch {
    return false
  }
}

export function getGpuTier(): GpuTier {
  if (typeof window === "undefined" || typeof document === "undefined") return 1
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0
  if (isWeakRenderer()) return 0

  const nav = navigator as Navigator & {
    deviceMemory?: number
    hardwareConcurrency?: number
  }
  const cores = nav.hardwareConcurrency ?? 4
  const mem = nav.deviceMemory ?? 4
  const dpr = window.devicePixelRatio || 1

  let score = 0
  if (cores >= 8) score++
  if (mem >= 8) score++
  if (dpr >= 1.5) score++
  if (cores >= 4 && mem >= 4) score++

  return score >= 2 ? 2 : score >= 1 ? 1 : 0
}
