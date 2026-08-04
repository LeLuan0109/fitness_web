import {
  getMyNotifications,
  getNumberOfUnreadNotifications,
  markAsRead,
  registerDeviceToken,
} from "@/api/notifications.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { requestNotificationPermission } from "@/lib/firebase"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"

export const useNotifications = () => {
  const queryClient = useQueryClient()
  const registrationAttempted = useRef(false)

  // Đăng ký FCM token
  const registerTokenMutation = useMutation({
    mutationFn: registerDeviceToken,
  })

  // Sử dụng useInfiniteQuery thay vì useQuery
  const notificationsQuery = useInfiniteQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: ({ pageParam = 0 }) => getMyNotifications(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.meta?.hasMore ? lastPage.meta.page + 1 : undefined
    },
    initialPageParam: 0,
  })

  const countUnreadQuery = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
    queryFn: getNumberOfUnreadNotifications,
    select: (data) => data.data,
  })

  // Đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
    },
  })

  // Khởi tạo FCM token
  useEffect(() => {
    const initializeNotifications = async () => {
      if (registrationAttempted.current) return
      registrationAttempted.current = true

      console.log("🚀 Initializing FCM notifications...")
      const token = await requestNotificationPermission()

      if (token) {
        registerTokenMutation.mutate({
          token,
          deviceType: "web",
        })
      }
    }

    initializeNotifications()
  }, [])

  const notifications = useMemo(() => {
    return notificationsQuery.data?.pages.flatMap((page) => page.data) || []
  }, [notificationsQuery.data])

  return {
    notifications,
    unreadCount: countUnreadQuery.data,
    isLoading: notificationsQuery.isLoading,
    isLoadingMore: notificationsQuery.isFetchingNextPage,
    hasMore: notificationsQuery.hasNextPage,
    loadMore: notificationsQuery.fetchNextPage,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    refetch: notificationsQuery.refetch,
    isRefetching: notificationsQuery.isRefetching,
  }
}
