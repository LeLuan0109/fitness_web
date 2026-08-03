import { Users, Dumbbell, BookOpen, Utensils, Newspaper, Settings } from "lucide-react"
import { memo } from "react"

interface AppLauncherProps {
  onNavigate?: (path: string) => void
}

interface AppCard {
  title: string
  description: string
  icon: any
  color: string
  path: string
}

const apps: AppCard[] = [
  {
    title: "Quản lý người dùng",
    description: "Xem và quản lý tài khoản người dùng",
    icon: Users,
    color: "#0ea5e9",
    path: "/admin/users"
  },
  {
    title: "Quản lý bài tập",
    description: "Thư viện bài tập và động tác",
    icon: Dumbbell,
    color: "#0284c7",
    path: "/exercises/list"
  },
  {
    title: "Quản lý thực đơn",
    description: "Thực đơn và món ăn hệ thống",
    icon: BookOpen,
    color: "#0369a1",
    path: "/dishes/list"
  },
  {
    title: "Quản lý nguyên liệu",
    description: "Dữ liệu dinh dưỡng nguyên liệu",
    icon: Utensils,
    color: "#0c4a6e",
    path: "/ingredients/list"
  },
  {
    title: "Quản lý cộng đồng",
    description: "Kiểm duyệt bài viết và feed",
    icon: Newspaper,
    color: "#075985",
    path: "/community/feed"
  },
  {
    title: "Cài đặt hệ thống",
    description: "Cấu hình và thiết lập hệ thống",
    icon: Settings,
    color: "#f97316",
    path: "/admin/settings"
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
      <h2 className="text-2xl font-semibold text-[#171717] dark:text-[#fafafa]">Các công cụ quản trị</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <button
            key={app.path}
            onClick={() => handleCardClick(app.path)}
            className="group relative overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0ea5e9]/40 hover:shadow-md dark:border-[#404040] dark:bg-[#171717]"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex size-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${app.color}15` }}
              >
                <app.icon className="h-6 w-6" style={{ color: app.color }} />
              </div>
              <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg
                  className="h-5 w-5 text-[#737373] dark:text-[#a3a3a3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-[#171717] dark:text-[#fafafa]">{app.title}</h3>
              <p className="mt-1 text-sm text-[#737373] dark:text-[#a3a3a3]">{app.description}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  )
})

AppLauncher.displayName = "AppLauncher"