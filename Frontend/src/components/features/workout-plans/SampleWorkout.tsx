import { CoreformEmptyState, CoreformLoadingState } from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ROUTES } from "@/constants/routes"
import { useCopyPlan } from "@/hooks/queries/workout-plan/useCopyPlan"
import { useGetSamplePlan } from "@/hooks/queries/workout-plan/useGetSamplePlans"
import authStore from "@/stores/auth.store"
import { PlanListResponse, WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { toast } from "sonner"
import { WorkoutCard } from "./WorkoutCard"
import { WorkoutsSearchForm } from "./WorkoutsSearchForm"

export const SampleWorkout = () => {
  const navigate = useNavigate()
  const isAdmin = authStore.use.auth().role?.name === "ADMIN"
  const [searchParams, setSearchParams] = useState<WorkoutPlanSearchParams>({
    page: 0,
    limit: 12,
  })

  const {
    data: samplePlansData,
    isFetching: isFetchingSamplePlans,
    refetch: refetchSamplePlans,
  } = useGetSamplePlan(searchParams)

  const { mutate: copyPlan, isPending: isPendingCopy, variables: cloningPlanId } = useCopyPlan({
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

  const handleClonePlan = (plan: PlanListResponse) => {
    if (isAdmin) {
      navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: plan.id.toString() }))
    } else {
      copyPlan(plan.id.toString())
    }
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1,
    }))
  }

  return (
    <div className="space-y-8">
      <WorkoutsSearchForm onSearch={setSearchParams} />

      {isFetchingSamplePlans ? (
        <CoreformLoadingState />
      ) : !hasResults ? (
        <CoreformEmptyState
          icon={Calendar}
          title="Không tìm thấy kế hoạch nào"
          description="Không có kế hoạch nào phù hợp với tiêu chí tìm kiếm."
        />
      ) : (
        <>
          <div>
            <h3 className="font-display mb-5 text-lg font-medium text-foreground">Tất cả kế hoạch</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {samplePlansData.data.map((plan) => (
                <WorkoutCard
                  key={plan.id}
                  plan={plan}
                  showFeaturedIcon={false}
                  onViewDetail={() => handleWorkoutClick(plan)}
                  onClone={handleClonePlan}
                  isCloning={isPendingCopy && cloningPlanId === plan.id.toString()}
                />
              ))}
            </div>
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
