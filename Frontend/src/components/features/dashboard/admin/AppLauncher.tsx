import { ArrowRight, BookOpen, Dumbbell, Newspaper, Users, Utensils, type LucideIcon } from "lucide-react"
import { memo } from "react"

interface AppLauncherProps {
  onNavigate?: (path: string) => void
}

interface AppCard {
  title: string
  description: string
  icon: LucideIcon
  iconClassName: string
  path: string
}

const apps: AppCard[] = [
  {
    title: "Quản lý người dùng",
    description: "Xem và quản lý tài khoản người dùng",
    icon: Users,
    iconClassName: "bg-blue-50 text-blue-600",
    path: "/admin/users"
  },
  {
    title: "Quản lý bài tập",
    description: "Thư viện bài tập và động tác",
    icon: Dumbbell,
    iconClassName: "bg-indigo-50 text-indigo-600",
    path: "/exercises"
  },
  {
    title: "Quản lý thực đơn",
    description: "Thực đơn và món ăn hệ thống",
    icon: BookOpen,
    iconClassName: "bg-cyan-50 text-cyan-700",
    path: "/dishes"
  },
  {
    title: "Quản lý nguyên liệu",
    description: "Dữ liệu dinh dưỡng nguyên liệu",
    icon: Utensils,
    iconClassName: "bg-violet-50 text-violet-600",
    path: "/ingredients"
  },
  {
    title: "Quản lý cộng đồng",
    description: "Kiểm duyệt bài viết và feed",
    icon: Newspaper,
    iconClassName: "bg-sky-50 text-sky-700",
    path: "/community/feed"
  }
]

export const AppLauncher = memo(({ onNavigate }: AppLauncherProps) => {
  const handleCardClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.location.href = path
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 id="tools-title" className="text-lg font-semibold text-slate-950">Lối tắt quản trị</h2>
        <p className="mt-1 text-sm text-slate-500">Truy cập nhanh các khu vực vận hành thường dùng.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <button
            type="button"
            key={app.path}
            onClick={() => handleCardClick(app.path)}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${app.iconClassName}`}>
              <app.icon className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">{app.title}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">{app.description}</p>
            </div>
            <ArrowRight className="size-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
})

AppLauncher.displayName = "AppLauncher"