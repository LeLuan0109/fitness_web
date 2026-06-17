import { ROUTES } from "@/constants/routes"
import { useGetSamplePlan } from "@/hooks/queries/workout-plan/useGetSamplePlans"
import { PlanListResponse, WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { useEffect, useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { WorkoutCard } from "./WorkoutCard"
import { WorkoutsSearchForm } from "./WorkoutsSearchForm"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { Calendar, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/shared/ui/card"

export const SampleWorkout = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<WorkoutPlanSearchParams>({
    page: 0,
    limit: 12,
  })

  const {
    data: samplePlansData,
    isFetching: isFetchingSamplePlans,
    refetch: refetchSamplePlans,
  } = useGetSamplePlan(searchParams)

  // Pagination logic
  const hasResults = samplePlansData?.data && samplePlansData.data.length > 0
  const pagination = samplePlansData?.pagination
  const currentPage = (searchParams?.page || 0) + 1
  const totalPages = pagination?.totalPages || 0

  useEffect(() => {
    refetchSamplePlans()
  }, [searchParams, refetchSamplePlans])

  const handleWorkoutClick = (plan: PlanListResponse) => {
    navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: plan.id.toString() }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1, // Convert 1-based to 0-based
    }))
  }

  return (
    <div className="space-y-6">
      <WorkoutsSearchForm onSearch={setSearchParams} />

      {isFetchingSamplePlans ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !hasResults ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Không tìm thấy kế hoạch nào</h3>
            <p className="text-muted-foreground mb-4">Không có kế hoạch nào phù hợp với tiêu chí tìm kiếm</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h3 className="mb-4">Tất cả kế hoạch</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {samplePlansData.data.map((plan) => (
                <WorkoutCard
                  key={plan.id}
                  plan={plan}
                  showFeaturedIcon={false}
                  onViewDetail={() => handleWorkoutClick(plan)}
                />
              ))}
            </div>
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
