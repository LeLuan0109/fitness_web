import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addDays, format, isSameDay, isToday, parseISO, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight, Droplet, Plus, Search, TrendingUp, UtensilsCrossed } from "lucide-react"
import { toast } from "sonner"

import { applyMenuToDate, addFoodLog, getFoodDiaryCalendar, getFoodDiaryDayDetail } from "@/api/food-log.api"
import { getDishes } from "@/api/dish.api"
import { getMyMenus } from "@/api/menu.api"
import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { Input } from "@/components/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { cn } from "@/lib/utils"
import { FoodDiaryMealSlot, MealSlotStatus } from "@/types/food-diary.type"

const STATUS_META: Record<MealSlotStatus, { label: string; badge: string }> = {
  MATCH: { label: "Đúng thực đơn", badge: "bg-success/15 text-success" },
  CHANGED: { label: "Đổi món", badge: "bg-amber-500/15 text-amber-600" },
  SKIPPED: { label: "Bỏ bữa", badge: "bg-destructive/15 text-destructive" },
  PLANNED: { label: "Kế hoạch", badge: "bg-indigo-500/15 text-indigo-600" },
}

function completionColor(percent: number) {
  if (percent >= 90) return "bg-success"
  if (percent >= 60) return "bg-amber-500"
  return "bg-destructive"
}

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
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [addDialogSlot, setAddDialogSlot] = useState<FoodDiaryMealSlot | null>(null)
  const [addName, setAddName] = useState("")
  const [addCalories, setAddCalories] = useState("")
  const [logMode, setLogMode] = useState<"manual" | "catalog">("manual")
  const [dishSearch, setDishSearch] = useState("")
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null)

  const [selectedMenuId, setSelectedMenuId] = useState<string>("")
  const [applyMenuConfirmOpen, setApplyMenuConfirmOpen] = useState(false)

  const weekStartStr = format(weekStart, "yyyy-MM-dd")
  const weekEndStr = format(addDays(weekStart, 6), "yyyy-MM-dd")
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
  const selectedDateApiStr = format(selectedDate, "dd/MM/yyyy")

  const { data: calendar } = useQuery({
    queryKey: ["food-diary-calendar", weekStartStr],
    queryFn: () => getFoodDiaryCalendar(weekStartStr, weekEndStr),
    select: (res) => res?.data,
  })

  const { data: dayDetail, isFetching: isFetchingDetail } = useQuery({
    queryKey: ["food-diary-day-detail", selectedDateStr],
    queryFn: () => getFoodDiaryDayDetail(selectedDateStr),
    select: (res) => res?.data,
  })

  const { data: myMenus } = useQuery({
    queryKey: ["my-menus-for-diary"],
    queryFn: () => getMyMenus({ size: 100 }),
    select: (res) => res?.data ?? [],
  })

  const { data: dishOptions, isFetching: isFetchingDishes } = useQuery({
    queryKey: ["dish-picker", dishSearch],
    queryFn: () => getDishes({ search: dishSearch || undefined, size: 20 }),
    select: (res) => res?.data ?? [],
    enabled: !!addDialogSlot && logMode === "catalog",
  })

  const selectedDish = dishOptions?.find((d) => d.id === selectedDishId) ?? null

  const invalidateDiaryQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["food-diary-day-detail", selectedDateStr] })
    queryClient.invalidateQueries({ queryKey: ["food-diary-calendar", weekStartStr] })
  }

  const addMutation = useMutation({
    mutationFn: () =>
      logMode === "catalog" && selectedDish
        ? addFoodLog({
            dishId: selectedDish.id,
            date: selectedDateApiStr,
            mealType: addDialogSlot?.mealType,
          })
        : addFoodLog({
            customName: addName || addDialogSlot?.mealTypeLabel || "Món tự nhập",
            actualCalories: Number(addCalories),
            date: selectedDateApiStr,
            mealType: addDialogSlot?.mealType,
          }),
    onSuccess: () => {
      setAddDialogSlot(null)
      invalidateDiaryQueries()
    },
  })

  const applyMenuMutation = useMutation({
    mutationFn: () => applyMenuToDate({ menuId: Number(selectedMenuId), date: selectedDateApiStr }),
    onSuccess: () => {
      toast.success("Đã áp dụng thực đơn cho ngày này — cả 4 bữa đã được ghi lại.")
      invalidateDiaryQueries()
    },
    onError: () => {
      toast.error("Không thể áp dụng thực đơn này. Vui lòng thử lại.")
    },
  })

  const openAddDialog = (slot: FoodDiaryMealSlot) => {
    setAddDialogSlot(slot)
    setAddName("")
    setAddCalories("")
    setLogMode("manual")
    setDishSearch("")
    setSelectedDishId(null)
  }

  const days = calendar?.days ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Nhật ký ăn uống</h1>
        <p className="text-sm text-text-secondary">
          Theo dõi mức hoàn thành thực đơn mỗi ngày, calo/macro và từng bữa ăn trong ngày.
        </p>
      </div>

      {/* ===== Chọn thực đơn cho ngày đang xem ===== */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
          <UtensilsCrossed className="h-4 w-4" /> Chọn thực đơn cho ngày {format(selectedDate, "dd/MM/yyyy")}
        </h3>
        <p className="mb-3 text-xs text-text-secondary">
          Áp dụng 1 thực đơn cá nhân sẽ tự ghi lại cả 4 bữa của ngày này theo đúng món trong thực đơn đó
          (ghi đè dữ liệu cũ nếu có).
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Chọn thực đơn của bạn..." />
            </SelectTrigger>
            <SelectContent>
              {(myMenus ?? []).map((menu) => (
                <SelectItem key={menu.id} value={String(menu.id)}>
                  {menu.name}
                </SelectItem>
              ))}
              {(myMenus ?? []).length === 0 && (
                <div className="px-2 py-1.5 text-sm text-text-secondary">Bạn chưa có thực đơn cá nhân nào.</div>
              )}
            </SelectContent>
          </Select>
          <Button
            disabled={!selectedMenuId || applyMenuMutation.isPending}
            onClick={() => setApplyMenuConfirmOpen(true)}
          >
            Dùng thực đơn này cho ngày này
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={applyMenuConfirmOpen}
        onOpenChange={setApplyMenuConfirmOpen}
        title="Áp dụng thực đơn cho ngày này?"
        content={`Dữ liệu 4 bữa đã ghi (nếu có) của ngày ${format(selectedDate, "dd/MM/yyyy")} sẽ bị ghi đè theo thực đơn đã chọn.`}
        confirmText="Áp dụng"
        onConfirm={() => applyMenuMutation.mutate()}
      />

      {/* ===== Carousel "Hoàn thành thực đơn" theo tuần ===== */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Hoàn thành thực đơn</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" /> ≥90%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> 60-89%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive" /> &lt;60%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWeekStart((w) => addDays(w, -7))}
                className="rounded-md border border-border p-1.5 hover:bg-muted"
                aria-label="Tuần trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setWeekStart((w) => addDays(w, 7))}
                className="rounded-md border border-border p-1.5 hover:bg-muted"
                aria-label="Tuần sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((cell) => {
            const d = parseISO(cell.date)
            const today = isToday(d)
            const selected = isSameDay(d, selectedDate)
            return (
              <button
                key={cell.date}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "flex flex-col items-center justify-end gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted",
                  selected && "bg-primary/10",
                )}
              >
                <div
                  className={cn("w-3 rounded-full", completionColor(cell.completionPercent))}
                  style={{ height: `${12 + cell.completionPercent * 0.5}px` }}
                />
                <span className={cn("text-xs font-semibold", today ? "text-destructive" : "text-foreground")}>
                  {d.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== Thống kê ngày (ngày đang chọn) ===== */}
      {dayDetail && (
        <div className={cn("rounded-xl border border-border bg-card p-5", isFetchingDetail && "opacity-60")}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">
                {format(selectedDate, "EEEE").toUpperCase()} · {format(selectedDate, "dd/MM/yyyy")}
              </p>
              <h3 className="text-base font-semibold text-foreground">Thống kê ngày</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{Math.round(dayDetail.completionPercent)}%</p>
              <p className="text-xs text-text-secondary">
                {dayDetail.mealsLogged}/{dayDetail.mealsPlanned} bữa
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <MacroBar label="Calories" current={dayDetail.totalCalories} target={dayDetail.targetCalories} unit="kcal" color="#f97316" />
            <MacroBar label="Protein" current={dayDetail.totalProtein} target={dayDetail.targetProtein} unit="g" color="#22c55e" />
            <MacroBar label="Carbs" current={dayDetail.totalCarbs} target={dayDetail.targetCarbs} unit="g" color="#3b82f6" />
            <MacroBar label="Fat" current={dayDetail.totalFat} target={dayDetail.targetFat} unit="g" color="#8b5cf6" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="flex items-center gap-1 text-xs text-text-secondary">
                <Droplet className="h-3.5 w-3.5" /> Nước
              </p>
              <p className="text-lg font-bold text-foreground">
                {dayDetail.waterMl != null ? (dayDetail.waterMl / 1000).toFixed(1) : "-"} / {(dayDetail.waterTarget / 1000).toFixed(1)} L
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="flex items-center gap-1 text-xs text-text-secondary">
                <TrendingUp className="h-3.5 w-3.5" /> Tuần này
              </p>
              <p className="text-lg font-bold text-foreground">
                {dayDetail.weekAdherencePercent != null ? Math.round(dayDetail.weekAdherencePercent) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Nhật ký bữa ăn (timeline theo bữa) ===== */}
      {dayDetail && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Nhật ký bữa ăn</h3>
          <div className="flex flex-col gap-3">
            {dayDetail.slots.map((slot) => {
              const meta = STATUS_META[slot.status]
              const canLog = slot.actualItemName == null && slot.status !== "PLANNED"
              return (
                <div key={slot.mealType} className="rounded-lg border border-border p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-text-secondary">{slot.time}</p>
                    <Badge className={meta.badge} variant="outline">
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground">{slot.mealTypeLabel}</p>
                  {slot.plannedDishName && (
                    <p className="text-xs text-text-secondary">Gợi ý: {slot.plannedDishName}</p>
                  )}
                  {slot.actualItemName ? (
                    <p className="mt-1 text-sm text-foreground">
                      {slot.actualItemName} — {Math.round(slot.actualCalories ?? 0)} kcal
                    </p>
                  ) : slot.status === "PLANNED" ? (
                    <p className="mt-1 text-sm text-text-secondary">Chưa tới giờ ăn.</p>
                  ) : (
                    <p className="mt-1 text-sm text-destructive">Không có dữ liệu bữa này.</p>
                  )}
                  {canLog && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-auto p-0 text-primary hover:bg-transparent hover:underline"
                      onClick={() => openAddDialog(slot)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Ghi món đã ăn
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Dialog open={!!addDialogSlot} onOpenChange={(open) => !open && setAddDialogSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{addDialogSlot?.mealTypeLabel}</DialogTitle>
          </DialogHeader>

          <Tabs value={logMode} onValueChange={(v) => setLogMode(v as "manual" | "catalog")}>
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="manual">
                Nhập tay
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="catalog">
                Chọn từ danh sách món ăn
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {logMode === "manual" ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Tên món</label>
                <Input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder={addDialogSlot?.plannedDishName ?? "VD: Cơm gà"}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-text-secondary">Số calo thực tế (kcal)</label>
                <Input
                  type="number"
                  min={0}
                  value={addCalories}
                  onChange={(e) => setAddCalories(e.target.value)}
                  placeholder="VD: 550"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <Input
                  className="pl-8"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="Tìm món ăn..."
                />
              </div>
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {isFetchingDishes && (
                  <p className="py-2 text-center text-sm text-text-secondary">Đang tìm...</p>
                )}
                {!isFetchingDishes && (dishOptions ?? []).length === 0 && (
                  <p className="py-2 text-center text-sm text-text-secondary">Không tìm thấy món ăn nào.</p>
                )}
                {(dishOptions ?? []).map((dish) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => setSelectedDishId(dish.id)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left hover:bg-muted",
                      selectedDishId === dish.id && "border-primary bg-primary/10",
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{dish.name}</span>
                    <span className="text-xs text-text-secondary">{Math.round(dish.calories)} kcal</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogSlot(null)}>
              Hủy
            </Button>
            <Button
              onClick={() => addMutation.mutate()}
              disabled={
                addMutation.isPending || (logMode === "manual" ? !addCalories : !selectedDishId)
              }
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
