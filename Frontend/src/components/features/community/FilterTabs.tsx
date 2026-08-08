import { CoreformFilterCard, CoreformPrimaryButton, CoreformSearchButton } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
import { Calendar } from "@/components/shared/ui/calendar"
import { Input } from "@/components/shared/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon, Search, X } from "lucide-react"
import { useState } from "react"

export type PostFilters = {
  key?: string
  startDate?: Date
  endDate?: Date
}

interface FilterTabsProps {
  filters: PostFilters
  onFiltersChange: (filters: PostFilters) => void
  appearance?: "user" | "admin"
}

export const FilterTabs = ({ filters, onFiltersChange, appearance = "user" }: FilterTabsProps) => {
  const [searchValue, setSearchValue] = useState(filters.key || "")
  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate)

  const handleSearchSubmit = () => {
    onFiltersChange({
      ...filters,
      key: searchValue || undefined,
    })
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    onFiltersChange({
      ...filters,
      startDate: date,
    })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    onFiltersChange({
      ...filters,
      endDate: date,
    })
  }

  const handleClearFilters = () => {
    setSearchValue("")
    setStartDate(undefined)
    setEndDate(undefined)
    onFiltersChange({
      key: undefined,
      startDate: undefined,
      endDate: undefined,
    })
  }

  const hasActiveFilters = filters.key || filters.startDate || filters.endDate

  return (
    <CoreformFilterCard className={appearance === "admin" ? "border-primary/15 shadow-primary/5" : undefined}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className={cn("absolute left-3 top-1/2 size-4 -translate-y-1/2", appearance === "admin" ? "text-primary/60" : "text-earth/40")} />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit()
              }}
              className={cn("rounded-xl pl-9", appearance === "admin" ? "border-primary/15 bg-primary/[0.03]" : "border-sand/60 bg-cream/50")}
            />
          </div>
          <CoreformPrimaryButton type="button" onClick={handleSearchSubmit}>
            Tìm kiếm
          </CoreformPrimaryButton>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "rounded-full font-normal",
                  appearance === "admin"
                    ? "border-primary/15 bg-primary/[0.03] hover:border-primary/40 hover:bg-primary/10"
                    : "border-sand/60 bg-cream/50 hover:border-clay hover:bg-sand-light/40",
                  !startDate && (appearance === "admin" ? "text-muted-foreground" : "text-earth/50"),
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Từ ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={cn("w-auto rounded-2xl p-0", appearance === "admin" ? "border-primary/20" : "border-sand")}
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                disabled={(date) => (endDate ? date > endDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "rounded-full font-normal",
                  appearance === "admin"
                    ? "border-primary/15 bg-primary/[0.03] hover:border-primary/40 hover:bg-primary/10"
                    : "border-sand/60 bg-cream/50 hover:border-clay hover:bg-sand-light/40",
                  !endDate && (appearance === "admin" ? "text-muted-foreground" : "text-earth/50"),
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : "Đến ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={cn("w-auto rounded-2xl p-0", appearance === "admin" ? "border-primary/20" : "border-sand")}
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={(date) => (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <CoreformSearchButton type="button" size="sm" onClick={handleClearFilters} className="gap-2 px-4 py-2">
              <X className="size-4" />
              Xóa bộ lọc
            </CoreformSearchButton>
          )}
        </div>

        {hasActiveFilters && (
          <div className={cn("flex flex-wrap gap-2 text-sm", appearance === "admin" ? "text-muted-foreground" : "text-earth/60")}>
            {filters.key && (
              <span className={cn("rounded-full border px-3 py-1", appearance === "admin" ? "border-primary/15 bg-primary/10 text-primary" : "border-sand/40 bg-sand-light/50")}>Từ khóa: {filters.key}</span>
            )}
            {filters.startDate && (
              <span className={cn("rounded-full border px-3 py-1", appearance === "admin" ? "border-primary/15 bg-primary/10 text-primary" : "border-sand/40 bg-sand-light/50")}>
                Từ: {format(filters.startDate, "dd/MM/yyyy", { locale: vi })}
              </span>
            )}
            {filters.endDate && (
              <span className={cn("rounded-full border px-3 py-1", appearance === "admin" ? "border-primary/15 bg-primary/10 text-primary" : "border-sand/40 bg-sand-light/50")}>
                Đến: {format(filters.endDate, "dd/MM/yyyy", { locale: vi })}
              </span>
            )}
          </div>
        )}
      </div>
    </CoreformFilterCard>
  )
}
