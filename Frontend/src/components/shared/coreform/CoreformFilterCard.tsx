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
        "gap-0 rounded-3xl border-sand/60 bg-white py-0 shadow-sm shadow-earth/5",
        className,
      )}
    >
      <CardContent className={cn("p-6 lg:p-8", contentClassName)}>
        {title && (
          <CardTitle className="font-display mb-5 text-lg font-medium text-earth">{title}</CardTitle>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
