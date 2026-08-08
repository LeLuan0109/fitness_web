import { Profile } from "@/components/features/profile/Profile"
import { PageLayout } from "@/layouts/PageLayout"
import { BadgeCheck, ShieldCheck } from "lucide-react"

export function AdminProfilePage() {
  return (
    <PageLayout title="Hồ sơ quản trị viên">
      <div className="space-y-6 text-slate-950">
        <header className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-50 to-transparent" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                <ShieldCheck className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Tài khoản quản trị</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Hồ sơ quản trị viên</h1>
                <p className="mt-1 text-sm leading-6 text-slate-600">Cập nhật thông tin cá nhân và thông tin tài khoản quản trị.</p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="size-4" aria-hidden="true" />
              Tài khoản đã xác thực
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl [&_[data-slot=card]]:rounded-2xl [&_[data-slot=card]]:border-slate-200 [&_[data-slot=card]]:bg-white [&_[data-slot=card]]:shadow-sm [&_input]:border-slate-300 [&_input]:bg-white [&_input]:focus-visible:ring-blue-600 [&_form_button[type=submit]]:bg-blue-600 [&_form_button[type=submit]]:text-white [&_form_button[type=submit]]:hover:bg-blue-700">
          <Profile />
        </main>
      </div>
    </PageLayout>
  )
}
