import { Users, Dumbbell, BookOpen, Utensils, Newspaper, type LucideIcon } from "lucide-react"
import { memo } from "react"

interface AppLauncherProps {
  onNavigate?: (path: string) => void
}

interface AppCard {
  title: string
  description: string
  icon: LucideIcon
  color: string
  path: string
}

const apps: AppCard[] = [
  {
    title: "Quản lý người dùng",
    description: "Xem và quản lý tài khoản người dùng",
    icon: Users,
    color: "var(--primary)",
    path: "/admin/users"
  },
  {
    title: "Quản lý bài tập",
    description: "Thư viện bài tập và động tác",
    icon: Dumbbell,
    color: "var(--designali-indigo-deep)",
    path: "/exercises"
  },
  {
    title: "Quản lý thực đơn",
    description: "Thực đơn và món ăn hệ thống",
    icon: BookOpen,
    color: "var(--designali-action-blue)",
    path: "/dishes"
  },
  {
    title: "Quản lý nguyên liệu",
    description: "Dữ liệu dinh dưỡng nguyên liệu",
    icon: Utensils,
    color: "var(--designali-app-orange)",
    path: "/ingredients"
  },
  {
    title: "Quản lý cộng đồng",
    description: "Kiểm duyệt bài viết và feed",
    icon: Newspaper,
    color: "var(--designali-app-pink)",
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
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Các công cụ quản trị</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <button
            key={app.path}
            onClick={() => handleCardClick(app.path)}
            className="admin-app-card group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex size-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `color-mix(in srgb, ${app.color} 15%, transparent)` }}
              >
                <app.icon className="h-6 w-6" style={{ color: app.color }} />
              </div>
              <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-foreground">{app.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{app.description}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  )
})

AppLauncher.displayName = "AppLauncher"