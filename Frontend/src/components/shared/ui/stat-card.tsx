import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { memo } from "react"

type StatTone = "accent" | "teal" | "amber" | "indigo"

const toneMap: Record<StatTone, string> = {
  accent: "bg-primary/10 text-primary",
  teal: "bg-primary/15 text-primary",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  indigo: "bg-secondary text-secondary-foreground",
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
    <div className="group rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className={cn("flex size-10 items-center justify-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight text-card-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-primary" : "text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend.value)}%{trend.label ? ` ${trend.label}` : ""}
          </span>
        )}
      </div>
      {description && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
})

StatCard.displayName = "StatCard"
