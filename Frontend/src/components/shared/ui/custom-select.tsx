import * as React from "react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "./select"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Option } from "@/types/common.type"
import { Input } from "./input"

type CustomSelectProps = {
  options: Option[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  clearable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
} & React.ComponentProps<typeof Select>

export function CustomSelect({
  options,
  placeholder = "",
  value,
  onChange,
  className,
  clearable = true,
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  ...props
}: CustomSelectProps) {
  const [searchValue, setSearchValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onChange?.("")
  }

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchValue) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.value.toLowerCase().includes(searchValue.toLowerCase()),
    )
  }, [options, searchValue, searchable])

  React.useEffect(() => {
    if (!isOpen) {
      setSearchValue("")
    }
  }, [isOpen])

  return (
    <Select value={value} onValueChange={onChange} open={isOpen} onOpenChange={setIsOpen} {...props}>
      <div className="relative flex items-center">
        <SelectTrigger
          className={cn(
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-full bg-input-background text-foreground relative disabled:opacity-50 ",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {clearable && value && value.trim() !== "" && (
          <button
            disabled={props.disabled}
            onMouseDown={(e) => e.stopPropagation()}
            role="button"
            tabIndex={-1}
            onClick={handleClear}
            className="ml-2 rounded-full p-1 hover:bg-muted transition-colors flex-shrink-0 z-10 absolute right-7 disabled:hover:bg-transparent"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4 text-foreground hover:text-muted-foreground" />
          </button>
        )}
      </div>
      <SelectContent className="bg-input-background text-foreground ">
        {searchable && (
          <div className="px-2 py-1.5 border-b">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 w-full"
              autoFocus
              onKeyDown={(e) => {
                e.stopPropagation()
              }}
            />
          </div>
        )}
        <SelectGroup>
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">Không tìm thấy kết quả.</div>
          ) : (
            filteredOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                title={opt.label}
                onChange={() => onChange?.(opt.value)}
              >
                <span>{opt.label}</span>
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
