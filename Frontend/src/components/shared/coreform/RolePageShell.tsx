import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { PageLayout } from "@/layouts/PageLayout"

type RolePageShellProps = {
  title: string
  heading: string
  description: string
  icon: LucideIcon
  children: ReactNode
}

export function RolePageShell({ title, heading, description, icon: Icon, children }: RolePageShellProps) {
  return (
    <PageLayout title={title}>
      <div className="space-y-6 text-foreground">
        <header className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="h-1 bg-primary" aria-hidden="true" />
          <div className="flex items-start gap-4 p-5 sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{heading}</h1>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>
        {children}
      </div>
    </PageLayout>
  )
}
