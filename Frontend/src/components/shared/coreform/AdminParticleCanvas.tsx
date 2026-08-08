import { useEffect, useRef } from "react"

import adminThemeStore from "@/stores/admin-theme.store"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const PARTICLE_COUNT = 84
const LINK_DISTANCE = 130
const REPEL_RADIUS = 130
const REPEL_STRENGTH = 1.4

/**
 * Full-bleed animated "constellation network" canvas mounted behind the
 * admin layout. Particles drift, link to nearby neighbours, and repel away
 * from the cursor. Colors follow the admin accent color live.
 *
 * Performance: a single rAF loop, paused on tab-hidden, frozen (single static
 * frame) under prefers-reduced-motion, and DPR-aware for crispness on retina.
 */
export function AdminParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const accent = adminThemeStore.use.accent()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const particles: Particle[] = []

    const seed = () => {
      particles.length = 0
      const count = Math.min(
        PARTICLE_COUNT,
        Math.max(40, Math.floor((width * height) / 16000)),
      )
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 1.8 + 0.8,
        })
      }
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const mouse = { x: -9999, y: -9999, active: false }
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    /** Read the live accent from the CSS var set by admin-theme.store. */
    const getAccent = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--admin-accent")
        .trim()
      return raw || "#0ea5e9"
    }

    const drawFrame = () => {
      const accentColor = getAccent()
      ctx.clearRect(0, 0, width, height)

      // Update
      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx
          p.y += p.vy
        }

        // Repel from cursor
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
            p.x += (dx / dist) * force
            p.y += (dy / dist) * force
          }
        }

        // Wrap around edges
        if (p.x < -20) p.x = width + 20
        else if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        else if (p.y > height + 20) p.y = -20
      }

      // Links (constellation)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.5
            ctx.strokeStyle = hexWithAlpha(accentColor, alpha)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Particles
      ctx.fillStyle = accentColor
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Soft cursor halo
      if (mouse.active) {
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          REPEL_RADIUS,
        )
        grad.addColorStop(0, hexWithAlpha(accentColor, 0.1))
        grad.addColorStop(1, hexWithAlpha(accentColor, 0))
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, REPEL_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let rafId = 0
    let running = true
    const loop = () => {
      drawFrame()
      if (running && !reduceMotion) rafId = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      running = !document.hidden
      if (running) {
        loop()
      } else {
        cancelAnimationFrame(rafId)
      }
    }

    resize()
    loop()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseout", onLeave)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseout", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
    // Re-init when accent changes drastically is unnecessary — getAccent()
    // reads the live CSS var each frame, so the loop self-updates colors.
  }, [])

  // accent is read live from CSS var inside the loop; dependency only kept
  // to satisfy reactive intent without re-creating the canvas.
  void accent

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="admin-particle-canvas pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}

/** Apply alpha to a #rrggbb hex (or fall back gracefully). */
function hexWithAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").trim()
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean
  if (full.length !== 6) return `rgba(99,102,241,${alpha})`
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
