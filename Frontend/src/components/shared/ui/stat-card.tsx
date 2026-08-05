import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { memo } from "react"

type StatTone = "accent" | "teal" | "amber" | "indigo"

const toneMap: Record<StatTone, string> = {
  accent: "bg-[#0ea5e9]/10 text-[#0ea5e9] dark:bg-[#0ea5e9]/20 dark:text-[#0ea5e9]",
  teal: "bg-[#0284c7]/10 text-[#0284c7] dark:bg-[#0284c7]/20 dark:text-[#0284c7]",
  amber: "bg-[#f97316]/15 text-[#f97316] dark:bg-[#f97316]/20 dark:text-[#f97316]",
  indigo: "bg-[#0369a1]/10 text-[#0369a1] dark:bg-[#0369a1]/20 dark:text-[#0369a1]",
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
    <div className="group rounded-2xl border border-[#e5e5e5] bg-white p-6 text-[#0a0a0a] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0ea5e9]/40 hover:shadow-md dark:border-[#404040] dark:bg-[#171717] dark:text-[#fafafa]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[#737373] dark:text-[#a3a3a3]">{title}</p>
        <span className={cn("flex size-10 items-center justify-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-[#fafafa]">{value}</span>
        {trend && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-[#3b82f6]" : "text-[#ef4444]",
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend.value)}%{trend.label ? ` ${trend.label}` : ""}
          </span>
        )}
      </div>
      {description && <p className="mt-2 text-xs leading-relaxed text-[#737373] dark:text-[#a3a3a3]">{description}</p>}
    </div>
  )
})

StatCard.displayName = "StatCard"
