import { Button } from "@/components/shared/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/ui/dialog"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

interface WorkoutCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercisesPracticed?: number
  caloriesBurned?: number
}

export function WorkoutCompletionDialog({
  open,
  onOpenChange,
  exercisesPracticed = 0,
  caloriesBurned = 0,
}: WorkoutCompletionDialogProps) {
  const form = useForm<{ exercisesPracticed: number; caloriBurned: number }>({
    defaultValues: { exercisesPracticed, caloriBurned: caloriesBurned },
  })

  useEffect(() => {
    // update values when props change / dialog opens
    form.reset({ exercisesPracticed: exercisesPracticed ?? 0, caloriBurned: caloriesBurned ?? 0 })
  }, [exercisesPracticed, caloriesBurned, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col justify-between w-full">
          <DialogTitle className="text-xl font-semibold text-foreground">Tổng kết ngày hôm nay</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <SimpleField
              control={form.control}
              name="exercisesPracticed"
              label="Số bài tập đã tập"
              className="space-y-2"
            >
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  disabled
                />
              )}
            </SimpleField>

            <SimpleField control={form.control} name="caloriBurned" label="Tổng calo tiêu thụ" className="space-y-2">
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  disabled
                />
              )}
            </SimpleField>

            <DialogClose asChild>
              <Button type="button" className="w-full">
                Xong
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
