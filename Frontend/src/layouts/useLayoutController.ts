import { useCallback, useEffect, useState, type UIEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ROUTES } from "@/constants/routes"
import { useLogout } from "@/hooks/queries/auth/useAuthQuery"
import { useNotifications } from "@/hooks/queries/notifications/useNotifications"
import { queryClient } from "@/lib/react-query"
import authStore from "@/stores/auth.store"
import type { Notification as AppNotification } from "@/types/notification.type"

export function useLayoutController() {
  const auth = authStore.use.auth()
  const clearAuth = authStore.use.clearAuth()
  const navigate = useNavigate()
  const [notificationOpen, setNotificationOpen] = useState(false)

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

  const {
    notifications,
    unreadCount,
    markAsRead,
    loadMore,
    hasMore,
    isLoadingMore,
    refetch,
    isRefetching,
  } = useNotifications()

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
      })
    }

    setNotificationOpen(false)
    if (notification.referenceUrl) {
      navigate(
        notification.type === "SOCIAL"
          ? "community" + notification.referenceUrl
          : notification.referenceUrl,
      )
    }
  }

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget

      if (scrollHeight - scrollTop - clientHeight <= 10 && hasMore && !isLoadingMore) {
        loadMore()
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
        navigate(ROUTES.AUTH.LOGIN)
      },
      onError: () => {
        toast.error("Đăng xuất thất bại")
        clearAuth()
        navigate(ROUTES.AUTH.LOGIN)
      },
    },
  })

  const navigateToProfile = () => {
    navigate("/profile")
  }

  const navigateToChangePassword = () => {
    navigate("/change-password")
  }

  const handleLogout = () => {
    mutateLogout({ token: localStorage.getItem("access_token") || "" })
  }

  return {
    auth,
    navigate,
    notificationOpen,
    setNotificationOpen,
    notifications,
    unreadCount,
    hasMore,
    isLoadingMore,
    isRefetching,
    handleNotificationClick,
    handleScroll,
    handleRefreshNotifications,
    navigateToProfile,
    navigateToChangePassword,
    handleLogout,
  }
}
