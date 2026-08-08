import { ExerciseCard } from "@/components/features/exercises/ExerciseCard"
import { ExerciseSearchForm } from "@/components/features/exercises/ExercisesSearchForm"
import { CoreformEmptyState, CoreformLoadingState } from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { useGetListExercises } from "@/hooks/queries/exercises/useGetListExercises"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { Dumbbell } from "lucide-react"
import { useEffect, useState } from "react"

export function UserExerciseList() {
  const [searchParams, setSearchParams] = useState<ExerciseSearchParams>({ page: 0, size: 9 })
  const {
    data: dataListExercises,
    isFetching: isFetchingExercises,
    refetch: refetchExercises,
  } = useGetListExercises(searchParams)

  const hasResults = dataListExercises?.data && dataListExercises.data.length > 0
  const pagination = dataListExercises?.pagination
  const currentPage = (searchParams.page || 0) + 1
  const totalPages = pagination?.totalPages || 0

  useEffect(() => {
    refetchExercises()
  }, [searchParams, refetchExercises])

  const handlePageChange = (page: number) => {
    setSearchParams((previous) => ({ ...previous, page: page - 1 }))
  }

  return (
    <div className="space-y-8 text-earth">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-earth via-clay to-earth p-8 text-cream shadow-lg shadow-earth/20 sm:p-10">
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold text-cream backdrop-blur-sm">
            Thư viện luyện tập
          </span>
          <h1 className="text-[30px] font-bold leading-[36px] tracking-tight text-cream sm:text-[34px] sm:leading-[40px]">
            Danh sách bài tập
          </h1>
          <p className="max-w-xl text-base font-medium leading-6 text-cream/85 sm:text-lg">
            Khám phá thư viện bài tập và tinh chỉnh kỹ thuật với AI.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-cream/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-clay/30 blur-3xl" />
      </div>

      <div className="rounded-3xl border border-sand/60 bg-white p-4 shadow-sm shadow-earth/5 md:p-6">
        <ExerciseSearchForm onSearch={setSearchParams} />
      </div>

      {isFetchingExercises ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-sand/60 bg-white p-12 shadow-sm shadow-earth/5">
          <CoreformLoadingState />
        </div>
      ) : !hasResults ? (
        <div className="rounded-3xl border border-sand/60 bg-white p-12 shadow-sm shadow-earth/5">
          <CoreformEmptyState
            icon={Dumbbell}
            title="Không tìm thấy bài tập"
            description="Không có bài tập nào phù hợp với từ khóa tìm kiếm. Thử điều chỉnh bộ lọc."
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dataListExercises.data.map((exercise) => (
              <div key={exercise.id} className="transition-all duration-300 hover:-translate-y-1">
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
