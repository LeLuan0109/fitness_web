import { CoreformLiftLoader } from "./CoreformLiftLoader"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type Props = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function CoreformEmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-sand/60 bg-white px-6 py-16 text-center shadow-sm shadow-earth/5",
        className,
      )}
    >
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-earth/5 text-clay">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display text-xl font-medium text-earth">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-earth/60">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

export function CoreformLoadingState({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <CoreformLiftLoader size="md" label={label} />
    </div>
  )
}
