import { LucideIcon } from "lucide-react"

interface MacroCardProps {
  label: string
  value: string
  Icon?: LucideIcon
}

export const MacroCard = ({ label, value, Icon }: MacroCardProps) => {
  return (
    <div className="min-w-[120px] bg-gradient-to-br from-[#2b2b2f] to-[#37363a] border border-white/6 rounded-2xl px-4 py-3 flex flex-col items-center justify-center gap-2 shadow-sm">
      <div className="flex items-center gap-2">
        {Icon ? (
          <div className="p-2 rounded-full bg-white/6 text-white/90">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <span className="text-[#a1a1aa] text-sm font-medium">{label}</span>
      </div>
      <span className="text-white text-lg font-bold">{value}</span>
    </div>
  )
}
