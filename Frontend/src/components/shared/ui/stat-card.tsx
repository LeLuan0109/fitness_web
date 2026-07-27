import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { memo } from "react"

type StatTone = "accent" | "teal" | "amber" | "indigo"

const toneMap: Record<StatTone, string> = {
  accent: "bg-[#4a3525]/10 text-[#4a3525]",   // earth
  teal:   "bg-[#8c6239]/10 text-[#8c6239]",   // clay
  amber:  "bg-[#c49a72]/20 text-[#6b4c35]",   // sand-dark / mid-earth
  indigo: "bg-[#d9c3b0]/40 text-[#4a3525]",   // sand / earth
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
    <div className="group rounded-xl border border-sand/60 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-clay/40 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-clay/80">{title}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-display text-3xl font-bold tracking-tight text-earth">{value}</span>
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
      {description && <p className="mt-1.5 text-xs leading-relaxed text-clay/60">{description}</p>}
    </div>
  )
})

StatCard.displayName = "StatCard"
