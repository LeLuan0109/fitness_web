import transitionStore from "@/stores/transition.store"
import { useEffect } from "react"

const DURATION_MS = 2200

export function CoreformDoorTransition() {
  const mode = transitionStore((s) => s.mode)
  const isPlaying = transitionStore((s) => s.isPlaying)
  const finish = transitionStore((s) => s.finish)

  useEffect(() => {
    if (!isPlaying || !mode) return

    const timer = window.setTimeout(() => {
      finish()
    }, DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [isPlaying, mode, finish])

  if (!isPlaying || !mode) return null

  return (
    <div
      className="coreform-door-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-earth"
      data-mode={mode}
      aria-live="polite"
      aria-label={mode === "enter" ? "Đang vào hệ thống" : "Đang đăng xuất"}
    >
      <div className="coreform-door-scene relative h-full w-full max-w-lg">
        <div className="coreform-door-frame absolute left-1/2 top-1/2 h-72 w-48 -translate-x-1/2 -translate-y-1/2 rounded-sm border-4 border-sand/30 bg-earth/80 shadow-2xl">
          <div className="coreform-door-panel coreform-door-left absolute inset-y-0 left-0 w-1/2 origin-left border-r border-sand/20 bg-gradient-to-br from-clay to-earth" />
          <div className="coreform-door-panel coreform-door-right absolute inset-y-0 right-0 w-1/2 origin-right border-l border-sand/20 bg-gradient-to-bl from-clay to-earth" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/5 to-cream/10" />
        </div>

        <div className={`coreform-door-person absolute left-1/2 top-1/2 -translate-x-1/2 ${mode === "enter" ? "coreform-person-enter" : "coreform-person-exit"}`}>
          <svg viewBox="0 0 40 64" className="h-16 w-10 text-cream" fill="currentColor">
            <circle cx="20" cy="8" r="6" />
            <path d="M20 14v18M20 32l-8 14M20 32l8 14M12 22l8-4M28 22l-8-4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <p className="coreform-door-label absolute bottom-16 left-0 right-0 text-center text-sm font-medium tracking-[0.2em] text-sand/80 uppercase">
          {mode === "enter" ? "Chào mừng trở lại" : "Hẹn gặp lại"}
        </p>
      </div>
    </div>
  )
}
