import { useGetAdminDashboardData } from "@/hooks/queries/dashboard/admin/useGetAdminDashboardData"
import { Loader2 } from "lucide-react"
import { useState, useCallback } from "react"
import { StatsCards } from "./StatsCards"
import { UserGrowthChart } from "./UserGrowthChart"
import { UserGoalChart } from "./UserGoalChart"

export const AdminDashboard = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { stats, userGrowth, userGoal, isLoading } = useGetAdminDashboardData(selectedYear)

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Trang chủ quản trị viên</h1>
        <p className="mt-1 text-sm text-text-secondary">Tổng quan hệ thống</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <UserGrowthChart
          data={userGrowth}
          currentYear={currentYear}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />
        <UserGoalChart data={userGoal} />
      </div>
    </div>
  )
}
