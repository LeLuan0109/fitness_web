import { LucideIcon } from "lucide-react"

interface MacroCardProps {
  label: string
  value: string
  Icon?: LucideIcon
}

export const MacroCard = ({ label, value, Icon }: MacroCardProps) => {
  return (
    <div className="min-w-[120px] rounded-2xl border border-sand/60 bg-gradient-to-br from-cream to-white px-4 py-3 flex flex-col items-center justify-center gap-2 shadow-sm shadow-earth/5">
      <div className="flex items-center gap-2">
        {Icon ? (
          <div className="p-2 rounded-full bg-earth/5 text-clay">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <span className="text-earth/60 text-sm font-medium">{label}</span>
      </div>
      <span className="text-earth text-lg font-bold">{value}</span>
    </div>
  )
}
