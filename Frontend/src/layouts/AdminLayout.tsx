import {
  Apple,
  Bell,
  ChevronDown,
  Dumbbell,
  Flame,
  HeartPulse,
  LayoutDashboard,
  LockIcon,
  LogOut,
  Menu,
  Newspaper,
  PanelLeft,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import { Suspense, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import {
  AdminParticleCanvas,
  CoreformLiftLoader,
  ThemeModeToggle,
} from "@/components/shared/coreform"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { ScrollArea } from "@/components/shared/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/shared/ui/sheet"
import { ROUTES } from "@/constants/routes"

import { useLayoutController } from "./useLayoutController"

type NavigationGroup = {
  label: string
  items: {
    title: string
    description: string
    url: string
    icon: LucideIcon
  }[]
}

const navigationGroups: NavigationGroup[] = [
  {
    label: "Quản trị",
    items: [
      {
        title: "Bảng điều khiển",
        description: "Tổng quan hoạt động hệ thống.",
        url: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: "Quản lý người dùng",
        description: "Xem thành viên và trạng thái tài khoản.",
        url: ROUTES.ADMIN.USERS,
        icon: Users,
      },
    ],
  },
  {
    label: "Hành trình",
    items: [
      {
        title: "Danh sách bài tập",
        description: "Quản lý thư viện bài tập.",
        url: ROUTES.EXERCISES.LIST,
        icon: Dumbbell,
      },
      {
        title: "Kế hoạch mẫu",
        description: "Xem lại các giáo án mẫu.",
        url: ROUTES.WORKOUTS.SAMPLE_LIST,
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Dinh dưỡng",
    items: [
      {
        title: "Thực đơn mẫu",
        description: "Xem lại các thực đơn được tuyển chọn.",
        url: ROUTES.NUTRITION.SAMPLE,
        icon: Apple,
      },
      {
        title: "Danh sách món ăn",
        description: "Quản lý món ăn và dữ liệu dinh dưỡng.",
        url: ROUTES.DISHES.LIST,
        icon: HeartPulse,
      },
      {
        title: "Danh sách nguyên liệu",
        description: "Duy trì dữ liệu nguyên liệu.",
        url: ROUTES.INGREDIENTS.LIST,
        icon: Flame,
      },
    ],
  },
  {
    label: "Cộng đồng",
    items: [
      {
        title: "Bảng feed",
        description: "Kiểm duyệt hoạt động cộng đồng.",
        url: ROUTES.COMMUNITY.FEED,
        icon: Newspaper,
      },
    ],
  },
]

export default function AdminLayout() {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    auth,
    navigate,
    notificationOpen,
    setNotificationOpen,
    notifications,
    unreadCount,
    isLoadingMore,
    isRefetching,
    handleNotificationClick,
    handleScroll,
    handleRefreshNotifications,
    navigateToProfile,
    navigateToChangePassword,
    handleLogout,
  } = useLayoutController()

  const handleNavigate = (url: string) => {
    setMobileOpen(false)
    navigate(url)
  }
  const sidebarWidth = sidebarCollapsed ? "lg:w-20" : "lg:w-64"
  const contentMargin = sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/15">
          <span className="size-3 rounded-full bg-primary" />
        </span>
        {!sidebarCollapsed && (
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="font-display truncate text-lg font-bold tracking-tight">COREFORM</span>
            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Admin
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const ItemIcon = item.icon
                  const isActive =
                    location.pathname === item.url ||
                    (item.url !== "/" && location.pathname.startsWith(item.url))
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleNavigate(item.url)}
                      title={sidebarCollapsed ? item.title : undefined}
                      className={`admin-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive ? "is-active" : ""
                      } ${sidebarCollapsed ? "justify-center" : ""}`}
                    >
                      <ItemIcon className="size-5 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate text-left">{item.title}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="hidden shrink-0 border-t border-border p-3 lg:block">
        <button
          onClick={() => setSidebarCollapsed((value) => !value)}
          className="admin-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
        >
          <PanelLeft className={`size-5 shrink-0 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          {!sidebarCollapsed && <span>Thu gọn</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="coreform-admin relative flex min-h-screen bg-background font-sans text-foreground">
      <AdminParticleCanvas />

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col border-r transition-all duration-300 lg:flex ${sidebarWidth}`}
      >
        {sidebar}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="admin-sidebar w-72 border-border p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="font-display text-lg font-bold">COREFORM</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="admin-icon-btn grid size-9 place-items-center rounded-lg"
                aria-label="Đóng menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebar}</div>
          </div>
        </SheetContent>
      </Sheet>

      <div className={`relative z-10 flex min-h-screen flex-1 flex-col ${contentMargin}`}>
        <header className="admin-header sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="admin-icon-btn grid size-10 place-items-center rounded-full lg:hidden"
            aria-label="Mở menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="admin-search h-10 w-full rounded-xl border pl-9 pr-3 text-sm transition-colors"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeModeToggle triggerClassName="admin-icon-btn" />

            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="admin-icon-btn relative grid size-10 place-items-center rounded-full"
                  aria-label="Thông báo"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="admin-notification-popover w-[min(92vw,22rem)] overflow-hidden rounded-2xl p-0 shadow-xl sm:w-96">
                <div className="admin-notification-header flex items-center justify-between border-b px-5 py-4">
                  <div>
                    <h4 className="text-base font-semibold">Thông báo</h4>
                    {unreadCount > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{unreadCount} chưa đọc</p>
                    )}
                  </div>
                  <button
                    onClick={handleRefreshNotifications}
                    disabled={isRefetching}
                    className="admin-icon-btn grid size-9 place-items-center rounded-full disabled:opacity-50"
                    title="Tải lại"
                  >
                    <RefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <ScrollArea className="h-80 w-full" onScrollEndCapture={handleScroll}>
                  <ul className="divide-y divide-border">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`admin-notification-item cursor-pointer px-5 py-4 text-sm transition-colors ${
                            !notification.isRead ? "is-unread" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div
                                className={`truncate ${!notification.isRead ? "font-semibold" : "font-medium text-muted-foreground"}`}
                              >
                                {notification.title}
                              </div>
                              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {notification.content}
                              </div>
                            </div>
                            {!notification.isRead && (
                              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-5 py-10 text-center text-sm text-muted-foreground">Không có thông báo</li>
                    )}
                  </ul>
                  {isLoadingMore && (
                    <div className="flex justify-center py-3 text-xs text-muted-foreground">Đang tải thêm…</div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="admin-profile-btn flex items-center gap-2 rounded-full border py-1 pl-1 pr-1 transition-colors sm:pr-3">
                  <span className="grid size-8 place-items-center rounded-full bg-primary/15 text-sm font-bold uppercase text-primary">
                    {auth?.username?.charAt(0)}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">{auth?.username}</span>
                  <ChevronDown className="hidden size-4 text-muted-foreground sm:inline" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-popover p-2 text-popover-foreground shadow-xl">
                <DropdownMenuGroup>
                  <div className="border-b border-border px-2 pb-2 pt-1">
                    <p className="text-sm font-semibold">{auth?.username}</p>
                    <p className="truncate text-xs text-muted-foreground">{auth?.email}</p>
                  </div>
                </DropdownMenuGroup>
                <div className="pt-1" />
                <DropdownMenuItem className="cursor-pointer rounded-lg p-2 focus:bg-muted" onClick={navigateToProfile}>
                  <User className="mr-2 size-4" /> Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-lg p-2 focus:bg-muted" onClick={navigateToChangePassword}>
                  <LockIcon className="mr-2 size-4" /> Đổi mật khẩu
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border" />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg p-2 text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 dark:text-rose-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <CoreformLiftLoader />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
