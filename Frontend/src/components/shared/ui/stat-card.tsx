import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { memo } from "react"

type StatTone = "accent" | "teal" | "amber" | "indigo"

const toneMap: Record<StatTone, string> = {
  accent: "bg-emerald-50 text-emerald-600",
  teal: "bg-teal-50 text-teal-600",
  amber: "bg-amber-50 text-amber-600",
  indigo: "bg-indigo-50 text-indigo-600",
}

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  tone?: StatTone
  trend?: { value: number; label?: string }
}

export const StatCard = memo(({ title, value, description, icon: Icon, tone = "accent", trend }: StatCardProps) => {
  const positive = (trend?.value ?? 0) >= 0
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-hover">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend.value)}%{trend.label ? ` ${trend.label}` : ""}
          </span>
        )}
      </div>
      {description && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
})

StatCard.displayName = "StatCard"
