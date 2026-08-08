import { useGetAdminDashboardData } from "@/hooks/queries/dashboard/admin/useGetAdminDashboardData"
import { Activity, Loader2, ShieldCheck } from "lucide-react"
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
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="grid size-12 place-items-center rounded-full bg-blue-50">
            <Loader2 className="size-6 animate-spin text-blue-600" />
          </span>
          <p className="text-sm font-medium">Đang tải dữ liệu quản trị...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 text-foreground">
      <header className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/80">
                <Activity className="size-3.5" />
                Trung tâm điều hành
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
                Theo dõi người dùng, nội dung và hoạt động vận hành từ một nơi.
              </p>
            </div>
          </div>
          <div className="w-fit rounded-xl border border-white/20 bg-white/15 px-4 py-3">
            <p className="text-xs font-medium text-primary-foreground/75">Dữ liệu báo cáo</p>
            <p className="mt-0.5 text-sm font-semibold">Năm {selectedYear}</p>
          </div>
        </div>
      </header>

      <StatsCards stats={stats} />

      <section aria-labelledby="analytics-title">
        <div className="mb-4">
          <h2 id="analytics-title" className="text-lg font-semibold text-slate-950">Phân tích người dùng</h2>
          <p className="mt-1 text-sm text-slate-500">Tăng trưởng tài khoản và phân bố mục tiêu tập luyện.</p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
        <UserGrowthChart
          data={userGrowth}
          currentYear={currentYear}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />
        <UserGoalChart data={userGoal} />
        </div>
      </section>

      <section aria-labelledby="tools-title">
        <AppLauncher onNavigate={handleNavigate} />
      </section>
    </div>
  )
}
