type StepProps = {
  stepNumber: number
  description: string
}

export const Step = ({ stepNumber, description }: StepProps) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        {stepNumber}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
