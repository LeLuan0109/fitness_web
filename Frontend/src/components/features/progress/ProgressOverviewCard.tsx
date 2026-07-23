import { dailyCheckin, getProgressOverview, logWeight } from "@/api/progress.api"
import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Progress } from "@/components/shared/ui/progress"
import { ProgressStatus } from "@/types/progress.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

const STATUS_META: Record<ProgressStatus, { label: string; className: string }> = {
  ON_TRACK: { label: "🟢 Đúng hướng", className: "bg-green-100 text-green-700 border-green-300" },
  CAUTION: { label: "🟡 Cần chú ý", className: "bg-amber-100 text-amber-700 border-amber-300" },
  OFF_TRACK: { label: "🔴 Chệch hướng", className: "bg-red-100 text-red-700 border-red-300" },
  NO_DATA: { label: "⚪ Chưa đủ dữ liệu", className: "bg-muted text-muted-foreground border-border" },
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  const m = STATUS_META[status] ?? STATUS_META.NO_DATA
  return <Badge variant="outline" className={m.className}>{m.label}</Badge>
}

export function ProgressOverviewCard() {
  const qc = useQueryClient()
  const [weight, setWeight] = useState("")
  const [water, setWater] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["progress-overview"],
    queryFn: () => getProgressOverview().then((r) => r.data),
  })

  const refetch = () => qc.invalidateQueries({ queryKey: ["progress-overview"] })

  const { mutate: saveWeight, isPending: savingWeight } = useMutation({
    mutationFn: () => logWeight({ weight: Number(weight) }),
    onSuccess: () => { toast.success("Đã ghi cân nặng"); setWeight(""); refetch() },
    onError: () => toast.error("Ghi cân nặng thất bại"),
  })

  const { mutate: saveWater } = useMutation({
    mutationFn: () => dailyCheckin({ waterMl: Number(water) }),
    onSuccess: () => { toast.success("Đã ghi lượng nước"); setWater(""); refetch() },
    onError: () => toast.error("Ghi nước thất bại"),
  })

  const { mutate: answerMenu } = useMutation({
    mutationFn: (followed: boolean) => dailyCheckin({ followedMenu: followed }),
    onSuccess: () => { toast.success("Đã ghi nhận"); refetch() },
    onError: () => toast.error("Lưu thất bại"),
  })

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader><CardTitle>Tiến độ so với mục tiêu</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">Đang tải...</p></CardContent>
      </Card>
    )
  }

  const { energy, weight: w, workout, overallStatus, message } = data

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Tiến độ so với mục tiêu</CardTitle>
        <StatusBadge status={overallStatus} />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Trụ 1: Năng lượng */}
          <div className="rounded-lg border p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Năng lượng (7 ngày)</span>
              <StatusBadge status={energy.status} />
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {energy.avgIntake} <span className="text-sm font-normal text-muted-foreground">/ {energy.targetCalories} kcal</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {energy.deficitSurplus >= 0 ? "Thặng dư" : "Thâm hụt"} {Math.abs(energy.deficitSurplus)} kcal · Duy trì {energy.tdee} · Xu hướng {energy.trend === "UP" ? "↑" : energy.trend === "DOWN" ? "↓" : "→"}
            </p>
            <p className="text-xs text-muted-foreground">💧 Nước: {energy.waterMlToday}/{energy.waterTarget} ml</p>
          </div>

          {/* Trụ 3: Cân nặng */}
          <div className="rounded-lg border p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Cân nặng → mục tiêu</span>
              <StatusBadge status={w.status} />
            </div>
            {w.hasData ? (
              <>
                <p className="text-2xl font-bold tabular-nums">
                  {w.current} <span className="text-sm font-normal text-muted-foreground">→ {w.target} kg</span>
                </p>
                <Progress value={w.progressPercent ?? 0} />
                <p className="text-xs text-muted-foreground">
                  Đã đi {w.progressPercent ?? 0}% {w.weeklyRate != null ? `· ${w.weeklyRate > 0 ? "+" : ""}${w.weeklyRate} kg/tuần` : ""}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu cân nặng/mục tiêu. Ghi cân nặng bên dưới.</p>
            )}
          </div>

          {/* Trụ 2: Tuân thủ tập */}
          <div className="rounded-lg border p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Tuân thủ tập (tuần này)</span>
              <StatusBadge status={workout.status} />
            </div>
            {workout.hasPlan ? (
              <>
                <p className="text-2xl font-bold tabular-nums">
                  {workout.sessionsThisWeek} <span className="text-sm font-normal text-muted-foreground">/ {workout.targetPerWeek} buổi</span>
                </p>
                <Progress value={workout.adherencePercent ?? 0} />
                <p className="text-xs text-muted-foreground truncate">Kế hoạch: {workout.planName}</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có kế hoạch cá nhân đang theo.</p>
            )}
          </div>
        </div>

        {/* Ghi nhanh: cân nặng, nước, tuân thủ thực đơn */}
        <div className="grid gap-3 md:grid-cols-3 border-t pt-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Cân nặng hôm nay (kg)</label>
              <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="VD: 78" />
            </div>
            <Button size="sm" disabled={!weight || savingWeight} onClick={() => saveWeight()}>Lưu</Button>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Nước uống hôm nay (ml)</label>
              <Input type="number" value={water} onChange={(e) => setWater(e.target.value)} placeholder="VD: 2000" />
            </div>
            <Button size="sm" variant="outline" disabled={!water} onClick={() => saveWater()}>Lưu</Button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Hôm nay ăn đúng khẩu phần thực đơn?</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => answerMenu(true)}>Có</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => answerMenu(false)}>Không</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
