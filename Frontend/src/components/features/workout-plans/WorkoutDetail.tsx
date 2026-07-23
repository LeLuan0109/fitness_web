import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { ScrollArea } from "@/components/shared/ui/scroll-area"
import { Separator } from "@/components/shared/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useCopyPlan } from "@/hooks/queries/workout-plan/useCopyPlan"
import { useDeletePlan } from "@/hooks/queries/workout-plan/useDeletePlan"
import { useDetailPlan } from "@/hooks/queries/workout-plan/useDetailPlan"
import authStore from "@/stores/auth.store"
import { PlanDayResponse } from "@/types/workout-plan.type"
import { getDifficultyColor, getGoalColor, getLevelName } from "@/utils/utils"
import { getFitnessGoalName } from "@/utils/workout-plan.util"
import {
  Calendar,
  CheckCheckIcon,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit,
  Flame,
  Loader2,
  RotateCcw,
  Star,
  Target,
  TrashIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { generatePath, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { RecordSetDialog } from "../record-set-dialog/RecordSetDialog"
import { WorkoutCompletionDialog } from "../workout-completion-dialog/WorkoutCompletionDialog"

export const WorkoutDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: dataDetailPlan, isFetching, error, refetch: refetchDetailPlan } = useDetailPlan(id)
  const { isOpen: isOpenRecordSet, onOpenChange: onOpenRecordSetDialog } = useDisclosure()
  const isAdmin = authStore.use.auth().role?.name === "ADMIN"
  const [hasStarted, setHasStarted] = useState(false) // ⭐ Thêm state kiểm tra đã bắt đầu
  const [selectedExercise, setSelectedExercise] = useState<{
    name: string
    id: number
    previousSets?: number
    workoutDayId: number
  } | null>(null)
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set())
  const { isOpen: isOpenWorkoutCompletion, onOpenChange: onOpenWorkoutCompletionDialog } = useDisclosure()
  const { isOpen: isOpenDeleteConfirmDialog, onOpenChange: onOpenDeleteConfirmDialogChange } = useDisclosure()
  const [exercisesPracticedCount, setExercisesPracticedCount] = useState<number>(0)
  const [caloriesBurnedTotal, setCaloriesBurnedTotal] = useState<number>(0)

  const handleOpenWorkoutCompletion = (open: boolean, day?: PlanDayResponse) => {
    if (open && day) {
      const exercises = day.exercises ?? []
      const practiced = exercises.reduce((acc: number, ex: any) => acc + (ex.logs && ex.logs.length > 0 ? 1 : 0), 0)
      const calories = exercises.reduce(
        (sum: number, ex: any) =>
          sum +
          (Array.isArray(ex.logs) ? ex.logs.reduce((s: number, l: any) => s + (Number(l.caloriesBurned) || 0), 0) : 0),
        0,
      )
      setExercisesPracticedCount(practiced)
      setCaloriesBurnedTotal(calories)
    }
    onOpenWorkoutCompletionDialog(open)
  }

  const { mutate: copyPlan, isPending: isPendingCopy } = useCopyPlan({
    config: {
      onSuccess: (data) => {
        toast.success("Đã sao chép lịch tập thành công!")
        navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: data.data }))
      },
      onError: () => {
        toast.error("Sao chép lịch tập thất bại!")
      },
    },
  })

  const { mutate: deletePlan } = useDeletePlan({
    config: {
      onSuccess: () => {
        toast.success("Xóa lịch tập thành công!")
        if (isAdmin) {
          navigate(ROUTES.WORKOUTS.SAMPLE_LIST)
        } else {
          navigate(ROUTES.WORKOUTS.MY_LIST)
        }
      },
      onError: () => {
        toast.error("Xóa lịch tập thấy bại!")
      },
    },
  })

  useEffect(() => {
    if (dataDetailPlan?.startDate) {
      let startDate: Date

      if (typeof dataDetailPlan.startDate === "string") {
        const [day, month, year] = dataDetailPlan.startDate.split("/").map(Number)
        startDate = new Date(year, month - 1, day) // month is 0-indexed
      } else {
        startDate = new Date(dataDetailPlan.startDate)
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      startDate.setHours(0, 0, 0, 0)

      setHasStarted(startDate <= today)
    }
  }, [dataDetailPlan])

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !dataDetailPlan) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Không thể tải thông tin kế hoạch tập luyện</p>
      </div>
    )
  }

  const handleCopyPlan = () => {
    if (!isAdmin) {
      copyPlan(id)
    } else {
      navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: dataDetailPlan.id.toString() }))
    }
  }

  const handleDeletePlan = (id: string) => {
    deletePlan(id)
  }

  const handleExerciseDetail = (exerciseId: number) => {
    navigate(generatePath(ROUTES.EXERCISES.DETAIL, { id: exerciseId.toString() }))
  }

  const handleStartExercise = (exercise: { exerciseName: string; exerciseId: number }, workoutDayId: number) => {
    // Find the specific day and exercise to count only logs for this day
    const currentDay = dataDetailPlan.weeks.flatMap((week) => week.days).find((day) => day.id === workoutDayId)

    const currentExercise = currentDay?.exercises.find((ex) => ex.exerciseId === exercise.exerciseId)
    const previousSets = currentExercise?.logs?.length ?? 0

    console.log("previousSets", previousSets)
    setSelectedExercise({ name: exercise.exerciseName, id: exercise.exerciseId, previousSets, workoutDayId })
    onOpenRecordSetDialog(true)
  }

  const toggleExerciseExpand = (exerciseKey: string) => {
    const newExpanded = new Set(expandedExercises)
    if (newExpanded.has(exerciseKey)) {
      newExpanded.delete(exerciseKey)
    } else {
      newExpanded.add(exerciseKey)
    }
    setExpandedExercises(newExpanded)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Quay lại
        </Button>
        <div className="flex gap-2">
          {!dataDetailPlan.isDefault && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: dataDetailPlan.id.toString() }))}
              >
                <Edit /> Chỉnh sửa
              </Button>
            </>
          )}
          {dataDetailPlan.isDefault && (
            <Button onClick={handleCopyPlan} disabled={isPendingCopy}>
              {isPendingCopy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Copy className="w-4 h-4 mr-2" />}
              {!isAdmin ? "Sao chép và chỉnh sửa" : "Chinh sửa kế hoạch mẫu"}
            </Button>
          )}
          {(isAdmin || !dataDetailPlan.isDefault) && (
            <Button variant="destructive" onClick={() => onOpenDeleteConfirmDialogChange(true)}>
              <TrashIcon /> Xóa
            </Button>
          )}
        </div>
      </div>

      {/* ⭐ Thông báo nếu kế hoạch chưa bắt đầu */}
      {!dataDetailPlan.isDefault && !hasStarted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ℹ️ Kế hoạch này chưa bắt đầu (Ngày bắt đầu: {dataDetailPlan.startDate}). Các chức năng ghi log và tổng kết
            sẽ được kích hoạt khi đến ngày bắt đầu.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{dataDetailPlan.name}</CardTitle>
                {dataDetailPlan.isDefault && <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />}
              </div>
              <CardDescription className="text-base mt-2">
                {dataDetailPlan.description || "Chưa có mô tả cho kế hoạch này"}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(dataDetailPlan.difficultyLevel)} variant="outline">
              {getLevelName(dataDetailPlan.difficultyLevel)}
            </Badge>
            <Badge className={getGoalColor(dataDetailPlan.targetGoal)} variant="outline">
              {getFitnessGoalName(dataDetailPlan.targetGoal)}
            </Badge>
            {dataDetailPlan.isDefault && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                Mặc định
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Thời gian</p>
              <p className="font-medium">{dataDetailPlan.durationWeek} tuần</p>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg">
              <Target className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Ngày/tuần</p>
              <p className="font-medium">{dataDetailPlan.daysPerWeek} ngày</p>
            </div>
            {!dataDetailPlan.isDefault && (
              <div className="p-4 bg-accent/50 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                <p className="font-medium">{dataDetailPlan.startDate}</p>
              </div>
            )}
            {/* {dataDetailPlan.isDefault && (
              <div className="p-4 bg-accent/50 rounded-lg">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Người dùng</p>
                <p className="font-medium">{dataDetailPlan.totalUsers?.toLocaleString() || "Chưa có"}</p>
              </div>
            )} */}
          </div>

          <Separator />

          {/* Week Schedule */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Lịch tập chi tiết
            </h3>

            {dataDetailPlan.weeks && dataDetailPlan.weeks.length > 0 ? (
              <Tabs defaultValue="week1" className="w-full">
                <TabsList>
                  {dataDetailPlan.weeks.map((week) => (
                    <TabsTrigger key={week.weekNumber} value={`week${week.weekNumber}`}>
                      Tuần {week.weekNumber}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {dataDetailPlan.weeks.map((week) => (
                  <TabsContent key={week.weekNumber} value={`week${week.weekNumber}`} className="mt-4">
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <div className="space-y-3">
                        {week.days && week.days.length > 0 ? (
                          week.days.map((day, dayIdx) => (
                            <div key={dayIdx} className="space-y-2">
                              {/* Day Header */}
                              <div className="rounded-xl border border-sand/60 bg-earth p-3 text-cream flex items-center justify-between">
                                <h4 className="font-medium">
                                  {`Buổi ${dayIdx + 1}`}
                                </h4>
                                {!dataDetailPlan.isDefault && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-clay hover:bg-earth text-cream px-3 py-1 text-xs"
                                    onClick={() => handleOpenWorkoutCompletion(true, day)}
                                    disabled={!hasStarted}
                                    title={!hasStarted ? "Chưa đến ngày bắt đầu" : ""}
                                  >
                                    <CheckCheckIcon />
                                    Tổng kết
                                  </Button>
                                )}
                              </div>

                              {/* Exercises */}
                              {day.exercises && day.exercises.length > 0 ? (
                                day.exercises.map((exercise, exIdx) => {
                                  const exerciseKey = `${dayIdx}-${exIdx}`
                                  const isExpanded = expandedExercises.has(exerciseKey)

                                  return (
                                    <div key={exIdx} className="ml-4 overflow-hidden rounded-xl border border-sand/60 bg-cream/60 text-earth">
                                      {/* Exercise Header */}
                                      <div className="p-3 flex items-center justify-between">
                                        <div
                                          className="flex items-center gap-3 flex-1 cursor-pointer"
                                          onClick={() => !dataDetailPlan.isDefault && toggleExerciseExpand(exerciseKey)}
                                        >
                                          <div className="flex-1">
                                            <p className="font-medium text-sm">{exercise.exerciseName}</p>
                                            <div className="text-xs text-earth/60 flex gap-2">
                                              {exercise.sets && <span>{exercise.sets} sets</span>}
                                              {exercise.reps && <span>x {exercise.reps} reps</span>}
                                              {exercise.weight && <span>{exercise.weight}kg</span>}
                                              {exercise.duration && <span>{exercise.duration}s</span>}
                                            </div>
                                          </div>
                                          {!dataDetailPlan.isDefault && (
                                            <ChevronDown
                                                className={`w-4 h-4 text-earth/50 transition-transform ${
                                                isExpanded ? "rotate-180" : ""
                                              }`}
                                            />
                                          )}
                                        </div>

                                        <div className="flex gap-2 ml-2">
                                          {!dataDetailPlan.isDefault && (
                                            <Button
                                              size="sm"
                                              onClick={() => handleStartExercise(exercise, day.id)}
                                              className="bg-clay hover:bg-earth text-cream px-3 py-1 text-xs"
                                              disabled={!hasStarted}
                                              title={!hasStarted ? "Chưa đến ngày bắt đầu" : ""}
                                            >
                                              <RotateCcw className="w-3 h-3 mr-1" />
                                              Ghi log
                                            </Button>
                                          )}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleExerciseDetail(exercise.exerciseId)}
                                            className="border-sand/70 text-earth hover:bg-earth hover:text-cream px-3 py-1 text-xs"
                                          >
                                            Chi tiết
                                            <ChevronRight className="w-3 h-3 ml-1" />
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Exercise Logs (only for non-default plans) */}
                                      {!dataDetailPlan.isDefault && isExpanded && (
                                        <div className="px-3 pb-3">
                                          <div className="rounded-lg border border-sand/50 bg-white p-2 space-y-1">
                                            {(exercise.logs ?? []).map((log, logIdx) => (
                                              <div key={logIdx} className="text-xs text-earth/65">
                                                [Set {log.setNumber}]: {log.reps} reps / [Calo đốt cháy]:{" "}
                                                {log.caloriesBurned}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })
                              ) : (
                                <p className="text-muted-foreground text-sm">Chưa có bài tập nào</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">Chưa có lịch tập cho tuần này</p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Chưa có lịch tập chi tiết</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <RecordSetDialog
        open={isOpenRecordSet}
        onOpenChange={onOpenRecordSetDialog}
        exerciseName={selectedExercise?.name || ""}
        previousSets={selectedExercise?.previousSets ?? 0}
        onSave={() => {
          refetchDetailPlan()
        }}
        data={{
          exerciseId: selectedExercise?.id,
          workoutDayId: selectedExercise?.workoutDayId,
          reps: null,
          duration: null,
          setNumber: selectedExercise?.previousSets ?? 0,
          weight: null,
        }}
      />
      <WorkoutCompletionDialog
        open={isOpenWorkoutCompletion}
        onOpenChange={onOpenWorkoutCompletionDialog}
        exercisesPracticed={exercisesPracticedCount}
        caloriesBurned={caloriesBurnedTotal}
      />
      <ConfirmDialog
        open={isOpenDeleteConfirmDialog}
        onOpenChange={onOpenDeleteConfirmDialogChange}
        content="Bạn có chắc muốn xóa lịch tập này?"
        variant="destructive"
        onConfirm={() => {
          handleDeletePlan(dataDetailPlan.id.toString())
        }}
      />
    </div>
  )
}
