import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { Calendar } from "@/components/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { Search, Calendar as CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export type PostFilters = {
  key?: string
  startDate?: Date
  endDate?: Date
}

interface FilterTabsProps {
  filters: PostFilters
  onFiltersChange: (filters: PostFilters) => void
}

export const FilterTabs = ({ filters, onFiltersChange }: FilterTabsProps) => {
  const [searchValue, setSearchValue] = useState(filters.key || "")
  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

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
    <div className="space-y-3 mb-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit()
              }
            }}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearchSubmit} size="default">
          Tìm kiếm
        </Button>
      </div>

      {/* Date Range Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Từ ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              disabled={(date) => (endDate ? date > endDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : "Đến ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateChange}
              disabled={(date) => (startDate ? date < startDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {filters.key && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <span>Từ khóa: {filters.key}</span>
            </div>
          )}
          {filters.startDate && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <span>Từ: {format(filters.startDate, "dd/MM/yyyy", { locale: vi })}</span>
            </div>
          )}
          {filters.endDate && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <span>Đến: {format(filters.endDate, "dd/MM/yyyy", { locale: vi })}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
