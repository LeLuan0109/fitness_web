import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { MonthlyStatsData } from "@/types/user.type"
import { TrendingUp } from "lucide-react"

type MonthlyStatsProps = {
  monthlyStats: MonthlyStatsData
}

export const MonthlyStats = ({ monthlyStats }: MonthlyStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Thống kê hàng tháng</CardTitle>
            <CardDescription>{monthlyStats.monthName}</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng số buổi tập</span>
              <span className="font-medium">{monthlyStats.totalWorkouts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Số ngày hoạt động</span>
              <span className="font-medium">{monthlyStats.activeDays}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Chuỗi hiện tại</span>
              <span className="font-medium">{monthlyStats.currentStreak} ngày</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng thời gian</span>
              <span className="font-medium">{monthlyStats.totalDurationMin} phút</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trung bình mỗi buổi</span>
              <span className="font-medium">{monthlyStats.avgDurationMin} phút</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng calories</span>
              <span className="font-medium">{monthlyStats.totalCalories} kcal</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
