import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MacroCardProps {
  label: string
  value: string
  Icon?: LucideIcon
  appearance?: "user" | "admin"
}

export const MacroCard = ({ label, value, Icon, appearance = "user" }: MacroCardProps) => {
  const isAdmin = appearance === "admin"

  return (
    <div className={cn("flex min-w-[120px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border px-4 py-3", isAdmin ? "bg-card shadow-none" : "rounded-2xl border-sand/60 bg-gradient-to-br from-cream to-white shadow-sm shadow-earth/5")}>
      <div className="flex items-center gap-2">
        {Icon ? (
          <div className={cn("rounded-full p-2", isAdmin ? "bg-primary/10 text-primary" : "bg-earth/5 text-clay")}>
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <span className={cn("text-sm font-medium", isAdmin ? "text-muted-foreground" : "text-earth/60")}>{label}</span>
      </div>
      <span className={cn("text-lg font-bold", !isAdmin && "text-earth")}>{value}</span>
    </div>
  )
}
