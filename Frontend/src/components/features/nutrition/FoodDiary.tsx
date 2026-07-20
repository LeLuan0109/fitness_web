import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format, subDays } from "date-fns"
import { Plus, Trash2, Flame } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { addFoodLog, deleteFoodLog, getFoodDiary, getFoodDiarySummary } from "@/api/food-log.api"
import { getDishes } from "@/api/dish.api"
import { Button } from "@/components/shared/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shared/ui/chart"
import { Input } from "@/components/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select"

type Period = "day" | "week" | "month"

interface MacroBarProps {
  label: string
  current: number
  target: number
  unit: string
  color: string
}

function MacroBar({ label, current, target, unit, color }: MacroBarProps) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
  const over = current > target && target > 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className={over ? "text-destructive" : "text-text-secondary"}>
          {Math.round(current)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export function FoodDiary() {
  const queryClient = useQueryClient()
  const today = useMemo(() => format(new Date(), "dd/MM/yyyy"), [])
  const [period, setPeriod] = useState<Period>("day")
  const [dishId, setDishId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

  // Khoảng ngày cho chế độ tuần/tháng
  const range = useMemo(() => {
    const to = new Date()
    const from = subDays(to, period === "month" ? 29 : 6)
    return { from: format(from, "dd/MM/yyyy"), to: format(to, "dd/MM/yyyy") }
  }, [period])

  const { data: summary } = useQuery({
    queryKey: ["food-summary", range.from, range.to],
    queryFn: () => getFoodDiarySummary(range.from, range.to),
    select: (res) => res?.data,
    enabled: period !== "day",
  })

  const summaryChart = useMemo(
    () => (summary?.days ?? []).map((d) => ({ label: d.date?.slice(5), Calo: d.calories })),
    [summary],
  )

  const { data: dishesRes } = useQuery({
    queryKey: ["dishes-for-diary"],
    queryFn: () => getDishes(),
    select: (res) => res?.data ?? [],
  })
  const dishes = dishesRes ?? []

  const { data: diary, isLoading } = useQuery({
    queryKey: ["food-diary", today],
    queryFn: () => getFoodDiary(today),
    select: (res) => res?.data,
  })

  const addMutation = useMutation({
    mutationFn: () => addFoodLog({ dishId: Number(dishId), quantity, date: today, mealType: "OTHER" }),
    onSuccess: () => {
      setDishId("")
      setQuantity(1)
      queryClient.invalidateQueries({ queryKey: ["food-diary", today] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFoodLog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["food-diary", today] }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Nhật ký ăn uống</h1>
        <p className="text-sm text-text-secondary">
          Ghi món đã ăn và theo dõi calo, đạm, tinh bột, chất béo so với mục tiêu — theo ngày, tuần hoặc tháng.
        </p>
      </div>

      {/* Chọn kỳ xem */}
      <div className="inline-flex w-fit rounded-lg border border-border p-0.5">
        {([
          { k: "day", label: "Hôm nay" },
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

      {/* ===== Chế độ TUẦN / THÁNG: trung bình + biểu đồ calo mỗi ngày ===== */}
      {period !== "day" && summary && (
        <>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Trung bình mỗi ngày ({period === "week" ? "7 ngày" : "30 ngày"})
            </h3>
            <p className="mb-4 text-xs text-text-secondary">
              {summary.fromDate} → {summary.toDate}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MacroBar label="Calo" current={summary.avgCalories} target={summary.targetCalories} unit="kcal" color="#f97316" />
              <MacroBar label="Đạm" current={summary.avgProtein} target={summary.targetProtein} unit="g" color="#0ea5e9" />
              <MacroBar label="Tinh bột" current={summary.avgCarbs} target={summary.targetCarbs} unit="g" color="#8c6239" />
              <MacroBar label="Chất béo" current={summary.avgFat} target={summary.targetFat} unit="g" color="#eab308" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-base font-semibold text-foreground">Calo nạp mỗi ngày</h3>
            {summaryChart.length === 0 ? (
              <p className="py-6 text-center text-text-secondary">Chưa có dữ liệu trong khoảng này.</p>
            ) : (
              <ChartContainer config={{ Calo: { label: "Calo", color: "#f97316" } }} className="h-[300px] w-full">
                <BarChart data={summaryChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,53,37,0.12)" />
                  <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Calo" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </>
      )}

      {/* Tổng quan macro */}
      {period === "day" && diary && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              Đã nạp {Math.round(diary.totalCalories)} / {Math.round(diary.targetCalories)} kcal
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MacroBar label="Calo" current={diary.totalCalories} target={diary.targetCalories} unit="kcal" color="#f97316" />
            <MacroBar label="Đạm" current={diary.totalProtein} target={diary.targetProtein} unit="g" color="#0ea5e9" />
            <MacroBar label="Tinh bột" current={diary.totalCarbs} target={diary.targetCarbs} unit="g" color="#8c6239" />
            <MacroBar label="Chất béo" current={diary.totalFat} target={diary.targetFat} unit="g" color="#eab308" />
          </div>
        </div>
      )}

      {/* Thêm món (chỉ ở chế độ Hôm nay) */}
      {period === "day" && (
      <>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-base font-semibold text-foreground">Thêm món đã ăn</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-text-secondary">Món ăn</label>
            <Select value={dishId} onValueChange={setDishId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn món ăn" />
              </SelectTrigger>
              <SelectContent>
                {dishes.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name} ({d.calories} kcal)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-28">
            <label className="mb-1 block text-sm text-text-secondary">Số phần</label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <Button onClick={() => addMutation.mutate()} disabled={!dishId || addMutation.isPending}>
            <Plus className="mr-1 h-4 w-4" /> Thêm
          </Button>
        </div>
      </div>

      {/* Danh sách món đã ăn */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-base font-semibold text-foreground">Món đã ăn hôm nay</h3>
        {isLoading ? (
          <p className="text-text-secondary">Đang tải...</p>
        ) : !diary || diary.items.length === 0 ? (
          <p className="py-6 text-center text-text-secondary">Chưa ghi món nào. Hãy thêm món bạn đã ăn.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {diary.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">
                    {item.dishName} {item.quantity > 1 && `× ${item.quantity}`}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {Math.round(item.calories)} kcal · P {Math.round(item.protein)}g · C {Math.round(item.carbs)}g · F{" "}
                    {Math.round(item.fat)}g
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      </>
      )}
    </div>
  )
}
