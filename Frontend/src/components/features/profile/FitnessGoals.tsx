import { Badge } from "@/components/shared/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Progress } from "@/components/shared/ui/progress"
import { Target } from "lucide-react"

const goals = [
  { id: 1, name: "Workout 5x per week", current: 5, target: 5, unit: "workouts", completed: true },
  { id: 2, name: "Burn 3000 calories/week", current: 2615, target: 3000, unit: "calories", completed: false },
  { id: 3, name: "Run 10 miles/week", current: 8.4, target: 10, unit: "miles", completed: false },
  { id: 4, name: "Increase bench press", current: 80, target: 90, unit: "kg", completed: false },
]

export const FitnessGoals = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mục tiêu tập luyện</CardTitle>
            <CardDescription>Theo dõi tiến trình của bạn hướng tới các mục tiêu</CardDescription>
          </div>
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{goal.name}</h4>
                  {goal.completed && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Completed
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
