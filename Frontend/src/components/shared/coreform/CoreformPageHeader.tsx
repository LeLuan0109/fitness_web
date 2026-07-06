import { Button } from "@/components/shared/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Props = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function CoreformPageHeader({ title, description, action, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight text-earth sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm leading-relaxed text-earth/60 sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function CoreformPrimaryButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "h-auto rounded-full bg-earth px-5 py-2.5 text-sm font-medium text-cream shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-clay",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export function CoreformSearchButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto shrink-0 rounded-full border-sand bg-white px-5 py-2.5 text-sm font-medium text-earth transition-all duration-300 hover:border-clay hover:bg-sand-light/40 hover:text-earth",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
