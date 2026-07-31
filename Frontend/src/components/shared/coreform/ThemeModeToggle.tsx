import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { cn } from "@/lib/utils"

const MODES = [
  { value: "light", label: "Sáng", description: "Giao diện sáng", icon: Sun },
  { value: "dark", label: "Tối", description: "Giao diện tối", icon: Moon },
  { value: "system", label: "Tự động", description: "Theo hệ thống", icon: Monitor },
] as const

type ThemeMode = (typeof MODES)[number]["value"]

type ThemeModeToggleProps = {
  className?: string
  triggerClassName?: string
}

/**
 * Messenger-style appearance picker: Light / Dark / Auto (system).
 */
export function ThemeModeToggle({ className, triggerClassName }: ThemeModeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const activeMode = (theme ?? "system") as ThemeMode

  const TriggerIcon =
    activeMode === "system"
      ? resolvedTheme === "dark"
        ? Moon
        : Sun
      : (MODES.find((m) => m.value === activeMode)?.icon ?? Monitor)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Chế độ giao diện"
          className={cn(
            "relative flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            triggerClassName,
            className,
          )}
        >
          {mounted ? (
            <TriggerIcon className="size-5" />
          ) : (
            <span className="size-5" aria-hidden="true" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-60 rounded-2xl border-border bg-popover p-2 text-popover-foreground shadow-xl"
      >
        <p className="px-2 pb-1 pt-1.5 text-sm font-semibold">Giao diện</p>
        <p className="px-2 pb-2 text-xs text-muted-foreground">Chọn chế độ hiển thị</p>
        <div className="space-y-0.5">
          {MODES.map(({ value, label, description, icon: Icon }) => {
            const selected = activeMode === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border border-border bg-transparent text-foreground"
                    : "hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border border-border bg-transparent text-foreground",
                    selected ? "" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">{description}</span>
                </span>
                {selected && <Check className="size-4 shrink-0 text-primary" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
