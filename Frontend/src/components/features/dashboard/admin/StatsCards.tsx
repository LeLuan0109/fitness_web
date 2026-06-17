import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Users, Dumbbell, BookOpen, UserPlus } from "lucide-react"
import { DashboardStatsResponse } from "@/types/dashboard.type"
import { memo } from "react"

interface StatsCardsProps {
  stats?: DashboardStatsResponse
}

export const StatsCards = memo(({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng đã kích hoạt</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalActivateUsers?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">Tổng số người dùng đã kích hoạt tài khoản</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Người dùng mới hôm nay</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.newUsersToday?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">Người dùng đăng ký mới trong ngày</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Thực đơn hệ thống</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalSystemMenus?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">Tổng số thực đơn có sẵn</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kế hoạch luyện tập</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalSystemPlans?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">Tổng số kế hoạch luyện tập có sẵn</p>
        </CardContent>
      </Card>
    </div>
  )
})

StatsCards.displayName = "StatsCards"
