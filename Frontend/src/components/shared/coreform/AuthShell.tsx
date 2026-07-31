import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthShell({ children, title = "COREFORM", subtitle }: Props) {
  return (
    <div className="coreform-app relative min-h-svh overflow-hidden bg-cream text-earth">
      <div className="dashboard-noise" aria-hidden="true" />
      <div className="relative z-10 grid min-h-svh grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-earth p-12 text-cream lg:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20" />
          <div className="relative">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-cream">
                <span className="size-3 rounded-full bg-clay" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">{title}</span>
            </div>
            <h2 className="font-display max-w-md text-4xl font-medium leading-tight">
              Chuẩn hóa tư thế.
              <br />
              <span className="accent-display text-sand">Bứt phá</span> giới hạn.
            </h2>
          </div>
          <p className="relative max-w-sm text-sm leading-relaxed text-cream/70">
            {subtitle ??
              "Hệ thống thông minh phân tích sức khỏe, lập lộ trình tập luyện cá nhân hóa và tinh chỉnh kỹ thuật theo thời gian thực."}
          </p>
        </div>

        <div className="flex min-h-[60vh] items-center justify-center px-6 py-10 sm:px-10">{children}</div>
      </div>
    </div>
  )
}
