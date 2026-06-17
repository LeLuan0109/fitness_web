import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { RelatedExercise } from "./RelatedExercise"
import { ExerciseData } from "@/types/exercises.type"

type RelatedExerciseGroupProps = {
  exercises: ExerciseData[]
}

export const RelatedExerciseGroup = ({ exercises }: RelatedExerciseGroupProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bài tập liên quan</CardTitle>
        <CardDescription>Các bài tập tương tự mà bạn có thể quan tâm</CardDescription>
      </CardHeader>
      <CardContent>
        {exercises.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Không có bài tập liên quan</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {exercises.map((related) => (
              <RelatedExercise
                key={related.id}
                id={related.id}
                name={related.name}
                difficulty={related.level}
                type={related.trainingType}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
