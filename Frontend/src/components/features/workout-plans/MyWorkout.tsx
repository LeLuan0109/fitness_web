import {
  CoreformEmptyState,
  CoreformLoadingState,
  CoreformPageHeader,
  CoreformPrimaryButton,
} from "@/components/shared/coreform"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeletePlan } from "@/hooks/queries/workout-plan/useDeletePlan"
import { useGetMyPlans } from "@/hooks/queries/workout-plan/useGetMyPlans"
import { WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { Calendar, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { WorkoutCard } from "./WorkoutCard"
import { WorkoutsSearchForm } from "./WorkoutsSearchForm"

export const MyWorkout = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<WorkoutPlanSearchParams>({
    page: 0,
    limit: 12,
  })
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [deletingPlanId, setDeletingPlanId] = useState<number | undefined>()

  const { data: myPlansData, isFetching: isFetchingMyPlans, refetch: refetchMyPlans } = useGetMyPlans(searchParams)
  const { mutate: deletePlan } = useDeletePlan({
    config: {
      onSuccess: () => {
        toast.success("Kế hoạch đã được xóa thành công")
        refetchMyPlans()
      },
      onError: () => {
        toast.error("Xóa kế hoạch thất bại. Vui lòng thử lại sau.")
      },
      onSettled: () => {
        setDeletingPlanId(undefined)
      },
    },
  })

  const hasResults = myPlansData?.data && myPlansData.data.length > 0
  const pagination = myPlansData?.pagination
  const currentPage = (searchParams?.page || 0) + 1
  const totalPages = pagination?.totalPages || 0

  useEffect(() => {
    if (searchParams) {
      refetchMyPlans()
    }
  }, [searchParams, refetchMyPlans])

  const handleViewDetail = (plan: { id: number }) => {
    navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: plan.id.toString() }))
  }

  const handleEditPlan = (plan: { id: number }) => {
    navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: plan.id.toString() }))
  }

  const handleDeletePlan = (planId: number) => {
    setDeletingPlanId(planId)
    onOpen()
  }

  const handleConfirmDelete = () => {
    if (deletingPlanId) {
      deletePlan(deletingPlanId.toString())
    }
    onOpenChange(false)
  }

  const handleCancelDelete = () => {
    setDeletingPlanId(undefined)
    onOpenChange(false)
  }

  const handleSearch = (params: WorkoutPlanSearchParams) => {
    setSearchParams({
      ...params,
      page: 0,
    })
  }

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page - 1,
    }))
  }

  const navigateToCreatePlan = () => {
    navigate(ROUTES.WORKOUTS.CREATE)
  }

  return (
    <>
      <div className="space-y-8">
        <CoreformPageHeader
          title="Kế hoạch tập luyện của tôi"
          description="Quản lý và theo dõi lộ trình tập luyện cá nhân của bạn."
          action={
            <CoreformPrimaryButton onClick={navigateToCreatePlan}>
              <Plus className="size-4" />
              Tạo kế hoạch mới
            </CoreformPrimaryButton>
          }
        />

        <WorkoutsSearchForm onSearch={handleSearch} />

        {isFetchingMyPlans ? (
          <CoreformLoadingState />
        ) : !hasResults ? (
          <CoreformEmptyState
            icon={Calendar}
            title="Không tìm thấy kế hoạch nào"
            description="Không có kế hoạch nào phù hợp với từ khóa tìm kiếm."
            action={
              <CoreformPrimaryButton onClick={navigateToCreatePlan}>
                <Plus className="size-4" />
                Tạo kế hoạch đầu tiên
              </CoreformPrimaryButton>
            }
          />
        ) : (
          <>
            <div>
              <h3 className="font-display mb-5 text-lg font-medium text-earth">
                Kế hoạch của bạn
                {pagination?.total ? ` (${pagination.total} kế hoạch)` : ""}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myPlansData.data.map((plan) => (
                  <WorkoutCard
                    key={plan.id}
                    plan={plan}
                    variant="personal"
                    onEdit={handleEditPlan}
                    onDelete={handleDeletePlan}
                    onViewDetail={handleViewDetail}
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
      <ConfirmDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa lịch tập"
        content="Bạn có chắc muốn xóa lịch tập này không?"
        variant="destructive"
      />
    </>
  )
}
