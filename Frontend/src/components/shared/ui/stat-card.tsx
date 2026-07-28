import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { memo } from "react"

type StatTone = "accent" | "teal" | "amber" | "indigo"

const toneMap: Record<StatTone, string> = {
  accent: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  teal: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  amber: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
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
    <div className="group rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-display text-3xl font-bold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-emerald-700" : "text-rose-600",
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
