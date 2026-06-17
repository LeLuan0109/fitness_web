import { Control, ControllerRenderProps, FieldValues, Path, UseControllerProps } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { cn } from "@/lib/utils"

interface SimpleFieldProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>
  extends UseControllerProps<TFieldValues, TName> {
  label?: string
  control: Control<TFieldValues>
  direction?: "vertical" | "horizontal"
  className?: string
  icon?: React.ReactNode
  required?: boolean
  children: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode
  enableFormMessage?: boolean
  hideLabel?: boolean
  iconPosition?: "start" | "end"
}

function SimpleField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  name,
  control,
  label,
  direction = "vertical",
  children,
  className,
  icon,
  required,
  enableFormMessage = true,
  hideLabel = false,
  iconPosition = "end",
}: SimpleFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) =>
        direction === "vertical" ? (
          <FormItem className={cn(className)}>
            {!hideLabel && (
              <FormLabel className="text-sm text-foreground leading-5 h-5">
                {label} {required && <span className="text-red-600">*</span>}
              </FormLabel>
            )}
            <div className="relative">
              <FormControl>{children(field)}</FormControl>
              <div
                className={cn("absolute inset-y-0", iconPosition === "end" ? "end-0" : "start-0", "flex items-center")}
                tabIndex={-1}
              >
                {icon}
              </div>
            </div>
            {enableFormMessage && <FormMessage />}
          </FormItem>
        ) : (
          <FormItem>
            <div className={cn("flex flex-row items-center gap-2", className)}>
              <FormControl>{children(field)}</FormControl>
              {!hideLabel && <FormLabel className="text-sm text-foreground leading-5 h-5">{label}</FormLabel>}
            </div>
            {enableFormMessage && <FormMessage />}
          </FormItem>
        )
      }
    />
  )
}

export { SimpleField }
