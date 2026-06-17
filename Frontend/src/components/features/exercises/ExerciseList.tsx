import { ExerciseCard } from "@/components/features/exercises/ExerciseCard"
import { ExerciseSearchForm } from "@/components/features/exercises/ExercisesSearchForm"
import { Button } from "@/components/shared/ui/button"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { ROUTES } from "@/constants/routes"
import { useGetListExercises } from "@/hooks/queries/exercises/useGetListExercises"
import authStore from "@/stores/auth.store"
import { Role } from "@/types/enum"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { Loader2, Plus } from "lucide-react"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TypographyH3 variant="bold">Danh sách bài tập</TypographyH3>
        {isAdmin && (
          <Button onClick={handleCreateExercise}>
            <Plus /> Tạo bài tập
          </Button>
        )}
      </div>
      <ExerciseSearchForm onSearch={setSearchParams} />

      {isFetchingExercises ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !hasResults ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground text-lg">Không tìm thấy bài tập nào phù hợp với từ khóa tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Common Pagination */}
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
