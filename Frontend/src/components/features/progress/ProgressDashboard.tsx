import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChevronLeft, ChevronRight, Flame, ListChecks, Scale, Target, TrendingDown, Trophy, Utensils } from "lucide-react"

import { getProgressCalendar, getProgressDayDetail } from "@/api/progress.api"
import { Badge } from "@/components/shared/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shared/ui/chart"
import { StatCard } from "@/components/shared/ui/stat-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shared/ui/tooltip"
import { cn } from "@/lib/utils"
import { DayCellStatus, ProgressDayCell } from "@/types/progress.type"

const STATUS_META: Record<Exclude<DayCellStatus, "NONE">, { label: string; bar: string; badge: string }> = {
  COMPLETED: { label: "Hoàn thành", bar: "bg-success", badge: "bg-success/15 text-success" },
  PARTIAL: { label: "Một phần", bar: "bg-amber-500", badge: "bg-amber-500/15 text-amber-600" },
  MISSED: { label: "Bỏ lỡ", bar: "bg-destructive", badge: "bg-destructive/15 text-destructive" },
  PLANNED: { label: "Kế hoạch", bar: "bg-indigo-500", badge: "bg-indigo-500/15 text-indigo-600" },
  REST: { label: "Nghỉ", bar: "bg-muted-foreground/40", badge: "bg-muted text-muted-foreground" },
}

// Bảng màu cố định gán cho từng kế hoạch (theo planId) để phân biệt khi 1 ngày có nhiều kế hoạch song song
const PLAN_COLORS = [
  { text: "text-indigo-600", bg: "bg-indigo-500/15" },
  { text: "text-teal-600", bg: "bg-teal-500/15" },
  { text: "text-rose-600", bg: "bg-rose-500/15" },
  { text: "text-amber-600", bg: "bg-amber-500/15" },
  { text: "text-violet-600", bg: "bg-violet-500/15" },
  { text: "text-cyan-600", bg: "bg-cyan-500/15" },
]

function planColor(planId: number) {
  return PLAN_COLORS[planId % PLAN_COLORS.length]
}

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

