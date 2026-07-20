import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Dumbbell, Trophy, TrendingUp, Repeat } from "lucide-react"

import { getExerciseProgress, getLoggedExercises } from "@/api/workout-log.api"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shared/ui/chart"
import { StatCard } from "@/components/shared/ui/stat-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select"

export function Progress() {
  const [exerciseId, setExerciseId] = useState<number | null>(null)
  const [period, setPeriod] = useState<"day" | "week" | "month">("day")

  const { data: exercisesRes, isLoading: loadingExercises } = useQuery({
    queryKey: ["logged-exercises"],
    queryFn: getLoggedExercises,
    select: (res) => res?.data ?? [],
  })

  const exercises = exercisesRes ?? []

  // Tự chọn bài đầu tiên khi có dữ liệu
  const selectedId = exerciseId ?? (exercises.length > 0 ? exercises[0].id : null)

  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ["exercise-progress", selectedId],
    queryFn: () => getExerciseProgress(selectedId as number),
    select: (res) => res?.data,
    enabled: !!selectedId,
  })

  // Gộp các điểm theo ngày/tuần/tháng. Tạ & 1RM lấy MAX trong kỳ; volume cộng dồn.
  const chartData = useMemo(() => {
    const points = progress?.points ?? []
    if (period === "day") {
      return points.map((p) => ({
        label: p.date?.slice(5),
        "Tạ (kg)": p.maxWeight,
        "1RM ước tính": p.estimatedOneRm,
      }))
    }

    const keyOf = (dateStr: string) => {
      const d = new Date(dateStr)
      if (period === "month") {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      }
      // tuần: lấy thứ Hai đầu tuần làm mốc
      const day = (d.getDay() + 6) % 7 // 0 = Mon
      const monday = new Date(d)
      monday.setDate(d.getDate() - day)
      return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(
        monday.getDate(),
      ).padStart(2, "0")}`
    }

    const groups = new Map<string, { w: number; rm: number }>()
    for (const p of points) {
      const k = keyOf(p.date)
      const g = groups.get(k) ?? { w: 0, rm: 0 }
      g.w = Math.max(g.w, p.maxWeight ?? 0)
      g.rm = Math.max(g.rm, p.estimatedOneRm ?? 0)
      groups.set(k, g)
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, g]) => ({
        label: period === "month" ? k.slice(2) : k.slice(5), // YY-MM hoặc MM-dd
        "Tạ (kg)": g.w,
        "1RM ước tính": Math.round(g.rm * 10) / 10,
      }))
  }, [progress, period])

  const chartConfig = {
    "Tạ (kg)": { label: "Tạ (kg)", color: "#8c6239" },
    "1RM ước tính": { label: "1RM ước tính", color: "#0ea5e9" },
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Tiến bộ sức mạnh</h1>
        <p className="text-sm text-text-secondary">
          Theo dõi mức tạ, 1RM ước tính và kỷ lục cá nhân (PR) của từng bài tập theo thời gian.
        </p>
      </div>

      {/* Chọn bài tập + kỳ xem */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="max-w-xs flex-1">
          <Select
            value={selectedId ? String(selectedId) : undefined}
            onValueChange={(v) => setExerciseId(Number(v))}
            disabled={loadingExercises || exercises.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn bài tập" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((ex) => (
                <SelectItem key={ex.id} value={String(ex.id)}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="inline-flex rounded-lg border border-border p-0.5">
          {([
            { k: "day", label: "Ngày" },
            { k: "week", label: "Tuần" },
            { k: "month", label: "Tháng" },
          ] as const).map((opt) => (
            <button
              key={opt.k}
              onClick={() => setPeriod(opt.k)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                period === opt.k ? "bg-primary text-primary-foreground" : "text-text-secondary hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {exercises.length === 0 && !loadingExercises && (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-text-secondary">
          Chưa có dữ liệu tập luyện. Hãy hoàn thành vài buổi tập để xem tiến bộ.
        </div>
      )}

      {progress && (
        <>
          {/* Kỷ lục cá nhân */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Tạ nặng nhất (PR)"
              value={`${progress.bestWeight ?? 0} kg`}
              description={progress.bestDate ? `Lập ngày ${progress.bestDate}` : undefined}
              icon={Trophy}
              tone="amber"
            />
            <StatCard
              title="1RM ước tính cao nhất"
              value={`${progress.bestEstimatedOneRm ?? 0} kg`}
              description="Công thức Epley"
              icon={TrendingUp}
              tone="teal"
            />
            <StatCard
              title="Reps nhiều nhất / set"
              value={progress.bestReps ?? 0}
              icon={Repeat}
              tone="indigo"
            />
          </div>

          {/* Biểu đồ tiến bộ */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Diễn tiến: {progress.exerciseName}
              </h3>
            </div>
            {chartData.length === 0 ? (
              <p className="py-8 text-center text-text-secondary">Chưa có dữ liệu cho bài này.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,53,37,0.12)" />
                  <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="Tạ (kg)" stroke="#8c6239" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="1RM ước tính" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            )}
          </div>
        </>
      )}

      {loadingProgress && <p className="text-center text-text-secondary">Đang tải dữ liệu...</p>}
    </div>
  )
}
