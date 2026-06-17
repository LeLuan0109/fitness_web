import { ExerciseCard } from "@/components/features/history/ExerciseCard"
import { HistoryChart } from "@/components/features/history/HistoryChart"
import { StatCard } from "@/components/features/history/StatCard"
import { Button } from "@/components/shared/ui/button"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { SimpleDatePicker } from "@/components/shared/ui/simple-datepicker"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Tabs, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { TypographyH3, TypographyH5 } from "@/components/shared/ui/typography"
import { useGetExerciseOptions } from "@/hooks/queries/exercises/useGetExerciseOptions"
import { useGetWorkoutLogHistory } from "@/hooks/queries/workout-log/useGetWorkoutLogHistory"
import { useGetWorkoutLogStatistics } from "@/hooks/queries/workout-log/useGetWorkoutLogStatistics"
import { HistoryFilters, TimeFilter, WorkoutLogHistoryRequest } from "@/types/history.type"
import { getMonthRange, getWeekRange } from "@/utils/history.util"
import { formatDateddMMyyyy, removeEmptyValues } from "@/utils/utils"
import { Award, CalendarIcon, Dumbbell, Flame, Search } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

export function History() {
  const { start, end } = getWeekRange(new Date(), 1)
  const [filters, setFilters] = useState<HistoryFilters | undefined>()
  const [searchParams, setSearchParams] = useState<WorkoutLogHistoryRequest | undefined>({
    fromDate: formatDateddMMyyyy(start),
    toDate: formatDateddMMyyyy(end),
    exerciseId: null,
  })

  const form = useForm({
    defaultValues: {
      timeFilter: "this_week",
      fromDate: start,
      toDate: end,
      exerciseId: null,
    },
  })

  const { data: dataStatistics } = useGetWorkoutLogStatistics()
  const { data: dataHistory } = useGetWorkoutLogHistory(searchParams)

  const stats = {
    totalWorkouts: dataStatistics?.totalWorkouts ?? 0,
    totalCalories: dataStatistics?.totalCalories ?? 0,
    currentStreak: dataStatistics?.currentStreak ?? 0,
    longestStreak: dataStatistics?.longestStreak ?? 0,
  }

  const caloriesData =
    dataStatistics?.caloriesChart.map(({ date, value1 }) => ({
      date,
      value: value1,
    })) ?? []

  const volumeData =
    dataStatistics?.intensityChart.map(({ date, value1 }) => ({
      date,
      value: value1,
    })) ?? []

  const { data: dataExerciseOptions = [] } = useGetExerciseOptions()

  const handleTimeTabChange = (value: TimeFilter) => {
    form.setValue("timeFilter", value)
    const now = new Date()
    if (value === "this_week") {
      const { start, end } = getWeekRange(now, 1)
      form.setValue("fromDate", start)
      form.setValue("toDate", end)
      setFilters((s) => ({ ...s, timeFilter: value, fromDate: start, toDate: end }))
      setSearchParams((s) => ({ ...s, fromDate: formatDateddMMyyyy(start), toDate: formatDateddMMyyyy(end) }))
    } else if (value === "this_month") {
      const { start, end } = getMonthRange(now)
      form.setValue("fromDate", start)
      form.setValue("toDate", end)
      setFilters((s) => ({ ...s, timeFilter: value, fromDate: start, toDate: end }))
      setSearchParams((s) => ({ ...s, fromDate: formatDateddMMyyyy(start), toDate: formatDateddMMyyyy(end) }))
    } else {
      form.setValue("fromDate", null)
      form.setValue("toDate", null)
      setFilters((s) => ({ ...s, timeFilter: value }))
      setSearchParams((s) => ({ ...s, fromDate: null, toDate: null, exerciseId: null }))
    }
  }

  const handleSubmit = (values: HistoryFilters) => {
    setFilters({
      ...filters,
      timeFilter: (values.timeFilter as TimeFilter) ?? filters.timeFilter,
      fromDate: values.fromDate ?? filters.fromDate,
      toDate: values.toDate ?? filters.toDate,
      exerciseId: values.exerciseId || null,
    })
    const payload: WorkoutLogHistoryRequest = {
      fromDate: values.fromDate ? formatDateddMMyyyy(values.fromDate) : "",
      toDate: values.toDate ? formatDateddMMyyyy(values.toDate) : "",
      exerciseId: values.exerciseId ? Number(values.exerciseId) : null,
    }
    setSearchParams(removeEmptyValues(payload))
  }

  const isDisabledFromDate = form.watch("timeFilter") !== "all"
  const isDisabledToDate = form.watch("timeFilter") !== "all"

  return (
    <div className="space-y-6">
      {/* Title */}
      <TypographyH3 variant="bold">Nhật ký</TypographyH3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={<Dumbbell />}
          label="Tổng số buổi tập luyện"
          value={stats.totalWorkouts}
          iconColor="text-history-training"
        />
        <StatCard
          icon={<Flame />}
          label="Tổng số calo đã tiêu thụ"
          value={stats.totalCalories.toFixed(2)}
          iconColor="text-history-calories"
        />
        <StatCard icon={<Award />} label="Chuỗi hiện tại" value={stats.currentStreak} iconColor="text-history-points" />
        <StatCard icon={<Award />} label="Chuỗi dài nhất" value={stats.longestStreak} iconColor="text-history-points" />
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoryChart title="Thống kê lượng calo đã tiêu thụ" data={caloriesData} />
        <HistoryChart title="Thống kê cường độ tập luyện (Sets × Reps × Weight)" data={volumeData} />
      </div>
      {/* Filter Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-history-card-bg rounded-[20px] p-6">
          <Tabs
            value={form.watch("timeFilter") || filters.timeFilter}
            onValueChange={(v) => handleTimeTabChange(v as TimeFilter)}
          >
            <TabsList className="flex gap-4">
              <TabsTrigger value="this_week">Tuần này</TabsTrigger>
              <TabsTrigger value="this_month">Tháng này</TabsTrigger>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="p-2" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
            <SimpleField label="Ngày bắt đầu" name="fromDate" control={form.control} enableFormMessage={false}>
              {(field) => <SimpleDatePicker {...field} disabled={isDisabledFromDate} />}
            </SimpleField>

            <SimpleField label="Ngày kết thúc" name="toDate" control={form.control} enableFormMessage={false}>
              {(field) => <SimpleDatePicker {...field} disabled={isDisabledToDate} />}
            </SimpleField>

            <SimpleField label="Bài tập" name="exerciseId" control={form.control} enableFormMessage={false}>
              {(field) => (
                <CustomSelect
                  {...field}
                  options={dataExerciseOptions}
                  value={field.value}
                  onChange={field.onChange}
                  searchable
                />
              )}
            </SimpleField>

            <div>
              <Button type="submit" variant="secondary" className="w-full">
                <Search />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Exercise Logs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <TypographyH5 variant="bold" className="text-white">
            Thống kê
          </TypographyH5>
          <span className="text-muted-foreground text-sm">
            {dataHistory?.reduce((acc, log) => acc + (log.totalExercises || 0), 0) || 0} bài tập
          </span>
        </div>

        <div className="space-y-6">
          {dataHistory && dataHistory.length > 0 ? (
            dataHistory.map((log, index) => (
              <div
                key={log.date}
                className="space-y-3 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Date Header */}
                <div className="bg-history-date-header rounded-xl px-6 py-4 flex justify-between items-center border border-history-border-gray/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="text-white text-sm font-semibold">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
                    <Dumbbell className="w-3.5 h-3.5 text-primary" />
                    <span className="text-white text-xs font-medium">{log.totalExercises} Bài tập</span>
                  </div>
                </div>

                {/* Exercise Cards */}
                <div className="space-y-3">
                  {log.exercises.map((exercise) => (
                    <ExerciseCard key={exercise.exerciseId} exercise={exercise} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có dữ liệu lịch sử tập luyện</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
