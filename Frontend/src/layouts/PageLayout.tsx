import { Helmet } from "@vuer-ai/react-helmet-async"

import type { ReactNode } from "react"

type Props = {
  title: string
  children: ReactNode
  /** Landing pages manage their own full-bleed layout */
  variant?: "default" | "landing"
}

export const PageLayout = ({ title, children, variant = "default" }: Props) => {
  if (variant === "landing") {
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {children}
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="relative min-h-[calc(100vh-4rem)]">
        <div className="dashboard-noise" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </>
  )
}
