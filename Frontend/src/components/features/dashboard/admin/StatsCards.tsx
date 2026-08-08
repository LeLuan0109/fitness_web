import { ArrowUpRight, BookOpen, Dumbbell, UserPlus, Users, type LucideIcon } from "lucide-react"
import { DashboardStatsResponse } from "@/types/dashboard.type"
import { memo } from "react"

interface StatsCardsProps {
  stats?: DashboardStatsResponse
}

export const StatsCards = memo(({ stats }: StatsCardsProps) => {
  const cards: Array<{
    title: string
    value: string | number
    description: string
    icon: LucideIcon
    iconClassName: string
  }> = [
    {
      title: "Người dùng hoạt động",
      value: stats?.totalActivateUsers?.toLocaleString() || 0,
      description: "Tài khoản đã kích hoạt",
      icon: Users,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      title: "Đăng ký hôm nay",
      value: stats?.newUsersToday?.toLocaleString() || 0,
      description: "Người dùng mới trong ngày",
      icon: UserPlus,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Thực đơn hệ thống",
      value: stats?.totalSystemMenus?.toLocaleString() || 0,
      description: "Thực đơn đang khả dụng",
      icon: BookOpen,
      iconClassName: "bg-violet-50 text-violet-600",
    },
    {
      title: "Kế hoạch luyện tập",
      value: stats?.totalSystemPlans?.toLocaleString() || 0,
      description: "Kế hoạch đang khả dụng",
      icon: Dumbbell,
      iconClassName: "bg-cyan-50 text-cyan-700",
    },
  ]

  return (
    <section aria-label="Chỉ số tổng quan" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <span className={`grid size-11 place-items-center rounded-xl ${card.iconClassName}`}>
              <card.icon className="size-5" aria-hidden="true" />
            </span>
            <ArrowUpRight className="size-4 text-slate-300 transition-colors group-hover:text-blue-600" aria-hidden="true" />
          </div>
          <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{card.value}</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-800">{card.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">{card.description}</p>
        </article>
      ))}
    </section>
  )
})

StatsCards.displayName = "StatsCards"
