import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  iconColor?: string
  className?: string
}

export function StatCard({ icon, label, value, iconColor, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl p-6 flex flex-col gap-6",
        "border border-border hover:border-primary/30",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:shadow-primary/10",
        "hover:-translate-y-1",
        className,
      )}
    >
      {/* Icon and Label Row */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            "bg-muted",
            "backdrop-blur-sm",
            "transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg",
            iconColor,
          )}
        >
          <div className="w-10 h-8 flex items-center justify-center">{icon}</div>
        </div>
        <span className="text-muted-foreground text-sm font-medium tracking-wide">{label}</span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-foreground text-3xl font-bold tracking-tight leading-none">{value}</span>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/5 to-transparent",
          "transition-opacity duration-300 pointer-events-none",
        )}
      />
    </div>
  )
}
