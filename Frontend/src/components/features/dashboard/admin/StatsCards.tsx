import { StatCard } from "@/components/shared/ui/stat-card"
import { Users, Dumbbell, BookOpen, UserPlus } from "lucide-react"
import { DashboardStatsResponse } from "@/types/dashboard.type"
import { memo } from "react"

interface StatsCardsProps {
  stats?: DashboardStatsResponse
}

export const StatsCards = memo(({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng người dùng đã kích hoạt"
        value={stats?.totalActivateUsers?.toLocaleString() || 0}
        description="Tổng số người dùng đã kích hoạt tài khoản"
        icon={Users}
        tone="accent"
      />
      <StatCard
        title="Người dùng mới hôm nay"
        value={stats?.newUsersToday?.toLocaleString() || 0}
        description="Người dùng đăng ký mới trong ngày"
        icon={UserPlus}
        tone="teal"
      />
      <StatCard
        title="Thực đơn hệ thống"
        value={stats?.totalSystemMenus?.toLocaleString() || 0}
        description="Tổng số thực đơn có sẵn"
        icon={BookOpen}
        tone="amber"
      />
      <StatCard
        title="Kế hoạch luyện tập"
        value={stats?.totalSystemPlans?.toLocaleString() || 0}
        description="Tổng số kế hoạch luyện tập có sẵn"
        icon={Dumbbell}
        tone="indigo"
      />
    </div>
  )
})

StatsCards.displayName = "StatsCards"
