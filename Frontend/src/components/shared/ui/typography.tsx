import { cn } from "@/lib/utils"

import type { ReactNode } from "react"

interface TypographyProps {
  readonly children: ReactNode
  readonly className?: string
  readonly variant?: "regular" | "bold"
}

export function TypographyH1({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-[40px] leading-[60px] tracking-tight text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </h1>
  )
}

export function TypographyH2({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <h2
      className={cn(
        "text-[32px] leading-[48px] tracking-tight text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function TypographyH3({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <h3
      className={cn(
        "text-[24px] leading-[36px] tracking-tight text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function TypographyH4({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <h4
      className={cn(
        "text-[20px] leading-[30px] tracking-tight text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </h4>
  )
}

export function TypographyH5({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <h5
      className={cn(
        "text-[16px] leading-[24px] tracking-tight text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </h5>
  )
}

export function TypographyBody({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-[14px] leading-[20px] text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </p>
  )
}

export function TypographyCaption({ children, className, variant = "regular" }: TypographyProps) {
  return (
    <span
      className={cn(
        "text-[12px] leading-[18px] text-foreground",
        variant === "bold" ? "font-bold" : "font-normal",
        className,
      )}
    >
      {children}
    </span>
  )
}
