import { Button } from "@/components/shared/ui/button"
import { Skeleton } from "@/components/shared/ui/skeleton"
import { ROUTES } from "@/constants/routes"
import { useGetDashboardData } from "@/hooks/queries/dashboard/useGetDashboardData"
import { PageLayout } from "@/layouts/PageLayout"
import authStore from "@/stores/auth.store"
import { ScoredMenuSuggestion, ScoredPlanSuggestion } from "@/types/dashboard.type"
import { Activity, ArrowRight, Dumbbell, Flame, Soup, Target, type LucideIcon } from "lucide-react"
import { useMemo } from "react"
import { generatePath, useNavigate } from "react-router-dom"

const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) {
    return {
      label: "Gầy",
      className: "border-[#6B86C7]/25 bg-[#EEF3FF] text-[#405C9D]",
      dotClassName: "bg-[#6B86C7]",
    }
  }

  if (bmi < 25) {
    return {
      label: "Cân bằng",
      className: "border-[#86A873]/25 bg-[#F2F7EE] text-[#587443]",
      dotClassName: "bg-[#86A873]",
    }
  }

  if (bmi < 30) {
    return {
      label: "Thừa cân",
      className: "border-[#B88455]/25 bg-[#FBF3EA] text-[#8C6239]",
      dotClassName: "bg-[#B88455]",
    }
  }

  return {
    label: "Béo phì",
    className: "border-[#B35F4A]/25 bg-[#FFF0ED] text-[#9C4433]",
    dotClassName: "bg-[#B35F4A]",
  }
}

const formatMetric = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value)

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-clay">
      <span className="h-px w-8 bg-clay" />
      {children}
    </div>
  )
}

function BodyDashboardSection({
  metrics,
  weightGap,
  estimatedWeeksToGoal,
  paceWarning,
}: {
  metrics: {
    label: string
    value: string
    helper: string
    tag: string
    tagClassName: string
    tagDotClassName: string
    icon: LucideIcon
    progress: number
  }[]
  weightGap?: number | null
  estimatedWeeksToGoal?: number | null
  paceWarning?: string | null
}) {
  return (
    <section>
      <SectionEyebrow>Chỉ Số Cơ Thể</SectionEyebrow>
      <h1 className="font-display mb-2 text-3xl font-medium tracking-tight text-earth md:text-4xl">
        Số liệu rõ ràng trước khi bạn bước vào buổi tập.
      </h1>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-earth/65">
        BMI, TDEE và calo mục tiêu được đặt ngay trong trang chủ để quyết định hôm nay nên tập, ăn và phục hồi thế nào.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon

          return (
            <article
              key={metric.label}
              className="group rounded-3xl border border-sand/60 bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-earth/10 bg-earth/5 text-earth transition-all duration-300 group-hover:border-earth group-hover:bg-earth group-hover:text-cream">
                  <MetricIcon className="size-5" />
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${metric.tagClassName}`}
                >
                  <span className={`size-2 rounded-full ${metric.tagDotClassName}`} />
                  {metric.tag}
                </div>
              </div>
              <p className="text-sm font-medium text-earth/60">{metric.label}</p>
              <p className="font-display mt-2 text-3xl tracking-tight text-earth">{metric.value}</p>
              <p className="mt-3 min-h-10 text-sm leading-relaxed text-earth/65">{metric.helper}</p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-sand-light">
                <div
                  className="h-full rounded-full bg-clay transition-all duration-700"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </article>
          )
        })}
      </div>

      {paceWarning && (
        <div className="mt-6 rounded-2xl border border-[#B35F4A]/25 bg-[#FFF0ED] px-6 py-4 text-sm leading-relaxed text-[#9C4433]">
          {paceWarning}
        </div>
      )}
      {!paceWarning && weightGap != null && Math.abs(weightGap) > 0.1 && estimatedWeeksToGoal != null && (
        <div className="mt-6 rounded-2xl border border-sand/60 bg-cream px-6 py-4 text-sm leading-relaxed text-earth/70">
          Cần {weightGap > 0 ? "giảm" : "tăng"} khoảng <strong>{Math.abs(weightGap)}kg</strong> để đạt cân mục tiêu —
          ước tính <strong>{estimatedWeeksToGoal} tuần</strong> với tốc độ an toàn (~0.5kg/tuần).
        </div>
      )}
    </section>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const className =
    score >= 70
      ? "border-[#86A873]/25 bg-[#F2F7EE] text-[#587443]"
      : score >= 40
        ? "border-[#B88455]/25 bg-[#FBF3EA] text-[#8C6239]"
        : "border-[#B35F4A]/25 bg-[#FFF0ED] text-[#9C4433]"

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${className}`}>
      {score} điểm khớp
    </span>
  )
}

