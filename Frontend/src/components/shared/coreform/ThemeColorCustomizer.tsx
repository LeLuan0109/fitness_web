import { Palette, Check } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { cn } from "@/lib/utils"
import adminThemeStore, {
  ADMIN_THEME_PRESETS,
} from "@/stores/admin-theme.store"

/**
 * Theme color customizer for the admin header. Lets the operator pick one of
 * four preset accents or any custom color. The choice is persisted and applied
 * instantly to every accent-driven surface (buttons, active menu, border glow,
 * chart series, canvas particles) via the admin-theme store.
 */
export function ThemeColorCustomizer() {
  const accent = adminThemeStore.use.accent()
  const themeName = adminThemeStore.use.themeName()
  const setAccent = adminThemeStore.use.setAccent()

  const isPreset = (hex: string) =>
    ADMIN_THEME_PRESETS.some((p) => p.hex.toLowerCase() === hex.toLowerCase())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Đổi màu giao diện"
          className="admin-icon-btn relative flex size-10 items-center justify-center rounded-full transition-colors"
        >
          <Palette className="size-5" />
          <span
            className="absolute -end-0.5 -top-0.5 size-3.5 rounded-full border-2 border-background"
            style={{ backgroundColor: accent }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="admin-theme-popover w-64 rounded-2xl border-border bg-popover p-4 text-popover-foreground shadow-xl"
      >
        <div className="mb-3">
          <p className="text-sm font-semibold">Màu giao diện</p>
          <p className="text-xs text-muted-foreground">{themeName}</p>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {ADMIN_THEME_PRESETS.map((preset) => {
            const active = preset.hex.toLowerCase() === accent.toLowerCase()
            return (
              <button
                key={preset.hex}
                type="button"
                title={preset.name}
                onClick={() => setAccent(preset.hex, preset.name)}
                className={cn(
                  "group relative flex aspect-square items-center justify-center rounded-xl border transition-all",
                  active
                    ? "border-foreground/30 ring-2 ring-foreground/15"
                    : "border-border hover:scale-105 hover:border-foreground/20",
                )}
                style={{ backgroundColor: preset.hex }}
              >
                {active && <Check className="size-4 text-white drop-shadow" />}
              </button>
            )
          })}
        </div>

        <div className="my-3 h-px bg-border" />

        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-3 py-2.5 transition-colors hover:bg-muted">
          <span className="text-xs font-medium">Tùy chỉnh</span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-muted-foreground">{accent}</span>
            <span
              className="relative grid size-7 place-items-center overflow-hidden rounded-lg border border-border"
              style={{ backgroundColor: accent }}
            >
              <input
                type="color"
                value={isPreset(accent) ? accent : accent}
                onChange={(e) => setAccent(e.target.value, "Custom")}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                aria-label="Chọn màu tùy chỉnh"
              />
            </span>
          </span>
        </label>
      </PopoverContent>
    </Popover>
  )
}
