import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format, subDays } from "date-fns"
import { CheckCircle2, ChevronDown, Clock, Dumbbell, Trophy, XCircle } from "lucide-react"

import { getWorkoutSessionDetail, getWorkoutSessions } from "@/api/workout-log.api"
import { Badge } from "@/components/shared/ui/badge"
import { cn } from "@/lib/utils"
import { SetStatus, WorkoutSessionSummary } from "@/types/history.type"

function ringColor(percent: number) {
  if (percent >= 90) return "#22c55e"
  if (percent >= 60) return "#f59e0b"
  return "#ef4444"
}

interface CompletionRingProps {
  percent: number
  size?: number
  strokeWidth?: number
}

function CompletionRing({ percent, size = 64, strokeWidth = 6 }: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, percent) / 100) * circumference
  const color = ringColor(percent)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>
        {Math.round(percent)}%
      </span>
    </div>
  )
}

const SET_STATUS_META: Record<SetStatus, { icon: JSX.Element; label: string }> = {
  MATCH: { icon: <CheckCircle2 className="h-4 w-4 text-success" />, label: "" },
  MISMATCH: { icon: <XCircle className="h-4 w-4 text-destructive" />, label: "" },
  AI_MISMATCH: { icon: <XCircle className="h-4 w-4 text-destructive" />, label: "AI" },
}

function SessionDetailPanel({ workoutDayId, date }: { workoutDayId: number; date: string }) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ["workout-session-detail", workoutDayId, date],
    queryFn: () => getWorkoutSessionDetail(workoutDayId, date),
    select: (res) => res?.data,
  })

  if (isLoading) return <p className="py-4 text-center text-sm text-text-secondary">Đang tải...</p>
  if (!detail) return null

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      {detail.exercises.map((ex) => (
        <div key={ex.exerciseId} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Dumbbell className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{ex.exerciseName}</p>
                <p className="text-xs text-text-secondary">{ex.muscleGroupLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-secondary">
                {ex.setsCompleted}/{ex.setsTarget} sets
                {ex.repsPerSetTarget != null && ` · ${ex.repsPerSetTarget} reps/set`}
              </span>
              <CompletionRing percent={ex.completionPercent} size={44} strokeWidth={5} />
            </div>
          </div>

          {ex.sets.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-text-secondary">
                    <th className="pb-2 pr-4">Set</th>
                    <th className="pb-2 pr-4">Tạ</th>
                    <th className="pb-2 pr-4">Target</th>
                    <th className="pb-2 pr-4">AI nhận diện</th>
                    <th className="pb-2">Nhận xét</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ex.sets.map((set) => {
                    const meta = SET_STATUS_META[set.status]
                    return (
                      <tr key={set.setNumber}>
                        <td className="py-2 pr-4 text-text-secondary">S{set.setNumber}</td>
                        <td className="py-2 pr-4 text-foreground">{set.weight != null ? `${set.weight} kg` : "-"}</td>
                        <td className="py-2 pr-4 text-text-secondary">{set.targetReps != null ? `${set.targetReps} reps` : "-"}</td>
                        <td className={cn("py-2 pr-4 font-semibold", set.matchesTarget ? "text-success" : "text-destructive")}>
                          {set.actualReps != null ? `${set.actualReps} reps` : "-"}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-1.5">
                            {meta.icon}
                            {meta.label && (
                              <Badge className="bg-amber-500/15 text-amber-600" variant="outline">
                                {meta.label} ⚠
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SessionCard({ session }: { session: WorkoutSessionSummary }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <button className="flex w-full items-center gap-4 text-left" onClick={() => setExpanded((v) => !v)}>
        <CompletionRing percent={session.completionPercent} />
        <div className="flex-1">
          <p className="font-semibold text-foreground">{session.sessionLabel}</p>
          {session.planName && <p className="text-xs text-text-secondary">{session.planName}</p>}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {session.startTime}
            </span>
            <span>{session.durationMinutes} phút</span>
            <span>
              {session.setsCompleted}/{session.setsTarget} sets
            </span>
            <span>
              {session.repsCompleted}/{session.repsTarget} reps
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {session.prExerciseName && session.prWeightGain != null && (
            <span className="flex items-center gap-1 text-sm font-semibold text-success">
              <Trophy className="h-4 w-4" /> +{session.prWeightGain} kg PR
            </span>
          )}
          <span className="text-sm font-bold text-foreground">{Math.round(session.volumeKg)} kg</span>
          <span className="text-xs text-text-secondary">Volume</span>
        </div>
        <ChevronDown className={cn("h-5 w-5 text-text-secondary transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="mt-4">
          <SessionDetailPanel workoutDayId={session.workoutDayId} date={session.date} />
        </div>
      )}
    </div>
  )
}

export function WorkoutSessionLog() {
  const range = useMemo(() => {
    const to = new Date()
    const from = subDays(to, 30)
    return { from: format(from, "dd/MM/yyyy"), to: format(to, "dd/MM/yyyy") }
  }, [])

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["workout-sessions", range.from, range.to],
    queryFn: () => getWorkoutSessions(range.from, range.to),
    select: (res) => res?.data ?? [],
  })

  if (isLoading) return <p className="py-8 text-center text-text-secondary">Đang tải...</p>

  if (!sessions || sessions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-text-secondary">
        Chưa có buổi tập nào được log trong 30 ngày gần đây.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((session) => (
        <SessionCard key={`${session.workoutDayId}-${session.date}`} session={session} />
      ))}
    </div>
  )
}
