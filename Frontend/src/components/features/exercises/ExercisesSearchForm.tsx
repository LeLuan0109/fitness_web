import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { LEVEL_OPTIONS } from "@/constants/common"
import { useGetMuscleGroupOptions } from "@/hooks/queries/muscle-group/useGetMuscleGroupOptions"
import { useGetTrainingTypeOptions } from "@/hooks/queries/training-type/useGetTrainingTypeOptions"
import { ExerciseSearchParams } from "@/types/exercises.type"
import { removeEmptyValues } from "@/utils/utils"
import { SearchIcon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"

type ExerciseSearchFormProps = {
  onSearch: Dispatch<SetStateAction<ExerciseSearchParams>>
}

export const ExerciseSearchForm = ({ onSearch }: ExerciseSearchFormProps) => {
  const form = useForm<ExerciseSearchParams>({
    defaultValues: {
      search: "",
      level: "",
      typeId: "",
      muscleId: "",
      page: 0,
      size: 10,
    },
  })

  const { data: muscleGroupOptions } = useGetMuscleGroupOptions()
  const { data: trainingTypeOptions } = useGetTrainingTypeOptions()

  const handleSearch = () => {
    const data: ExerciseSearchParams = removeEmptyValues(form.getValues())
    onSearch(data)
  }

  return (
    <Card>
      <CardContent className="flex gap-8 justify-between">
        <Form {...form}>
          <form className="flex flex-wrap w-full gap-x-6 gap-y-2">
            <SimpleField
              label="Tên bài tập"
              name="search"
              control={form.control}
              className="w-[220px]"
              enableFormMessage={false}
            >
              {(field) => <Input {...field} />}
            </SimpleField>
            <SimpleField
              label="Cấp độ"
              name="level"
              control={form.control}
              className=" w-[220px]"
              enableFormMessage={false}
            >
              {(field) => <CustomSelect {...field} options={LEVEL_OPTIONS} />}
            </SimpleField>
            <SimpleField
              label="Loại bài tập"
              name="typeId"
              control={form.control}
              className=" w-[220px]"
              enableFormMessage={false}
            >
              {(field) => <CustomSelect {...field} options={trainingTypeOptions ?? []} />}
            </SimpleField>
            <SimpleField
              label="Nhóm cơ"
              name="muscleId"
              control={form.control}
              className="w-[220px]"
              enableFormMessage={false}
            >
              {(field) => <CustomSelect {...field} options={muscleGroupOptions ?? []} searchable />}
            </SimpleField>
          </form>
        </Form>
        <Button variant="secondary" className="mt-6" onClick={handleSearch}>
          <SearchIcon /> Tìm kiếm
        </Button>
      </CardContent>
    </Card>
  )
}
