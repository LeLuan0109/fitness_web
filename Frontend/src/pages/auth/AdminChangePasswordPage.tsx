import { ChangePasswordForm } from "@/components/features/auth/ChangePasswordForm"
import { PageLayout } from "@/layouts/PageLayout"
import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react"

export function AdminChangePasswordPage() {
  return (
    <PageLayout title="Đổi mật khẩu quản trị">
      <div className="space-y-6 text-slate-950">
        <header className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
          <div className="h-1 bg-blue-600" aria-hidden="true" />
          <div className="flex items-start gap-4 p-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <LockKeyhole className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Bảo mật tài khoản</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Đổi mật khẩu quản trị</h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">Đặt mật khẩu mới để bảo vệ quyền truy cập quản trị.</p>
            </div>
          </div>
        </header>

        <main className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="order-2 lg:order-1 [&_[data-slot=card]]:rounded-2xl [&_[data-slot=card]]:border-slate-200 [&_[data-slot=card]]:bg-white [&_[data-slot=card]]:shadow-sm [&_form]:max-w-none [&_input]:h-11 [&_input]:border-slate-300 [&_input]:bg-white [&_input]:focus-visible:ring-blue-600 [&_form_button]:!text-slate-500">
            <ChangePasswordForm showHeader={false} />
          </section>

          <aside className="order-1 rounded-2xl border border-blue-100 bg-blue-50 p-5 lg:order-2">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-blue-950">Mật khẩu an toàn</h2>
                <p className="text-xs text-blue-700">Bảo vệ quyền quản trị hệ thống</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-5 text-blue-950">
              {[
                "Sử dụng mật khẩu dài và khó đoán.",
                "Không dùng lại mật khẩu ở dịch vụ khác.",
                "Không chia sẻ thông tin đăng nhập.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </main>
      </div>
    </PageLayout>
  )
}
