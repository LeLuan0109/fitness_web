import { ExerciseCard } from "@/components/features/exercises/ExerciseCard"
import { ExerciseSearchForm } from "@/components/features/exercises/ExercisesSearchForm"
import {
  CoreformEmptyState,
  CoreformLoadingState,
  CoreformPageHeader,
  CoreformPrimaryButton,
} from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ROUTES } from "@/constants/routes"
import { useGetListExercises } from "@/hooks/queries/exercises/useGetListExercises"
import authStore from "@/stores/auth.store"
import { Role } from "@/types/enum"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { Dumbbell, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export const ExerciseList = () => {
  const [searchParams, setSearchParams] = useState<ExerciseSearchParams>({ page: 0, size: 9 })
  const {
    data: dataListExercises,
    isFetching: isFetchingExercises,
    refetch: refetchExercises,
  } = useGetListExercises(searchParams)
  const isAdmin = authStore.use.auth().role.name === Role.ADMIN
  const navigate = useNavigate()

  const hasResults = dataListExercises?.data && dataListExercises.data.length > 0

  const pagination = dataListExercises?.pagination
  const currentPage = (searchParams?.page || 0) + 1
  const totalPages = pagination?.totalPages || 0

  useEffect(() => {
    if (searchParams) {
      refetchExercises()
    }
  }, [searchParams, refetchExercises])

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1,
    }))
  }

  const handleCreateExercise = () => {
    navigate(ROUTES.EXERCISES.CREATE)
  }

  return (
    <div className="space-y-8">
      <CoreformPageHeader
        title="Danh sách bài tập"
        description="Khám phá thư viện bài tập và tinh chỉnh kỹ thuật với AI."
        action={
          isAdmin ? (
            <CoreformPrimaryButton onClick={handleCreateExercise}>
              <Plus className="size-4" /> Tạo bài tập
            </CoreformPrimaryButton>
          ) : undefined
        }
      />

      <ExerciseSearchForm onSearch={setSearchParams} />

      {isFetchingExercises ? (
        <CoreformLoadingState />
      ) : !hasResults ? (
        <CoreformEmptyState
          icon={Dumbbell}
          title="Không tìm thấy bài tập"
          description="Không có bài tập nào phù hợp với từ khóa tìm kiếm. Thử điều chỉnh bộ lọc."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dataListExercises.data.map((exercise) => (
              <ExerciseCard
                id={exercise.id.toString()}
                key={exercise.id}
                title={exercise.name}
                description={exercise.description}
                muscleGroups={exercise.muscleGroups}
                difficulty={exercise.level}
                imageUrl={exercise.thumbnail}
              />
            ))}
          </div>

          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pagination?.pageSize || 10}
            total={pagination?.total || 0}
            className="mt-8"
          />
        </>
      )}
    </div>
  )
}
