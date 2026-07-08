import { useEffect } from "react"
import { KeyRound, LockKeyhole, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import transitionStore from "@/stores/transition.store"

const DURATION_MS = 2600

type DoorTransitionMode = "enter" | "exit"

type CoreformDoorTransitionProps = {
  isLoading?: boolean
  isLoggingIn?: boolean
  onComplete?: () => void
  className?: string
}

const transitionCopy = {
  enter: {
    aria: "Đang xác thực thông tin",
    eyebrow: "Mở cánh cửa COREFORM",
    primary: "ĐANG XÁC THỰC THÔNG TIN...",
    secondary: "CHUẨN BỊ MỞ CỬA HÀNH TRÌNH...",
    Icon: KeyRound,
    AccentIcon: Sparkles,
  },
  exit: {
    aria: "Đang đóng hành trình",
    eyebrow: "Khép lại phiên tập",
    primary: "ĐANG ĐÓNG HÀNH TRÌNH...",
    secondary: "HẸN GẶP LẠI BẠN!",
    Icon: LockKeyhole,
    AccentIcon: Sparkles,
  },
} satisfies Record<
  DoorTransitionMode,
  {
    aria: string
    eyebrow: string
    primary: string
    secondary: string
    Icon: typeof KeyRound
    AccentIcon: typeof Sparkles
  }
>

export function CoreformDoorTransition({
  isLoading,
  isLoggingIn = true,
  onComplete,
  className,
}: CoreformDoorTransitionProps) {
  const storeMode = transitionStore((s) => s.mode)
  const storeIsPlaying = transitionStore((s) => s.isPlaying)
  const finish = transitionStore((s) => s.finish)
  const isControlled = typeof isLoading === "boolean"
  const mode = (isControlled ? (isLoggingIn ? "enter" : "exit") : storeMode) as DoorTransitionMode | null
  const isPlaying = isControlled ? isLoading : storeIsPlaying

  useEffect(() => {
    if (!isPlaying || !mode) return

    const timer = window.setTimeout(() => {
      if (isControlled) {
        onComplete?.()
        return
      }

      finish()
    }, DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [finish, isControlled, isPlaying, mode, onComplete])

  if (!isPlaying || !mode) return null

  const copy = transitionCopy[mode]
  const StatusIcon = copy.Icon
  const AccentIcon = copy.AccentIcon

  return (
    <div
      className={cn(
        "coreform-door-overlay fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-earth/90 text-cream backdrop-blur-xl",
        className,
      )}
      data-mode={mode}
      aria-live="polite"
      aria-label={copy.aria}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.14),transparent_34%),linear-gradient(135deg,rgba(16,185,129,0.12),transparent_38%),linear-gradient(225deg,rgba(217,195,176,0.14),transparent_44%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative flex h-full w-full flex-col items-center justify-center px-5 py-10">
        <div className="coreform-door-scene relative h-[min(54vh,26rem)] w-[min(74vw,21rem)] max-w-[22rem] [perspective:1200px]">
          <div className="absolute inset-x-8 -bottom-7 h-8 rounded-full bg-earth/45 blur-2xl" />
          <div className="coreform-door-reveal absolute inset-6 rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.85),rgba(217,195,176,0.24)_32%,rgba(16,185,129,0.12)_64%,rgba(0,0,0,0.08)_100%)] shadow-[0_0_70px_rgba(217,195,176,0.28)]" />

          <div className="coreform-door-frame absolute inset-0 overflow-hidden rounded-[1.8rem] border border-cream/15 bg-[#2f241b]/90 p-2 shadow-[0_30px_90px_rgba(74,53,37,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="absolute inset-2 rounded-[1.3rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_42%,rgba(0,0,0,0.26))]" />

            <div className="coreform-door-panel coreform-door-left absolute inset-y-2 left-2 w-[calc(50%-0.25rem)] origin-left overflow-hidden rounded-l-[1.25rem] border border-cream/10 bg-[linear-gradient(135deg,#3a2a1f_0%,#5b4330_45%,#8c6239_100%)] shadow-[inset_-14px_0_30px_rgba(74,53,37,0.36),inset_1px_0_0_rgba(255,255,255,0.14)]">
              <span className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(100deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_12px)]" />
              <span className="coreform-door-handle absolute right-3 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-[#e7d3a4]/80 shadow-[0_0_18px_rgba(231,211,164,0.35)]" />
            </div>

            <div className="coreform-door-panel coreform-door-right absolute inset-y-2 right-2 w-[calc(50%-0.25rem)] origin-right overflow-hidden rounded-r-[1.25rem] border border-cream/10 bg-[linear-gradient(225deg,#3a2a1f_0%,#5b4330_45%,#8c6239_100%)] shadow-[inset_14px_0_30px_rgba(74,53,37,0.36),inset_-1px_0_0_rgba(255,255,255,0.14)]">
              <span className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(80deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_12px)]" />
              <span className="coreform-door-handle absolute left-3 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-[#e7d3a4]/80 shadow-[0_0_18px_rgba(231,211,164,0.35)]" />
            </div>

            <div className="coreform-door-seam absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/45 to-transparent" />
          </div>

          <div className="coreform-door-person absolute left-1/2 top-1/2">
            <div className="relative flex size-16 items-center justify-center rounded-full border border-cream/15 bg-earth/25 shadow-[0_18px_45px_rgba(74,53,37,0.35)] backdrop-blur-md">
              <span className="coreform-person-pulse absolute inset-1 rounded-full border border-white/20" />
              <svg
                viewBox="0 0 48 64"
                className="relative h-12 w-9 text-cream drop-shadow-[0_0_10px_rgba(250,250,250,0.45)]"
                aria-hidden="true"
              >
                <circle cx="24" cy="8" r="5" fill="currentColor" />
                <path
                  className="coreform-walker-body"
                  d="M24 14v19"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className="coreform-walker-arm-left"
                  d="M24 21l-10 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className="coreform-walker-arm-right"
                  d="M24 21l10 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className="coreform-walker-leg-left"
                  d="M24 33l-10 16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  className="coreform-walker-leg-right"
                  d="M24 33l10 16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="coreform-door-status absolute bottom-[clamp(2rem,7vh,4.75rem)] left-1/2 w-[min(92vw,31rem)] -translate-x-1/2 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/10 px-3 py-1.5 text-xs font-medium text-cream/85 shadow-[0_14px_35px_rgba(74,53,37,0.18)] backdrop-blur-md">
            <AccentIcon className="size-3.5 text-[#e7d3a4]" />
            <span>{copy.eyebrow}</span>
          </div>

          <div className="mx-auto grid gap-2 rounded-2xl border border-cream/10 bg-earth/35 px-4 py-3 shadow-[0_20px_55px_rgba(74,53,37,0.22)] backdrop-blur-md sm:min-w-[28rem]">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-cream">
              <StatusIcon className="size-4 text-[#e7d3a4]" />
              <span>{copy.primary}</span>
            </p>
            <p className="text-sm font-medium text-cream/75">{copy.secondary}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
