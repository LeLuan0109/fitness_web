import {
  Activity,
  Apple,
  Bell,
  ChevronDown,
  Compass,
  Dumbbell,
  Flame,
  HeartPulse,
  LayoutDashboard,
  LockIcon,
  LogOut,
  Menu,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"

import { FloatingChatButton } from "@/components/features/chatbot"
import { CoreformCursor, CoreformLiftLoader } from "@/components/shared/coreform"
import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
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
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ROLES } from "@/constants/roles.constant"
import { ROUTES } from "@/constants/routes"
import { useLogout } from "@/hooks/queries/auth/useAuthQuery"
import { useNotifications } from "@/hooks/queries/notifications/useNotifications"
import { queryClient } from "@/lib/react-query"
import authStore from "@/stores/auth.store"
import transitionStore from "@/stores/transition.store"
import type { Notification as AppNotification } from "@/types/notification.type"
import { toast } from "sonner"

type NavigationItem = {
  title: string
  description: string
  url: string
  icon: LucideIcon
}

type NavigationGroup = {
  label: string
  icon: LucideIcon
  items: NavigationItem[]
}

const userNavigationGroups: NavigationGroup[] = [
  {
    label: "Tính năng",
    icon: Activity,
    items: [
      {
        title: "Tiến bộ sức mạnh",
        description: "Biểu đồ tạ, 1RM và kỷ lục cá nhân (PR).",
        url: ROUTES.PROGRESS,
        icon: TrendingUp,
      },
      {
        title: "Phân tích chỉ số cơ thể",
        description: "BMI, TDEE, calo và chỉ số tập luyện.",
        url: ROUTES.HOME,
        icon: HeartPulse,
      },
    ],
  },
  {
    label: "Hành trình",
    icon: Compass,
    items: [
      {
        title: "Danh sách bài tập",
        description: "Khám phá thư viện động tác.",
        url: ROUTES.EXERCISES.LIST,
        icon: Dumbbell,
      },
      {
        title: "Kế hoạch mẫu",
        description: "Bắt đầu với giáo án có sẵn.",
        url: ROUTES.WORKOUTS.SAMPLE_LIST,
        icon: LayoutDashboard,
      },
      {
        title: "Kế hoạch của tôi",
        description: "Tiếp tục lộ trình cá nhân.",
        url: ROUTES.WORKOUTS.MY_LIST,
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Dinh dưỡng",
    icon: Apple,
    items: [
      {
        title: "Thực đơn mẫu",
        description: "Thực đơn cân bằng theo mục tiêu.",
        url: ROUTES.NUTRITION.SAMPLE,
        icon: Apple,
      },
      {
        title: "Thực đơn của tôi",
        description: "Xem lại thực đơn đã lưu.",
        url: ROUTES.NUTRITION.MY_MEALS,
        icon: Flame,
      },
      {
        title: "Nhật ký ăn uống",
        description: "Ghi món đã ăn, theo dõi macro theo ngày.",
        url: ROUTES.NUTRITION.DIARY,
        icon: HeartPulse,
      },
      {
        title: "Danh sách món ăn",
        description: "Khám phá món ăn và thông tin dinh dưỡng.",
        url: ROUTES.DISHES.LIST,
        icon: HeartPulse,
      },
    ],
  },
  {
    label: "Cộng đồng",
    icon: Users,
    items: [
      {
        title: "Bảng feed",
        description: "Cập nhật từ cộng đồng tập luyện.",
        url: ROUTES.COMMUNITY.FEED,
        icon: Newspaper,
      },
      {
        title: "Bài viết của tôi",
        description: "Quản lý các bài chia sẻ của bạn.",
        url: ROUTES.COMMUNITY.MY_POSTS,
        icon: User,
      },
    ],
  },
]

const adminNavigationGroups: NavigationGroup[] = [
  {
    label: "Quản trị",
    icon: LayoutDashboard,
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
    icon: Compass,
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
    icon: Apple,
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
    icon: Users,
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

export default function AppLayout() {
  const auth = authStore.use.auth()
  const clearAuth = authStore.use.clearAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAdmin = auth?.role?.name === ROLES.ADMIN
  const navigationGroups = useMemo(() => (isAdmin ? adminNavigationGroups : userNavigationGroups), [isAdmin])

  useEffect(() => {
    if (auth && location.pathname === "/" && isAdmin) {
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
    }
  }, [auth, isAdmin, location.pathname, navigate])

  useEffect(() => {
    const channel = new BroadcastChannel("notification_broadcast_channel")

    const handleMessage = () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
      })
    }

    channel.addEventListener("message", handleMessage)
    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
    }
  }, [])

  const { notifications, unreadCount, markAsRead, loadMore, hasMore, isLoadingMore, refetch, isRefetching } =
    useNotifications()

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
      })
    }

    setNotificationOpen(false)
    if (notification.referenceUrl) {
      if (notification.type === "SOCIAL") {
        navigate("community" + notification.referenceUrl)
      } else {
        navigate(notification.referenceUrl)
      }
    }
  }

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget

      if (scrollHeight - scrollTop - clientHeight <= 10) {
        if (hasMore && !isLoadingMore) {
          loadMore()
        }
      }
    },
    [hasMore, isLoadingMore, loadMore],
  )

  const handleRefreshNotifications = () => {
    refetch()
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
    })
  }

  const { mutate: mutateLogout } = useLogout({
    config: {
      onSuccess: () => {
        toast.success("Đăng xuất thành công")
        transitionStore.getState().playExit(() => {
          clearAuth()
          navigate(ROUTES.AUTH.LOGIN)
        })
      },
      onError: () => {
        toast.error("Đăng xuất thất bại")
        transitionStore.getState().playExit(() => {
          clearAuth()
          navigate(ROUTES.AUTH.LOGIN)
        })
      },
    },
  })

  if (!auth) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  const navigateToProfile = () => {
    navigate("/profile")
  }

  const navigateToChangePassword = () => {
    navigate("/change-password")
  }

  const handleLogout = () => {
    mutateLogout({ token: localStorage.getItem("access_token") || "" })
  }

  const handleNavigate = (url: string) => {
    setMobileMenuOpen(false)
    navigate(url)
  }

  const getStartedRoute = isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.WORKOUTS.SAMPLE_LIST

  return (
    <div className="coreform-app min-h-svh bg-cream text-earth">
      <CoreformCursor />
      <header className="sticky top-0 z-50 border-b border-sand/40 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-earth hover:bg-sand-light/60 hover:text-earth lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          <button
            type="button"
            className="font-display flex shrink-0 items-center gap-2.5 text-xl font-bold tracking-tight text-earth transition duration-300 ease-in-out hover:text-clay"
            onClick={() => navigate(ROUTES.HOME)}
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-earth">
              <span className="size-2.5 rounded-full bg-clay" />
            </span>
            COREFORM
          </button>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
            {navigationGroups.map((group) => {
              const GroupIcon = group.icon

              return (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-cursor-hover=""
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-earth/80 transition duration-300 ease-in-out hover:bg-sand-light/60 hover:text-earth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/30 data-[state=open]:bg-sand-light/60 data-[state=open]:text-earth"
                    >
                      <GroupIcon className="size-4 text-clay" />
                      {group.label}
                      <ChevronDown className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-80 rounded-2xl border-sand bg-white p-2 text-earth shadow-xl shadow-earth/10"
                  >
                    <DropdownMenuGroup>
                      {group.items.map((item) => {
                        const ItemIcon = item.icon

                        return (
                          <DropdownMenuItem
                            key={item.title}
                            className="cursor-pointer rounded-xl p-3 transition duration-300 ease-in-out focus:bg-sand-light/60 focus:text-earth"
                            onClick={() => handleNavigate(item.url)}
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-earth/5 text-clay">
                              <ItemIcon className="size-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-earth">{item.title}</p>
                              <p className="mt-1 text-xs leading-5 text-earth/60">{item.description}</p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              className="hidden rounded-full px-3 text-earth/80 transition duration-300 ease-in-out hover:bg-sand-light/60 hover:text-earth sm:inline-flex"
              onClick={navigateToProfile}
            >
              {auth?.username || "Sign In"}
            </Button>

            <Button
              className="hidden rounded-full bg-clay px-6 text-sm font-medium text-cream shadow-sm transition duration-300 ease-in-out hover:scale-105 hover:bg-earth md:inline-flex"
              onClick={() => handleNavigate(getStartedRoute)}
            >
              Bắt đầu ngay
            </Button>

            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative flex size-10 items-center justify-center rounded-full text-earth transition duration-300 ease-in-out hover:bg-sand-light/60"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <Badge
                      className="absolute -end-1.5 -top-1.5 h-5 min-w-5 rounded-full bg-[#B35F4A] px-1 text-white tabular-nums"
                      variant="destructive"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(92vw,22rem)] overflow-hidden rounded-2xl border-sand bg-white p-0 text-earth shadow-xl shadow-earth/10 sm:w-96">
                <div className="flex items-center justify-between border-b border-sand/40 bg-sand-light/40 px-5 py-4">
                  <div>
                    <h4 className="font-display text-base font-medium text-earth">Thông báo</h4>
                    {unreadCount > 0 && (
                      <p className="mt-0.5 text-xs text-earth/50">{unreadCount} chưa đọc</p>
                    )}
                  </div>
                  <button
                    onClick={handleRefreshNotifications}
                    disabled={isRefetching}
                    className="flex size-9 items-center justify-center rounded-full text-earth/60 transition-colors hover:bg-white hover:text-clay disabled:opacity-50"
                    title="Tải lại thông báo"
                  >
                    <RefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <ScrollArea className="h-80 w-full" onScrollEndCapture={handleScroll}>
                  <ul className="divide-y divide-sand/30">
                    {notifications.length > 0 ? (
                      <>
                        {notifications.map((notification) => (
                          <li
                            key={notification.id}
                            className={`cursor-pointer px-5 py-4 text-sm transition-all duration-200 hover:bg-sand-light/40 ${
                              !notification.isRead
                                ? "border-l-[3px] border-l-clay bg-sand-light/30"
                                : "border-l-[3px] border-l-transparent bg-white"
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className={`text-earth ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                                  {notification.title}
                                </div>
                                <div className="mt-1 text-xs leading-relaxed text-earth/60">{notification.content}</div>
                                <div className="mt-2 text-[11px] text-earth/40">{notification.createdAt}</div>
                                {notification.referenceUrl && (
                                  <div className="mt-2 text-xs font-medium text-clay">Nhấn để xem chi tiết →</div>
                                )}
                              </div>
                              {!notification.isRead && (
                                <div className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-clay" />
                              )}
                            </div>
                          </li>
                        ))}

                        {isLoadingMore && (
                          <li className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-earth/50">
                              <CoreformLiftLoader size="sm" />
                              Đang tải thêm...
                            </div>
                          </li>
                        )}

                        {!hasMore && notifications.length > 0 && (
                          <li className="px-5 py-4 text-center text-xs text-earth/40">
                            Đã hiển thị tất cả thông báo
                          </li>
                        )}
                      </>
                    ) : (
                      <li className="px-5 py-12 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-earth/5 text-clay">
                          <Bell className="size-5" />
                        </div>
                        <p className="font-display text-base font-medium text-earth">Không có thông báo</p>
                        <p className="mt-1 text-xs text-earth/50">Bạn sẽ nhận cập nhật tại đây</p>
                      </li>
                    )}
                  </ul>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-2 py-2 text-earth transition-colors hover:bg-sand-light/60"
                >
                  <span className="hidden max-w-[180px] truncate text-sm sm:inline">{auth?.username}</span>
                  <ChevronDown className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl border-sand bg-white text-earth">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer focus:bg-sand-light/60" onClick={navigateToProfile}>
                    <User />
                    <span>Hồ sơ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-sand-light/60" onClick={navigateToChangePassword}>
                    <LockIcon />
                    <span>Đổi mật khẩu</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer focus:bg-sand-light/60" onClick={handleLogout}>
                  <LogOut />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[min(88vw,380px)] border-sand bg-cream p-0 text-earth">
          <SheetHeader className="border-b border-sand/40 px-5 py-4 text-left">
            <SheetTitle className="font-display flex items-center gap-2.5 text-xl font-bold text-earth">
              <span className="flex size-7 items-center justify-center rounded-full bg-earth">
                <span className="size-2.5 rounded-full bg-clay" />
              </span>
              COREFORM
            </SheetTitle>
          </SheetHeader>
          <nav className="space-y-6 overflow-y-auto px-5 py-5" aria-label="Mobile navigation">
            {navigationGroups.map((group) => {
              const GroupIcon = group.icon

              return (
                <div key={group.label}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-clay">
                    <GroupIcon className="size-4" />
                    {group.label}
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon

                      return (
                        <button
                          key={item.title}
                          type="button"
                          className="flex w-full items-start gap-3 rounded-2xl border border-sand/60 bg-white p-3 text-left transition duration-300 ease-in-out hover:border-clay/40 hover:bg-sand-light/40"
                          onClick={() => handleNavigate(item.url)}
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-earth/5 text-clay">
                            <ItemIcon className="size-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-earth">{item.title}</span>
                            <span className="mt-1 block text-xs leading-5 text-earth/60">{item.description}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <Button
              className="w-full rounded-full bg-clay text-cream transition duration-300 ease-in-out hover:bg-earth"
              onClick={() => handleNavigate(getStartedRoute)}
            >
              Bắt đầu ngay
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <Suspense
        fallback={
          <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-lg bg-[#E8DDD4]" />
              <div className="aspect-video rounded-lg bg-[#E8DDD4]" />
              <div className="aspect-video rounded-lg bg-[#E8DDD4]" />
            </div>
            <div className="min-h-[60vh] flex-1 rounded-lg bg-[#F4EFEA]" />
          </main>
        }
      >
        <Outlet />
      </Suspense>

      {!isAdmin && <FloatingChatButton />}
    </div>
  )
}
