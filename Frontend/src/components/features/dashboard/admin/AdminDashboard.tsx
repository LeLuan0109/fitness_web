import { useGetAdminDashboardData } from "@/hooks/queries/dashboard/admin/useGetAdminDashboardData"
import { Loader2 } from "lucide-react"
import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { StatsCards } from "./StatsCards"
import { UserGrowthChart } from "./UserGrowthChart"
import { UserGoalChart } from "./UserGoalChart"
import { AppLauncher } from "./AppLauncher"

export const AdminDashboard = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { stats, userGrowth, userGoal, isLoading } = useGetAdminDashboardData(selectedYear)
  const navigate = useNavigate()

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year)
  }, [])

  const handleNavigate = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner with Ocean Blue Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0369a1] p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Trang chủ quản trị viên</h1>
          <p className="mt-2 text-lg text-white/90">Tổng quan hệ thống và quản lý</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0ea5e9]/20 via-transparent to-[#0369a1]/20" />
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

      {/* App Launcher Section */}
      <AppLauncher onNavigate={handleNavigate} />
    </div>
  )
}
