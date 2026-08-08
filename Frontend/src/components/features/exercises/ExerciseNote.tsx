import { AlertCircle, CheckCircle2, Heart } from "lucide-react"

type ExerciseNoteProps = {
  tips: string[]
  commonMistakes: string[]
  healthBenefits: string[]
}

export const ExerciseNote = ({ tips, commonMistakes, healthBenefits }: ExerciseNoteProps) => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900 dark:text-green-100">Mẹo quan trọng</p>
            <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-200">
              {tips.map((tip, idx) => (
                <li key={idx + 1}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">Lỗi thường gặp</p>
            <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-200">
              {commonMistakes.map((mistake, idx) => (
                <li key={idx + 1}>• {mistake}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg border border-primary/25 bg-primary/10 p-4">
          <Heart className="mt-0.5 size-5 flex-shrink-0 text-primary" />
          <div>
            <p className="font-medium text-foreground">Lợi ích sức khỏe</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {healthBenefits.map((benefit, idx) => (
                <li key={idx + 1}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
