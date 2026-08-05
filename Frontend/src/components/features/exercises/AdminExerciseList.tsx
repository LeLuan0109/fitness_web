import { AdminExerciseCard } from "@/components/features/exercises/AdminExerciseCard"
import { ExerciseSearchForm } from "@/components/features/exercises/ExercisesSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { Button } from "@/components/shared/ui/button"
import { ROUTES } from "@/constants/routes"
import { useGetListExercises } from "@/hooks/queries/exercises/useGetListExercises"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { Dumbbell, Plus, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export const AdminExerciseList = () => {
  const [searchParams, setSearchParams] = useState<ExerciseSearchParams>({ page: 0, size: 9 })
  const {
    data: dataListExercises,
    isFetching: isFetchingExercises,
    refetch: refetchExercises,
  } = useGetListExercises(searchParams)
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Danh sách bài tập</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý thư viện bài tập và tinh chỉnh kỹ thuật.
          </p>
        </div>
        <Button onClick={handleCreateExercise} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="size-4" /> Tạo bài tập
        </Button>
      </div>

      <ExerciseSearchForm onSearch={setSearchParams} />

      {isFetchingExercises ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center backdrop-blur-sm">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-primary">
            <Dumbbell className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Không tìm thấy bài tập</h3>
          <p className="mt-2 text-sm text-muted-foreground">Không có bài tập nào phù hợp với từ khóa tìm kiếm. Thử điều chỉnh bộ lọc.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dataListExercises.data.map((exercise) => (
              <AdminExerciseCard
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
