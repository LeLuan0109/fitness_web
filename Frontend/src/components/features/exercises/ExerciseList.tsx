import { ExerciseCard } from "@/components/features/exercises/ExerciseCard"
import { ExerciseSearchForm } from "@/components/features/exercises/ExercisesSearchForm"
import {
  CoreformEmptyState,
  CoreformLoadingState,
} from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ROUTES } from "@/constants/routes"
import { useGetListExercises } from "@/hooks/queries/exercises/useGetListExercises"
import authStore from "@/stores/auth.store"
import { Role } from "@/types/enum"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { Dumbbell, Plus } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useState } from "react"
import { useNavigate } from "react-router"

export const ExerciseList = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [filters, setFilters] = useState<Omit<ExerciseSearchParams, "page">>({
    size: 9,
  })
  const searchParams: ExerciseSearchParams = { ...filters, page: page - 1 }
  const {
    data: dataListExercises,
    isFetching: isFetchingExercises,
  } = useGetListExercises(searchParams)
  const isAdmin = authStore.use.auth().role.name === Role.ADMIN
  const navigate = useNavigate()

  const hasResults = dataListExercises?.data && dataListExercises.data.length > 0

  const pagination = dataListExercises?.pagination
  const currentPage = page
  const totalPages = pagination?.totalPages || 0


  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSearch = (params: Partial<Omit<ExerciseSearchParams, "page" | "size">>) => {
    setFilters((prev) => ({ ...prev, ...params }))
    setPage(1)
  }

  const handleCreateExercise = () => {
    navigate(ROUTES.EXERCISES.CREATE)
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner - Gradient xanh đại dương, hỗ trợ sáng/tối */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#1e3a8a] p-8 text-white shadow-lg shadow-blue-500/20 sm:p-10 dark:from-[#0284c7] dark:via-[#1d4ed8] dark:to-[#0f172a] dark:shadow-blue-900/40">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm dark:bg-sky-400/20">
              AI-Powered Fitness
            </span>
            <h1 className="text-[30px] font-bold leading-[36px] tracking-tight text-white sm:text-[34px] sm:leading-[40px]">
              Danh sách bài tập
            </h1>
            <p className="text-base font-medium leading-[24px] text-white/90 sm:text-lg max-w-xl">
              Khám phá thư viện bài tập và tinh chỉnh kỹ thuật với AI.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleCreateExercise}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-[#1e3a8a] shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] dark:bg-sky-100 dark:text-blue-900 dark:hover:bg-sky-200"
            >
              <Plus className="size-5" />
              Tạo bài tập
            </button>
          )}
        </div>

        {/* Decorative blur blobs - tone xanh đại dương */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#38bdf8]/30 blur-3xl dark:bg-sky-400/20" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#1e40af]/40 blur-3xl dark:bg-blue-900/50" />
        <div className="absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-[#0ea5e9]/20 blur-2xl dark:bg-cyan-500/10" />
      </div>

      {/* Search Form - Card surface hỗ trợ sáng/tối */}
      <div className="rounded-3xl border border-[#e5e5e5] bg-white p-4 shadow-sm md:p-6 dark:border-[#262626] dark:bg-[#171717]">
        <ExerciseSearchForm onSearch={handleSearch} />
      </div>

      {/* Loading State */}
      {isFetchingExercises ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#e5e5e5] bg-white p-12 shadow-sm dark:border-[#262626] dark:bg-[#171717]">
          <CoreformLoadingState />
        </div>
      ) : !hasResults ? (
        /* Empty State */
        <div className="rounded-3xl border border-[#e5e5e5] bg-white p-12 shadow-sm dark:border-[#262626] dark:bg-[#171717]">
          <CoreformEmptyState
            icon={Dumbbell}
            title="Không tìm thấy bài tập"
            description="Không có bài tập nào phù hợp với từ khóa tìm kiếm. Thử điều chỉnh bộ lọc."
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dataListExercises.data.map((exercise) => (
              <div
                key={exercise.id}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <ExerciseCard
                  id={exercise.id.toString()}
                  title={exercise.name}
                  description={exercise.description}
                  muscleGroups={exercise.muscleGroups}
                  difficulty={exercise.level}
                  imageUrl={exercise.thumbnail}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-4">
            <CommonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pagination?.pageSize || 10}
              total={pagination?.total || 0}
            />
          </div>
        </div>
      )}
    </div>
  )
}