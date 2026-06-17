import { Button } from "@/components/shared/ui/button"
import { Calendar } from "@/components/shared/ui/calendar"
import { FormControl } from "@/components/shared/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { useState } from "react"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

interface SimpleDatePickerProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>
  extends ControllerRenderProps<TFieldValues, TName> {
  placeholder?: string
  className?: string
  disabledDates?: (date: Date) => boolean
  dateFormat?: string
  minDate?: Date
  maxDate?: Date
  fromYear?: number
  toYear?: number
}

function SimpleDatePicker<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  value,
  onChange,
  placeholder = "Chọn 1 ngày",
  className,
  disabledDates,
  dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
  fromYear = 1900,
  toYear = 2100,
  ...props
}: SimpleDatePickerProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false)
  const defaultDisabled = (date: Date) => date > maxDate || date < minDate

  const handleSelect = (date: Date | undefined) => {
    onChange(date)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(null)
  }

  const isDisabled = Boolean(props.disabled)

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal bg-input-background hover:bg-input-hovered focus:bg-input-focused",
                !value && "text-muted-foreground",
                value && !props.disabled && "pr-20",
                className,
              )}
              disabled={isDisabled}
            >
              {value ? format(value, dateFormat) : <span>{placeholder}</span>}
              <CalendarIcon className="ml-auto h-4 w-4" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-input-background" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={disabledDates || defaultDisabled}
            captionLayout="dropdown"
            defaultMonth={value}
            autoFocus
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(toYear, 11)}
          />
        </PopoverContent>
      </Popover>
      {value && !isDisabled && (
        <X
          className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer z-10"
          onClick={handleClear}
        />
      )}
    </div>
  )
}

export { SimpleDatePicker }
