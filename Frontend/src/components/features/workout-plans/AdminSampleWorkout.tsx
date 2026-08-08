import { CoreformEmptyState, CoreformLoadingState } from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ROUTES } from "@/constants/routes"
import { useGetSamplePlan } from "@/hooks/queries/workout-plan/useGetSamplePlans"
import type { PlanListResponse, WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { generatePath, useNavigate } from "react-router"
import { WorkoutCard } from "./WorkoutCard"
import { WorkoutsSearchForm } from "./WorkoutsSearchForm"

export function AdminSampleWorkout() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<WorkoutPlanSearchParams>({ page: 0, limit: 12 })
  const { data, isFetching, refetch } = useGetSamplePlan(searchParams)

  useEffect(() => {
    refetch()
  }, [searchParams, refetch])

  const plans = data?.data ?? []
  const pagination = data?.pagination

  const openDetail = (plan: PlanListResponse) => {
    navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: String(plan.id) }))
  }

  const editPlan = (plan: PlanListResponse) => {
    navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: String(plan.id) }))
  }

  return (
    <div className="space-y-7">
      <WorkoutsSearchForm onSearch={setSearchParams} appearance="admin" />

      {isFetching ? (
        <CoreformLoadingState />
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/[0.03] py-12">
          <CoreformEmptyState
            icon={Calendar}
            title="Không tìm thấy kế hoạch nào"
            description="Không có kế hoạch mẫu nào phù hợp với tiêu chí tìm kiếm."
          />
        </div>
      ) : (
        <>
          <div>
            <h3 className="mb-5 text-lg font-semibold text-foreground">Tất cả kế hoạch mẫu</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <WorkoutCard
                  key={plan.id}
                  plan={plan}
                  appearance="admin"
                  onViewDetail={() => openDetail(plan)}
                  onClone={editPlan}
                />
              ))}
            </div>
          </div>

          <CommonPagination
            currentPage={(searchParams.page ?? 0) + 1}
            totalPages={pagination?.totalPages ?? 0}
            onPageChange={(page) => setSearchParams((previous) => ({ ...previous, page: page - 1 }))}
            pageSize={pagination?.pageSize ?? 12}
            total={pagination?.total ?? 0}
            className="mt-8"
          />
        </>
      )}
    </div>
  )
}
