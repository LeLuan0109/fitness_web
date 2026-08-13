import { Check, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

type Option = {
  value: string
  label: string
}

type CustomSelectProps = {
  value?: string
  onChange?: (value: string) => void
  options: Option[]
  placeholder?: string
  searchable?: boolean
  className?: string
  disabled?: boolean
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  searchable = false,
  className = "",
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
    setSearch("")
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-2xl border border-[#e5e5e5] bg-white px-4 py-2.5 text-base font-medium text-[#0a0a0a] shadow-sm transition-all hover:border-[#3b82f6] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#262626] dark:bg-[#171717] dark:text-[#fafafa] dark:hover:border-[#3b82f6] dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span className={selectedOption ? "text-[#0a0a0a] dark:text-[#fafafa]" : "text-[#737373] dark:text-[#a3a3a3]"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`size-4 text-[#737373] transition-transform dark:text-[#a3a3a3] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-lg dark:border-[#262626] dark:bg-[#171717] dark:shadow-2xl">
          {searchable && (
            <div className="border-b border-[#e5e5e5] p-2 dark:border-[#262626]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-[#fafafa] dark:placeholder:text-[#a3a3a3] dark:focus:border-[#3b82f6]"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#737373] dark:text-[#a3a3a3]">
                Không có kết quả
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#3b82f6] text-white dark:bg-[#3b82f6] dark:text-white"
                        : "text-[#0a0a0a] hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] dark:text-[#fafafa] dark:hover:bg-[#3b82f6]/20 dark:hover:text-[#60a5fa]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="size-4" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}