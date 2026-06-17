import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Award } from "lucide-react"

const achievements = [
  { id: 1, name: "First Workout", description: "Completed your first workout", earned: true },
  { id: 2, name: "Week Warrior", description: "5 workouts in a week", earned: true },
  { id: 3, name: "Consistency King", description: "30 day streak", earned: false },
  { id: 4, name: "Calorie Crusher", description: "Burned 5000 calories in a week", earned: false },
  { id: 5, name: "Early Bird", description: "10 morning workouts", earned: true },
  { id: 6, name: "Strength Master", description: "50 strength workouts", earned: false },
]

export const Achievements = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Thành tích</CardTitle>
            <CardDescription>Các cột mốc tập luyện của bạn</CardDescription>
          </div>
          <Award className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.earned ? "bg-accent border-primary/20" : "bg-muted/20 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
