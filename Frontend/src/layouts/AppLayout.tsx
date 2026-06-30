import { Bell, ChevronDown, Loader2, LockIcon, LogOut, RefreshCw, User } from "lucide-react"
import { Suspense, useCallback, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"

import { FloatingChatButton } from "@/components/features/chatbot"
import { ThemeToggle } from "@/components/shared/common/ThemeToggle"
import { Badge } from "@/components/shared/ui/badge"
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
import { Separator } from "@/components/shared/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/shared/ui/sidebar"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ROUTES } from "@/constants/routes"
import { ROLES } from "@/constants/roles.constant"
import { useLogout } from "@/hooks/queries/auth/useAuthQuery"
import { useNotifications } from "@/hooks/queries/notifications/useNotifications"
import { AppSidebar } from "@/layouts/components/app-sidebar"
import { queryClient } from "@/lib/react-query"
import authStore from "@/stores/auth.store"
import { toast } from "sonner"

export default function AppLayout() {
  const auth = authStore.use.auth()
  const clearAuth = authStore.use.clearAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const isAdmin = auth?.role?.name === ROLES.ADMIN
  // Redirect người dùng về trang phù hợp với role khi vào "/"
  useEffect(() => {
    if (auth && location.pathname === "/") {
      if (isAdmin) {
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
      }
      // User sẽ ở lại trang HOME (Dashboard)
    }
  }, [auth, location.pathname, navigate])

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
  }, [queryClient])

  // Sử dụng hook notifications với infinite scroll
  const { notifications, unreadCount, markAsRead, loadMore, hasMore, isLoadingMore, refetch, isRefetching } =
    useNotifications()

  const handleNotificationClick = (notification: any) => {
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
        clearAuth()
      },
      onError: () => {
        toast.error("Đăng xuất thất bại")
        clearAuth()
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>

          <div className="ml-auto flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-fit cursor-pointer">
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <Badge
                      className="absolute -end-2.5 -top-2.5 h-5 min-w-5 rounded-full px-1 tabular-nums"
                      variant="destructive"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-80">
                <div className="px-4 py-3 border-b bg-muted/20 flex items-center justify-between">
                  <h4 className="font-medium text-sm">Thông báo</h4>
                  <button
                    onClick={handleRefreshNotifications}
                    disabled={isRefetching}
                    className="p-1 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                    title="Tải lại thông báo"
                  >
                    <RefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <ScrollArea className="h-72 w-full" onScrollEndCapture={handleScroll}>
                  <ul className="divide-y">
                    {notifications.length > 0 ? (
                      <>
                        {notifications.map((notification) => (
                          <li
                            key={notification.id}
                            className={`px-4 py-3 text-sm hover:bg-muted/50 cursor-pointer transition-all duration-200 ${
                              !notification.isRead
                                ? "bg-muted/30 border-l-4 border-l-primary shadow-sm"
                                : "border-l-4 border-l-transparent"
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className={`${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                                  {notification.title}
                                </div>
                                <div className="text-muted-foreground text-xs mt-1">{notification.content}</div>
                                <div className="text-muted-foreground text-xs mt-1">{notification.createdAt}</div>
                                {notification.referenceUrl && (
                                  <div className="text-xs text-primary mt-1">👆 Click để xem chi tiết</div>
                                )}
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1 flex-shrink-0 animate-pulse" />
                              )}
                            </div>
                          </li>
                        ))}

                        {/* Loading indicator */}
                        {isLoadingMore && (
                          <li className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Đang tải thêm...
                            </div>
                          </li>
                        )}

                        {/* No more data indicator */}
                        {!hasMore && notifications.length > 0 && (
                          <li className="px-4 py-3 text-center text-xs text-muted-foreground">
                            📄 Đã hiển thị tất cả thông báo
                          </li>
                        )}
                      </>
                    ) : (
                      <li className="px-4 py-8 text-sm text-center text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        Không có thông báo nào
                      </li>
                    )}
                  </ul>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1 transition-colors">
                  <span className="text-sm truncate max-w-[300px]">{auth?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={navigateToProfile}>
                    <User />
                    <span>Hồ sơ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={navigateToChangePassword}>
                    <LockIcon />
                    <span>Đổi mật khẩu</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <Suspense
          fallback={
            <div className="flex flex-1 flex-col gap-4 p-4 animate-pulse">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          }
        >
          <div className="flex flex-1 flex-col gap-4 px-4 app-gradient-bg @container/main:px-6 @container/main:py-4">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <Outlet />
              </div>
            </div>
          </div>
        </Suspense>
      </SidebarInset>

      {/* Floating Chat Button */}
      {!isAdmin && <FloatingChatButton />}
    </SidebarProvider>
  )
}
