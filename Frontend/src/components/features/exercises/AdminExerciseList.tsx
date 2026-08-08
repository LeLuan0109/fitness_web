import { AdminExerciseCard } from "@/components/features/exercises/AdminExerciseCard"
import { ExerciseSearchForm } from "@/components/features/exercises/ExercisesSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { Button } from "@/components/shared/ui/button"
import { ROUTES } from "@/constants/routes"
import { useGetListExercises } from "@/hooks/queries/exercises/useGetListExercises"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { Dumbbell, Plus, Loader2, LibraryBig } from "lucide-react"
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
    <div className="w-full space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <LibraryBig className="size-3.5" /> Thư viện vận động
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý bài tập</h1>
            <p className="mt-2 text-sm text-primary-foreground/80">Quản lý thư viện, cấp độ và nhóm cơ của từng bài tập.</p>
          </div>
          <Button onClick={handleCreateExercise} className="gap-2 bg-white text-primary shadow-md hover:bg-white/90">
            <Plus className="size-4" /> Tạo bài tập
          </Button>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <ExerciseSearchForm onSearch={setSearchParams} />
      </div>

      {isFetchingExercises ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Dumbbell className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Không tìm thấy bài tập</h3>
          <p className="mt-2 max-w-md text-sm text-slate-500">Không có bài tập nào phù hợp. Hãy thử điều chỉnh bộ lọc.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
