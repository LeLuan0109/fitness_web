import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Skeleton } from "@/components/shared/ui/skeleton"
import { useGetDashboardData } from "@/hooks/queries/dashboard/useGetDashboardData"
import { PageLayout } from "@/layouts/PageLayout"
import { Activity, Apple, Calendar, Dumbbell, Flame, Target, TrendingUp, Utensils } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"
import { getFitnessGoalName } from "@/utils/workout-plan.util"
import { getLevelName } from "@/utils/utils"

const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return { label: "Gầy", color: "text-blue-500", variant: "secondary" as const }
  if (bmi < 25) return { label: "Bình thường", color: "text-green-500", variant: "default" as const }
  if (bmi < 30) return { label: "Thừa cân", color: "text-orange-500", variant: "secondary" as const }
  return { label: "Béo phì", color: "text-red-500", variant: "destructive" as const }
}

// const getFitnessGoalLabel = (goal: string) => {
//   const goals: Record<string, string> = {
//     LOSE_WEIGHT: "Giảm cân",
//     GAIN_WEIGHT: "Tăng cân",
//     MAINTAIN_WEIGHT: "Duy trì",
//     BUILD_MUSCLE: "Tăng cơ",
//   }
//   return goals[goal] || goal
// }

export function Dashboard() {
  const navigate = useNavigate()
  const auth = authStore.use.auth()
  const { data, isLoading, isError } = useGetDashboardData(auth.id)

  if (isLoading) {
    return (
      <PageLayout title="Trang chủ">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    )
  }

  if (isError || !data) {
    return (
      <PageLayout title="Trang chủ">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
          </CardContent>
        </Card>
      </PageLayout>
    )
  }

  const { bmi, tdee, targetCalories, suggestedMenus, suggestedWorkoutPlans } = data
  const bmiStatus = getBMIStatus(bmi)

  return (
    <PageLayout title="Trang chủ">
      <div className="space-y-6">
        {/* Health Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chỉ số BMI</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
              <Badge variant={bmiStatus.variant} className="mt-2">
                {bmiStatus.label}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TDEE</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tdee.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-2">Calo tiêu thụ hàng ngày</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calo mục tiêu</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{targetCalories.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-2">Calo nên nạp mỗi ngày</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">
                  {targetCalories > tdee ? "+" : ""}
                  {(targetCalories - tdee).toFixed(0)} so với TDEE
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Menus */}
        {suggestedMenus && suggestedMenus.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Thực đơn được đề xuất
                  </CardTitle>
                  <CardDescription>Các thực đơn phù hợp với mục tiêu của bạn</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.NUTRITION.SAMPLE)}>
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {suggestedMenus.slice(0, 3).map((menu) => (
                  <Card key={menu.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-1">{menu.name}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {menu.description || "Không có mô tả"}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {getFitnessGoalName(menu.fitnessGoal)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Calo:</span>
                          <span className="font-semibold">{menu.calories} kcal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-muted-foreground">Protein</div>
                            <div className="font-semibold">{menu.protein}g</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-muted-foreground">Carbs</div>
                            <div className="font-semibold">{menu.carbs}g</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-muted-foreground">Fat</div>
                            <div className="font-semibold">{menu.fat}g</div>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-2"
                          size="sm"
                          onClick={() => navigate(ROUTES.NUTRITION.SAMPLE_DETAIL.replace(":id", menu.id.toString()))}
                        >
                          <Apple className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggested Workout Plans */}
        {suggestedWorkoutPlans && suggestedWorkoutPlans.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Lịch tập được đề xuất
                  </CardTitle>
                  <CardDescription>Các kế hoạch tập luyện phù hợp với bạn</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.WORKOUTS.SAMPLE_LIST)}>
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {suggestedWorkoutPlans.slice(0, 3).map((plan) => (
                  <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-1">{plan.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{plan.description || "Không có mô tả"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {plan.daysPerWeek} ngày/tuần • {plan.durationWeek} tuần
                          </span>
                        </div>
                        {plan.difficultyLevel && <Badge variant="outline">{getLevelName(plan.difficultyLevel)}</Badge>}
                        {plan.targetGoal && (
                          <div className="text-xs text-muted-foreground">
                            Mục tiêu: {getFitnessGoalName(plan.targetGoal)}
                          </div>
                        )}
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => navigate(ROUTES.WORKOUTS.DETAIL.replace(":id", plan.id.toString()))}
                        >
                          <Dumbbell className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {(!suggestedMenus || suggestedMenus.length === 0) &&
          (!suggestedWorkoutPlans || suggestedWorkoutPlans.length === 0) && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">Chưa có gợi ý nào cho bạn.</p>
              </CardContent>
            </Card>
          )}
      </div>
    </PageLayout>
  )
}
