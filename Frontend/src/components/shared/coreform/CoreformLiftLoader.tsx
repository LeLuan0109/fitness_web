import { cn } from "@/lib/utils"

type Props = {
  className?: string
  label?: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = { sm: "size-10", md: "size-16", lg: "size-24" }

export function CoreformLiftLoader({ className, label, size = "md" }: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative", sizeMap[size])} aria-hidden="true">
        <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
          <g stroke="#D9C3B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 52h40" />
            <path d="M18 52V38c0-2 1.5-4 4-4h4" />
            <path d="M46 52V38c0-2-1.5-4-4-4h-4" />
            <path d="M22 34h20" />
            <circle cx="32" cy="18" r="5" />
            <path d="M32 23v6" />
            <path d="M26 29l-4 3" />
            <path d="M38 29l4 3" />
          </g>
          <defs>
            <clipPath id="coreform-lift-clip">
              <rect className="coreform-lift-fill-rect" x="0" y="64" width="64" height="64" />
            </clipPath>
          </defs>
          <g clipPath="url(#coreform-lift-clip)" stroke="#4A3525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 52h40" fill="#4A3525" />
            <path d="M18 52V38c0-2 1.5-4 4-4h4" fill="#8C6239" />
            <path d="M46 52V38c0-2-1.5-4-4-4h-4" fill="#8C6239" />
            <rect x="22" y="30" width="20" height="4" rx="1" fill="#4A3525" />
            <circle cx="32" cy="18" r="5" fill="#4A3525" />
            <path d="M32 23v6" />
            <path d="M26 29l-4 3" />
            <path d="M38 29l4 3" />
          </g>
        </svg>
      </div>
      {label && <p className="text-xs font-medium tracking-wide text-earth/50">{label}</p>}
    </div>
  )
}
