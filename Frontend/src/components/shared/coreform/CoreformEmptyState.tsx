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
        "rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm shadow-earth/5 dark:border-white/10 dark:bg-surface dark:text-foreground dark:shadow-slate-950/15",
        className,
      )}
    >
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display text-xl font-medium text-foreground">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>}
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
