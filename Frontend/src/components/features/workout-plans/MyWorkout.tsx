import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { CommonPagination } from "@/components/shared/ui/common-pagination"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeletePlan } from "@/hooks/queries/workout-plan/useDeletePlan"
import { useGetMyPlans } from "@/hooks/queries/workout-plan/useGetMyPlans"
import { WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { Calendar, Loader2, Plus } from "lucide-react"
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

  // Pagination logic
  const hasResults = myPlansData?.data && myPlansData.data.length > 0
  const pagination = myPlansData?.pagination
  const currentPage = (searchParams?.page || 0) + 1
  const totalPages = pagination?.totalPages || 0

  useEffect(() => {
    if (searchParams) {
      refetchMyPlans()
    }
  }, [searchParams, refetchMyPlans])

  const handleViewDetail = (plan: any) => {
    navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: plan.id.toString() }))
  }

  const handleEditPlan = (plan: any) => {
    navigate(generatePath(ROUTES.WORKOUTS.EDIT, { id: plan.id.toString() }))
  }

  const handleDeletePlan = (planId: number) => {
    setDeletingPlanId(planId)
    onOpen()
  }

  const handleConfirmDelete = () => {
    if (deletingPlanId) {
      deletePlan(deletingPlanId.toString()) // Gọi mutation để xóa
    }
    onOpenChange(false)
  }

  const handleCancelDelete = () => {
    setDeletingPlanId(null) // Reset planId khi hủy
    onOpenChange(false) // Đóng dialog
  }

  const handleSearch = (params: WorkoutPlanSearchParams) => {
    setSearchParams({
      ...params,
      page: 0, // Reset to first page when searching
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <TypographyH3 variant="bold">Kế hoạch tập luyện của tôi</TypographyH3>
          <Button onClick={navigateToCreatePlan}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo kế hoạch mới
          </Button>
        </div>

        <WorkoutsSearchForm onSearch={handleSearch} />

        {isFetchingMyPlans ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !hasResults ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Không tìm thấy kế hoạch nào</h3>
              <p className="text-muted-foreground mb-4">Không có kế hoạch nào phù hợp với từ khóa tìm kiếm</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div>
              <h3 className="mb-4">
                Kế hoạch của bạn
                {pagination?.total && ` (${pagination.total} kế hoạch)`}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