function RecommendationsSection({
  navigate,
  usedFallback,
  planSuggestions,
  menuSuggestions,
}: {
  navigate: ReturnType<typeof useNavigate>
  usedFallback?: boolean
  planSuggestions: ScoredPlanSuggestion[]
  menuSuggestions: ScoredMenuSuggestion[]
}) {
  if (planSuggestions.length === 0 && menuSuggestions.length === 0) return null

  return (
    <section className="mt-16">
      <SectionEyebrow>Đề Xuất Cho Bạn</SectionEyebrow>
      <h2 className="font-display mb-2 text-2xl font-medium tracking-tight text-earth md:text-3xl">
        Kế hoạch & thực đơn sát với bạn nhất.
      </h2>
      {usedFallback && (
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-earth/50">
          Kho chưa có tổ hợp khớp đúng mục tiêu của bạn — danh sách dưới đây đã được nới điều kiện để luôn có gợi ý.
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Dumbbell className="size-5 text-clay" />
            <h3 className="font-display text-xl text-earth">Kế hoạch tập</h3>
          </div>
          <div className="space-y-4">
            {planSuggestions.map((s) => (
              <article
                key={s.plan.id}
                className="group rounded-3xl border border-sand/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h4 className="font-display text-lg leading-tight text-earth">{s.plan.name}</h4>
                  <ScoreBadge score={s.matchScore} />
                </div>
                {s.plan.description && (
                  <p className="mb-4 text-sm leading-relaxed text-earth/60">{s.plan.description}</p>
                )}
                <ul className="mb-5 space-y-1.5 text-sm text-earth/70">
                  {s.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="h-auto rounded-full border-earth/20 px-5 py-2.5 text-sm font-medium text-earth transition-all duration-300 hover:border-earth hover:bg-earth hover:text-cream"
                  onClick={() => navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: String(s.plan.id) }))}
                >
                  Xem chi tiết
                  <ArrowRight className="size-3.5" />
                </Button>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <Soup className="size-5 text-clay" />
            <h3 className="font-display text-xl text-earth">Thực đơn</h3>
          </div>
          <div className="space-y-4">
            {menuSuggestions.map((s) => (
              <article
                key={s.menu.id}
                className="group rounded-3xl border border-sand/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h4 className="font-display text-lg leading-tight text-earth">{s.menu.name}</h4>
                  <ScoreBadge score={s.matchScore} />
                </div>
                {s.menu.description && (
                  <p className="mb-4 text-sm leading-relaxed text-earth/60">{s.menu.description}</p>
                )}
                <ul className="mb-5 space-y-1.5 text-sm text-earth/70">
                  {s.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="h-auto rounded-full border-earth/20 px-5 py-2.5 text-sm font-medium text-earth transition-all duration-300 hover:border-earth hover:bg-earth hover:text-cream"
                  onClick={() => navigate(generatePath(ROUTES.NUTRITION.SAMPLE_DETAIL, { id: String(s.menu.id) }))}
                >
                  Xem chi tiết
                  <ArrowRight className="size-3.5" />
                </Button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const auth = authStore.use.auth()
  const { data, isLoading, isError } = useGetDashboardData(auth.id)

  const dashboardMetrics = useMemo(() => {
    if (!data) return []

    const bmiStatus = getBMIStatus(data.bmi)
    const calorieDelta = data.targetCalories - data.tdee

    return [
      {
        label: "Chỉ số BMI",
        value: formatMetric(data.bmi, 1),
        helper: "Đánh giá nhanh tỷ lệ cơ thể",
        tag: bmiStatus.label,
        tagClassName: bmiStatus.className,
        tagDotClassName: bmiStatus.dotClassName,
        icon: Activity,
        progress: Math.min(Math.max((data.bmi / 35) * 100, 12), 100),
      },
      {
        label: "TDEE",
        value: formatMetric(data.tdee),
        helper: "Calo tiêu thụ hằng ngày",
        tag: "Daily burn",
        tagClassName: "border-sand bg-sand-light/60 text-clay",
        tagDotClassName: "bg-clay",
        icon: Flame,
        progress: 72,
      },
      {
        label: "Calo mục tiêu",
        value: formatMetric(data.targetCalories),
        helper: "Calo nên nạp mỗi ngày",
        tag: `${calorieDelta > 0 ? "+" : ""}${formatMetric(calorieDelta)} so với TDEE`,
        tagClassName:
          calorieDelta >= 0
            ? "border-[#86A873]/25 bg-[#F2F7EE] text-[#587443]"
            : "border-[#B35F4A]/25 bg-[#FFF0ED] text-[#9C4433]",
        tagDotClassName: calorieDelta >= 0 ? "bg-[#86A873]" : "bg-[#B35F4A]",
        icon: Target,
        progress: calorieDelta >= 0 ? 82 : 58,
      },
    ]
  }, [data])

  if (isLoading) {
    return (
      <PageLayout title="Trang chủ">
        <div className="space-y-7">
          <Skeleton className="h-8 w-64 rounded-full bg-sand-light" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-48 rounded-3xl bg-sand-light" />
            <Skeleton className="h-48 rounded-3xl bg-sand-light" />
            <Skeleton className="h-48 rounded-3xl bg-sand-light" />
          </div>
        </div>
      </PageLayout>
    )
  }

  if (isError || !data) {
    return (
      <PageLayout title="Trang chủ">
        <section className="mx-auto max-w-xl rounded-3xl border border-sand bg-card p-8 text-center shadow-xl shadow-earth/5">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-earth/5 text-clay">
            <Activity className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-medium">Không thể tải dữ liệu</h1>
          <p className="mt-3 text-sm leading-6 text-earth/65">Vui lòng thử lại sau để xem tổng quan sức khỏe của bạn.</p>
        </section>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Trang chủ">
      <BodyDashboardSection
        metrics={dashboardMetrics}
        weightGap={data.weightGap}
        estimatedWeeksToGoal={data.estimatedWeeksToGoal}
        paceWarning={data.paceWarning}
      />
      <RecommendationsSection
        navigate={navigate}
        usedFallback={data.usedFallback}
        planSuggestions={data.workoutPlanSuggestions ?? []}
        menuSuggestions={data.menuSuggestions ?? []}
      />
    </PageLayout>
  )
}
