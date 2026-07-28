import { Card, CardContent, CardTitle } from "@/components/shared/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Props = {
  title?: string
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function CoreformFilterCard({ title, children, className, contentClassName }: Props) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-3xl border border-border bg-card py-0 shadow-sm shadow-earth/5 dark:border-white/10 dark:bg-surface dark:shadow-slate-950/15",
        className,
      )}
    >
      <CardContent className={cn("p-6 lg:p-8", contentClassName)}>
        {title && (
          <CardTitle className="font-display mb-5 text-lg font-medium text-foreground">{title}</CardTitle>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