function formatMonthParam(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`
}

function formatDateDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return `Ngày ${d} tháng ${m}, ${y}`
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function ProgressDashboard() {
  const today = new Date()
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState<{ date: string; workoutDayId?: number } | null>(null)
  const [trendMetric, setTrendMetric] = useState<"weight" | "calories">("weight")

  const monthParam = formatMonthParam(cursor.year, cursor.month)
  const currentDateStr = todayStr()

  const { data: calendar, isFetching } = useQuery({
    queryKey: ["progress-calendar", monthParam],
    queryFn: () => getProgressCalendar(monthParam),
    select: (res) => res?.data,
  })

  const { data: dayDetail, isFetching: isFetchingDetail } = useQuery({
    queryKey: ["progress-day-detail", selected?.date, selected?.workoutDayId],
    queryFn: () => getProgressDayDetail(selected!.date, selected!.workoutDayId),
    select: (res) => res?.data,
    enabled: !!selected,
  })

  const weeks = useMemo(() => {
    const days = calendar?.days ?? []
    if (days.length === 0) return []
    const firstDow = new Date(days[0].date).getDay() // 0=CN..6=T7
    const leadingBlanks = (firstDow + 6) % 7 // số ô trống đầu (Mon=0)
    const cells: (ProgressDayCell | null)[] = [...Array(leadingBlanks).fill(null), ...days]
    while (cells.length % 7 !== 0) cells.push(null)
    const rows: (ProgressDayCell | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
    return rows
  }, [calendar])

  const trendData = useMemo(() => {
    const days = calendar?.days ?? []
    return days
      .filter((d) => (trendMetric === "weight" ? d.weight != null : d.caloriesEaten != null))
      .map((d) => ({
        label: d.date.slice(8),
        value: trendMetric === "weight" ? d.weight : d.caloriesEaten,
      }))
  }, [calendar, trendMetric])

  const s = calendar?.summary
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  })

  const goToMonth = (delta: number) => {
    setSelected(null)
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Tăng tiến của bạn</h1>
        <p className="text-sm text-text-secondary">
          Theo dõi cân nặng, calo, tuân thủ kế hoạch tập &amp; ăn theo từng ngày trong tháng.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Cân nặng"
          value={s?.currentWeight != null ? `${s.currentWeight} kg` : "—"}
          description={
            s?.weightChangeTotal != null
              ? `${s.weightChangeTotal <= 0 ? "↓" : "↑"} ${Math.abs(s.weightChangeTotal)} kg`
              : "Chưa có dữ liệu"
          }
          icon={Scale}
          tone="teal"
        />
        <StatCard
          title="Xu hướng"
          value={s?.weeklyRate != null ? `${s.weeklyRate} kg/tuần` : "—"}
          description={s?.weeklyRate != null ? "So với tuần trước" : undefined}
          icon={TrendingDown}
          tone="indigo"
        />
        <StatCard
          title="Calories TB"
          value={s ? `${Math.round(s.avgCalories)} kcal` : "—"}
          description={s ? `Mục tiêu ${Math.round(s.targetCalories)}` : undefined}
          icon={Flame}
          tone="amber"
        />
        <StatCard
          title="Bám kế hoạch tập"
          value={s ? `${Math.round(s.workoutAdherencePercent)}%` : "—"}
          description={s ? `${s.workoutSessionsDone}/${s.workoutSessionsTotal} buổi` : undefined}
          icon={ListChecks}
          tone="accent"
        />
        <StatCard
          title="Bám kế hoạch ăn"
          value={s ? `${Math.round(s.mealAdherencePercent)}%` : "—"}
          description={s ? `${s.mealDaysLogged}/${s.mealDaysTotal} ngày` : undefined}
          icon={Utensils}
          tone="amber"
        />
        <StatCard
          title="Progress Score"
          value={s ? `${Math.round(s.progressScore)} / 100` : "—"}
          description={s?.progressScoreLabel}
          icon={Trophy}
          tone="teal"
        />
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold capitalize text-foreground">{monthLabel}</h3>
            <p className="text-xs text-text-secondary">Nhấn vào ngày bất kỳ để xem chi tiết</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
              {(Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((k) => (
                <span key={k} className="inline-flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", STATUS_META[k].bar)} />
                  {STATUS_META[k].label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToMonth(-1)}
                className="rounded-md border border-border p-1.5 hover:bg-muted"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToMonth(1)}
                className="rounded-md border border-border p-1.5 hover:bg-muted"
                aria-label="Tháng sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-text-secondary">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <div className={cn("mt-2 flex flex-col gap-2", isFetching && "opacity-50")}>
          {weeks.map((row, i) => (
            <div key={i} className="grid grid-cols-7 gap-2">
              {row.map((cell, j) => {
                if (!cell) return <div key={j} />
                const isToday = cell.date === currentDateStr
                const isSelected = selected?.date === cell.date
                const isRest = cell.sessions.length === 0
                return (
                  <Tooltip key={cell.date}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelected({ date: cell.date, workoutDayId: cell.sessions[0]?.workoutDayId })}
                        className={cn(
                          "flex min-h-[92px] flex-col items-start gap-1 rounded-lg border p-2 text-left transition-colors hover:border-primary/40",
                          isSelected ? "border-primary bg-primary/5" : "border-border",
                          isToday && !isSelected && "border-primary/60",
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full text-sm font-semibold",
                              isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                            )}
                          >
                            {Number(cell.date.slice(8))}
                          </span>
                          {isToday && <span className="text-[9px] font-semibold uppercase text-primary">Hôm nay</span>}
                        </div>

                        {isRest ? (
                          <span className="text-[11px] leading-tight text-text-secondary">Nghỉ</span>
                        ) : (
                          <div className="flex w-full flex-col gap-1">
                            {cell.sessions.map((s) => {
                              const color = planColor(s.planId)
                              const meta = STATUS_META[s.status]
                              return (
                                <div key={s.workoutDayId} className="flex flex-col gap-0.5">
                                  <span
                                    className={cn(
                                      "truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight",
                                      color.bg,
                                      color.text,
                                    )}
                                    title={s.planName}
                                  >
                                    {s.planName}
                                  </span>
                                  <span className={cn("h-1 w-full rounded-full", meta.bar)} />
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">{formatDateDisplay(cell.date)}</p>
                        {isRest ? (
                          <p>Không có buổi tập</p>
                        ) : (
                          cell.sessions.map((s) => (
                            <p key={s.workoutDayId}>
                              {s.planName} — {s.sessionLabel} — {STATUS_META[s.status].label}
                            </p>
                          ))
                        )}
                        {cell.caloriesEaten != null && (
                          <p>
                            Ăn {Math.round(cell.caloriesEaten)} / {Math.round(cell.caloriesTarget)} kcal
                          </p>
                        )}
                        {cell.weight != null && <p>Cân nặng: {cell.weight} kg</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Day detail panel */}
      {selected && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">{formatDateDisplay(selected.date)}</h3>
            {dayDetail && dayDetail.status !== "NONE" && (
              <div className="flex items-center gap-2">
                <Badge className={STATUS_META[dayDetail.status].badge} variant="outline">
                  {STATUS_META[dayDetail.status].label}
                </Badge>
                {dayDetail.planDayLabel && (
                  <Badge className={STATUS_META[dayDetail.status].badge} variant="outline">
                    {dayDetail.planDayLabel}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Nếu ngày này có nhiều buổi (nhiều kế hoạch song song) — cho chọn xem buổi nào */}
          {(() => {
            const cell = calendar?.days.find((d) => d.date === selected.date)
            if (!cell || cell.sessions.length < 2) return null
            return (
              <div className="mb-4 flex flex-wrap gap-2">
                {cell.sessions.map((s) => {
                  const color = planColor(s.planId)
                  const isActive = selected.workoutDayId === s.workoutDayId
                  return (
                    <button
                      key={s.workoutDayId}
                      onClick={() => setSelected({ date: selected.date, workoutDayId: s.workoutDayId })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        isActive ? cn(color.bg, color.text, "border-transparent") : "border-border text-text-secondary hover:bg-muted",
                      )}
                    >
                      {s.planName} · {s.sessionLabel}
                    </button>
                  )
                })}
              </div>
            )
          })()}

          {isFetchingDetail && <p className="text-sm text-text-secondary">Đang tải...</p>}

          {dayDetail && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <Target className="h-3.5 w-3.5" /> Bài tập
                </h4>
                {dayDetail.exercises.length === 0 ? (
                  <p className="text-sm text-text-secondary">Không có buổi tập ngày này.</p>
                ) : (
                  <ul className="space-y-2">
                    {dayDetail.exercises.map((ex) => (
                      <li key={ex.exerciseId} className="flex items-center justify-between text-sm">
                        <span className={cn(ex.done ? "text-foreground" : "text-text-secondary")}>
                          {ex.exerciseName}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {ex.setsLogged}/{ex.setsPlanned} set
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5" /> Bữa ăn
                  </span>
                  <span className="text-destructive">
                    {Math.round(dayDetail.caloriesEaten)} / {Math.round(dayDetail.caloriesTarget)} kcal
                  </span>
                </h4>
                {dayDetail.meals.length === 0 ? (
                  <p className="text-sm text-text-secondary">Chưa ghi món ăn nào ngày này.</p>
                ) : (
                  <ul className="space-y-2">
                    {dayDetail.meals.map((meal, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{meal.name}</span>
                        <span className="text-xs text-text-secondary">{Math.round(meal.calories)} kcal</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trend chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Xu hướng</h3>
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {([
              { k: "weight", label: "Cân nặng" },
              { k: "calories", label: "Calories" },
            ] as const).map((opt) => (
              <button
                key={opt.k}
                onClick={() => setTrendMetric(opt.k)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  trendMetric === opt.k ? "bg-primary text-primary-foreground" : "text-text-secondary hover:bg-muted",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {trendData.length === 0 ? (
          <p className="py-8 text-center text-text-secondary">Chưa có đủ dữ liệu để vẽ biểu đồ tháng này.</p>
        ) : (
          <ChartContainer
            config={{ value: { label: trendMetric === "weight" ? "Cân nặng (kg)" : "Calories (kcal)", color: "#16a34a" } }}
            className="h-[280px] w-full"
          >
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,53,37,0.12)" />
              <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
