import { Button } from "@/components/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/ui/dialog"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { useLogSet } from "@/hooks/queries/workout-log/useLogWorkoutSet"
import { LogSetRequest } from "@/types/workout-log.type"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface RecordSetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exerciseName: string
  data: LogSetRequest
  onSave: () => void
  previousSets?: number
}

interface SetData {
  sets: number
  reps: number
  weight: number
  duration: number
}

export const RecordSetDialog = ({
  open,
  onOpenChange,
  exerciseName,
  previousSets = 0,
  data,
  onSave,
}: RecordSetDialogProps) => {
  const form = useForm<SetData>({
    defaultValues: {
      sets: 1,
      reps: 0,
      weight: 0,
      duration: 0,
    },
  })

  const { mutate: logSet } = useLogSet({
    config: {
      onSuccess: () => {
        toast.success("Ghi log tập luyện thành công!")
        onSave()
        onOpenChange(false)
      },
      onError: () => {
        toast.error("Ghi log tập luyện thất bại!")
        onOpenChange(false)
      },
    },
  })

  useEffect(() => {
    if (open) {
      form.setValue("sets", (previousSets ?? 0) + 1)
    } else {
      form.reset()
    }
  }, [open, previousSets, form])

  const handleSave = () => {
    const formValues = form.getValues()
    const payload: LogSetRequest = {
      ...data,
      weight: formValues.weight,
      duration: formValues.duration * 60,
      reps: formValues.reps,
      setNumber: formValues.sets,
    }
    logSet(payload)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col justify-between w-full">
          <DialogTitle className="text-xl font-semibold text-white">Ghi nhận bài tập hôm nay</DialogTitle>
          <p className="text-lg text-center font-medium text-gray-200">{exerciseName}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <SimpleField control={form.control} name="sets" label="Set" required className="space-y-2">
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  min="1"
                  disabled
                />
              )}
            </SimpleField>

            <SimpleField control={form.control} name="reps" label="Số rep" className="space-y-2">
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  min="0"
                />
              )}
            </SimpleField>

            <SimpleField control={form.control} name="weight" label="Trọng lượng (kg)" className="space-y-2">
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                />
              )}
            </SimpleField>

            <SimpleField control={form.control} name="duration" label="Thời gian (phút)" className="space-y-2">
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  min="0"
                />
              )}
            </SimpleField>

            <Button type="submit" className="w-full">
              Lưu
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
